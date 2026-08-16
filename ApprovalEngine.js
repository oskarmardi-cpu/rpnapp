/*=========================================================
 RPN MANAGEMENT SYSTEM
 ApprovalEngine.gs
 Enterprise Edition v1.1
=========================================================*/

const ApprovalEngine = (() => {

  "use strict";

  /*=======================================================
    RUNTIME CONFIG RESOLVER
  =======================================================*/

  function getConfig_(){

    if(
      typeof CONFIG === "undefined" ||
      !CONFIG
    ){

      throw new Error(
        "CONFIG belum tersedia."
      );

    }

    return CONFIG;

  }

  /*=======================================================
    DATABASE RESOLVER
  =======================================================*/

  function getDatabase_(){

    if(
      typeof Database === "undefined" ||
      !Database ||
      typeof Database.SYSTEM === "undefined"
    ){

      throw new Error(
        "Database.SYSTEM belum tersedia."
      );

    }

    return Database.SYSTEM;

  }

  /*=======================================================
    SHEET RESOLVER
  =======================================================*/

  function getSheet_(){

    const config = getConfig_();

    if(
      !config.SHEET ||
      !config.SHEET.APPROVAL
    ){

      throw new Error(
        "CONFIG.SHEET.APPROVAL belum tersedia."
      );

    }

    return config.SHEET.APPROVAL;

  }

  /*=======================================================
    CREATE APPROVAL
  =======================================================*/

  function create(data){

    const config = getConfig_();

    const database = getDatabase_();

    const sheet = getSheet_();

    RuleEngine.required(

      data,

      [
        "DOCUMENT_NO",
        "DOCUMENT_TYPE",
        "LEVEL",
        "APPROVER"
      ]

    );

    const header = SpreadsheetService.getHeader(

      database,

      sheet

    );

    const approval = {

      APPROVAL_ID :

        Utility.uuid(),

      APPROVAL_NO :

        DocumentNumberEngine.generate(

          "APPROVAL"

        ),

      DOCUMENT_NO :

        data.DOCUMENT_NO,

      DOCUMENT_TYPE :

        data.DOCUMENT_TYPE,

      LEVEL :

        data.LEVEL,

      APPROVER :

        data.APPROVER,

      STATUS :

        config.APPROVAL_STATUS.PENDING,

      REQUEST_DATE :

        Utility.now(),

      APPROVED_DATE :

        "",

      REMARK :

        ""

    };

    Repository.insert(

      database,

      sheet,

      header,

      approval

    );

    NotificationEngine.approval(

      data.APPROVER,

      data.DOCUMENT_NO

    );

    return approval;

  }

  /*=======================================================
    APPROVE
  =======================================================*/

  function approve(

    approvalId,

    remark

  ){

    const config = getConfig_();

    return updateStatus_(

      approvalId,

      config.APPROVAL_STATUS.APPROVED,

      remark

    );

  }

  /*=======================================================
    REJECT
  =======================================================*/

  function reject(

    approvalId,

    remark

  ){

    const config = getConfig_();

    return updateStatus_(

      approvalId,

      config.APPROVAL_STATUS.REJECTED,

      remark

    );

  }

  /*=======================================================
    CANCEL
  =======================================================*/

  function cancel(

    approvalId,

    remark

  ){

    const config = getConfig_();

    return updateStatus_(

      approvalId,

      config.APPROVAL_STATUS.CANCELLED,

      remark

    );

  }

  /*=======================================================
    UPDATE STATUS
  =======================================================*/

  function updateStatus_(

    approvalId,

    status,

    remark

  ){

    const config = getConfig_();

    const database = getDatabase_();

    const sheet = getSheet_();

    const find = SpreadsheetService.find(

      database,

      sheet,

      config.COLUMN.SYS_APPROVAL.ID,

      approvalId

    );

    if(!find){

      throw new Error(

        "Approval tidak ditemukan."

      );

    }

    const row = find.object;

    row.STATUS = status;

    row.REMARK = remark || "";

    row.APPROVED_DATE =

      Utility.now();

    row.APPROVED_BY =

      currentUser_();

    const header = SpreadsheetService.getHeader(

      database,

      sheet

    );

    Repository.update(

      database,

      sheet,

      find.row,

      header,

      row

    );

    SpreadsheetService.audit(

      status,

      sheet,

      approvalId,

      row

    );

    return row;

  }

  /*=======================================================
    PENDING
  =======================================================*/

  function pending(userId){

    const config = getConfig_();

    const database = getDatabase_();

    const sheet = getSheet_();

    return Repository.find(

      database,

      sheet,

      item =>

        item.APPROVER === userId &&

        item.STATUS ===

        config.APPROVAL_STATUS.PENDING

    );

  }

  /*=======================================================
    HISTORY
  =======================================================*/

  function history(documentNo){

    const database = getDatabase_();

    const sheet = getSheet_();

    return Repository.find(

      database,

      sheet,

      item =>

        item.DOCUMENT_NO === documentNo

    );

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

  return {

    create,

    approve,

    reject,

    cancel,

    pending,

    history

  };

})();