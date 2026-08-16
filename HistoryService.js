/*=========================================================
 RPN MANAGEMENT SYSTEM
 HistoryService.gs
 Enterprise Edition v2.1
=========================================================*/

const HistoryService = (() => {

  "use strict";

  /*=======================================================
    DATABASE
  =======================================================*/

  const DATABASE =
    Database.SYSTEM;

  const SHEET =
    CONFIG.SHEET.HISTORY;

  /*=======================================================
    CHECK AUDIT AVAILABLE
  =======================================================*/

  function isAvailable_(){

    try{

      SpreadsheetService.getHeader(

        DATABASE,

        SHEET

      );

      return true;

    }

    catch(err){

      return false;

    }

  }

  /*=======================================================
    WRITE
  =======================================================*/

  function write(

    action,

    module,

    reference,

    data

  ){

    try{

      /*
       * Audit bersifat OPTIONAL.
       * Jika SYSTEM / SYS_AUDIT belum tersedia,
       * proses utama tidak boleh gagal.
       */

      if(!isAvailable_()){

        return null;

      }

      const header =

        SpreadsheetService.getHeader(

          DATABASE,

          SHEET

        );

      const history = {

        HISTORY_ID :

          Utility.uuid(),

        ACTION :

          action,

        MODULE :

          module,

        REFERENCE :

          reference,

        DATA :

          JSON.stringify(

            data || {}

          ),

        USERNAME :

          currentUser_(),

        CREATED_AT :

          Utility.now()

      };

      Repository.insert(

        DATABASE,

        SHEET,

        header,

        history

      );

      return history;

    }

    catch(err){

      /*
       * Audit tidak boleh memblokir
       * transaksi utama.
       */

      try{

        console.error(

          "HistoryService.write:",

          err.message

        );

      }

      catch(e){}

      return null;

    }

  }

  /*=======================================================
    GET ALL
  =======================================================*/

  function getHistory(){

    try{

      if(!isAvailable_()){

        return Response.success([]);

      }

      return Response.success(

        Repository.all(

          DATABASE,

          SHEET

        )

      );

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    USER HISTORY
  =======================================================*/

  function getUserHistory(

    username

  ){

    try{

      if(!isAvailable_()){

        return Response.success([]);

      }

      return Response.success(

        Repository.find(

          DATABASE,

          SHEET,

          item =>

            item.USERNAME === username

        )

      );

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    MODULE HISTORY
  =======================================================*/

  function getModuleHistory(

    module

  ){

    try{

      if(!isAvailable_()){

        return Response.success([]);

      }

      return Response.success(

        Repository.find(

          DATABASE,

          SHEET,

          item =>

            item.MODULE === module

        )

      );

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    REFERENCE HISTORY
  =======================================================*/

  function getReferenceHistory(

    reference

  ){

    try{

      if(!isAvailable_()){

        return Response.success([]);

      }

      return Response.success(

        Repository.find(

          DATABASE,

          SHEET,

          item =>

            item.REFERENCE === reference

        )

      );

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    SEARCH
  =======================================================*/

  function search(

    keyword

  ){

    try{

      if(!isAvailable_()){

        return Response.success([]);

      }

      keyword =

        String(keyword || "")

          .toLowerCase();

      return Response.success(

        Repository.find(

          DATABASE,

          SHEET,

          item =>

            JSON.stringify(item)

              .toLowerCase()

              .indexOf(keyword) > -1

        )

      );

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    REMOVE
  =======================================================*/

  function remove(

    historyId

  ){

    try{

      if(!isAvailable_()){

        return Response.error(

          "History database belum tersedia."

        );

      }

      const find =

        SpreadsheetService.find(

          DATABASE,

          SHEET,

          CONFIG.COLUMN.HISTORY.ID,

          historyId

        );

      if(!find){

        return Response.error(

          "History tidak ditemukan."

        );

      }

      Database.remove(

        DATABASE,

        SHEET,

        find.row

      );

      return Response.success();

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    CLEAR
  =======================================================*/

  function clear(){

    try{

      if(!isAvailable_()){

        return Response.success();

      }

      Database.clear(

        DATABASE,

        SHEET

      );

      return Response.success();

    }

    catch(err){

      return Response.error(err);

    }

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      const user =

        Auth.getUser();

      if(!user){

        return "SYSTEM";

      }

      return (

        user.USERNAME ||

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

    getHistory,

    getUserHistory,

    getModuleHistory,

    getReferenceHistory,

    search,

    remove,

    clear

  };

})();