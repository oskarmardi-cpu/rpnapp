/*=========================================================
 RPN MANAGEMENT SYSTEM
 StockEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const StockEngine = (() => {

  "use strict";

  /*=======================================================
    CURRENT STOCK
  =======================================================*/

  function current(filter){

    let data = Repository.all(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE

    );

    if(filter){

      data = data.filter(filter);

    }

    return data;

  }

  /*=======================================================
    BY BRANCH
  =======================================================*/

  function byBranch(branch){

    ValidationEngine.branch(branch);

    return current(item =>

      item.CURRENT_BRANCH === branch &&

      item.CURRENT_STATUS !==

      CONFIG.STATUS.SCRAP

    );

  }

  /*=======================================================
    BY WAREHOUSE
  =======================================================*/

  function byWarehouse(warehouse){

    ValidationEngine.warehouse(

      warehouse

    );

    return current(item =>

      item.CURRENT_WAREHOUSE === warehouse &&

      item.CURRENT_STATUS !==

      CONFIG.STATUS.SCRAP

    );

  }

  /*=======================================================
    BY STATUS
  =======================================================*/

  function byStatus(status){

    ValidationEngine.status(status);

    return current(item =>

      item.CURRENT_STATUS === status

    );

  }

  /*=======================================================
    BY TYPE
  =======================================================*/

  function byType(type){

    return current(item => {

      const asset = AssetEngine.get(

        item.ASSET_ID

      );

      return asset &&

        asset.ASSET_TYPE === type;

    });

  }

  /*=======================================================
    AVAILABLE
  =======================================================*/

  function available(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.READY

      );

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.RENTAL

      );

  }

  /*=======================================================
    BOOKED
  =======================================================*/

  function booked(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.BOOKED

      );

  }

  /*=======================================================
    REPAIR
  =======================================================*/

  function repair(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.REPAIR

      );

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.WAITING_PART

      );

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportStock(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.EXPORT

      );

  }

  /*=======================================================
    SCRAP
  =======================================================*/

  function scrap(type){

    return byType(type)

      .filter(item =>

        item.CURRENT_STATUS ===

        CONFIG.STATUS.SCRAP

      );

  }

  /*=======================================================
    SUMMARY
  =======================================================*/

  function summary(){

    return {

      UNIT :

        available(

          CONFIG.ASSET_TYPE.UNIT

        ).length,

      BATTERY :

        available(

          CONFIG.ASSET_TYPE.BATTERY

        ).length,

      CHARGER :

        available(

          CONFIG.ASSET_TYPE.CHARGER

        ).length,

      TROLLEY :

        available(

          CONFIG.ASSET_TYPE.TROLLEY

        ).length,

      SPARE_PART :

        available(

          CONFIG.ASSET_TYPE.SPARE_PART

        ).length

    };

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    current,

    byBranch,

    byWarehouse,

    byStatus,

    byType,

    available,

    rental,

    booked,

    repair,

    waitingPart,

    export : exportStock,

    scrap,

    summary

  };

})();