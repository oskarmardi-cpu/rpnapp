/*=========================================================
 RPN MANAGEMENT SYSTEM
 CustomerDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const CustomerDomainService = (() => {

  "use strict";

  /*=======================================================
    REGISTER CUSTOMER
  =======================================================*/

  function register(data){

    return Database.transaction(function(){

      ValidationEngine.customer(data);

      const customer = CustomerEngine.create(data);

      TimelineEngine.event({

        MODULE      : "CUSTOMER",
        ACTION      : "REGISTER",
        DOCUMENT_NO : customer.CUSTOMER_CODE

      });

      AuditTrailEngine.create(

        "CUSTOMER",

        customer

      );

      DashboardEngine.refresh();

      return customer;

    });

  }

  /*=======================================================
    UPDATE CUSTOMER
  =======================================================*/

  function update(

    customerId,

    data

  ){

    return Database.transaction(function(){

      const before = CustomerEngine.get(

        customerId

      );

      const customer = CustomerEngine.update(

        customerId,

        data

      );

      TimelineEngine.event({

        MODULE      : "CUSTOMER",
        ACTION      : "UPDATE",
        DOCUMENT_NO : customer.CUSTOMER_CODE

      });

      AuditTrailEngine.update(

        "CUSTOMER",

        before,

        customer

      );

      return customer;

    });

  }

  /*=======================================================
    SET CREDIT LIMIT
  =======================================================*/

  function setCreditLimit(

    customerId,

    limit

  ){

    return Database.transaction(function(){

      CustomerEngine.setCreditLimit(

        customerId,

        limit

      );

      TimelineEngine.event({

        MODULE      : "CUSTOMER",
        ACTION      : "SET_CREDIT_LIMIT",
        DOCUMENT_NO : customerId

      });

      AuditTrailEngine.create(

        "CUSTOMER_LIMIT",

        {

          CUSTOMER_ID : customerId,

          LIMIT : limit

        }

      );

    });

  }

  /*=======================================================
    ASSIGN ASSET
  =======================================================*/

  function assignAsset(

    customerId,

    assetId

  ){

    return Database.transaction(function(){

      AssetEngine.assignCustomer(

        assetId,

        customerId

      );

      TimelineEngine.event({

        MODULE   : "CUSTOMER",
        ACTION   : "ASSIGN_ASSET",
        ASSET_ID : assetId

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    RELEASE ASSET
  =======================================================*/

  function releaseAsset(

    assetId

  ){

    return Database.transaction(function(){

      AssetEngine.releaseCustomer(

        assetId

      );

      TimelineEngine.event({

        MODULE   : "CUSTOMER",
        ACTION   : "RELEASE_ASSET",
        ASSET_ID : assetId

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    CUSTOMER SUMMARY
  =======================================================*/

  function summary(

    customerId

  ){

    return {

      PROFILE :

        CustomerEngine.get(

          customerId

        ),

      RENTAL :

        RentalEngine.byCustomer(

          customerId

        ),

      SALES :

        SalesEngine.byCustomer(

          customerId

        ),

      EXPORT :

        ExportEngine.byCustomer(

          customerId

        ),

      ASSET :

        AssetEngine.byCustomer(

          customerId

        ),

      OUTSTANDING :

        FinanceEngine.outstanding(

          customerId

        ),

      CREDIT_LIMIT :

        FinanceEngine.creditLimit(

          customerId

        )

    };

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    register,

    update,

    setCreditLimit,

    assignAsset,

    releaseAsset,

    summary

  };

})();