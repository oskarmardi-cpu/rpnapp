/*=========================================================
 RPN MANAGEMENT SYSTEM
 AssetCompositionEngine.gs
 Enterprise Edition v1.1
=========================================================*/

const AssetCompositionEngine = (() => {

  "use strict";

  /*=======================================================
    CONFIG RESOLVER
  =======================================================*/

  function getConfig_(){

    if(
      typeof CONFIG === "undefined" ||
      !CONFIG
    ){

      throw new Error(
        "CONFIG belum tersedia."
      );

    }

    return CONFIG;

  }

  /*=======================================================
    DATABASE RESOLVER
  =======================================================*/

  function getDatabase_(){

    if(
      typeof Database === "undefined" ||
      !Database
    ){

      throw new Error(
        "Database belum tersedia."
      );

    }

    if(
      typeof Database.SYSTEM === "undefined"
    ){

      throw new Error(
        "Database.SYSTEM belum tersedia."
      );

    }

    return Database.SYSTEM;

  }

  /*=======================================================
    SHEET RESOLVER
  =======================================================*/

  function getSheet_(){

    const config = getConfig_();

    if(
      !config.SHEET ||
      !config.SHEET.ASSET_RELATION
    ){

      throw new Error(
        "CONFIG.SHEET.ASSET_RELATION belum tersedia."
      );

    }

    return config.SHEET.ASSET_RELATION;

  }

  /*=======================================================
    INSTALL COMPONENT
  =======================================================*/

  function install(data){

    const database = getDatabase_();
    const sheet = getSheet_();

    RuleEngine.required(data,[

      "PARENT_ASSET_ID",
      "CHILD_ASSET_ID",
      "RELATION_TYPE",
      "EVENT_ID"

    ]);

    return Database.transaction(function(){

      uninstallCurrent_(

        data.CHILD_ASSET_ID,

        data.EVENT_ID

      );

      const header = SpreadsheetService.getHeader(

        database,

        sheet

      );

      const relation = {

        RELATION_ID :

          Utility.uuid(),

        PARENT_ASSET_ID :

          data.PARENT_ASSET_ID,

        CHILD_ASSET_ID :

          data.CHILD_ASSET_ID,

        RELATION_TYPE :

          data.RELATION_TYPE,

        START_DATE :

          Utility.now(),

        END_DATE :

          "",

        EVENT_ID :

          data.EVENT_ID,

        ACTIVE :

          true,

        CREATED_BY :

          currentUser_(),

        CREATED_AT :

          Utility.now()

      };

      Repository.insert(

        database,

        sheet,

        header,

        relation

      );

      SpreadsheetService.audit(

        "INSTALL_COMPONENT",

        sheet,

        relation.RELATION_ID,

        relation

      );

      return relation;

    });

  }

  /*=======================================================
    REMOVE COMPONENT
  =======================================================*/

  function remove(

    childAssetId,

    eventId

  ){

    return uninstallCurrent_(

      childAssetId,

      eventId

    );

  }

  /*=======================================================
    CURRENT COMPONENT
  =======================================================*/

  function current(parentAssetId){

    const database = getDatabase_();
    const sheet = getSheet_();

    return Repository.find(

      database,

      sheet,

      function(item){

        return (

          item.PARENT_ASSET_ID === parentAssetId &&

          item.ACTIVE === true

        );

      }

    );

  }

  /*=======================================================
    HISTORY
  =======================================================*/

  function history(assetId){

    const database = getDatabase_();
    const sheet = getSheet_();

    return Repository.find(

      database,

      sheet,

      function(item){

        return (

          item.PARENT_ASSET_ID === assetId ||

          item.CHILD_ASSET_ID === assetId

        );

      }

    );

  }

  /*=======================================================
    FIND PARENT
  =======================================================*/

  function parent(childAssetId){

    const database = getDatabase_();
    const sheet = getSheet_();

    return Repository.first(

      database,

      sheet,

      function(item){

        return (

          item.CHILD_ASSET_ID === childAssetId &&

          item.ACTIVE === true

        );

      }

    );

  }

  /*=======================================================
    UNINSTALL CURRENT
  =======================================================*/

  function uninstallCurrent_(

    childAssetId,

    eventId

  ){

    const database = getDatabase_();
    const sheet = getSheet_();

    const relation = parent(

      childAssetId

    );

    if(!relation){

      return;

    }

    relation.ACTIVE = false;

    relation.END_DATE = Utility.now();

    relation.EVENT_ID = eventId;

    const find = SpreadsheetService.find(

      database,

      sheet,

      3,

      childAssetId

    );

    if(!find){

      return;

    }

    const header = SpreadsheetService.getHeader(

      database,

      sheet

    );

    Repository.update(

      database,

      sheet,

      find.row,

      header,

      relation

    );

    SpreadsheetService.audit(

      "REMOVE_COMPONENT",

      sheet,

      relation.RELATION_ID,

      relation

    );

  }

  /*=======================================================
    COMPONENT LIST
  =======================================================*/

  function battery(unitId){

    return component_(

      unitId,

      "BATTERY"

    );

  }

  function charger(unitId){

    return component_(

      unitId,

      "CHARGER"

    );

  }

  function trolley(unitId){

    return component_(

      unitId,

      "TROLLEY"

    );

  }

  function attachment(unitId){

    return component_(

      unitId,

      "ATTACHMENT"

    );

  }

  /*=======================================================
    COMPONENT FINDER
  =======================================================*/

  function component_(

    unitId,

    type

  ){

    const database = getDatabase_();
    const config = getConfig_();

    return current(

      unitId

    ).filter(function(item){

      const asset = Repository.findById(

        Database.MASTER,

        config.SHEET.ASSET,

        1,

        item.CHILD_ASSET_ID

      );

      return (

        asset &&

        asset.ASSET_TYPE === type

      );

    });

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      return Auth.getUser().username;

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    install,

    remove,

    current,

    history,

    parent,

    battery,

    charger,

    trolley,

    attachment

  };

})();