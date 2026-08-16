/*=========================================================
 RPN MANAGEMENT SYSTEM
 ReservationEngine.gs
 Enterprise Edition v2.0 Final
 Queue Booking System
=========================================================*/

const ReservationEngine = (() => {

  "use strict";

  const DATABASE = Database.TRANSACTION;

  const SHEET = CONFIG.SHEET.RESERVATION;

  /*=======================================================
    CREATE RESERVATION
  =======================================================*/

  function create(data){

    ValidationEngine.asset(

      data.ASSET_ID

    );

    return LockManager.execute(function(){

      const queue = nextQueue_(

        data.ASSET_ID

      );

      const reservation = {

        RESERVATION_ID :

          Utility.uuid(),

        RESERVATION_NO :

          DocumentNumberEngine.generate(

            "RESERVATION"

          ),

        ASSET_ID :

          data.ASSET_ID,

        CUSTOMER_ID :

          data.CUSTOMER_ID,

        SALES_ID :

          data.SALES_ID,

        SALES_ORDER_NO :

          "",

        QUEUE_NO :

          queue,

        STATUS :

          CONFIG.RESERVATION_STATUS.WAITING,

        REQUEST_DATE :

          Utility.now(),

        EXPIRED_DATE :

          data.EXPIRED_DATE,

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

        reservation

      );

      EventEngine.create({

        EVENT_TYPE :

          CONFIG.EVENT.RESERVATION_CREATE,

        ASSET_ID :

          data.ASSET_ID,

        DOCUMENT_NO :

          reservation.RESERVATION_NO,

        DESCRIPTION :

          "Queue : " + queue

      });

      return reservation;

    },"DOCUMENT");

  }

  /*=======================================================
    SALES ORDER
  =======================================================*/

  function salesOrder(

    reservationId,

    salesOrderNo

  ){

    return LockManager.execute(function(){

      const reservation = Repository.findById(

        DATABASE,

        SHEET,

        CONFIG.COLUMN.T_RESERVATION.ID,

        reservationId

      );

      if(!reservation){

        throw new Error(

          "Reservation tidak ditemukan."

        );

      }

      reservation.SALES_ORDER_NO =

        salesOrderNo;

      reservation.STATUS =

        CONFIG.RESERVATION_STATUS.BOOKED;

      Repository.save(

        DATABASE,

        SHEET,

        reservation

      );

      StatusEngine.change(

        reservation.ASSET_ID,

        CONFIG.STATUS.BOOKED

      );

      waitingQueue_(

        reservation.ASSET_ID,

        reservation.RESERVATION_ID

      );

      return reservation;

    },"DOCUMENT");

  }

  /*=======================================================
    CANCEL
  =======================================================*/

  function cancel(

    reservationId

  ){

    return LockManager.execute(function(){

      const reservation = Repository.findById(

        DATABASE,

        SHEET,

        CONFIG.COLUMN.T_RESERVATION.ID,

        reservationId

      );

      reservation.STATUS =

        CONFIG.RESERVATION_STATUS.CANCELLED;

      Repository.save(

        DATABASE,

        SHEET,

        reservation

      );

      if(

        reservation.SALES_ORDER_NO

      ){

        StatusEngine.change(

          reservation.ASSET_ID,

          CONFIG.STATUS.READY

        );

        promoteQueue_(

          reservation.ASSET_ID

        );

      }

      return reservation;

    },"DOCUMENT");

  }

  /*=======================================================
    PROMOTE QUEUE
  =======================================================*/

  function promoteQueue_(

    assetId

  ){

    const list = Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId &&

        item.STATUS===

        CONFIG.RESERVATION_STATUS.WAITING

    );

    if(!list.length){

      return;

    }

    list.sort(function(a,b){

      return a.QUEUE_NO-b.QUEUE_NO;

    });

    NotificationEngine.notify(

      list[0].SALES_ID,

      "Booking Unit",

      "Antrian pertama siap diproses Sales Order."

    );

  }

  /*=======================================================
    WAITING QUEUE
  =======================================================*/

  function waitingQueue_(

    assetId,

    bookingId

  ){

    const list = Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId &&

        item.RESERVATION_ID!==bookingId &&

        item.STATUS===

        CONFIG.RESERVATION_STATUS.WAITING

    );

    list.forEach(function(item){

      NotificationEngine.notify(

        item.SALES_ID,

        "Waiting Queue",

        "Unit sedang dibooking customer lain."

      );

    });

  }

  /*=======================================================
    NEXT QUEUE
  =======================================================*/

  function nextQueue_(

    assetId

  ){

    const list = Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    );

    if(!list.length){

      return 1;

    }

    return Math.max.apply(

      null,

      list.map(

        x=>x.QUEUE_NO

      )

    ) + 1;

  }

  /*=======================================================
    GET QUEUE
  =======================================================*/

  function queue(

    assetId

  ){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    ).sort(function(a,b){

      return a.QUEUE_NO-b.QUEUE_NO;

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    salesOrder,

    cancel,

    queue

  };

})();