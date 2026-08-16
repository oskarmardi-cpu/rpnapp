/*=========================================================
 RPN MANAGEMENT SYSTEM
 Logger.gs
 Enterprise Edition v3.0
=========================================================*/

const Logger = (() => {

  "use strict";

  const DATABASE = Database.SYSTEM;

  const SHEET = CONFIG.SHEET.AUDIT;

  /*=======================================================
    INFO
  =======================================================*/

  function info(

    module,

    message,

    data

  ){

    write_(

      "INFO",

      module,

      message,

      data

    );

  }

  /*=======================================================
    WARNING
  =======================================================*/

  function warning(

    module,

    message,

    data

  ){

    write_(

      "WARNING",

      module,

      message,

      data

    );

  }

  /*=======================================================
    ERROR
  =======================================================*/

  function error(

    module,

    err,

    data

  ){

    write_(

      "ERROR",

      module,

      err.message ||

      String(err),

      data

    );

  }

  /*=======================================================
    DEBUG
  =======================================================*/

  function debug(

    module,

    message,

    data

  ){

    if(

      !CONFIG.SYSTEM.DEBUG

    ){

      return;

    }

    write_(

      "DEBUG",

      module,

      message,

      data

    );

  }

  /*=======================================================
    WRITE
  =======================================================*/

  function write_(

    level,

    module,

    message,

    data

  ){

    try{

      const header = SpreadsheetService.getHeader(

        DATABASE,

        SHEET

      );

      Repository.insert(

        DATABASE,

        SHEET,

        header,

        {

          AUDIT_ID :

            Utility.uuid(),

          MODULE :

            module,

          ACTION :

            level,

          REFERENCE :

            "",

          BEFORE_DATA :

            "",

          AFTER_DATA :

            JSON.stringify(

              data || {}

            ),

          USERNAME :

            currentUser_(),

          IP_ADDRESS :

            "",

          CREATED_AT :

            Utility.now(),

          MESSAGE :

            message

        }

      );

    }

    catch(e){

      console.log(e);

    }

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      const user =

        Auth.getUser();

      return user ?

        user.USERNAME :

        "SYSTEM";

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    info,

    warning,

    error,

    debug

  };

})();