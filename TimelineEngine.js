/*=========================================================
 RPN MANAGEMENT SYSTEM
 TimelineEngine.gs
 Enterprise Edition v4.0
 Digital Asset Passport
=========================================================*/

const TimelineEngine = (() => {

  "use strict";

  /*=======================================================
    TIMELINE
  =======================================================*/

  function timeline(assetId){

    ValidationEngine.asset(

      assetId

    );

    const asset = AssetEngine.get(

      assetId

    );

    return {

      PASSPORT :

        asset,

      MOVEMENT :

        movement(assetId),

      EVENT :

        event(assetId),

      REPAIR :

        repair(assetId),

      RENTAL :

        rental(assetId),

      SALES :

        sales(assetId),

      EXPORT :

        exportHistory(assetId),

      CANNIBAL :

        cannibal(assetId),

      COMPONENT :

        component(assetId),

      APPROVAL :

        approval(assetId)

    };

  }

  /*=======================================================
    EVENT
  =======================================================*/

  function event(assetId){

    return Repository.find(

      Database.SYSTEM,

      CONFIG.SHEET.EVENT_LEDGER,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    MOVEMENT
  =======================================================*/

  function movement(assetId){

    return Repository.find(

      Database.SYSTEM,

      CONFIG.SHEET.ASSET_MOVEMENT,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(assetId){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.RENTAL,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    REPAIR
  =======================================================*/

  function repair(assetId){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.WORK_ORDER,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    SALES
  =======================================================*/

  function sales(assetId){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.SALES,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportHistory(assetId){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.EXPORT,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    CANNIBAL
  =======================================================*/

  function cannibal(assetId){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.CANNIBAL,

      item =>

        item.SOURCE_ASSET_ID===assetId ||

        item.TARGET_ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    COMPONENT
  =======================================================*/

  function component(assetId){

    return {

      INSTALLED :

        AssetCompositionEngine

        .getComponents(assetId),

      HISTORY :

        Repository.find(

          Database.SYSTEM,

          CONFIG.SHEET.ASSET_RELATION,

          item =>

            item.PARENT_ASSET_ID===assetId ||

            item.CHILD_ASSET_ID===assetId

        ).sort(sortDate_)

    };

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function approval(assetId){

    return Repository.find(

      Database.SYSTEM,

      CONFIG.SHEET.APPROVAL,

      item =>

        item.ASSET_ID===assetId

    ).sort(sortDate_);

  }

  /*=======================================================
    DIGITAL PASSPORT
  =======================================================*/

  function passport(assetId){

    const asset = AssetEngine.getPassport(

      assetId

    );

    asset.TIMELINE =

      timeline(assetId);

    return asset;

  }

  /*=======================================================
    LAST EVENT
  =======================================================*/

  function lastEvent(assetId){

    const list = event(assetId);

    return list.length ?

      list[0] :

      null;

  }

  /*=======================================================
    SORT
  =======================================================*/

  function sortDate_(a,b){

    return new Date(

      b.CREATED_AT ||

      b.EVENT_DATE ||

      b.START_DATE

    ) -

    new Date(

      a.CREATED_AT ||

      a.EVENT_DATE ||

      a.START_DATE

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    timeline,

    passport,

    movement,

    event,

    repair,

    rental,

    sales,

    export : exportHistory,

    cannibal,

    component,

    approval,

    lastEvent

  };

})();