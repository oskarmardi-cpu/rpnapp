/*=========================================================
 RPN MANAGEMENT SYSTEM
 WorkflowEngine.gs
 Enterprise Edition v4.0
 Single Entry Workflow Engine
=========================================================*/

const WorkflowEngine = (() => {

  "use strict";

  /*=======================================================
    EXECUTE WORKFLOW
  =======================================================*/

  function execute(

    workflow,

    data

  ){

    return LockManager.execute(function(){

      PermissionEngine.transaction();

      ValidationEngine.asset(

        data.ASSET_ID

      );

      const currentStatus =

        AssetEngine.getStatus(

          data.ASSET_ID

        );

      validateTransition_(

        currentStatus,

        workflow

      );

      const event = EventEngine.create({

        EVENT_TYPE :

          workflow,

        ASSET_ID :

          data.ASSET_ID,

        DOCUMENT_NO :

          data.DOCUMENT_NO,

        BRANCH :

          data.TO_BRANCH,

        LOCATION :

          data.TO_LOCATION,

        DESCRIPTION :

          data.DESCRIPTION

      });

      MovementEngine.create({

        EVENT_ID :

          event.EVENT_ID,

        ASSET_ID :

          data.ASSET_ID,

        FROM_BRANCH :

          data.FROM_BRANCH,

        TO_BRANCH :

          data.TO_BRANCH,

        FROM_WAREHOUSE :

          data.FROM_WAREHOUSE,

        TO_WAREHOUSE :

          data.TO_WAREHOUSE,

        FROM_LOCATION :

          data.FROM_LOCATION,

        TO_LOCATION :

          data.TO_LOCATION,

        FROM_STATUS :

          currentStatus,

        TO_STATUS :

          targetStatus_(workflow)

      });

      StatusEngine.change(

        data.ASSET_ID,

        targetStatus_(workflow),

        event.EVENT_ID

      );

      DashboardEngine.refresh();

      NotificationEngine.broadcast(

        workflow,

        data

      );

      HistoryService.write(

        workflow,

        "WORKFLOW",

        event.EVENT_NO,

        data

      );

      return {

        EVENT :

          event,

        STATUS :

          targetStatus_(

            workflow

          )

      };

    },"DOCUMENT");

  }

  /*=======================================================
    STATUS MAP
  =======================================================*/

  function targetStatus_(workflow){

    const map = {};

    map[CONFIG.EVENT.PULL_OUT] =
      CONFIG.STATUS.PULL_OUT;

    map[CONFIG.EVENT.RECEIVING] =
      CONFIG.STATUS.RECEIVING;

    map[CONFIG.EVENT.INSPECTION] =
      CONFIG.STATUS.INSPECTION;

    map[CONFIG.EVENT.REPAIR_START] =
      CONFIG.STATUS.REPAIR;

    map[CONFIG.EVENT.WAITING_PART] =
      CONFIG.STATUS.WAITING_PART;

    map[CONFIG.EVENT.QC_PASS] =
      CONFIG.STATUS.QC;

    map[CONFIG.EVENT.READY] =
      CONFIG.STATUS.READY;

    map[CONFIG.EVENT.RENTAL_OUT] =
      CONFIG.STATUS.RENTAL;

    map[CONFIG.EVENT.RENTAL_RETURN] =
      CONFIG.STATUS.RETURN;

    map[CONFIG.EVENT.TRANSFER] =
      CONFIG.STATUS.TRANSFER;

    map[CONFIG.EVENT.CANNIBAL] =
      CONFIG.STATUS.CANNIBAL;

    map[CONFIG.EVENT.SALES] =
      CONFIG.STATUS.SOLD;

    map[CONFIG.EVENT.EXPORT] =
      CONFIG.STATUS.EXPORT;

    map[CONFIG.EVENT.SCRAP] =
      CONFIG.STATUS.SCRAP;

    map[CONFIG.EVENT.RESERVATION_CONFIRM] =
      CONFIG.STATUS.BOOKED;

    return map[workflow];

  }

  /*=======================================================
    VALIDATE TRANSITION
  =======================================================*/

  function validateTransition_(

    current,

    workflow

  ){

    const target =

      targetStatus_(

        workflow

      );

    if(!target){

      throw new Error(

        "Workflow tidak terdaftar."

      );

    }

    if(current===target){

      throw new Error(

        "Status sudah berada pada " +

        target

      );

    }

    return true;

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    execute

  };

})();