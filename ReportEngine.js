/*=========================================================
 RPN MANAGEMENT SYSTEM
 ReportEngine.gs
 Enterprise Edition v4.0
=========================================================*/

const ReportEngine = (() => {

  "use strict";

  /*=======================================================
    DIGITAL SERVICE REPORT
  =======================================================*/

  function service(workOrderId){

    const wo = WorkOrderEngine.get(

      workOrderId

    );

    return {

      HEADER :

        reportHeader(),

      WORK_ORDER :

        wo,

      UNIT :

        AssetEngine.getPassport(

          wo.ASSET_ID

        ),

      CUSTOMER :

        CustomerEngine.get(

          wo.CUSTOMER_ID

        ),

      REPAIR :

        RepairEngine.history(

          workOrderId

        ),

      PART :

        RepairEngine.parts(

          workOrderId

        ),

      PHOTO :

        PhotoEngine.byDocument(

          wo.WO_NUMBER

        ),

      MECHANIC :

        MechanicEngine.byWO(

          workOrderId

        ),

      APPROVAL :

        ApprovalEngine.history(

          wo.WO_NUMBER

        )

    };

  }

  /*=======================================================
    PM REPORT
  =======================================================*/

  function preventiveMaintenance(pmId){

    return PMEngine.report(

      pmId

    );

  }

  /*=======================================================
    RENTAL REPORT
  =======================================================*/

  function rental(rentalId){

    return RentalEngine.report(

      rentalId

    );

  }

  /*=======================================================
    USED UNIT REPORT
  =======================================================*/

  function used(assetId){

    return TimelineEngine.passport(

      assetId

    );

  }

  /*=======================================================
    EXPORT REPORT
  =======================================================*/

  function exportReport(exportId){

    return ExportEngine.report(

      exportId

    );

  }

  /*=======================================================
    POPULATION REPORT
  =======================================================*/

  function population(){

    return PopulationEngine.dashboard();

  }

  /*=======================================================
    KPI REPORT
  =======================================================*/

  function kpi(){

    return KPIEngine.calculate();

  }

  /*=======================================================
    DASHBOARD REPORT
  =======================================================*/

  function dashboard(){

    return DashboardEngine.dashboard();

  }

  /*=======================================================
    EXECUTIVE REPORT
  =======================================================*/

  function executive(){

    return {

      DASHBOARD :

        DashboardEngine.dashboard(),

      KPI :

        KPIEngine.calculate(),

      POPULATION :

        PopulationEngine.summary(),

      SNAPSHOT :

        Utility.now()

    };

  }

  /*=======================================================
    EXPORT PDF
  =======================================================*/

  function pdf(

    type,

    id

  ){

    return PDFEngine.generate(

      type,

      load_(type,id)

    );

  }

  /*=======================================================
    EXPORT EXCEL
  =======================================================*/

  function excel(

    type,

    id

  ){

    return ExcelEngine.generate(

      type,

      load_(type,id)

    );

  }

  /*=======================================================
    LOAD DATA
  =======================================================*/

  function load_(

    type,

    id

  ){

    switch(type){

      case "SERVICE":

        return service(id);

      case "PM":

        return preventiveMaintenance(id);

      case "RENTAL":

        return rental(id);

      case "USED":

        return used(id);

      case "EXPORT":

        return exportReport(id);

      case "POPULATION":

        return population();

      case "KPI":

        return kpi();

      case "DASHBOARD":

        return dashboard();

      case "EXECUTIVE":

        return executive();

      default:

        throw new Error(

          "Report Type tidak dikenali."

        );

    }

  }

  /*=======================================================
    HEADER
  =======================================================*/

  function reportHeader(){

    return {

      COMPANY :

        CONFIG.APP.COMPANY,

      SYSTEM :

        CONFIG.APP.NAME,

      VERSION :

        CONFIG.VERSION.SYSTEM,

      GENERATED_AT :

        Utility.now(),

      GENERATED_BY :

        Auth.getUser().FULLNAME

    };

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

    dashboard,

    executive,

    pdf,

    excel

  };

})();