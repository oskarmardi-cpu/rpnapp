/*=========================================================
 RPN MANAGEMENT SYSTEM
 SalesEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const SalesEngine = (() => {

  "use strict";

  const DATABASE = Database.TRANSACTION;

  const SHEET = CONFIG.SHEET.SALES;

  /*=======================================================
    CREATE SALES ORDER
  =======================================================*/

  function create(data){

    PermissionEngine.sales();

    return LockManager.execute(function(){

      const booking = Repository.findById(

        Database.TRANSACTION,

        CONFIG.SHEET.RESERVATION,

        CONFIG.COLUMN.T_RESERVATION.ID,

        data.RESERVATION_ID

      );

      if(!booking){

        throw new Error(

          "Reservation tidak ditemukan."

        );

      }

      if(

        booking.SALES_ORDER_NO

      ){

        throw new Error(

          "Sales Order sudah dibuat."

        );

      }

      const sales = {

        SALES_ID :

          Utility.uuid(),

        SALES_NO :

          DocumentNumberEngine.generate(

            "SALES"

          ),

        RESERVATION_ID :

          booking.RESERVATION_ID,

        ASSET_ID :

          booking.ASSET_ID,

        CUSTOMER_ID :

          booking.CUSTOMER_ID,

        SALESMAN :

          booking.SALES_ID,

        SALES_ORDER_NO :

          data.SALES_ORDER_NO,

        SALES_TYPE :

          data.SALES_TYPE,

        STATUS :

          "OPEN",

        CREATED_AT :

          Utility.now(),

        CREATED_BY :

          Auth.getUser().USERNAME

      };

      Repository.insert(

        DATABASE,

        SHEET,

        SpreadsheetService.getHeader(

          DATABASE,

          SHEET

        ),

        sales

      );

      ReservationEngine.salesOrder(

        booking.RESERVATION_ID,

        data.SALES_ORDER_NO

      );

      EventEngine.create({

        EVENT_TYPE :

          CONFIG.EVENT.SALES,

        ASSET_ID :

          booking.ASSET_ID,

        DOCUMENT_NO :

          sales.SALES_NO,

        DESCRIPTION :

          "Sales Order : " +

          data.SALES_ORDER_NO

      });

      return sales;

    },"DOCUMENT");

  }

  /*=======================================================
    CANCEL SALES
  =======================================================*/

  function cancel(

    salesId,

    reason

  ){

    PermissionEngine.sales();

    return LockManager.execute(function(){

      const sales = Repository.findById(

        DATABASE,

        SHEET,

        "SALES_ID",

        salesId

      );

      sales.STATUS =

        "CANCELLED";

      sales.CANCEL_REASON =

        reason;

      sales.CANCEL_DATE =

        Utility.now();

      Repository.save(

        DATABASE,

        SHEET,

        sales

      );

      ReservationEngine.cancel(

        sales.RESERVATION_ID

      );

      EventEngine.create({

        EVENT_TYPE :

          "SALES_CANCEL",

        ASSET_ID :

          sales.ASSET_ID,

        DOCUMENT_NO :

          sales.SALES_NO,

        DESCRIPTION :

          reason

      });

      return sales;

    },"DOCUMENT");

  }

  /*=======================================================
    FINISH SALES
  =======================================================*/

  function finish(

    salesId

  ){

    const sales = Repository.findById(

      DATABASE,

      SHEET,

      "SALES_ID",

      salesId

    );

    sales.STATUS =

      "FINISHED";

    sales.FINISH_DATE =

      Utility.now();

    Repository.save(

      DATABASE,

      SHEET,

      sales

    );

    AssetLifecycleEngine.sales(

      sales.ASSET_ID,

      {

        DOCUMENT_NO :

          sales.SALES_NO

      }

    );

    return sales;

  }

  /*=======================================================
    GET SALES
  =======================================================*/

  function get(

    salesId

  ){

    return Repository.findById(

      DATABASE,

      SHEET,

      "SALES_ID",

      salesId

    );

  }

  /*=======================================================
    SALES HISTORY
  =======================================================*/

  function history(

    assetId

  ){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    cancel,

    finish,

    get,

    history

  };

})();