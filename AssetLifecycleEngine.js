/*=========================================================
 RPN MANAGEMENT SYSTEM
 AssetLifecycleEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const AssetLifecycleEngine = (() => {

  "use strict";

  /*=======================================================
    CREATE ASSET
  =======================================================*/

  function create(data){

    ValidationEngine.duplicate(

      Database.MASTER,

      CONFIG.SHEET.ASSET,

      CONFIG.COLUMN.M_ASSET.SERIAL_NUMBER,

      data.SERIAL_NUMBER

    );

    return MasterService.create(

      CONFIG.SHEET.ASSET,

      data

    );

  }

  /*=======================================================
    READY
  =======================================================*/

  function ready(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.READY,

      CONFIG.EVENT.READY,

      payload

    );

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(

    assetId,

    payload

  ){

    ValidationEngine.rental(

      assetId

    );

    return changeStatus_(

      assetId,

      CONFIG.STATUS.RENTAL,

      CONFIG.EVENT.RENTAL_OUT,

      payload

    );

  }

  /*=======================================================
    RETURN
  =======================================================*/

  function returnAsset(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.RETURN,

      CONFIG.EVENT.RENTAL_RETURN,

      payload

    );

  }

  /*=======================================================
    REPAIR
  =======================================================*/

  function repair(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.REPAIR,

      CONFIG.EVENT.REPAIR_START,

      payload

    );

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.WAITING_PART,

      CONFIG.EVENT.WAITING_PART,

      payload

    );

  }

  /*=======================================================
    QC
  =======================================================*/

  function qc(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.QC,

      CONFIG.EVENT.QC_PASS,

      payload

    );

  }

  /*=======================================================
    BOOKED
  =======================================================*/

  function booked(

    assetId,

    payload

  ){

    ValidationEngine.assetReady(

      assetId

    );

    return changeStatus_(

      assetId,

      CONFIG.STATUS.BOOKED,

      CONFIG.EVENT.RESERVATION_CONFIRM,

      payload

    );

  }

  /*=======================================================
    SALES
  =======================================================*/

  function sales(

    assetId,

    payload

  ){

    ValidationEngine.salesOrder(

      assetId

    );

    return changeStatus_(

      assetId,

      CONFIG.STATUS.SOLD,

      CONFIG.EVENT.SALES,

      payload

    );

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportAsset(

    assetId,

    payload

  ){

    ValidationEngine.exportAsset(

      assetId

    );

    return changeStatus_(

      assetId,

      CONFIG.STATUS.EXPORT,

      CONFIG.EVENT.EXPORT,

      payload

    );

  }

  /*=======================================================
    CANNIBAL
  =======================================================*/

  function cannibal(

    assetId,

    payload

  ){

    ValidationEngine.cannibal(

      assetId

    );

    return changeStatus_(

      assetId,

      CONFIG.STATUS.CANNIBAL,

      CONFIG.EVENT.CANNIBAL,

      payload

    );

  }

  /*=======================================================
    SCRAP
  =======================================================*/

  function scrap(

    assetId,

    payload

  ){

    return changeStatus_(

      assetId,

      CONFIG.STATUS.SCRAP,

      CONFIG.EVENT.SCRAP,

      payload

    );

  }

  /*=======================================================
    CHANGE STATUS
  =======================================================*/

  function changeStatus_(

    assetId,

    status,

    eventType,

    payload

  ){

    return Database.transaction(function(){

      const event = EventEngine.create({

        EVENT_TYPE :

          eventType,

        ASSET_ID :

          assetId,

        DOCUMENT_NO :

          payload?.DOCUMENT_NO || "",

        BRANCH :

          payload?.BRANCH || "",

        LOCATION :

          payload?.LOCATION || "",

        DESCRIPTION :

          payload?.DESCRIPTION || ""

      });

      StatusEngine.change(

        assetId,

        status,

        event.EVENT_ID

      );

      if(payload){

        MovementEngine.create({

          ASSET_ID :

            assetId,

          EVENT_ID :

            event.EVENT_ID,

          FROM_BRANCH :

            payload.FROM_BRANCH || "",

          TO_BRANCH :

            payload.TO_BRANCH || "",

          FROM_LOCATION :

            payload.FROM_LOCATION || "",

          TO_LOCATION :

            payload.TO_LOCATION || "",

          FROM_STATUS :

            payload.FROM_STATUS ||

            AssetEngine.getStatus(assetId),

          TO_STATUS :

            status

        });

      }

      return AssetEngine.getPassport(

        assetId

      );

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    create,

    ready,

    rental,

    return : returnAsset,

    repair,

    waitingPart,

    qc,

    booked,

    sales,

    export : exportAsset,

    cannibal,

    scrap

  };

})();