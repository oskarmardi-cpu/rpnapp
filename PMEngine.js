/*=========================================================
 RPN MANAGEMENT SYSTEM
 PMEngine.gs
 Enterprise Edition v4.0
 Preventive Maintenance Engine
=========================================================*/

const PMEngine = (() => {

  "use strict";

  const DATABASE = Database.TRANSACTION;

  const SHEET = CONFIG.SHEET.PM;

  /*=======================================================
    CREATE PM
  =======================================================*/

  function create(data){

    PermissionEngine.transaction();

    ValidationEngine.asset(

      data.ASSET_ID

    );

    return LockManager.execute(function(){

      const pm = {

        PM_ID :

          Utility.uuid(),

        PM_NO :

          DocumentNumberEngine.generate(

            "PM"

          ),

        ASSET_ID :

          data.ASSET_ID,

        CUSTOMER_ID :

          data.CUSTOMER_ID,

        BRANCH :

          data.BRANCH,

        HM :

          data.HOUR_METER,

        PM_TYPE :

          data.PM_TYPE,

        STATUS :

          "OPEN",

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

        pm

      );

      return pm;

    });

  }

  /*=======================================================
    START PM
  =======================================================*/

  function start(

    pmId,

    payload

  ){

    const pm = find_(pmId);

    WorkflowEngine.execute(

      CONFIG.EVENT.INSPECTION,

      {

        ASSET_ID :

          pm.ASSET_ID,

        DOCUMENT_NO :

          pm.PM_NO,

        DESCRIPTION :

          "Preventive Maintenance",

        FROM_BRANCH :

          payload.FROM_BRANCH,

        TO_BRANCH :

          payload.TO_BRANCH,

        FROM_LOCATION :

          payload.FROM_LOCATION,

        TO_LOCATION :

          payload.TO_LOCATION

      }

    );

    pm.STATUS = "ON_PROGRESS";

    save_(pm);

    return pm;

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(

    pmId,

    payload

  ){

    const pm = find_(pmId);

    WorkflowEngine.execute(

      CONFIG.EVENT.WAITING_PART,

      {

        ASSET_ID :

          pm.ASSET_ID,

        DOCUMENT_NO :

          pm.PM_NO,

        DESCRIPTION :

          payload.REMARK

      }

    );

    pm.STATUS = "WAITING_PART";

    save_(pm);

    return pm;

  }

  /*=======================================================
    FINISH PM
  =======================================================*/

  function finish(

    pmId,

    payload

  ){

    const pm = find_(pmId);

    WorkflowEngine.execute(

      CONFIG.EVENT.READY,

      {

        ASSET_ID :

          pm.ASSET_ID,

        DOCUMENT_NO :

          pm.PM_NO,

        DESCRIPTION :

          "PM Finished"

      }

    );

    pm.STATUS = "FINISHED";

    pm.FINISH_DATE = Utility.now();

    pm.MECHANIC = payload.MECHANIC;

    pm.HOUR_METER_AFTER = payload.HOUR_METER;

    save_(pm);

    return pm;

  }

  /*=======================================================
    FIND
  =======================================================*/

  function find_(pmId){

    const pm = Repository.findById(

      DATABASE,

      SHEET,

      "PM_ID",

      pmId

    );

    if(!pm){

      throw new Error(

        "PM tidak ditemukan."

      );

    }

    return pm;

  }

  /*=======================================================
    SAVE
  =======================================================*/

  function save_(pm){

    Repository.save(

      DATABASE,

      SHEET,

      pm

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    start,

    waitingPart,

    finish

  };

})();