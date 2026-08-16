/*=========================================================
 RPN MANAGEMENT SYSTEM
 Database.gs
 Enterprise Edition v4.0
 CENTRAL DATABASE ARCHITECTURE
=========================================================*/

const Database = (() => {

  "use strict";

  /*=======================================================
    DATABASE MAP
  =======================================================*/

  const DB = {

    MASTER :
      CONFIG.SPREADSHEET.MASTER,

    /*
     * Belum ada spreadsheet Transaction terpisah.
     * Transaction menggunakan MASTER.
     */
    TRANSACTION :
      CONFIG.SPREADSHEET.MASTER,

    /*
     * System menggunakan MASTER.
     * Sheet SYS_* akan dibuat otomatis bila belum ada.
     */
    SYSTEM :
      CONFIG.SPREADSHEET.MASTER,

    /*
     * Report menggunakan spreadsheet Report terpisah.
     */
    REPORT :
      "1cq3-Sbwx0WXQoyOFRL9UKHHdKaqaNr6-MLfnNP7wByo"

  };


  /*=======================================================
    SYSTEM SHEETS
  =======================================================*/

  const SYSTEM_SHEETS = {

    SYS_AUDIT : [

      "AUDIT_ID",
      "MODULE",
      "ACTION",
      "DOCUMENT_NO",
      "ASSET_ID",
      "USERNAME",
      "ROLE",
      "BEFORE_DATA",
      "AFTER_DATA",
      "IP_ADDRESS",
      "DEVICE",
      "BROWSER",
      "CREATED_AT"

    ],

    SYS_SEQUENCE : [

      "TYPE",
      "RUNNING"

    ],

    SYS_HISTORY : [

      "HISTORY_ID",
      "MODULE",
      "ACTION",
      "REFERENCE_ID",
      "DOCUMENT_NO",
      "USER_ID",
      "USERNAME",
      "DATA",
      "CREATED_AT"

    ],

    SYS_EVENT_LEDGER : [

      "EVENT_ID",
      "EVENT_TYPE",
      "REFERENCE_ID",
      "DOCUMENT_NO",
      "ASSET_ID",
      "USER_ID",
      "USERNAME",
      "DATA",
      "CREATED_AT"

    ]

  };


  /*=======================================================
    OPEN DATABASE
  =======================================================*/

  function open(database){

    const key = String(database || "").toUpperCase();

    if(!DB[key]){

      throw new Error(

        "Database tidak ditemukan : " + key

      );

    }

    return SpreadsheetApp.openById(DB[key]);

  }


  /*=======================================================
    GET DATABASE ID
  =======================================================*/

  function id(database){

    const key = String(database || "").toUpperCase();

    if(!DB[key]){

      throw new Error(

        "Database ID tidak ditemukan : " + key

      );

    }

    return DB[key];

  }


  /*=======================================================
    GET SHEET
  =======================================================*/

  function sheet(database, sheetName){

    const ss = open(database);

    let sh = ss.getSheetByName(sheetName);

    /*
     * SYSTEM SHEET AUTO INITIALIZATION
     */
    if(!sh && String(database).toUpperCase() === "SYSTEM"){

      sh = createSystemSheet_(

        ss,

        sheetName

      );

    }

    if(!sh){

      throw new Error(

        "Sheet tidak ditemukan : " +

        sheetName

      );

    }

    return sh;

  }


  /*=======================================================
    CREATE SYSTEM SHEET
  =======================================================*/

  function createSystemSheet_(ss, sheetName){

    const headers = SYSTEM_SHEETS[sheetName];

    /*
     * Hanya sheet SYS_* yang boleh dibuat otomatis.
     */
    if(!headers){

      return null;

    }

    let sh = ss.getSheetByName(sheetName);

    if(sh){

      return sh;

    }

    sh = ss.insertSheet(sheetName);

    sh.getRange(

      1,

      1,

      1,

      headers.length

    ).setValues([headers]);

    sh.setFrozenRows(1);

    return sh;

  }


  /*=======================================================
    INITIALIZE SYSTEM
  =======================================================*/

  function initializeSystem(){

    const ss = open("SYSTEM");

    const result = {};

    Object.keys(SYSTEM_SHEETS).forEach(

      name => {

        const existing =

          ss.getSheetByName(name);

        if(existing){

          result[name] = "EXISTS";

          return;

        }

        createSystemSheet_(

          ss,

          name

        );

        result[name] = "CREATED";

      }

    );

    return result;

  }


  /*=======================================================
    SELECT
  =======================================================*/

  function select(database, sheetName){

    const sh = sheet(

      database,

      sheetName

    );

    const values =

      sh.getDataRange().getValues();

    if(values.length < 2){

      return [];

    }

    const header = values.shift();

    return values.map(

      row => {

        const object = {};

        header.forEach(

          (key,index) => {

            if(key){

              object[key] = row[index];

            }

          }

        );

        return object;

      }

    );

  }


  /*=======================================================
    FIND
  =======================================================*/

  function find(

    database,

    sheetName,

    column,

    value

  ){

    const sh = sheet(

      database,

      sheetName

    );

    const values =

      sh.getDataRange().getValues();

    if(values.length < 2){

      return null;

    }

    const header = values[0];

    let columnIndex = -1;

    /*
     * Support:
     * 1-based column number
     * column name
     */
    if(typeof column === "number"){

      columnIndex = column - 1;

    }
    else{

      columnIndex = header.indexOf(column);

    }

    if(columnIndex < 0){

      return null;

    }

    for(

      let i = 1;

      i < values.length;

      i++

    ){

      if(

        String(values[i][columnIndex]) ===

        String(value)

      ){

        const object = {};

        header.forEach(

          (key,index) => {

            if(key){

              object[key] = values[i][index];

            }

          }

        );

        return {

          row :

            i + 1,

          values :

            values[i],

          object :

            object

        };

      }

    }

    return null;

  }


  /*=======================================================
    FIND ALL
  =======================================================*/

  function findAll(

    database,

    sheetName,

    column,

    value

  ){

    return select(

      database,

      sheetName

    ).filter(

      item =>

        String(item[column]) ===

        String(value)

    );

  }


  /*=======================================================
    EXISTS
  =======================================================*/

  function exists(

    database,

    sheetName,

    column,

    value

  ){

    return Boolean(

      find(

        database,

        sheetName,

        column,

        value

      )

    );

  }


  /*=======================================================
    COUNT
  =======================================================*/

  function count(

    database,

    sheetName

  ){

    const sh = sheet(

      database,

      sheetName

    );

    return Math.max(

      0,

      sh.getLastRow() - 1

    );

  }


  /*=======================================================
    INSERT
  =======================================================*/

  function insert(

    database,

    sheetName,

    row

  ){

    const lock =

      LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      sheet(

        database,

        sheetName

      ).appendRow(row);

      return true;

    }

    finally{

      lock.releaseLock();

    }

  }


  /*=======================================================
    INSERT MANY
  =======================================================*/

  function insertMany(

    database,

    sheetName,

    rows

  ){

    if(

      !rows ||

      !rows.length

    ){

      return false;

    }

    const lock =

      LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      const sh =

        sheet(

          database,

          sheetName

        );

      const start =

        sh.getLastRow() + 1;

      sh.getRange(

        start,

        1,

        rows.length,

        rows[0].length

      ).setValues(rows);

      return true;

    }

    finally{

      lock.releaseLock();

    }

  }


  /*=======================================================
    UPDATE
  =======================================================*/

  function update(

    database,

    sheetName,

    row,

    values

  ){

    if(

      !Array.isArray(values)

    ){

      throw new Error(

        "Data update harus berupa array."

      );

    }

    sheet(

      database,

      sheetName

    )

    .getRange(

      row,

      1,

      1,

      values.length

    )

    .setValues([values]);

    return true;

  }


  /*=======================================================
    UPDATE OBJECT
  =======================================================*/

  function updateObject(

    database,

    sheetName,

    row,

    object

  ){

    const sh =

      sheet(

        database,

        sheetName

      );

    const header =

      sh.getRange(

        1,

        1,

        1,

        sh.getLastColumn()

      ).getValues()[0];

    const current =

      sh.getRange(

        row,

        1,

        1,

        header.length

      ).getValues()[0];

    header.forEach(

      (key,index) => {

        if(

          Object.prototype

            .hasOwnProperty

            .call(object,key)

        ){

          current[index] =

            object[key];

        }

      }

    );

    sh.getRange(

      row,

      1,

      1,

      current.length

    ).setValues([current]);

    return true;

  }


  /*=======================================================
    REMOVE
  =======================================================*/

  function remove(

    database,

    sheetName,

    row

  ){

    sheet(

      database,

      sheetName

    ).deleteRow(row);

    return true;

  }


  /*=======================================================
    CLEAR
  =======================================================*/

  function clear(

    database,

    sheetName

  ){

    const sh =

      sheet(

        database,

        sheetName

      );

    if(

      sh.getLastRow() > 1

    ){

      sh.getRange(

        2,

        1,

        sh.getLastRow() - 1,

        sh.getLastColumn()

      ).clearContent();

    }

    return true;

  }


  /*=======================================================
    TRANSACTION
  =======================================================*/

  function transaction(callback){

    const lock =

      LockService.getScriptLock();

    lock.waitLock(30000);

    try{

      return callback();

    }

    finally{

      lock.releaseLock();

    }

  }


  /*=======================================================
    DATABASE MAP
  =======================================================*/

  function map(){

    return {

      MASTER :

        DB.MASTER,

      TRANSACTION :

        DB.TRANSACTION,

      SYSTEM :

        DB.SYSTEM,

      REPORT :

        DB.REPORT

    };

  }


  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    MASTER :

      "MASTER",

    TRANSACTION :

      "TRANSACTION",

    SYSTEM :

      "SYSTEM",

    REPORT :

      "REPORT",

    open,

    id,

    sheet,

    select,

    find,

    findAll,

    exists,

    count,

    insert,

    insertMany,

    update,

    updateObject,

    remove,

    clear,

    transaction,

    initializeSystem,

    map

  };

})();