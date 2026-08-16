/*=========================================================
 RPN MANAGEMENT SYSTEM
 AuditTrailEngine.gs
 Enterprise Edition v5.1
=========================================================*/

const AuditTrailEngine = (() => {

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
      !Database ||
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
      !config.SHEET.AUDIT
    ){

      throw new Error(
        "CONFIG.SHEET.AUDIT belum tersedia."
      );

    }

    return config.SHEET.AUDIT;

  }

  /*=======================================================
    WRITE
  =======================================================*/

  function write(data){

    const database = getDatabase_();
    const sheet = getSheet_();

    const header = SpreadsheetService.getHeader(

      database,

      sheet

    );

    const audit = {

      AUDIT_ID :

        Utility.uuid(),

      MODULE :

        data.MODULE,

      ACTION :

        data.ACTION,

      DOCUMENT_NO :

        data.DOCUMENT_NO || "",

      ASSET_ID :

        data.ASSET_ID || "",

      USERNAME :

        currentUser_(),

      ROLE :

        currentRole_(),

      BEFORE_DATA :

        JSON.stringify(

          data.BEFORE || {}

        ),

      AFTER_DATA :

        JSON.stringify(

          data.AFTER || {}

        ),

      IP_ADDRESS :

        Session.getTemporaryActiveUserKey(),

      DEVICE :

        data.DEVICE || "",

      BROWSER :

        data.BROWSER || "",

      CREATED_AT :

        Utility.now()

    };

    Repository.insert(

      database,

      sheet,

      header,

      audit

    );

    return audit;

  }

  /*=======================================================
    LOGIN
  =======================================================*/

  function login(user){

    return write({

      MODULE : "AUTH",

      ACTION : "LOGIN",

      AFTER : user

    });

  }

  /*=======================================================
    LOGOUT
  =======================================================*/

  function logout(user){

    return write({

      MODULE : "AUTH",

      ACTION : "LOGOUT",

      AFTER : user

    });

  }

  /*=======================================================
    CREATE
  =======================================================*/

  function create(module,data){

    return write({

      MODULE : module,

      ACTION : "CREATE",

      AFTER : data

    });

  }

  /*=======================================================
    UPDATE
  =======================================================*/

  function update(

    module,

    before,

    after

  ){

    return write({

      MODULE : module,

      ACTION : "UPDATE",

      BEFORE : before,

      AFTER : after

    });

  }

  /*=======================================================
    DELETE
  =======================================================*/

  function remove(

    module,

    before

  ){

    return write({

      MODULE : module,

      ACTION : "DELETE",

      BEFORE : before

    });

  }

  /*=======================================================
    STATUS
  =======================================================*/

  function status(

    assetId,

    fromStatus,

    toStatus,

    documentNo

  ){

    return write({

      MODULE : "STATUS",

      ACTION : "CHANGE",

      ASSET_ID : assetId,

      DOCUMENT_NO : documentNo,

      BEFORE : {

        STATUS : fromStatus

      },

      AFTER : {

        STATUS : toStatus

      }

    });

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function approval(

    documentNo,

    status,

    remark

  ){

    return write({

      MODULE : "APPROVAL",

      ACTION : status,

      DOCUMENT_NO : documentNo,

      AFTER : {

        STATUS : status,

        REMARK : remark

      }

    });

  }

  /*=======================================================
    HISTORY
  =======================================================*/

  function history(

    module,

    reference

  ){

    const database = getDatabase_();
    const sheet = getSheet_();

    return Repository.find(

      database,

      sheet,

      item =>

        item.MODULE === module &&

        item.DOCUMENT_NO === reference

    );

  }

  /*=======================================================
    USER
  =======================================================*/

  function currentUser_(){

    try{

      const user = Auth.getUser();

      return (

        user.USERNAME ||

        user.username ||

        "SYSTEM"

      );

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    ROLE
  =======================================================*/

  function currentRole_(){

    try{

      const user = Auth.getUser();

      return (

        user.ROLE ||

        user.role ||

        "SYSTEM"

      );

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    write,

    login,

    logout,

    create,

    update,

    remove,

    status,

    approval,

    history

  };

})();