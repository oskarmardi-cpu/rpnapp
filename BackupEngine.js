/*=========================================================
 RPN MANAGEMENT SYSTEM
 BackupEngine.gs
 Enterprise Edition v4.0
=========================================================*/

const BackupEngine = (() => {

  "use strict";

  /*=======================================================
    EXECUTE
  =======================================================*/

  function execute(){

    const result = [];

    Object.keys(Database).forEach(function(db){

      if(typeof Database[db] !== "string") return;

      result.push(

        backupDatabase_(

          Database[db]

        )

      );

    });

    HistoryService.write(

      "BACKUP",

      "SYSTEM",

      Utility.uuid(),

      result

    );

    return result;

  }

  /*=======================================================
    BACKUP DATABASE
  =======================================================*/

  function backupDatabase_(database){

    const source = Database.open(

      database

    );

    const folder = DriveApp

      .getFolderById(

        CONFIG.FILE.BACKUP_FOLDER

      );

    const timestamp = Utilities.formatDate(

      new Date(),

      CONFIG.APP.TIMEZONE,

      "yyyyMMdd_HHmmss"

    );

    const name =

      database +

      "_" +

      timestamp;

    const file = DriveApp

      .getFileById(

        source.getId()

      )

      .makeCopy(

        name,

        folder

      );

    return {

      DATABASE :

        database,

      FILE_ID :

        file.getId(),

      FILE_NAME :

        file.getName(),

      CREATED_AT :

        Utility.now()

    };

  }

  /*=======================================================
    RESTORE
  =======================================================*/

  function restore(fileId){

    throw new Error(

      "Restore hanya dapat dilakukan oleh Super Admin."

    );

  }

  /*=======================================================
    CLEAN OLD BACKUP
  =======================================================*/

  function clean(days){

    days = days || 30;

    const folder = DriveApp

      .getFolderById(

        CONFIG.FILE.BACKUP_FOLDER

      );

    const files =

      folder.getFiles();

    const limit =

      new Date();

    limit.setDate(

      limit.getDate()-days

    );

    while(files.hasNext()){

      const file =

        files.next();

      if(

        file.getDateCreated()

        < limit

      ){

        file.setTrashed(

          true

        );

      }

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    execute,

    restore,

    clean

  };

})();