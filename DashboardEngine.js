/*=========================================================
 RPN MANAGEMENT SYSTEM
 DashboardEngine.gs
 Enterprise Edition v4.0
=========================================================*/

const DashboardEngine = (() => {

  "use strict";

  let cache = null;

  /*=======================================================
    DASHBOARD
  =======================================================*/

  function dashboard(){

    if(

      cache &&

      CONFIG.CACHE.ENABLED

    ){

      return cache;

    }

    cache = {

      SYSTEM : system(),

      POPULATION : PopulationEngine.dashboard(),

      KPI : KPIEngine.calculate(),

      RENTAL : rental(),

      WORKSHOP : workshop(),

      USED : used(),

      EXPORT : exportDashboard(),

      RESERVATION : reservation(),

      WAITING_PART : waitingPart(),

      APPROVAL : approval(),

      ALERT : alert(),

      TIMESTAMP : Utility.now()

    };

    return cache;

  }

  /*=======================================================
    SYSTEM
  =======================================================*/

  function system(){

    return {

      APPLICATION :

        CONFIG.APP.NAME,

      VERSION :

        CONFIG.VERSION.SYSTEM,

      BUILD :

        CONFIG.VERSION.BUILD,

      SERVER_TIME :

        Utility.now()

    };

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(){

    return {

      ACTIVE :

        PopulationEngine

        .rental()

        .length,

      CONTRACT :

        Repository.count(

          Database.TRANSACTION,

          CONFIG.SHEET.RENTAL

        )

    };

  }

  /*=======================================================
    WORKSHOP
  =======================================================*/

  function workshop(){

    return {

      OPEN :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.WORK_ORDER,

          x=>x.STATUS==="OPEN"

        ).length,

      REPAIR :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.WORK_ORDER,

          x=>x.STATUS==="ON_PROGRESS"

        ).length,

      WAITING_PART :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.WORK_ORDER,

          x=>x.STATUS==="WAITING_PART"

        ).length

    };

  }

  /*=======================================================
    USED
  =======================================================*/

  function used(){

    return {

      READY :

        PopulationEngine

        .used()

        .length,

      BOOKED :

        StockEngine.booked(

          CONFIG.ASSET_TYPE.UNIT

        ).length

    };

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportDashboard(){

    return KPIEngine.export();

  }

  /*=======================================================
    RESERVATION
  =======================================================*/

  function reservation(){

    return {

      TOTAL :

        Repository.count(

          Database.TRANSACTION,

          CONFIG.SHEET.RESERVATION

        ),

      WAITING :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.RESERVATION,

          x=>x.STATUS===

          CONFIG.RESERVATION_STATUS.WAITING

        ).length,

      BOOKED :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.RESERVATION,

          x=>x.STATUS===

          CONFIG.RESERVATION_STATUS.BOOKED

        ).length

    };

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(){

    return Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.WORK_ORDER,

      x=>x.STATUS==="WAITING_PART"

    );

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function approval(){

    return Repository.find(

      Database.SYSTEM,

      CONFIG.SHEET.APPROVAL,

      x=>x.STATUS===

      CONFIG.APPROVAL_STATUS.PENDING

    );

  }

  /*=======================================================
    ALERT
  =======================================================*/

  function alert(){

    return {

      EXPIRED_BOOKING :

        ReservationEngine.expiredCount ?

        ReservationEngine.expiredCount() : 0,

      WAITING_APPROVAL :

        approval().length,

      WAITING_PART :

        waitingPart().length

    };

  }

  /*=======================================================
    REFRESH
  =======================================================*/

  function refresh(){

    cache = null;

    return dashboard();

  }

  /*=======================================================
    SNAPSHOT
  =======================================================*/

  function snapshot(){

    const data = dashboard();

    Repository.insert(

      Database.REPORT,

      "R_DASHBOARD_SNAPSHOT",

      SpreadsheetService.getHeader(

        Database.REPORT,

        "R_DASHBOARD_SNAPSHOT"

      ),

      {

        SNAPSHOT_ID :

          Utility.uuid(),

        SNAPSHOT_DATE :

          Utility.now(),

        DATA :

          JSON.stringify(data)

      }

    );

    return true;

  }

  /*=======================================================
    WAITING PART ALERT
  =======================================================*/

  function waitingPartAlert(){

    const list = waitingPart();

    if(!list.length){

      return;

    }

    NotificationEngine.broadcast(

      "WAITING_PART",

      {

        TOTAL :

          list.length

      }

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    dashboard,

    refresh,

    snapshot,

    waitingPartAlert

  };

})();