/*=========================================================
 RPN MANAGEMENT SYSTEM
 ExportDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const ExportDomainService = (() => {

  "use strict";

  /*=======================================================
    CREATE EXPORT
  =======================================================*/

  function create(data){

    return Database.transaction(function(){

      ValidationEngine.export(data);

      const asset = AssetEngine.get(

        data.ASSET_ID

      );

      AssetEngine.available(

        asset.ASSET_ID

      );

      const exportDoc = ExportEngine.create(

        data

      );

      AssetEngine.updateStatus(

        asset.ASSET_ID,

        CONFIG.STATUS.EXPORT

      );

      AssetMovementEngine.create({

        ASSET_ID      : asset.ASSET_ID,
        DOCUMENT_NO   : exportDoc.EXPORT_NO,
        FROM_STATUS   : asset.CURRENT_STATUS,
        TO_STATUS     : CONFIG.STATUS.EXPORT,
        CUSTOMER_ID   : exportDoc.CUSTOMER_ID,
        BRANCH        : exportDoc.BRANCH

      });

      TimelineEngine.event({

        MODULE        : "EXPORT",
        ACTION        : "CREATE",
        DOCUMENT_NO   : exportDoc.EXPORT_NO,
        ASSET_ID      : asset.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "EXPORT",

        exportDoc

      );

      NotificationEngine.sendExportCreated(

        exportDoc

      );

      return exportDoc;

    });

  }

  /*=======================================================
    INSPECTION
  =======================================================*/

  function inspection(

    exportId,

    data

  ){

    return Database.transaction(function(){

      ExportEngine.inspection(

        exportId,

        data

      );

      TimelineEngine.event({

        MODULE      : "EXPORT",
        ACTION      : "INSPECTION",
        DOCUMENT_NO : ExportEngine
                        .get(exportId)
                        .EXPORT_NO

      });

      AuditTrailEngine.create(

        "EXPORT_INSPECTION",

        data

      );

    });

  }

  /*=======================================================
    STUFFING
  =======================================================*/

  function stuffing(

    exportId,

    containerNo

  ){

    return Database.transaction(function(){

      ExportEngine.stuffing(

        exportId,

        containerNo

      );

      TimelineEngine.event({

        MODULE      : "EXPORT",
        ACTION      : "STUFFING",
        DOCUMENT_NO : ExportEngine
                        .get(exportId)
                        .EXPORT_NO

      });

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    SHIPPING
  =======================================================*/

  function shipping(

    exportId,

    blNumber,

    vessel

  ){

    return Database.transaction(function(){

      ExportEngine.shipping(

        exportId,

        blNumber,

        vessel

      );

      TimelineEngine.event({

        MODULE      : "EXPORT",
        ACTION      : "SHIPPING",
        DOCUMENT_NO : ExportEngine
                        .get(exportId)
                        .EXPORT_NO

      });

      NotificationEngine.sendShipping(

        exportId

      );

    });

  }

  /*=======================================================
    FINISH EXPORT
  =======================================================*/

  function finish(

    exportId

  ){

    return Database.transaction(function(){

      const exportDoc = ExportEngine.get(

        exportId

      );

      ExportEngine.finish(

        exportId

      );

      AuditTrailEngine.update(

        "EXPORT",

        exportDoc,

        ExportEngine.get(exportId)

      );

      TimelineEngine.event({

        MODULE      : "EXPORT",
        ACTION      : "FINISH",
        DOCUMENT_NO : exportDoc.EXPORT_NO,
        ASSET_ID    : exportDoc.ASSET_ID

      });

      DashboardEngine.refresh();

      NotificationEngine.sendExportFinished(

        exportDoc

      );

    });

  }

  /*=======================================================
    CANCEL EXPORT
  =======================================================*/

  function cancel(

    exportId,

    reason

  ){

    return Database.transaction(function(){

      const exportDoc = ExportEngine.get(

        exportId

      );

      ExportEngine.cancel(

        exportId,

        reason

      );

      AssetEngine.updateStatus(

        exportDoc.ASSET_ID,

        CONFIG.STATUS.READY

      );

      TimelineEngine.event({

        MODULE      : "EXPORT",
        ACTION      : "CANCEL",
        DOCUMENT_NO : exportDoc.EXPORT_NO,
        ASSET_ID    : exportDoc.ASSET_ID,
        REMARK      : reason

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.update(

        "EXPORT",

        exportDoc,

        ExportEngine.get(exportId)

      );

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    create,

    inspection,

    stuffing,

    shipping,

    finish,

    cancel

  };

})();