/*=========================================================
 RPN MANAGEMENT SYSTEM
 DocumentNumberEngine.gs
 Enterprise Edition v1.1
=========================================================*/

const DocumentNumberEngine = (() => {

  "use strict";

  /*=======================================================
    PREFIX
  =======================================================*/

  const PREFIX = {

    WORK_ORDER   : "WO",
    PULL_OUT     : "PO",
    RECEIVING    : "RC",
    INSPECTION   : "IN",
    REPAIR       : "RP",
    PM           : "PM",
    TRANSFER     : "TF",
    CANNIBAL     : "CB",
    LOAN_PART    : "LP",
    RETURN_PART  : "RT",
    SALES        : "SO",
    EXPORT       : "EX",
    SCRAP        : "SC",
    RESERVATION  : "RSV",
    APPROVAL     : "APR",
    STOCK_OPNAME : "STO",
    ADJUSTMENT   : "ADJ"

  };

  /*=======================================================
    DATABASE
  =======================================================*/

  const DATABASE = "SYSTEM";

  /*=======================================================
    SHEET RESOLVER
    CONFIG dibaca saat function dipanggil,
    bukan saat file pertama kali dimuat.
  =======================================================*/

  function getSheet_(){

    if(
      typeof CONFIG === "undefined" ||
      !CONFIG ||
      !CONFIG.SHEET ||
      !CONFIG.SHEET.SEQUENCE
    ){

      throw new Error(
        "CONFIG.SHEET.SEQUENCE belum tersedia."
      );

    }

    return CONFIG.SHEET.SEQUENCE;

  }

  /*=======================================================
    GENERATE
  =======================================================*/

  function generate(type){

    const prefix = PREFIX[type];

    if(!prefix){

      throw new Error(
        "Document Prefix tidak ditemukan : " + type
      );

    }

    return SpreadsheetService.transaction(function(){

      const running = nextNumber_(type);

      return buildNumber_(
        prefix,
        running
      );

    });

  }

  /*=======================================================
    NEXT NUMBER
  =======================================================*/

  function nextNumber(type){

    return SpreadsheetService.transaction(function(){

      return nextNumber_(type);

    });

  }

  /*=======================================================
    PRIVATE
  =======================================================*/

  function nextNumber_(type){

    const find = SpreadsheetService.find(

      DATABASE,

      getSheet_(),

      1,

      type

    );

    if(!find){

      SpreadsheetService.insert(

        DATABASE,

        getSheet_(),

        [
          type,
          1
        ]

      );

      return 1;

    }

    const row = find.values.slice();

    row[1] = Number(row[1]) + 1;

    SpreadsheetService.update(

      DATABASE,

      getSheet_(),

      find.row,

      row

    );

    return row[1];

  }

  /*=======================================================
    BUILD NUMBER
  =======================================================*/

  function buildNumber_(

    prefix,

    number

  ){

    return [

      prefix,

      Utilities.formatDate(

        new Date(),

        Session.getScriptTimeZone(),

        "yyyyMMdd"

      ),

      pad_(number)

    ].join("-");

  }

  /*=======================================================
    PAD NUMBER
  =======================================================*/

  function pad_(number){

    return Utilities.formatString(

      "%06d",

      number

    );

  }

  /*=======================================================
    PREVIEW
  =======================================================*/

  function preview(type){

    const prefix = PREFIX[type];

    if(!prefix){

      return "";

    }

    const find = SpreadsheetService.find(

      DATABASE,

      getSheet_(),

      1,

      type

    );

    const next =

      find ?

      Number(find.values[1]) + 1 :

      1;

    return buildNumber_(

      prefix,

      next

    );

  }

  /*=======================================================
    RESET
  =======================================================*/

  function reset(type){

    const find = SpreadsheetService.find(

      DATABASE,

      getSheet_(),

      1,

      type

    );

    if(!find){

      return false;

    }

    SpreadsheetService.update(

      DATABASE,

      getSheet_(),

      find.row,

      [
        type,
        0
      ]

    );

    return true;

  }

  /*=======================================================
    GET CURRENT
  =======================================================*/

  function current(type){

    const find = SpreadsheetService.find(

      DATABASE,

      getSheet_(),

      1,

      type

    );

    if(!find){

      return 0;

    }

    return Number(

      find.values[1]

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    generate,
    nextNumber,
    preview,
    current,
    reset

  };

})();