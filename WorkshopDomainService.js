/*=========================================================
 RPN MANAGEMENT SYSTEM
 WorkshopDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const WorkshopDomainService = (() => {

  "use strict";

  /*=======================================================
    CREATE WORK ORDER
  =======================================================*/

  function create(data){

    return Database.transaction(function(){

      ValidationEngine.workOrder(data);

      const asset = AssetEngine.get(

        data.ASSET_ID

      );

      const wo = WorkOrderEngine.create(data);

      WorkflowEngine.startWorkOrder(

        wo

      );

      AssetEngine.updateStatus(

        asset.ASSET_ID,

        CONFIG.STATUS.REPAIR

      );

      AssetMovementEngine.create({

        ASSET_ID     : asset.ASSET_ID,
        DOCUMENT_NO  : wo.WO_NO,
        FROM_STATUS  : asset.CURRENT_STATUS,
        TO_STATUS    : CONFIG.STATUS.REPAIR,
        BRANCH       : wo.BRANCH

      });

      TimelineEngine.event({

        MODULE       : "WORK_ORDER",
        ACTION       : "CREATE",
        DOCUMENT_NO  : wo.WO_NO,
        ASSET_ID     : asset.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "WORK_ORDER",

        wo

      );

      NotificationEngine.sendWorkOrderCreated(

        wo

      );

      return wo;

    });

  }

  /*=======================================================
    REQUEST PART
  =======================================================*/

  function requestPart(

    workOrderId,

    items

  ){

    return Database.transaction(function(){

      const wo = WorkOrderEngine.get(

        workOrderId

      );

      InventoryEngine.request(

        wo,

        items

      );

      WorkOrderEngine.waitingPart(

        workOrderId

      );

      TimelineEngine.event({

        MODULE      : "WORK_ORDER",
        ACTION      : "WAITING_PART",
        DOCUMENT_NO : wo.WO_NO,
        ASSET_ID    : wo.ASSET_ID

      });

      DashboardEngine.refresh();

      NotificationEngine.sendWaitingPart(

        wo

      );

    });

  }

  /*=======================================================
    PICK PART
  =======================================================*/

  function pickPart(

    workOrderId

  ){

    return Database.transaction(function(){

      const wo = WorkOrderEngine.get(

        workOrderId

      );

      InventoryEngine.issue(

        workOrderId

      );

      WorkOrderEngine.repair(

        workOrderId

      );

      TimelineEngine.event({

        MODULE      : "WORK_ORDER",
        ACTION      : "PART_PICKED",
        DOCUMENT_NO : wo.WO_NO,
        ASSET_ID    : wo.ASSET_ID

      });

    });

  }

  /*=======================================================
    QC
  =======================================================*/

  function qc(

    workOrderId,

    result

  ){

    return Database.transaction(function(){

      QCEngine.finish(

        workOrderId,

        result

      );

      TimelineEngine.event({

        MODULE      : "QC",
        ACTION      : "FINISH",
        DOCUMENT_NO : WorkOrderEngine
                        .get(workOrderId)
                        .WO_NO

      });

    });

  }

  /*=======================================================
    CLOSE WORK ORDER
  =======================================================*/

  function close(

    workOrderId

  ){

    return Database.transaction(function(){

      const wo = WorkOrderEngine.get(

        workOrderId

      );

      ApprovalEngine.validateCloseWO(

        wo

      );

      WorkOrderEngine.close(

        workOrderId

      );

      AssetEngine.updateStatus(

        wo.ASSET_ID,

        CONFIG.STATUS.READY

      );

      AssetMovementEngine.create({

        ASSET_ID     : wo.ASSET_ID,
        DOCUMENT_NO  : wo.WO_NO,
        FROM_STATUS  : CONFIG.STATUS.REPAIR,
        TO_STATUS    : CONFIG.STATUS.READY

      });

      TimelineEngine.event({

        MODULE       : "WORK_ORDER",
        ACTION       : "CLOSE",
        DOCUMENT_NO  : wo.WO_NO,
        ASSET_ID     : wo.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.update(

        "WORK_ORDER",

        wo,

        WorkOrderEngine.get(workOrderId)

      );

      NotificationEngine.sendWorkOrderClosed(

        wo

      );

      ReportEngine.pdf(

        "SERVICE",

        workOrderId

      );

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    create,

    requestPart,

    pickPart,

    qc,

    close

  };

})();