/*=========================================================
 RPN MANAGEMENT SYSTEM
 InventoryDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const InventoryDomainService = (() => {

  "use strict";

  /*=======================================================
    RECEIVE STOCK
  =======================================================*/

  function receive(data){

    return Database.transaction(function(){

      ValidationEngine.receiving(data);

      const receive = InventoryEngine.receive(data);

      StockEngine.increase(receive.ITEMS);

      TimelineEngine.event({

        MODULE      : "INVENTORY",
        ACTION      : "RECEIVE",
        DOCUMENT_NO : receive.RECEIVE_NO

      });

      AuditTrailEngine.create(

        "INVENTORY",

        receive

      );

      DashboardEngine.refresh();

      NotificationEngine.sendStockReceived(

        receive

      );

      return receive;

    });

  }

  /*=======================================================
    ISSUE STOCK
  =======================================================*/

  function issue(data){

    return Database.transaction(function(){

      ValidationEngine.issue(data);

      StockEngine.checkAvailability(

        data.ITEMS

      );

      const issue = InventoryEngine.issue(data);

      StockEngine.decrease(issue.ITEMS);

      TimelineEngine.event({

        MODULE      : "INVENTORY",
        ACTION      : "ISSUE",
        DOCUMENT_NO : issue.ISSUE_NO

      });

      AuditTrailEngine.create(

        "INVENTORY",

        issue

      );

      DashboardEngine.refresh();

      return issue;

    });

  }

  /*=======================================================
    TRANSFER STOCK
  =======================================================*/

  function transfer(data){

    return Database.transaction(function(){

      ValidationEngine.transfer(data);

      const transfer = InventoryEngine.transfer(data);

      StockEngine.transfer(

        transfer.ITEMS,

        transfer.FROM_BRANCH,

        transfer.TO_BRANCH

      );

      TimelineEngine.event({

        MODULE      : "INVENTORY",
        ACTION      : "TRANSFER",
        DOCUMENT_NO : transfer.TRANSFER_NO

      });

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "TRANSFER",

        transfer

      );

      NotificationEngine.sendTransfer(

        transfer

      );

      return transfer;

    });

  }

  /*=======================================================
    STOCK OPNAME
  =======================================================*/

  function stockOpname(data){

    return Database.transaction(function(){

      const opname = InventoryEngine.stockOpname(data);

      StockEngine.adjust(opname.ITEMS);

      TimelineEngine.event({

        MODULE      : "INVENTORY",
        ACTION      : "STOCK_OPNAME",
        DOCUMENT_NO : opname.OPNAME_NO

      });

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "STOCK_OPNAME",

        opname

      );

      return opname;

    });

  }

  /*=======================================================
    ADJUSTMENT
  =======================================================*/

  function adjustment(data){

    return Database.transaction(function(){

      const adjust = InventoryEngine.adjustment(data);

      StockEngine.adjust(

        adjust.ITEMS

      );

      TimelineEngine.event({

        MODULE      : "INVENTORY",
        ACTION      : "ADJUSTMENT",
        DOCUMENT_NO : adjust.ADJUSTMENT_NO

      });

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "ADJUSTMENT",

        adjust

      );

      return adjust;

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    receive,

    issue,

    transfer,

    stockOpname,

    adjustment

  };

})();