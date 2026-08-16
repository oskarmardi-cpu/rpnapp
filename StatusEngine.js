/*=========================================================
 RPN MANAGEMENT SYSTEM
 StatusEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const StatusEngine = (() => {

  "use strict";

  /*=======================================================
    STATUS
  =======================================================*/

  const STATUS = CONFIG.STATUS;

  /*=======================================================
    GET CURRENT STATUS
  =======================================================*/

  function get(assetId){

    RuleEngine.required(

      {

        ASSET_ID : assetId

      },

      [

        "ASSET_ID"

      ]

    );

    const movement = Repository.first(

      Database.SYSTEM,

      CONFIG.SHEET.ASSET_MOVEMENT,

      function(item){

        return item.ASSET_ID === assetId;

      }

    );

    if(!movement){

      return null;

    }

    return movement.TO_STATUS;

  }

  /*=======================================================
    CHANGE STATUS
  =======================================================*/

  function change(

    assetId,

    newStatus,

    eventId

  ){

    RuleEngine.required(

      {

        ASSET_ID : assetId,

        STATUS : newStatus

      },

      [

        "ASSET_ID",

        "STATUS"

      ]

    );

    const asset = Repository.first(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      function(item){

        return item.ASSET_ID === assetId;

      }

    );

    if(!asset){

      throw new Error(

        "Asset tidak ditemukan."

      );

    }

    validateTransition(

      asset.CURRENT_STATUS,

      newStatus

    );

    asset.CURRENT_STATUS = newStatus;

    asset.LAST_EVENT = eventId || "";

    asset.UPDATED_AT = Utility.now();

    const header = SpreadsheetService.getHeader(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE

    );

    const find = SpreadsheetService.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      1,

      asset.INSTANCE_ID

    );

    Repository.update(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      find.row,

      header,

      asset

    );

    SpreadsheetService.audit(

      "STATUS",

      "ASSET",

      assetId,

      {

        STATUS : newStatus

      }

    );

    return asset;

  }

  /*=======================================================
    VALIDATE TRANSITION
  =======================================================*/

  function validateTransition(

    fromStatus,

    toStatus

  ){

    const rule = {

      READY : [

        STATUS.RENTAL,

        STATUS.TRANSFER,

        STATUS.EXPORT,

        STATUS.SALES,

        STATUS.REPAIR,

        STATUS.SCRAP

      ],

      RENTAL : [

        STATUS.PULL_OUT,

        STATUS.RETURN

      ],

      REPAIR : [

        STATUS.WAITING_PART,

        STATUS.QC,

        STATUS.READY

      ],

      WAITING_PART : [

        STATUS.REPAIR

      ],

      QC : [

        STATUS.READY

      ]

    };

    if(

      !rule[fromStatus]

    ){

      return true;

    }

    if(

      rule[fromStatus]

      .indexOf(

        toStatus

      ) === -1

    ){

      throw new Error(

        "Perubahan status tidak diizinkan : " +

        fromStatus +

        " -> " +

        toStatus

      );

    }

    return true;

  }

  /*=======================================================
    IS READY
  =======================================================*/

  function isReady(

    assetId

  ){

    return (

      get(assetId) ===

      STATUS.READY

    );

  }

  /*=======================================================
    IS RENTAL
  =======================================================*/

  function isRental(

    assetId

  ){

    return (

      get(assetId) ===

      STATUS.RENTAL

    );

  }

  /*=======================================================
    IS REPAIR
  =======================================================*/

  function isRepair(

    assetId

  ){

    return (

      get(assetId) ===

      STATUS.REPAIR

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    get,

    change,

    isReady,

    isRental,

    isRepair,

    validateTransition

  };

})();