/*=========================================================
 RPN MANAGEMENT SYSTEM
 AssetEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const AssetEngine = (() => {

  "use strict";


  /*=======================================================
    DATABASE
    Lazy initialization untuk mencegah dependency error
  =======================================================*/

  function database_(){

    return Database.MASTER;

  }


  /*=======================================================
    GET ASSET
  =======================================================*/

  function get(assetId){

    return Repository.findById(

      database_(),

      CONFIG.SHEET.ASSET,

      CONFIG.COLUMN.ASSET.ID,

      assetId

    );

  }


  /*=======================================================
    GET INSTANCE
  =======================================================*/

  function getInstance(assetId){

    return Repository.first(

      database_(),

      CONFIG.SHEET.ASSET_INSTANCE,

      item => item.ASSET_ID === assetId

    );

  }


  /*=======================================================
    GET STATUS
  =======================================================*/

  function getStatus(assetId){

    const instance = getInstance(assetId);

    return instance ?

      instance.CURRENT_STATUS :

      null;

  }


  /*=======================================================
    GET LOCATION
  =======================================================*/

  function getLocation(assetId){

    const instance = getInstance(assetId);

    if(!instance){

      return null;

    }

    return {

      BRANCH :
        instance.CURRENT_BRANCH,

      WAREHOUSE :
        instance.CURRENT_WAREHOUSE,

      LOCATION :
        instance.CURRENT_LOCATION

    };

  }


  /*=======================================================
    GET CUSTOMER
  =======================================================*/

  function getCustomer(assetId){

    const instance = getInstance(assetId);

    return instance ?

      instance.CURRENT_CUSTOMER :

      "";

  }


  /*=======================================================
    GET ACTIVE WO
  =======================================================*/

  function getWorkOrder(assetId){

    const instance = getInstance(assetId);

    return instance ?

      instance.CURRENT_WO :

      "";

  }


  /*=======================================================
    IS AVAILABLE
  =======================================================*/

  function isAvailable(assetId){

    return getStatus(assetId) ===

      CONFIG.STATUS.READY;

  }


  /*=======================================================
    IS BOOKED
  =======================================================*/

  function isBooked(assetId){

    return getStatus(assetId) ===

      CONFIG.STATUS.BOOKED;

  }


  /*=======================================================
    IS RENTAL
  =======================================================*/

  function isRental(assetId){

    return getStatus(assetId) ===

      CONFIG.STATUS.RENTAL;

  }


  /*=======================================================
    GET COMPONENT
  =======================================================*/

  function getComponents(assetId){

    return AssetCompositionEngine.current(

      assetId

    );

  }


  /*=======================================================
    GET HISTORY
  =======================================================*/

  function getHistory(assetId){

    return MovementEngine.history(

      assetId

    );

  }


  /*=======================================================
    UPDATE INSTANCE
  =======================================================*/

  function updateInstance(

    assetId,

    object

  ){

    const instance = getInstance(assetId);

    if(!instance){

      throw new Error(

        "Asset Instance tidak ditemukan."

      );

    }


    Object.assign(

      instance,

      object

    );


    const header =

      SpreadsheetService.getHeader(

        database_(),

        CONFIG.SHEET.ASSET_INSTANCE

      );


    const find =

      SpreadsheetService.find(

        database_(),

        CONFIG.SHEET.ASSET_INSTANCE,

        CONFIG.COLUMN.ASSET_INSTANCE.ID,

        instance.INSTANCE_ID

      );


    if(!find){

      throw new Error(

        "Asset Instance tidak ditemukan di database."

      );

    }


    Repository.update(

      database_(),

      CONFIG.SHEET.ASSET_INSTANCE,

      find.row,

      header,

      instance

    );


    return instance;

  }


  /*=======================================================
    DIGITAL PASSPORT
  =======================================================*/

  function getPassport(assetId){

    return {

      asset :

        get(assetId),

      instance :

        getInstance(assetId),

      location :

        getLocation(assetId),

      components :

        getComponents(assetId),

      history :

        getHistory(assetId)

    };

  }


  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    get,

    getInstance,

    getStatus,

    getLocation,

    getCustomer,

    getWorkOrder,

    isAvailable,

    isBooked,

    isRental,

    getComponents,

    getHistory,

    updateInstance,

    getPassport

  };

})();