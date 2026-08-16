/*=========================================================
 RPN MANAGEMENT SYSTEM
 MasterService.gs
 Enterprise Edition v2.0
=========================================================*/

const MasterService = (() => {

  "use strict";

  /*=======================================================
    GET LIST
  =======================================================*/

  function getList(sheet){

    try{

      return Response.success(

        Repository.all(

          Database.MASTER,

          sheet

        )

      );

    }

    catch(err){

      Logger.error(

        "MasterService.getList",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    GET BY ID
  =======================================================*/

  function getById(

    sheet,

    id

  ){

    try{

      const data = Repository.findById(

        Database.MASTER,

        sheet,

        CONFIG.COLUMN[sheet].ID,

        id

      );

      return Response.success(data);

    }

    catch(err){

      Logger.error(

        "MasterService.getById",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    SEARCH
  =======================================================*/

  function search(

    sheet,

    keyword

  ){

    try{

      keyword =

        String(keyword)

        .toLowerCase();

      const data = Repository.find(

        Database.MASTER,

        sheet,

        item =>

          JSON.stringify(item)

          .toLowerCase()

          .indexOf(keyword) > -1

      );

      return Response.success(data);

    }

    catch(err){

      Logger.error(

        "MasterService.search",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    CREATE
  =======================================================*/

  function create(

    sheet,

    object

  ){

    try{

      RuleEngine.object(object);

      RuleEngine.required(

        object,

        CONFIG.REQUIRED[sheet] || []

      );

      const header = SpreadsheetService.getHeader(

        Database.MASTER,

        sheet

      );

      Repository.insert(

        Database.MASTER,

        sheet,

        header,

        object

      );

      SpreadsheetService.audit(

        "CREATE",

        sheet,

        object.ID ||

        Utility.uuid(),

        object

      );

      return Response.success(object);

    }

    catch(err){

      Logger.error(

        "MasterService.create",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    UPDATE
  =======================================================*/

  function update(

    sheet,

    id,

    object

  ){

    try{

      const find = SpreadsheetService.find(

        Database.MASTER,

        sheet,

        CONFIG.COLUMN[sheet].ID,

        id

      );

      if(!find){

        return Response.error(

          "Data tidak ditemukan."

        );

      }

      const current =

        find.object;

      Object.assign(

        current,

        object

      );

      const header = SpreadsheetService.getHeader(

        Database.MASTER,

        sheet

      );

      Repository.update(

        Database.MASTER,

        sheet,

        find.row,

        header,

        current

      );

      SpreadsheetService.audit(

        "UPDATE",

        sheet,

        id,

        current

      );

      return Response.success(current);

    }

    catch(err){

      Logger.error(

        "MasterService.update",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    REMOVE (SOFT DELETE)
  =======================================================*/

  function remove(

    sheet,

    id

  ){

    try{

      const find = SpreadsheetService.find(

        Database.MASTER,

        sheet,

        CONFIG.COLUMN[sheet].ID,

        id

      );

      if(!find){

        return Response.error(

          "Data tidak ditemukan."

        );

      }

      const current =

        find.object;

      current.IS_ACTIVE = false;

      current.DELETED_AT =

        Utility.now();

      current.DELETED_BY =

        Auth.getUser().username;

      const header = SpreadsheetService.getHeader(

        Database.MASTER,

        sheet

      );

      Repository.update(

        Database.MASTER,

        sheet,

        find.row,

        header,

        current

      );

      SpreadsheetService.audit(

        "DELETE",

        sheet,

        id,

        current

      );

      return Response.success(current);

    }

    catch(err){

      Logger.error(

        "MasterService.remove",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    getList,

    getById,

    search,

    create,

    update,

    remove

  };

})();