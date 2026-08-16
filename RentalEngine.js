/*=========================================================
 RPN MANAGEMENT SYSTEM
 RentalEngine.gs
 Enterprise Edition v3.0
 PART 1
=========================================================*/

const RentalEngine = (() => {

  "use strict";

  const DATABASE = Database.TRANSACTION;

  /*=======================================================
    CREATE RENTAL
  =======================================================*/

  function create(data){

    PermissionEngine.rental();

    ValidationEngine.rental(

      data.ASSET_ID

    );

    return LockManager.execute(function(){

      const rental = {

        RENTAL_ID :

          Utility.uuid(),

        RENTAL_NO :

          DocumentNumberEngine.generate(

            "RENTAL"

          ),

        ASSET_ID :

          data.ASSET_ID,

        CUSTOMER_ID :

          data.CUSTOMER_ID,

        CONTRACT_NO :

          data.CONTRACT_NO,

        BRANCH :

          data.BRANCH,

        LOCATION :

          data.LOCATION,

        START_DATE :

          data.START_DATE,

        END_DATE :

          data.END_DATE,

        RENTAL_TYPE :

          data.RENTAL_TYPE,

        STATUS :

          "OPEN",

        CREATED_AT :

          Utility.now(),

        CREATED_BY :

          Auth.getUser().USERNAME

      };

      Repository.insert(

        DATABASE,

        CONFIG.SHEET.RENTAL,

        SpreadsheetService.getHeader(

          DATABASE,

          CONFIG.SHEET.RENTAL

        ),

        rental

      );

      return rental;

    },"DOCUMENT");

  }

  /*=======================================================
    PULL OUT
  =======================================================*/

  function pullOut(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.PULL_OUT,

      CONFIG.STATUS.PULL_OUT,

      data

    );

  }

  /*=======================================================
    RECEIVING
  =======================================================*/

  function receiving(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.RECEIVING,

      CONFIG.STATUS.RECEIVING,

      data

    );

  }

  /*=======================================================
    INSPECTION
  =======================================================*/

  function inspection(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.INSPECTION,

      CONFIG.STATUS.INSPECTION,

      data

    );

  }

  /*=======================================================
    REPAIR
  =======================================================*/

  function repair(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.REPAIR_START,

      CONFIG.STATUS.REPAIR,

      data

    );

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.WAITING_PART,

      CONFIG.STATUS.WAITING_PART,

      data

    );

  }

  /*=======================================================
    QC
  =======================================================*/

  function qc(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.QC_PASS,

      CONFIG.STATUS.QC,

      data

    );

  }

  /*=======================================================
    READY
  =======================================================*/

  function ready(

    rentalId,

    data

  ){

    return process_(

      rentalId,

      CONFIG.EVENT.READY,

      CONFIG.STATUS.READY,

      data

    );

  }

  /*=======================================================
    PROCESS
  =======================================================*/

  function process_(

    rentalId,

    eventType,

    status,

    data

  ){

    return Database.transaction(function(){

      const rental = Repository.findById(

        DATABASE,

        CONFIG.SHEET.RENTAL,

        "RENTAL_ID",

        rentalId

      );

      if(!rental){

        throw new Error(

          "Rental tidak ditemukan."

        );

      }

      EventEngine.create({

        EVENT_TYPE :

          eventType,

        ASSET_ID :

          rental.ASSET_ID,

        DOCUMENT_NO :

          rental.RENTAL_NO,

        BRANCH :

          data.BRANCH,

        LOCATION :

          data.LOCATION,

        DESCRIPTION :

          data.DESCRIPTION

      });

      AssetLifecycleEngine.ready(

        rental.ASSET_ID,

        {

          DOCUMENT_NO :

            rental.RENTAL_NO,

          FROM_BRANCH :

            data.FROM_BRANCH,

          TO_BRANCH :

            data.TO_BRANCH,

          FROM_LOCATION :

            data.FROM_LOCATION,

          TO_LOCATION :

            data.TO_LOCATION

        }

      );

      rental.STATUS = status;

      rental.UPDATED_AT =

        Utility.now();

      Repository.save(

        DATABASE,

        CONFIG.SHEET.RENTAL,

        rental

      );

      return rental;

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    pullOut,

    receiving,

    inspection,

    repair,

    waitingPart,

    qc,

    ready

  };

})();