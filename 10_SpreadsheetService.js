/*=========================================================
 RPN MANAGEMENT SYSTEM
 SpreadsheetService.gs Enterprise Edition
 PART 1A
=========================================================*/

const SpreadsheetService = (() => {

  "use strict";

  /*=======================================================
    CONFIG
  =======================================================*/

  const CACHE_EXPIRE = 21600;

  const CACHE = CacheService.getScriptCache();

  const LOCK = LockService.getScriptLock();

  const SPREADSHEET_CACHE = {};

  const SHEET_CACHE = {};

  const HEADER_CACHE = {};

  /*=======================================================
    OPEN SPREADSHEET
  =======================================================*/

  function open(key){

    validateKey_(key);

    if(SPREADSHEET_CACHE[key]){

      return SPREADSHEET_CACHE[key];

    }

    const id = CONFIG.SPREADSHEET[key];

    if(!id){

      throw new Error(

        "Spreadsheet tidak ditemukan : " + key

      );

    }

    const spreadsheet = SpreadsheetApp.openById(id);

    SPREADSHEET_CACHE[key] = spreadsheet;

    return spreadsheet;

  }

  /*=======================================================
    GET SHEET
  =======================================================*/

  function sheet(

    key,

    sheetName

  ){

    const cacheKey =

      key +

      "_" +

      sheetName;

    if(SHEET_CACHE[cacheKey]){

      return SHEET_CACHE[cacheKey];

    }

    const spreadsheet = open(key);

    const sheet = spreadsheet.getSheetByName(

      sheetName

    );

    if(!sheet){

      throw new Error(

        "Sheet tidak ditemukan : " +

        sheetName

      );

    }

    SHEET_CACHE[cacheKey] = sheet;

    return sheet;

  }

  /*=======================================================
    GET HEADER
  =======================================================*/

  function getHeader(

    key,

    sheetName

  ){

    const cacheKey =

      "HEADER_" +

      key +

      "_" +

      sheetName;

    if(HEADER_CACHE[cacheKey]){

      return HEADER_CACHE[cacheKey];

    }

    const cache = CACHE.get(cacheKey);

    if(cache){

      HEADER_CACHE[cacheKey] =

        JSON.parse(cache);

      return HEADER_CACHE[cacheKey];

    }

    const header = sheet(

      key,

      sheetName

    )

    .getRange(

      1,

      1,

      1,

      sheet(

        key,

        sheetName

      )

      .getLastColumn()

    )

    .getValues()[0]

    .map(function(item){

      return String(item).trim();

    });

    validateHeader_(header);

    HEADER_CACHE[cacheKey] = header;

    CACHE.put(

      cacheKey,

      JSON.stringify(header),

      CACHE_EXPIRE

    );

    return header;

  }

  /*=======================================================
    GET DATA
  =======================================================*/

  function getData(

    key,

    sheetName

  ){

    const ws = sheet(

      key,

      sheetName

    );

    const lastRow = ws.getLastRow();

    const lastColumn = ws.getLastColumn();

    if(lastRow <= 1){

      return [];

    }

    return ws.getRange(

      2,

      1,

      lastRow - 1,

      lastColumn

    ).getValues();

  }  /*=======================================================
    GET OBJECTS
  =======================================================*/

  function getObjects(

    key,

    sheetName

  ){

    const header = getHeader(

      key,

      sheetName

    );

    const data = getData(

      key,

      sheetName

    );

    return data.map(function(row){

      return buildObject_(

        header,

        row

      );

    });

  }

  /*=======================================================
    FLUSH CACHE
  =======================================================*/

  function flushCache(){

    Object.keys(

      SPREADSHEET_CACHE

    ).forEach(function(key){

      delete SPREADSHEET_CACHE[key];

    });

    Object.keys(

      SHEET_CACHE

    ).forEach(function(key){

      delete SHEET_CACHE[key];

    });

    Object.keys(

      HEADER_CACHE

    ).forEach(function(key){

      delete HEADER_CACHE[key];

    });

  }

  /*=======================================================
    BUILD OBJECT
  =======================================================*/

  function buildObject_(

    header,

    row

  ){

    const object = {};

    header.forEach(function(

      column,

      index

    ){

      object[column] =

        row[index];

    });

    return object;

  }

  /*=======================================================
    VALIDATE KEY
  =======================================================*/

  function validateKey_(key){

    if(

      Utility.isEmpty(key)

    ){

      throw new Error(

        "Spreadsheet Key wajib diisi."

      );

    }

    if(

      !CONFIG.SPREADSHEET[key]

    ){

      throw new Error(

        "Spreadsheet Key tidak terdaftar : " +

        key

      );

    }

  }

  /*=======================================================
    VALIDATE HEADER
  =======================================================*/

  function validateHeader_(header){

    if(

      !header ||

      header.length === 0

    ){

      throw new Error(

        "Header kosong."

      );

    }

    header.forEach(function(item){

      if(

        Utility.isEmpty(item)

      ){

        throw new Error(

          "Header tidak valid."

        );

      }

    });

  }


/*=======================================================
    FIND
  =======================================================*/

  function find(

    key,

    sheetName,

    column,

    value

  ){

    const data = getData(

      key,

      sheetName

    );

    for(

      let i = 0;

      i < data.length;

      i++

    ){

      if(

        String(

          data[i][column - 1]

        ) === String(value)

      ){

        return {

          row: i + 2,

          index: i,

          values: data[i],

          object: buildObject_(

            getHeader(

              key,

              sheetName

            ),

            data[i]

          )

        };

      }

    }

    return null;

  }

  /*=======================================================
    FIND ALL
  =======================================================*/

  function findAll(

    key,

    sheetName,

    callback

  ){

    const header = getHeader(

      key,

      sheetName

    );

    const data = getData(

      key,

      sheetName

    );

    const result = [];

    data.forEach(function(

      row,

      index

    ){

      const object = buildObject_(

        header,

        row

      );

      if(

        callback(

          object,

          index

        )

      ){

        result.push({

          row: index + 2,

          index: index,

          values: row,

          object: object

        });

      }

    });

    return result;

  }

  /*=======================================================
    EXISTS
  =======================================================*/

  function exists(

    key,

    sheetName,

    column,

    value

  ){

    return (

      find(

        key,

        sheetName,

        column,

        value

      ) !== null

    );

  }

  /*=======================================================
    COUNT
  =======================================================*/

  function count(

    key,

    sheetName

  ){

    return getData(

      key,

      sheetName

    ).length;

  }  /*=======================================================
    INSERT
  =======================================================*/

  function insert(

    key,

    sheetName,

    row

  ){

    validateRow_(row);

    const ws = sheet(

      key,

      sheetName

    );

    ws.getRange(

      ws.getLastRow() + 1,

      1,

      1,

      row.length

    ).setValues([

      row

    ]);

    flushCache();

    return true;

  }

  /*=======================================================
    INSERT MANY
  =======================================================*/

  function insertMany(

    key,

    sheetName,

    rows

  ){

    if(

      !rows ||

      rows.length === 0

    ){

      return 0;

    }

    const ws = sheet(

      key,

      sheetName

    );

    ws.getRange(

      ws.getLastRow() + 1,

      1,

      rows.length,

      rows[0].length

    ).setValues(

      rows

    );

    flushCache();

    return rows.length;

  }

  /*=======================================================
    UPDATE
  =======================================================*/

  function update(

    key,

    sheetName,

    rowIndex,

    row

  ){

    validateRow_(row);

    sheet(

      key,

      sheetName

    )

    .getRange(

      rowIndex,

      1,

      1,

      row.length

    )

    .setValues([

      row

    ]);

    flushCache();

    return true;

  }

  /*=======================================================
    UPDATE MANY
  =======================================================*/

  function updateMany(

    key,

    sheetName,

    updates

  ){

    if(

      !updates ||

      updates.length === 0

    ){

      return 0;

    }

    const ws = sheet(

      key,

      sheetName

    );

    updates.forEach(function(item){

      validateRow_(

        item.values

      );

      ws.getRange(

        item.row,

        1,

        1,

        item.values.length

      ).setValues([

        item.values

      ]);

    });

    flushCache();

    return updates.length;

  }

  /*=======================================================
    REMOVE
  =======================================================*/

  function remove(

    key,

    sheetName,

    rowIndex

  ){

    sheet(

      key,

      sheetName

    )

    .deleteRow(

      rowIndex

    );

    flushCache();

    return true;

  }

  /*=======================================================
    CLEAR
  =======================================================*/

  function clear(

    key,

    sheetName

  ){

    const ws = sheet(

      key,

      sheetName

    );

    if(

      ws.getLastRow() <= 1

    ){

      return true;

    }

    ws.getRange(

      2,

      1,

      ws.getLastRow() - 1,

      ws.getLastColumn()

    ).clearContent();

    flushCache();

    return true;

  }

  /*=======================================================
    VALIDATE ROW
  =======================================================*/

  function validateRow_(row){

    if(

      !Array.isArray(row)

    ){

      throw new Error(

        "Row harus berupa Array."

      );

    }

    if(

      row.length === 0

    ){

      throw new Error(

        "Row kosong."

      );

    }

  }  /*=======================================================
    LOCK
  =======================================================*/

  function lock(

    timeout = 30000

  ){

    if(

      !LOCK.tryLock(timeout)

    ){

      throw new Error(

        "Spreadsheet sedang digunakan oleh user lain."

      );

    }

    return true;

  }

  /*=======================================================
    UNLOCK
  =======================================================*/

  function unlock(){

    try{

      LOCK.releaseLock();

    }

    catch(e){}

  }

  /*=======================================================
    RETRY
  =======================================================*/

  function retry(

    callback,

    maxRetry = 3

  ){

    let error;

    for(

      let i = 1;

      i <= maxRetry;

      i++

    ){

      try{

        return callback();

      }

      catch(err){

        error = err;

        Utilities.sleep(

          i * 500

        );

      }

    }

    throw error;

  }

  /*=======================================================
    TRANSACTION
  =======================================================*/

  function transaction(

    callback

  ){

    lock();

    try{

      const result = retry(function(){

        return callback();

      });

      SpreadsheetApp.flush();

      unlock();

      return result;

    }

    catch(err){

      unlock();

      throw err;

    }

  }

  /*=======================================================
    AUDIT HOOK
  =======================================================*/

  function audit(

    action,

    module,

    reference,

    data

  ){

    try{

      if(

        typeof HistoryService !==

        "undefined"

      ){

        HistoryService.write(

          action,

          module,

          reference,

          data || {}

        );

      }

    }

    catch(e){}

  }

  /*=======================================================
    CACHE OBJECT
  =======================================================*/

  function cache(

    key,

    value,

    expire = CACHE_EXPIRE

  ){

    CACHE.put(

      key,

      JSON.stringify(value),

      expire

    );

  }

  /*=======================================================
    GET CACHE
  =======================================================*/

  function getCache(

    key

  ){

    const value = CACHE.get(key);

    return value ?

      JSON.parse(value) :

      null;

  }

  /*=======================================================
    PUBLIC API
  =======================================================*/

  return{

    open,

    sheet,

    getHeader,

    getData,

    getObjects,

    find,

    findAll,

    exists,

    count,

    insert,

    insertMany,

    update,

    updateMany,

    remove,

    clear,

    transaction,

    retry,

    lock,

    unlock,

    cache,

    getCache,

    flushCache,

    audit

  };

})();