/*=========================================================
 RPN MANAGEMENT SYSTEM
 InventoryEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const InventoryEngine = (() => {

  "use strict";

  /*=======================================================
    ISSUE PART
  =======================================================*/

  function issue(data){

    ValidationEngine.asset(

      data.ASSET_ID

    );

    ValidationEngine.duplicate(

      Database.TRANSACTION,

      CONFIG.SHEET.LOAN_PART,

      "REFERENCE_NO",

      data.REFERENCE_NO

    );

    return transaction_(

      "ISSUE",

      data

    );

  }

  /*=======================================================
    RETURN PART
  =======================================================*/

  function returnPart(data){

    return transaction_(

      "RETURN",

      data

    );

  }

  /*=======================================================
    LOAN PART
  =======================================================*/

  function loan(data){

    return transaction_(

      "LOAN",

      data

    );

  }

  /*=======================================================
    CANNIBAL PART
  =======================================================*/

  function cannibal(data){

    ValidationEngine.cannibal(

      data.SOURCE_ASSET_ID

    );

    AssetCompositionEngine.remove(

      data.SOURCE_ASSET_ID,

      data.PART_ASSET_ID,

      data.EVENT_ID

    );

    EventEngine.create({

      EVENT_TYPE :

        CONFIG.EVENT.REMOVE_COMPONENT,

      ASSET_ID :

        data.SOURCE_ASSET_ID,

      DOCUMENT_NO :

        data.DOCUMENT_NO,

      DESCRIPTION :

        "Cannibal Part"

    });

    return transaction_(

      "CANNIBAL",

      data

    );

  }

  /*=======================================================
    INSTALL PART
  =======================================================*/

  function install(data){

    AssetCompositionEngine.install(

      data.TARGET_ASSET_ID,

      data.PART_ASSET_ID,

      data.EVENT_ID

    );

    EventEngine.create({

      EVENT_TYPE :

        CONFIG.EVENT.INSTALL_COMPONENT,

      ASSET_ID :

        data.TARGET_ASSET_ID,

      DOCUMENT_NO :

        data.DOCUMENT_NO,

      DESCRIPTION :

        "Install Part"

    });

    return transaction_(

      "INSTALL",

      data

    );

  }

  /*=======================================================
    STOCK ADJUSTMENT
  =======================================================*/

  function adjustment(data){

    return transaction_(

      "ADJUSTMENT",

      data

    );

  }

  /*=======================================================
    STOCK OPNAME
  =======================================================*/

  function stockOpname(data){

    return transaction_(

      "STOCK_OPNAME",

      data

    );

  }

  /*=======================================================
    CURRENT STOCK
  =======================================================*/

  function stock(partNumber){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.PART,

      item =>

        item.PART_NUMBER===

        partNumber

    );

  }

  /*=======================================================
    PART HISTORY
  =======================================================*/

  function history(partNumber){

    return Repository.find(

      Database.SYSTEM,

      CONFIG.SHEET.EVENT_LEDGER,

      item =>

        item.REFERENCE_NO===

        partNumber

    );

  }

  /*=======================================================
    TRANSACTION
  =======================================================*/

  function transaction_(

    type,

    data

  ){

    return Database.transaction(function(){

      const header = SpreadsheetService.getHeader(

        Database.TRANSACTION,

        CONFIG.SHEET.LOAN_PART

      );

      const row = {

        TRANSACTION_ID :

          Utility.uuid(),

        TRANSACTION_NO :

          DocumentNumberEngine.generate(

            type

          ),

        TYPE :

          type,

        DOCUMENT_NO :

          data.DOCUMENT_NO,

        REFERENCE_NO :

          data.REFERENCE_NO,

        ASSET_ID :

          data.ASSET_ID || "",

        PART_NUMBER :

          data.PART_NUMBER,

        PART_NAME :

          data.PART_NAME,

        QTY :

          data.QTY,

        USERNAME :

          Auth.getUser().USERNAME,

        CREATED_AT :

          Utility.now()

      };

      Repository.insert(

        Database.TRANSACTION,

        CONFIG.SHEET.LOAN_PART,

        header,

        row

      );

      HistoryService.write(

        type,

        CONFIG.SHEET.LOAN_PART,

        row.TRANSACTION_NO,

        row

      );

      return row;

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    issue,

    returnPart,

    loan,

    cannibal,

    install,

    adjustment,

    stockOpname,

    stock,

    history

  };

})();