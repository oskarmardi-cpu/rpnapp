/*=========================================================
 RPN MANAGEMENT SYSTEM
 Repository.gs
 Enterprise Edition v4.0
=========================================================*/

const Repository = (() => {

  "use strict";

  /*=======================================================
    ALL
  =======================================================*/

  function all(

    database,

    sheet

  ){

    return Database.select(

      database,

      sheet

    );

  }

  /*=======================================================
    FIND
  =======================================================*/

  function find(

    database,

    sheet,

    predicate

  ){

    return all(

      database,

      sheet

    ).filter(predicate);

  }

  /*=======================================================
    FIRST
  =======================================================*/

  function first(

    database,

    sheet,

    predicate

  ){

    const result = find(

      database,

      sheet,

      predicate

    );

    return result.length ?

      result[0] :

      null;

  }

  /*=======================================================
    FIND BY ID
  =======================================================*/

  function findById(

    database,

    sheet,

    column,

    value

  ){

    return first(

      database,

      sheet,

      item =>

        item[column]===value

    );

  }

  /*=======================================================
    EXISTS
  =======================================================*/

  function exists(

    database,

    sheet,

    predicate

  ){

    return find(

      database,

      sheet,

      predicate

    ).length>0;

  }

  /*=======================================================
    COUNT
  =======================================================*/

  function count(

    database,

    sheet,

    predicate

  ){

    if(!predicate){

      return all(

        database,

        sheet

      ).length;

    }

    return find(

      database,

      sheet,

      predicate

    ).length;

  }

  /*=======================================================
    INSERT
  =======================================================*/

  function insert(

    database,

    sheet,

    header,

    object

  ){

    const row = header.map(

      column =>

        object[column] ?? ""

    );

    Database.insert(

      database,

      sheet,

      row

    );

    return object;

  }

  /*=======================================================
    INSERT MANY
  =======================================================*/

  function insertMany(

    database,

    sheet,

    header,

    objects

  ){

    const rows = objects.map(

      obj =>

        header.map(

          col =>

            obj[col] ?? ""

        )

    );

    Database.insertMany(

      database,

      sheet,

      rows

    );

    return objects.length;

  }

  /*=======================================================
    UPDATE
  =======================================================*/

  function update(

    database,

    sheet,

    row,

    header,

    object

  ){

    const values = header.map(

      col =>

        object[col] ?? ""

    );

    Database.update(

      database,

      sheet,

      row,

      values

    );

    return object;

  }

  /*=======================================================
    SAVE
  =======================================================*/

  function save(

    database,

    sheet,

    object

  ){

    const idColumn =

      CONFIG.COLUMN[sheet].ID;

    const result = Database.find(

      database,

      sheet,

      idColumn,

      object[idColumn]

    );

    if(!result){

      throw new Error(

        "Data tidak ditemukan."

      );

    }

    const header = SpreadsheetService.getHeader(

      database,

      sheet

    );

    return update(

      database,

      sheet,

      result.row,

      header,

      object

    );

  }

  /*=======================================================
    DELETE
  =======================================================*/

  function remove(

    database,

    sheet,

    column,

    value

  ){

    const result = Database.find(

      database,

      sheet,

      column,

      value

    );

    if(!result){

      return false;

    }

    Database.remove(

      database,

      sheet,

      result.row

    );

    return true;

  }

  /*=======================================================
    PAGING
  =======================================================*/

  function paging(

    database,

    sheet,

    page,

    limit

  ){

    page = page || 1;

    limit = limit ||

      CONFIG.PAGINATION.DEFAULT_LIMIT;

    const data = all(

      database,

      sheet

    );

    const start =

      (page-1)*limit;

    return {

      TOTAL :

        data.length,

      PAGE :

        page,

      LIMIT :

        limit,

      DATA :

        data.slice(

          start,

          start+limit

        )

    };

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    all,

    find,

    first,

    findById,

    exists,

    count,

    insert,

    insertMany,

    update,

    save,

    remove,

    paging

  };

})();