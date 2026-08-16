/*=========================================================
 RPN MANAGEMENT SYSTEM
 Router.gs
 Enterprise Edition v3.0
 AUTH ROUTE CONSISTENCY
=========================================================*/

const Router = (() => {

  "use strict";


  /*=======================================================
    ROUTE MAP
  =======================================================*/

  const ROUTES = {

    /*=====================================================
      SYSTEM
    =====================================================*/

    "SYSTEM.PING" :

      function(){

        return Response.success({

          SYSTEM :
            "RPN MANAGEMENT SYSTEM",

          STATUS :
            "ONLINE",

          VERSION :
            CONFIG.VERSION.SYSTEM,

          TIME :
            Utility.now()

        });

      },


    /*=====================================================
      AUTH
    =====================================================*/

    "AUTH.LOGIN" :

      function(payload){

        payload = payload || {};

        return Auth.login(

          payload.USERNAME,

          payload.PASSWORD

        );

      },


    "AUTH.LOGOUT" :

      function(){

        return Auth.logout();

      },


    "AUTH.SESSION" :

      function(){

        return Response.success({

          SESSION :
            Auth.getSession(),

          USER :
            Auth.getUser()

        });

      },


    /*=====================================================
      DASHBOARD
    =====================================================*/

    "dashboard.summary" :

      function(){

        return DashboardEngine.summary();

      },


    /*=====================================================
      MASTER
    =====================================================*/

    "master.list" :

      function(payload){

        payload = payload || {};

        return MasterService.getList(

          payload.sheet

        );

      },


    "master.get" :

      function(payload){

        payload = payload || {};

        return MasterService.getById(

          payload.sheet,

          payload.id

        );

      },


    "master.search" :

      function(payload){

        payload = payload || {};

        return MasterService.search(

          payload.sheet,

          payload.keyword

        );

      },


    "master.create" :

      function(payload){

        payload = payload || {};

        return MasterService.create(

          payload.sheet,

          payload.data

        );

      },


    "master.update" :

      function(payload){

        payload = payload || {};

        return MasterService.update(

          payload.sheet,

          payload.id,

          payload.data

        );

      },


    "master.delete" :

      function(payload){

        payload = payload || {};

        return MasterService.remove(

          payload.sheet,

          payload.id

        );

      },


    /*=====================================================
      TRANSACTION
    =====================================================*/

    "transaction.list" :

      function(payload){

        payload = payload || {};

        return TransactionService.getList(

          payload.sheet

        );

      },


    "transaction.get" :

      function(payload){

        payload = payload || {};

        return TransactionService.getById(

          payload.sheet,

          payload.id

        );

      },


    "transaction.create" :

      function(payload){

        payload = payload || {};

        return TransactionService.create(

          payload.sheet,

          payload.data

        );

      },


    "transaction.update" :

      function(payload){

        payload = payload || {};

        return TransactionService.update(

          payload.sheet,

          payload.id,

          payload.data

        );

      },


    "transaction.approve" :

      function(payload){

        payload = payload || {};

        return TransactionService.approve(

          payload.sheet,

          payload.id

        );

      },


    "transaction.finish" :

      function(payload){

        payload = payload || {};

        return TransactionService.finish(

          payload.sheet,

          payload.id

        );

      },


    "transaction.cancel" :

      function(payload){

        payload = payload || {};

        return TransactionService.cancel(

          payload.sheet,

          payload.id

        );

      },


    "transaction.delete" :

      function(payload){

        payload = payload || {};

        return TransactionService.remove(

          payload.sheet,

          payload.id

        );

      },


    /*=====================================================
      PROFILE
    =====================================================*/

    "profile.get" :

      function(payload){

        payload = payload || {};

        return ProfileService.getProfile(

          payload.username

        );

      },


    "profile.update" :

      function(payload){

        payload = payload || {};

        return ProfileService.updateProfile(

          payload.username,

          payload.data

        );

      },


    "profile.password" :

      function(payload){

        payload = payload || {};

        return ProfileService.changePassword(

          payload.username,

          payload.oldPassword,

          payload.newPassword

        );

      },


    "profile.photo" :

      function(payload){

        payload = payload || {};

        return ProfileService.changePhoto(

          payload.username,

          payload.photo

        );

      },


    "profile.signature" :

      function(payload){

        payload = payload || {};

        return ProfileService.changeSignature(

          payload.username,

          payload.signature

        );

      },


    "profile.email" :

      function(payload){

        payload = payload || {};

        return ProfileService.changeEmail(

          payload.username,

          payload.email

        );

      },


    "profile.phone" :

      function(payload){

        payload = payload || {};

        return ProfileService.changeWhatsApp(

          payload.username,

          payload.phone

        );

      },


    /*=====================================================
      HISTORY
    =====================================================*/

    "history.list" :

      function(){

        return HistoryService.getHistory();

      },


    "history.user" :

      function(payload){

        payload = payload || {};

        return HistoryService.getUserHistory(

          payload.username

        );

      },


    "history.module" :

      function(payload){

        payload = payload || {};

        return HistoryService.getModuleHistory(

          payload.module

        );

      },


    "history.reference" :

      function(payload){

        payload = payload || {};

        return HistoryService.getReferenceHistory(

          payload.reference

        );

      },


    "history.search" :

      function(payload){

        payload = payload || {};

        return HistoryService.search(

          payload.keyword

        );

      },


    /*=====================================================
      REPORT
    =====================================================*/

    "report.dashboard" :

      function(){

        return ReportService.dashboard();

      },


    "report.passport" :

      function(payload){

        payload = payload || {};

        return ReportService.passport(

          payload.assetId

        );

      },


    "report.workorder" :

      function(payload){

        payload = payload || {};

        return ReportService.workOrder(

          payload.woNumber

        );

      },


    "report.repair" :

      function(payload){

        payload = payload || {};

        return ReportService.repair(

          payload.woNumber

        );

      },


    "report.timeline" :

      function(payload){

        payload = payload || {};

        return ReportService.timeline(

          payload.assetId

        );

      },


    "report.branch" :

      function(payload){

        payload = payload || {};

        return ReportService.branch(

          payload.branch

        );

      },


    "report.status" :

      function(payload){

        payload = payload || {};

        return ReportService.status(

          payload.status

        );

      },


    "report.customer" :

      function(payload){

        payload = payload || {};

        return ReportService.customer(

          payload.customerId

        );

      },


    "report.pdf" :

      function(payload){

        return ReportService.exportPDF(

          payload || {}

        );

      },


    "report.excel" :

      function(payload){

        return ReportService.exportExcel(

          payload || {}

        );

      },


    "report.json" :

      function(payload){

        return ReportService.exportJSON(

          payload || {}

        );

      }

  };


  /*=======================================================
    EXECUTE
  =======================================================*/

  function execute(

    method,

    payload

  ){

    try{

      const route =

        ROUTES[method];

      if(!route){

        return Response.error(

          "API tidak ditemukan : " +

          method

        );

      }

      payload = payload || {};

      return route(payload);

    }

    catch(err){

      try{

        Logger.error(

          "Router.execute",

          err

        );

      }

      catch(e){

        console.error(

          "Router.execute",

          err

        );

      }

      return Response.error(err);

    }

  }


  /*=======================================================
    EXISTS
  =======================================================*/

  function exists(method){

    return Boolean(

      ROUTES[method]

    );

  }


  /*=======================================================
    GET ROUTES
  =======================================================*/

  function routes(){

    return Object.keys(

      ROUTES

    ).sort();

  }


  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    execute,

    exists,

    routes

  };

})();