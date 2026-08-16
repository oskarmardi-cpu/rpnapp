/*=========================================================
 RPN MANAGEMENT SYSTEM
 DashboardDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const DashboardDomainService = (() => {

  "use strict";

  /*=======================================================
    LOAD DASHBOARD
  =======================================================*/

  function load(){

    return Database.transaction(function(){

      return {

        SYSTEM :

          DashboardEngine.system(),

        POPULATION :

          PopulationEngine.dashboard(),

        KPI :

          KPIEngine.calculate(),

        RENTAL :

          RentalEngine.dashboard(),

        WORKSHOP :

          WorkOrderEngine.dashboard(),

        INVENTORY :

          InventoryEngine.dashboard(),

        USED :

          UsedUnitEngine.dashboard(),

        EXPORT :

          ExportEngine.dashboard(),

        APPROVAL :

          ApprovalEngine.dashboard(),

        NOTIFICATION :

          NotificationEngine.dashboard(),

        ALERT :

          alert(),

        TIMESTAMP :

          Utility.now()

      };

    });

  }

  /*=======================================================
    ALERT
  =======================================================*/

  function alert(){

    return {

      WAITING_APPROVAL :

        ApprovalEngine.pendingCount(),

      WAITING_PART :

        WorkOrderEngine.waitingPartCount(),

      EXPIRED_BOOKING :

        ReservationEngine.expiredCount(),

      PM_DUE :

        PMEngine.dueCount(),

      WARRANTY :

        WarrantyEngine.expiredCount(),

      LOW_STOCK :

        InventoryEngine.lowStockCount()

    };

  }

  /*=======================================================
    REFRESH
  =======================================================*/

  function refresh(){

    DashboardEngine.refresh();

    return load();

  }

  /*=======================================================
    SNAPSHOT
  =======================================================*/

  function snapshot(){

    return Database.transaction(function(){

      const data = load();

      DashboardEngine.snapshot(

        data

      );

      AuditTrailEngine.create(

        "DASHBOARD",

        {

          ACTION : "SNAPSHOT"

        }

      );

      return data;

    });

  }

  /*=======================================================
    EXECUTIVE
  =======================================================*/

  function executive(){

    return {

      KPI :

        KPIEngine.calculate(),

      POPULATION :

        PopulationEngine.summary(),

      SALES :

        SalesEngine.summary(),

      RENTAL :

        RentalEngine.summary(),

      EXPORT :

        ExportEngine.summary(),

      WORKSHOP :

        WorkOrderEngine.summary(),

      FINANCE :

        FinanceEngine.summary(),

      GENERATED_AT :

        Utility.now()

    };

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    load,

    refresh,

    snapshot,

    executive,

    alert

  };

})();