/*=========================================================
 RPN MANAGEMENT SYSTEM
 TransactionService.gs
 Enterprise Edition v2.0
=========================================================*/

const TransactionService = (() => {

  "use strict";

  /*=======================================================
    GET LIST
  =======================================================*/

  function getList(sheet){

    try{

      return Response.success(

        Repository.all(

          Database.TRANSACTION,

          sheet

        )

      );

    }

    catch(err){

      Logger.error(

        "TransactionService.getList",

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

        Database.TRANSACTION,

        sheet,

        CONFIG.COLUMN[sheet].ID,

        id

      );

      return Response.success(data);

    }

    catch(err){

      Logger.error(

        "TransactionService.getById",

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

      return Database.transaction(function(){

        object.DOCUMENT_NO =

          DocumentNumberEngine.generate(

            CONFIG.DOCUMENT[sheet]

          );

        object.CREATED_AT =

          Utility.now();

        object.CREATED_BY =

          Auth.getUser().username;

        object.STATUS =

          CONFIG.WO_STATUS.OPEN;

        const header = SpreadsheetService.getHeader(

          Database.TRANSACTION,

          sheet

        );

        Repository.insert(

          Database.TRANSACTION,

          sheet,

          header,

          object

        );

        SpreadsheetService.audit(

          "CREATE",

          sheet,

          object.DOCUMENT_NO,

          object

        );

        return Response.success(object);

      });

    }

    catch(err){

      Logger.error(

        "TransactionService.create",

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

        Database.TRANSACTION,

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

      current.UPDATED_AT =

        Utility.now();

      current.UPDATED_BY =

        Auth.getUser().username;

      const header = SpreadsheetService.getHeader(

        Database.TRANSACTION,

        sheet

      );

      Repository.update(

        Database.TRANSACTION,

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

        "TransactionService.update",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    APPROVE
  =======================================================*/

  function approve(

    sheet,

    id

  ){

    return changeStatus(

      sheet,

      id,

      CONFIG.WO_STATUS.READY

    );

  }

  /*=======================================================
    FINISH
  =======================================================*/

  function finish(

    sheet,

    id

  ){

    return changeStatus(

      sheet,

      id,

      CONFIG.WO_STATUS.CLOSED

    );

  }

  /*=======================================================
    CANCEL
  =======================================================*/

  function cancel(

    sheet,

    id

  ){

    return changeStatus(

      sheet,

      id,

      CONFIG.WO_STATUS.CANCELLED

    );

  }

  /*=======================================================
    CHANGE STATUS
  =======================================================*/

  function changeStatus(

    sheet,

    id,

    status

  ){

    try{

      const find = SpreadsheetService.find(

        Database.TRANSACTION,

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

      current.STATUS = status;

      current.UPDATED_AT =

        Utility.now();

      current.UPDATED_BY =

        Auth.getUser().username;

      const header = SpreadsheetService.getHeader(

        Database.TRANSACTION,

        sheet

      );

      Repository.update(

        Database.TRANSACTION,

        sheet,

        find.row,

        header,

        current

      );

      SpreadsheetService.audit(

        "STATUS",

        sheet,

        id,

        current

      );

      return Response.success(current);

    }

    catch(err){

      Logger.error(

        "TransactionService.changeStatus",

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

        Database.TRANSACTION,

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

        Database.TRANSACTION,

        sheet

      );

      Repository.update(

        Database.TRANSACTION,

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

        "TransactionService.remove",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    getList,

    getById,

    create,

    update,

    approve,

    finish,

    cancel,

    remove

  };

})();