/*=========================================================
 RPN MANAGEMENT SYSTEM
 ReportService.gs
 Enterprise Edition v2.0
=========================================================*/

const ReportService = (() => {

  "use strict";

  /*=======================================================
    DASHBOARD
  =======================================================*/

  function dashboard(){

    try{

      return Response.success(

        DashboardEngine.summary()

      );

    }

    catch(err){

      Logger.error(

        "ReportService.dashboard",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    DIGITAL PASSPORT
  =======================================================*/

  function passport(assetId){

    try{

      return Response.success(

        ReportEngine.passport(

          assetId

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.passport",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    WORK ORDER REPORT
  =======================================================*/

  function workOrder(

    woNumber

  ){

    try{

      return Response.success(

        ReportEngine.workOrder(

          woNumber

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.workOrder",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    REPAIR REPORT
  =======================================================*/

  function repair(

    woNumber

  ){

    try{

      return Response.success(

        ReportEngine.repair(

          woNumber

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.repair",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    TIMELINE
  =======================================================*/

  function timeline(

    assetId

  ){

    try{

      return Response.success(

        ReportEngine.timeline(

          assetId

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.timeline",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    BRANCH
  =======================================================*/

  function branch(

    branch

  ){

    try{

      return Response.success(

        ReportEngine.branch(

          branch

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.branch",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    STATUS
  =======================================================*/

  function status(

    status

  ){

    try{

      return Response.success(

        ReportEngine.status(

          status

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.status",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    CUSTOMER
  =======================================================*/

  function customer(

    customerId

  ){

    try{

      return Response.success(

        ReportEngine.customer(

          customerId

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.customer",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    EXPORT PDF
  =======================================================*/

  function exportPDF(data){

    try{

      return Response.success(

        ReportEngine.exportPDF(

          data

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.exportPDF",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    EXPORT EXCEL
  =======================================================*/

  function exportExcel(data){

    try{

      return Response.success(

        ReportEngine.exportExcel(

          data

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.exportExcel",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    EXPORT JSON
  =======================================================*/

  function exportJSON(data){

    try{

      return Response.success(

        ReportEngine.exportJSON(

          data

        )

      );

    }

    catch(err){

      Logger.error(

        "ReportService.exportJSON",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    dashboard,

    passport,

    workOrder,

    repair,

    timeline,

    branch,

    status,

    customer,

    exportPDF,

    exportExcel,

    exportJSON

  };

})();