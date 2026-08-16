/*=========================================================
 RPN MANAGEMENT SYSTEM
 NotificationEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const NotificationEngine = (() => {

  "use strict";

  const DATABASE = Database.SYSTEM;

  const SHEET = CONFIG.SHEET.NOTIFICATION;

  /*=======================================================
    CREATE
  =======================================================*/

  function create(data){

    RuleEngine.required(data,[

      "TITLE",
      "MESSAGE",
      "USER_ID"

    ]);

    return Database.transaction(function(){

      const header = SpreadsheetService.getHeader(

        DATABASE,

        SHEET

      );

      const notification = {

        NOTIFICATION_ID :

          Utility.uuid(),

        TITLE :

          data.TITLE,

        MESSAGE :

          data.MESSAGE,

        USER_ID :

          data.USER_ID,

        MODULE :

          data.MODULE || "",

        REFERENCE_ID :

          data.REFERENCE_ID || "",

        TYPE :

          data.TYPE || "INFO",

        STATUS :

          "UNREAD",

        CREATED_AT :

          Utility.now(),

        CREATED_BY :

          currentUser_()

      };

      Repository.insert(

        DATABASE,

        SHEET,

        header,

        notification

      );

      SpreadsheetService.audit(

        "CREATE_NOTIFICATION",

        SHEET,

        notification.NOTIFICATION_ID,

        notification

      );

      return notification;

    });

  }

  /*=======================================================
    READ
  =======================================================*/

  function read(notificationId){

    const find = SpreadsheetService.find(

      DATABASE,

      SHEET,

      1,

      notificationId

    );

    if(!find){

      throw new Error(

        "Notification tidak ditemukan."

      );

    }

    const row = find.object;

    row.STATUS = "READ";

    row.READ_AT = Utility.now();

    const header = SpreadsheetService.getHeader(

      DATABASE,

      SHEET

    );

    Repository.update(

      DATABASE,

      SHEET,

      find.row,

      header,

      row

    );

    return row;

  }

  /*=======================================================
    GET USER NOTIFICATION
  =======================================================*/

  function user(userId){

    return Repository.find(

      DATABASE,

      SHEET,

      function(item){

        return item.USER_ID===userId;

      }

    );

  }

  /*=======================================================
    UNREAD
  =======================================================*/

  function unread(userId){

    return Repository.find(

      DATABASE,

      SHEET,

      function(item){

        return (

          item.USER_ID===userId &&

          item.STATUS==="UNREAD"

        );

      }

    );

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(

    supervisor,

    woNumber

  ){

    return create({

      USER_ID : supervisor,

      TITLE : "Waiting Part",

      MESSAGE :

        "WO "+

        woNumber+

        " menunggu spare part.",

      MODULE : "WORK_ORDER",

      TYPE : "WARNING"

    });

  }

  /*=======================================================
    READY
  =======================================================*/

  function ready(

    supervisor,

    assetCode

  ){

    return create({

      USER_ID : supervisor,

      TITLE : "Unit Ready",

      MESSAGE :

        assetCode+

        " siap digunakan.",

      MODULE : "ASSET",

      TYPE : "SUCCESS"

    });

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function approval(

    approver,

    documentNo

  ){

    return create({

      USER_ID : approver,

      TITLE : "Approval",

      MESSAGE :

        documentNo+

        " menunggu approval.",

      MODULE : "APPROVAL",

      TYPE : "INFO"

    });

  }

  /*=======================================================
    RESERVATION
  =======================================================*/

  function reservation(

    sales,

    reservationNo

  ){

    return create({

      USER_ID : sales,

      TITLE : "Reservation",

      MESSAGE :

        reservationNo+

        " berhasil dibuat.",

      MODULE : "RESERVATION",

      TYPE : "SUCCESS"

    });

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportReady(

    manager,

    exportNo

  ){

    return create({

      USER_ID : manager,

      TITLE : "Export",

      MESSAGE :

        exportNo+

        " siap diproses.",

      MODULE : "EXPORT",

      TYPE : "INFO"

    });

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      return Auth.getUser().username;

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    read,

    user,

    unread,

    waitingPart,

    ready,

    approval,

    reservation,

    exportReady

  };

})();