/*=========================================================
 RPN MANAGEMENT SYSTEM
 WhatsAppEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const WhatsAppEngine = (() => {

  "use strict";

  /*=======================================================
    PROCESS MESSAGE
  =======================================================*/

  function process(payload){

    RuleEngine.required(payload,[

      "PHONE",
      "MESSAGE"

    ]);

    const user = validateUser_(

      payload.PHONE

    );

    const command = parseCommand_(

      payload.MESSAGE

    );

    switch(command.ACTION){

      case "WO":

        return updateWorkOrder(

          user,

          command

        );

      case "STATUS":

        return updateStatus(

          user,

          command

        );

      case "LOCATION":

        return updateLocation(

          user,

          command

        );

      case "APPROVE":

        return approve(

          user,

          command

        );

      case "PHOTO":

        return uploadPhoto(

          user,

          command,

          payload

        );

      default:

        throw new Error(

          "Command tidak dikenal."

        );

    }

  }

  /*=======================================================
    UPDATE STATUS
  =======================================================*/

  function updateStatus(

    user,

    command

  ){

    WorkflowEngine.execute(

      command.STATUS,

      {

        ASSET_ID :

          command.ASSET_ID,

        EVENT_ID :

          Utility.uuid(),

        FROM_BRANCH :

          command.FROM_BRANCH,

        TO_BRANCH :

          command.TO_BRANCH,

        FROM_LOCATION :

          command.FROM_LOCATION,

        TO_LOCATION :

          command.TO_LOCATION,

        FROM_STATUS :

          AssetEngine.getStatus(

            command.ASSET_ID

          )

      }

    );

    return {

      success : true,

      message :

      "Status berhasil diupdate."

    };

  }

  /*=======================================================
    UPDATE WO
  =======================================================*/

  function updateWorkOrder(

    user,

    command

  ){

    return TransactionService.update(

      CONFIG.SHEET.WORK_ORDER,

      command.WO_ID,

      command.DATA

    );

  }

  /*=======================================================
    UPDATE LOCATION
  =======================================================*/

  function updateLocation(

    user,

    command

  ){

    return MovementEngine.transfer(

      command.ASSET_ID,

      command.TO_BRANCH,

      command.TO_LOCATION,

      Utility.uuid()

    );

  }

  /*=======================================================
    APPROVAL
  =======================================================*/

  function approve(

    user,

    command

  ){

    return ApprovalEngine.approve(

      command.APPROVAL_ID,

      "Approved via WhatsApp"

    );

  }

  /*=======================================================
    PHOTO
  =======================================================*/

  function uploadPhoto(

    user,

    command,

    payload

  ){

    return {

      SUCCESS : true,

      FILE :

        payload.FILE_ID,

      EVENT :

        command.EVENT_ID

    };

  }

  /*=======================================================
    VALIDATE USER
  =======================================================*/

  function validateUser_(

    phone

  ){

    const user = Repository.first(

      Database.MASTER,

      CONFIG.SHEET.USER,

      item =>

        item.PHONE===phone

    );

    if(!user){

      throw new Error(

        "Nomor WhatsApp belum terdaftar."

      );

    }

    return user;

  }

  /*=======================================================
    PARSER
  =======================================================*/

  function parseCommand_(

    message

  ){

    const cmd =

      String(message)

      .trim()

      .split("|");

    return {

      ACTION :

        cmd[0].toUpperCase(),

      WO_ID :

        cmd[1] || "",

      ASSET_ID :

        cmd[2] || "",

      STATUS :

        cmd[3] || "",

      TO_BRANCH :

        cmd[4] || "",

      TO_LOCATION :

        cmd[5] || "",

      APPROVAL_ID :

        cmd[1] || "",

      EVENT_ID :

        Utility.uuid(),

      DATA : {}

    };

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    process,

    updateStatus,

    updateWorkOrder,

    updateLocation,

    approve,

    uploadPhoto

  };

})();