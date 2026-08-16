/*=========================================================
 RPN MANAGEMENT SYSTEM
 SchedulerEngine.gs
 Enterprise Edition v4.0
=========================================================*/

const SchedulerEngine = (() => {

  "use strict";

  /*=======================================================
    EVERY 5 MINUTES
  =======================================================*/

  function every5Minutes(){

    try{

      expiredReservation();

      dashboardRefresh();

      syncPopulation();

      syncWhatsApp();

    }

    catch(err){

      Logger.error(

        "Scheduler.5Minutes",

        err

      );

    }

  }

  /*=======================================================
    EVERY HOUR
  =======================================================*/

  function everyHour(){

    try{

      reminderPM();

      reminderHM();

      reminderApproval();

      reminderWaitingPart();

      updateRentalStatus();

    }

    catch(err){

      Logger.error(

        "Scheduler.Hour",

        err

      );

    }

  }

  /*=======================================================
    EVERY DAY
  =======================================================*/

  function everyDay(){

    try{

      createDashboardSnapshot();

      calculateKPI();

      backupDatabase();

      cleanCache();

    }

    catch(err){

      Logger.error(

        "Scheduler.Day",

        err

      );

    }

  }

  /*=======================================================
    EXPIRED RESERVATION
  =======================================================*/

  function expiredReservation(){

    const list = Repository.find(

      Database.TRANSACTION,

      CONFIG.SHEET.RESERVATION,

      item =>

        item.STATUS===

        CONFIG.RESERVATION_STATUS.WAITING &&

        new Date(

          item.EXPIRED_DATE

        ) < new Date()

    );

    list.forEach(function(item){

      ReservationEngine.cancel(

        item.RESERVATION_ID

      );

    });

  }

  /*=======================================================
    PM REMINDER
  =======================================================*/

  function reminderPM(){

    ScheduleEngine.pmReminder();

  }

  /*=======================================================
    HM REMINDER
  =======================================================*/

  function reminderHM(){

    ScheduleEngine.hmReminder();

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function reminderApproval(){

    ApprovalEngine.pendingReminder();

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function reminderWaitingPart(){

    DashboardEngine.waitingPartAlert();

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function updateRentalStatus(){

    RentalEngine.autoUpdate();

  }

  /*=======================================================
    DASHBOARD
  =======================================================*/

  function dashboardRefresh(){

    DashboardEngine.refresh();

  }

  /*=======================================================
    POPULATION
  =======================================================*/

  function syncPopulation(){

    PopulationEngine.dashboard();

  }

  /*=======================================================
    KPI
  =======================================================*/

  function calculateKPI(){

    KPIEngine.calculate();

  }

  /*=======================================================
    SNAPSHOT
  =======================================================*/

  function createDashboardSnapshot(){

    DashboardEngine.snapshot();

  }

  /*=======================================================
    WHATSAPP
  =======================================================*/

  function syncWhatsApp(){

    WhatsAppEngine.sync();

  }

  /*=======================================================
    CACHE
  =======================================================*/

  function cleanCache(){

    CacheManager.removeAll(

      [],

      "SCRIPT"

    );

  }

  /*=======================================================
    BACKUP
  =======================================================*/

  function backupDatabase(){

    BackupEngine.execute();

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    every5Minutes,

    everyHour,

    everyDay

  };

})();