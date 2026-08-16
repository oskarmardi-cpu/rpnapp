/*=========================================================
 RPN MANAGEMENT SYSTEM
 UsedUnitDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const UsedUnitDomainService = (() => {

  "use strict";

  /*=======================================================
    APPRAISAL
  =======================================================*/

  function appraisal(data){

    return Database.transaction(function(){

      ValidationEngine.usedAppraisal(data);

      const appraisal = UsedUnitEngine.appraisal(data);

      TimelineEngine.event({

        MODULE      : "USED_UNIT",
        ACTION      : "APPRAISAL",
        DOCUMENT_NO : appraisal.APPRAISAL_NO,
        ASSET_ID    : appraisal.ASSET_ID

      });

      AuditTrailEngine.create(

        "USED_UNIT",

        appraisal

      );

      DashboardEngine.refresh();

      return appraisal;

    });

  }

  /*=======================================================
    REFURBISHMENT
  =======================================================*/

  function refurbishment(data){

    return Database.transaction(function(){

      const wo = WorkOrderEngine.createRefurbishment(data);

      AssetEngine.updateStatus(

        data.ASSET_ID,

        CONFIG.STATUS.REPAIR

      );

      WorkflowEngine.startRefurbishment(wo);

      TimelineEngine.event({

        MODULE      : "USED_UNIT",
        ACTION      : "REFURBISHMENT",
        DOCUMENT_NO : wo.WO_NO,
        ASSET_ID    : data.ASSET_ID

      });

      DashboardEngine.refresh();

      return wo;

    });

  }

  /*=======================================================
    COSTING
  =======================================================*/

  function costing(assetId){

    return Database.transaction(function(){

      const costing = CostEngine.usedUnit(assetId);

      TimelineEngine.event({

        MODULE   : "USED_UNIT",
        ACTION   : "COSTING",
        ASSET_ID : assetId

      });

      return costing;

    });

  }

  /*=======================================================
    SET SELLING PRICE
  =======================================================*/

  function pricing(

    assetId,

    sellingPrice

  ){

    return Database.transaction(function(){

      UsedUnitEngine.setSellingPrice(

        assetId,

        sellingPrice

      );

      TimelineEngine.event({

        MODULE   : "USED_UNIT",
        ACTION   : "SET_PRICE",
        ASSET_ID : assetId

      });

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    BOOK UNIT
  =======================================================*/

  function booking(data){

    return Database.transaction(function(){

      ValidationEngine.usedBooking(data);

      ReservationEngine.create(data);

      AssetEngine.updateStatus(

        data.ASSET_ID,

        CONFIG.STATUS.BOOKED

      );

      TimelineEngine.event({

        MODULE   : "USED_UNIT",
        ACTION   : "BOOKING",
        ASSET_ID : data.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    SALES
  =======================================================*/

  function sales(data){

    return Database.transaction(function(){

      ApprovalEngine.validateSales(data);

      const sales = SalesEngine.create(data);

      AssetEngine.updateStatus(

        data.ASSET_ID,

        CONFIG.STATUS.SOLD

      );

      TimelineEngine.event({

        MODULE      : "USED_UNIT",
        ACTION      : "SALES",
        DOCUMENT_NO : sales.SALES_NO,
        ASSET_ID    : data.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "SALES",

        sales

      );

      NotificationEngine.sendSalesCreated(

        sales

      );

      return sales;

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    appraisal,

    refurbishment,

    costing,

    pricing,

    booking,

    sales

  };

})();