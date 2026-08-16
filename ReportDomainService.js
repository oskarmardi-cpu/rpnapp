/*=========================================================
 RPN MANAGEMENT SYSTEM
 ReportDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const ReportDomainService = (() => {

  "use strict";

  /*=======================================================
    SERVICE REPORT
  =======================================================*/

  function service(workOrderId){

    return Database.transaction(function(){

      const report = ReportEngine.service(

        workOrderId

      );

      AuditTrailEngine.create(

        "REPORT",

        {

          TYPE : "SERVICE",

          ID : workOrderId

        }

      );

      return report;

    });

  }

  /*=======================================================
    PM REPORT
  =======================================================*/

  function preventiveMaintenance(pmId){

    return Database.transaction(function(){

      return ReportEngine.preventiveMaintenance(

        pmId

      );

    });

  }

  /*=======================================================
    RENTAL REPORT
  =======================================================*/

  function rental(rentalId){

    return Database.transaction(function(){

      return ReportEngine.rental(

        rentalId

      );

    });

  }

  /*=======================================================
    USED REPORT
  =======================================================*/

  function used(assetId){

    return Database.transaction(function(){

      return ReportEngine.used(

        assetId

      );

    });

  }

  /*=======================================================
    EXPORT REPORT
  =======================================================*/

  function exportReport(exportId){

    return Database.transaction(function(){

      return ReportEngine.export(

        exportId

      );

    });

  }

  /*=======================================================
    POPULATION REPORT
  =======================================================*/

  function population(){

    return Database.transaction(function(){

      return ReportEngine.population();

    });

  }

  /*=======================================================
    KPI REPORT
  =======================================================*/

  function kpi(){

    return Database.transaction(function(){

      return ReportEngine.kpi();

    });

  }

  /*=======================================================
    EXECUTIVE REPORT
  =======================================================*/

  function executive(){

    return Database.transaction(function(){

      return ReportEngine.executive();

    });

  }

  /*=======================================================
    PDF
  =======================================================*/

  function pdf(

    type,

    id

  ){

    return Database.transaction(function(){

      const pdf = ReportEngine.pdf(

        type,

        id

      );

      AuditTrailEngine.create(

        "REPORT",

        {

          TYPE : type,

          FORMAT : "PDF",

          ID : id

        }

      );

      return pdf;

    });

  }

  /*=======================================================
    EXCEL
  =======================================================*/

  function excel(

    type,

    id

  ){

    return Database.transaction(function(){

      const excel = ReportEngine.excel(

        type,

        id

      );

      AuditTrailEngine.create(

        "REPORT",

        {

          TYPE : type,

          FORMAT : "EXCEL",

          ID : id

        }

      );

      return excel;

    });

  }

  /*=======================================================
    DASHBOARD REPORT
  =======================================================*/

  function dashboard(){

    return Database.transaction(function(){

      return ReportEngine.dashboard();

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    service,

    preventiveMaintenance,

    rental,

    used,

    export : exportReport,

    population,

    kpi,

    executive,

    dashboard,

    pdf,

    excel

  };

})();