/*=========================================================
 RPN MANAGEMENT SYSTEM
 ValidationEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const ValidationEngine = (() => {

  "use strict";

  /*=======================================================
    ASSET
  =======================================================*/

  function asset(assetId){

    const asset = AssetEngine.get(assetId);

    if(!asset){

      throw new Error(

        "Asset tidak ditemukan."

      );

    }

    return asset;

  }

  /*=======================================================
    ASSET READY
  =======================================================*/

  function assetReady(assetId){

    asset(assetId);

    if(

      !AssetEngine.isAvailable(

        assetId

      )

    ){

      throw new Error(

        "Asset tidak READY."

      );

    }

    return true;

  }

  /*=======================================================
    ASSET NOT BOOKED
  =======================================================*/

  function assetNotBooked(assetId){

    if(

      AssetEngine.isBooked(

        assetId

      )

    ){

      throw new Error(

        "Asset sedang BOOKED."

      );

    }

    return true;

  }

  /*=======================================================
    WORK ORDER
  =======================================================*/

  function workOrder(woId){

    const wo = Repository.findById(

      Database.TRANSACTION,

      CONFIG.SHEET.WORK_ORDER,

      CONFIG.COLUMN.T_WORK_ORDER.ID,

      woId

    );

    if(!wo){

      throw new Error(

        "Work Order tidak ditemukan."

      );

    }

    return wo;

  }

  /*=======================================================
    RESERVATION
  =======================================================*/

  function reservation(reservationId){

    const reservation = Repository.findById(

      Database.TRANSACTION,

      CONFIG.SHEET.RESERVATION,

      CONFIG.COLUMN.T_RESERVATION.ID,

      reservationId

    );

    if(!reservation){

      throw new Error(

        "Reservation tidak ditemukan."

      );

    }

    return reservation;

  }

  /*=======================================================
    SALES ORDER
  =======================================================*/

  function salesOrder(assetId){

    const exist = Repository.exists(

      Database.TRANSACTION,

      CONFIG.SHEET.RESERVATION,

      item =>

        item.ASSET_ID===assetId &&

        item.STATUS===

        CONFIG.RESERVATION_STATUS.CONFIRMED

    );

    if(exist){

      throw new Error(

        "Sales Order sudah ada."

      );

    }

    return true;

  }

  /*=======================================================
    BRANCH
  =======================================================*/

  function branch(branch){

    if(

      !Object.values(

        CONFIG.BRANCH

      ).includes(branch)

    ){

      throw new Error(

        "Branch tidak valid."

      );

    }

    return true;

  }

  /*=======================================================
    WAREHOUSE
  =======================================================*/

  function warehouse(warehouse){

    if(

      !Object.values(

        CONFIG.WAREHOUSE

      ).includes(warehouse)

    ){

      throw new Error(

        "Warehouse tidak valid."

      );

    }

    return true;

  }

  /*=======================================================
    STATUS
  =======================================================*/

  function status(status){

    if(

      !Object.values(

        CONFIG.STATUS

      ).includes(status)

    ){

      throw new Error(

        "Status tidak valid."

      );

    }

    return true;

  }

  /*=======================================================
    DUPLICATE
  =======================================================*/

  function duplicate(

    database,

    sheet,

    column,

    value

  ){

    if(

      Database.exists(

        database,

        sheet,

        column,

        value

      )

    ){

      throw new Error(

        "Data sudah ada."

      );

    }

    return true;

  }

  /*=======================================================
    COMPONENT
  =======================================================*/

  function component(childAssetId){

    const relation =

      AssetCompositionEngine.parent(

        childAssetId

      );

    if(

      relation

    ){

      throw new Error(

        "Component masih terpasang."

      );

    }

    return true;

  }

  /*=======================================================
    CANNIBAL
  =======================================================*/

  function cannibal(assetId){

    asset(assetId);

    assetReady(assetId);

    assetNotBooked(assetId);

    return true;

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportAsset(assetId){

    asset(assetId);

    assetReady(assetId);

    assetNotBooked(assetId);

    return true;

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(assetId){

    asset(assetId);

    assetReady(assetId);

    assetNotBooked(assetId);

    return true;

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    asset,

    assetReady,

    assetNotBooked,

    workOrder,

    reservation,

    salesOrder,

    branch,

    warehouse,

    status,

    duplicate,

    component,

    cannibal,

    exportAsset,

    rental

  };

})();