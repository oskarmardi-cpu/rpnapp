/*=========================================================
 RPN MANAGEMENT SYSTEM
 PopulationEngine.gs
 Enterprise Edition v4.0
 Actual Population Engine
=========================================================*/

const PopulationEngine = (() => {

  "use strict";

  /*=======================================================
    SUMMARY
  =======================================================*/

  function summary(){

    return {

      UNIT :

        summaryByType(

          CONFIG.ASSET_TYPE.UNIT

        ),

      BATTERY :

        summaryByType(

          CONFIG.ASSET_TYPE.BATTERY

        ),

      CHARGER :

        summaryByType(

          CONFIG.ASSET_TYPE.CHARGER

        ),

      TROLLEY :

        summaryByType(

          CONFIG.ASSET_TYPE.TROLLEY

        ),

      SPARE_PART :

        summaryByType(

          CONFIG.ASSET_TYPE.SPARE_PART

        )

    };

  }

  /*=======================================================
    SUMMARY BY TYPE
  =======================================================*/

  function summaryByType(type){

    const asset = StockEngine.byType(type);

    return {

      TOTAL :

        asset.length,

      READY :

        count_(asset,CONFIG.STATUS.READY),

      RENTAL :

        count_(asset,CONFIG.STATUS.RENTAL),

      BOOKED :

        count_(asset,CONFIG.STATUS.BOOKED),

      REPAIR :

        count_(asset,CONFIG.STATUS.REPAIR),

      WAITING_PART :

        count_(asset,CONFIG.STATUS.WAITING_PART),

      QC :

        count_(asset,CONFIG.STATUS.QC),

      EXPORT :

        count_(asset,CONFIG.STATUS.EXPORT),

      SCRAP :

        count_(asset,CONFIG.STATUS.SCRAP),

      CANNIBAL :

        count_(asset,CONFIG.STATUS.CANNIBAL)

    };

  }

  /*=======================================================
    BRANCH SUMMARY
  =======================================================*/

  function branch(branch){

    ValidationEngine.branch(branch);

    return {

      UNIT :

        branchType(

          branch,

          CONFIG.ASSET_TYPE.UNIT

        ),

      BATTERY :

        branchType(

          branch,

          CONFIG.ASSET_TYPE.BATTERY

        ),

      CHARGER :

        branchType(

          branch,

          CONFIG.ASSET_TYPE.CHARGER

        ),

      TROLLEY :

        branchType(

          branch,

          CONFIG.ASSET_TYPE.TROLLEY

        )

    };

  }

  /*=======================================================
    BRANCH TYPE
  =======================================================*/

  function branchType(

    branch,

    type

  ){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item => {

        const asset = AssetEngine.get(

          item.ASSET_ID

        );

        return asset &&

          asset.ASSET_TYPE===type &&

          item.CURRENT_BRANCH===branch;

      }

    ).length;

  }

  /*=======================================================
    CUSTOMER
  =======================================================*/

  function customer(customerId){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item =>

        item.CURRENT_CUSTOMER===customerId

    );

  }

  /*=======================================================
    USED STOCK
  =======================================================*/

  function used(){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item =>

        item.CURRENT_STATUS===CONFIG.STATUS.READY ||

        item.CURRENT_STATUS===CONFIG.STATUS.BOOKED ||

        item.CURRENT_STATUS===CONFIG.STATUS.REPAIR

    );

  }

  /*=======================================================
    RENTAL POPULATION
  =======================================================*/

  function rental(){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item =>

        item.CURRENT_STATUS===

        CONFIG.STATUS.RENTAL

    );

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportStock(){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item =>

        item.CURRENT_STATUS===

        CONFIG.STATUS.EXPORT

    );

  }

  /*=======================================================
    SCRAP
  =======================================================*/

  function scrap(){

    return Repository.find(

      Database.MASTER,

      CONFIG.SHEET.ASSET_INSTANCE,

      item =>

        item.CURRENT_STATUS===

        CONFIG.STATUS.SCRAP

    );

  }

  /*=======================================================
    DASHBOARD
  =======================================================*/

  function dashboard(){

    return {

      POPULATION :

        summary(),

      BRANCH : {

        LEMAHABANG :

          branch(

            CONFIG.BRANCH.LEMAHABANG

          ),

        SURABAYA :

          branch(

            CONFIG.BRANCH.SURABAYA

          ),

        MEDAN :

          branch(

            CONFIG.BRANCH.MEDAN

          )

      },

      RENTAL :

        rental().length,

      USED :

        used().length,

      EXPORT :

        exportStock().length,

      SCRAP :

        scrap().length

    };

  }

  /*=======================================================
    COUNT
  =======================================================*/

  function count_(

    list,

    status

  ){

    return list.filter(

      item =>

        item.CURRENT_STATUS===status

    ).length;

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    summary,

    branch,

    customer,

    used,

    rental,

    export : exportStock,

    scrap,

    dashboard

  };

})();