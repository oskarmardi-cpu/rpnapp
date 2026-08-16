/*=========================================================
 RPN MANAGEMENT SYSTEM
 FileManagerEngine.gs
 Enterprise Edition v5.0
=========================================================*/

const FileManagerEngine = (() => {

  "use strict";

  const DATABASE = Database.SYSTEM;

  const SHEET = CONFIG.SHEET.FILE;

  /*=======================================================
    UPLOAD
  =======================================================*/

  function upload(data){

    const folder = resolveFolder_(

      data

    );

    const file = folder.createFile(

      data.BLOB

    );

    const record = {

      FILE_ID :

        Utility.uuid(),

      DOCUMENT_NO :

        data.DOCUMENT_NO,

      MODULE :

        data.MODULE,

      CATEGORY :

        data.CATEGORY,

      FILE_NAME :

        file.getName(),

      DRIVE_FILE_ID :

        file.getId(),

      DRIVE_URL :

        file.getUrl(),

      MIME_TYPE :

        file.getMimeType(),

      FILE_SIZE :

        file.getSize(),

      BRANCH :

        data.BRANCH,

      ASSET_ID :

        data.ASSET_ID || "",

      CREATED_AT :

        Utility.now(),

      CREATED_BY :

        Auth.getUser().USERNAME

    };

    Repository.insert(

      DATABASE,

      SHEET,

      SpreadsheetService.getHeader(

        DATABASE,

        SHEET

      ),

      record

    );

    AuditTrailEngine.create(

      "FILE",

      record

    );

    return record;

  }

  /*=======================================================
    GET
  =======================================================*/

  function get(fileId){

    return Repository.findById(

      DATABASE,

      SHEET,

      "FILE_ID",

      fileId

    );

  }

  /*=======================================================
    DOCUMENT FILES
  =======================================================*/

  function byDocument(

    documentNo

  ){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.DOCUMENT_NO===

        documentNo

    );

  }

  /*=======================================================
    ASSET FILES
  =======================================================*/

  function byAsset(

    assetId

  ){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    );

  }

  /*=======================================================
    DELETE
  =======================================================*/

  function remove(fileId){

    const file = get(fileId);

    if(!file){

      throw new Error(

        "File tidak ditemukan."

      );

    }

    DriveApp

      .getFileById(

        file.DRIVE_FILE_ID

      )

      .setTrashed(true);

    Repository.remove(

      DATABASE,

      SHEET,

      "FILE_ID",

      fileId

    );

    AuditTrailEngine.remove(

      "FILE",

      file

    );

    return true;

  }

  /*=======================================================
    CREATE FOLDER
  =======================================================*/

  function resolveFolder_(data){

    const root = DriveApp

      .getFolderById(

        CONFIG.FILE.DOCUMENT_FOLDER

      );

    const branch = folder_(

      root,

      data.BRANCH

    );

    const year = folder_(

      branch,

      Utilities.formatDate(

        new Date(),

        CONFIG.APP.TIMEZONE,

        "yyyy"

      )

    );

    const month = folder_(

      year,

      Utilities.formatDate(

        new Date(),

        CONFIG.APP.TIMEZONE,

        "MM"

      )

    );

    return folder_(

      month,

      data.CATEGORY

    );

  }

  /*=======================================================
    GET / CREATE FOLDER
  =======================================================*/

  function folder_(

    parent,

    name

  ){

    const folders =

      parent.getFoldersByName(

        name

      );

    return folders.hasNext()

      ? folders.next()

      : parent.createFolder(

          name

        );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    upload,

    get,

    byDocument,

    byAsset,

    remove

  };

})();