/*=========================================================
 RPN MANAGEMENT SYSTEM
 RentalDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const RentalDomainService = (() => {

  "use strict";

  /*=======================================================
    CREATE RENTAL
  =======================================================*/

  function create(data){

    Database.transaction(function(){

      ValidationEngine.rental(data);

      ReservationEngine.validate(data.RESERVATION_ID);

      const asset = AssetEngine.get(data.ASSET_ID);

      AssetEngine.available(asset.ASSET_ID);

      ApprovalEngine.validateRental(data);

      const rental = RentalEngine.create(data);

      WorkflowEngine.startRental(rental);

      ReservationEngine.finish(

        data.RESERVATION_ID,

        rental.RENTAL_ID

      );

      AssetEngine.updateStatus(

        asset.ASSET_ID,

        CONFIG.STATUS.RENTAL

      );

      AssetMovementEngine.create({

        ASSET_ID : asset.ASSET_ID,

        DOCUMENT_NO : rental.RENTAL_NO,

        FROM_STATUS : CONFIG.STATUS.READY,

        TO_STATUS : CONFIG.STATUS.RENTAL,

        CUSTOMER_ID : rental.CUSTOMER_ID,

        BRANCH : rental.BRANCH

      });

      TimelineEngine.event({

        MODULE : "RENTAL",

        ACTION : "CREATE",

        DOCUMENT_NO : rental.RENTAL_NO,

        ASSET_ID : asset.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "RENTAL",

        rental

      );

      NotificationEngine.sendRentalCreated(

        rental

      );

      return rental;

    });

  }

  /*=======================================================
    FINISH RENTAL
  =======================================================*/

  function finish(rentalId){

    Database.transaction(function(){

      const rental = RentalEngine.get(

        rentalId

      );

      RentalEngine.finish(

        rentalId

      );

      AssetEngine.updateStatus(

        rental.ASSET_ID,

        CONFIG.STATUS.READY

      );

      AssetMovementEngine.create({

        ASSET_ID : rental.ASSET_ID,

        DOCUMENT_NO : rental.RENTAL_NO,

        FROM_STATUS : CONFIG.STATUS.RENTAL,

        TO_STATUS : CONFIG.STATUS.READY

      });

      TimelineEngine.event({

        MODULE : "RENTAL",

        ACTION : "FINISH",

        DOCUMENT_NO : rental.RENTAL_NO,

        ASSET_ID : rental.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.update(

        "RENTAL",

        rental,

        RentalEngine.get(rentalId)

      );

      NotificationEngine.sendRentalFinished(

        rental

      );

    });

  }

  /*=======================================================
    CANCEL RENTAL
  =======================================================*/

  function cancel(rentalId,reason){

    Database.transaction(function(){

      const rental = RentalEngine.get(rentalId);

      RentalEngine.cancel(

        rentalId,

        reason

      );

      ReservationEngine.reopen(

        rental.RESERVATION_ID

      );

      AssetEngine.updateStatus(

        rental.ASSET_ID,

        CONFIG.STATUS.READY

      );

      TimelineEngine.event({

        MODULE : "RENTAL",

        ACTION : "CANCEL",

        DOCUMENT_NO : rental.RENTAL_NO,

        ASSET_ID : rental.ASSET_ID,

        REMARK : reason

      });

      DashboardEngine.refresh();

      PopulationEngine.refresh();

      AuditTrailEngine.update(

        "RENTAL",

        rental,

        RentalEngine.get(rentalId)

      );

    });

  }

  /*=======================================================
    EXTEND RENTAL
  =======================================================*/

  function extend(

    rentalId,

    untilDate

  ){

    Database.transaction(function(){

      RentalEngine.extend(

        rentalId,

        untilDate

      );

      TimelineEngine.event({

        MODULE : "RENTAL",

        ACTION : "EXTEND",

        DOCUMENT_NO :

          RentalEngine

          .get(rentalId)

          .RENTAL_NO

      });

      NotificationEngine.sendRentalExtension(

        rentalId

      );

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    finish,

    cancel,

    extend

  };

})();