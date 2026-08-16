/*=========================================================
 RPN MANAGEMENT SYSTEM
 ApprovalDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const ApprovalDomainService = (() => {

  "use strict";

  /*=======================================================
    SUBMIT
  =======================================================*/

  function submit(

    module,

    documentNo,

    data

  ){

    return Database.transaction(function(){

      const approval = ApprovalEngine.submit({

        MODULE       : module,

        DOCUMENT_NO  : documentNo,

        DATA         : data

      });

      WorkflowEngine.waitingApproval(

        module,

        documentNo

      );

      TimelineEngine.event({

        MODULE       : module,

        ACTION       : "SUBMIT_APPROVAL",

        DOCUMENT_NO  : documentNo

      });

      NotificationEngine.sendApprovalRequest(

        approval

      );

      AuditTrailEngine.create(

        "APPROVAL",

        approval

      );

      DashboardEngine.refresh();

      return approval;

    });

  }

  /*=======================================================
    APPROVE
  =======================================================*/

  function approve(

    approvalId,

    remark

  ){

    return Database.transaction(function(){

      const approval = ApprovalEngine.get(

        approvalId

      );

      ApprovalEngine.approve(

        approvalId,

        remark

      );

      WorkflowEngine.approved(

        approval.MODULE,

        approval.DOCUMENT_NO

      );

      TimelineEngine.event({

        MODULE       : approval.MODULE,

        ACTION       : "APPROVED",

        DOCUMENT_NO  : approval.DOCUMENT_NO

      });

      AuditTrailEngine.approval(

        approval.DOCUMENT_NO,

        "APPROVED",

        remark

      );

      NotificationEngine.sendApprovalResult(

        approval

      );

      DashboardEngine.refresh();

      return ApprovalEngine.get(

        approvalId

      );

    });

  }

  /*=======================================================
    REJECT
  =======================================================*/

  function reject(

    approvalId,

    remark

  ){

    return Database.transaction(function(){

      const approval = ApprovalEngine.get(

        approvalId

      );

      ApprovalEngine.reject(

        approvalId,

        remark

      );

      WorkflowEngine.rejected(

        approval.MODULE,

        approval.DOCUMENT_NO

      );

      TimelineEngine.event({

        MODULE       : approval.MODULE,

        ACTION       : "REJECTED",

        DOCUMENT_NO  : approval.DOCUMENT_NO,

        REMARK       : remark

      });

      AuditTrailEngine.approval(

        approval.DOCUMENT_NO,

        "REJECTED",

        remark

      );

      NotificationEngine.sendApprovalRejected(

        approval

      );

      DashboardEngine.refresh();

      return ApprovalEngine.get(

        approvalId

      );

    });

  }

  /*=======================================================
    CANCEL
  =======================================================*/

  function cancel(

    approvalId,

    reason

  ){

    return Database.transaction(function(){

      const approval = ApprovalEngine.get(

        approvalId

      );

      ApprovalEngine.cancel(

        approvalId,

        reason

      );

      TimelineEngine.event({

        MODULE       : approval.MODULE,

        ACTION       : "CANCEL_APPROVAL",

        DOCUMENT_NO  : approval.DOCUMENT_NO,

        REMARK       : reason

      });

      AuditTrailEngine.create(

        "APPROVAL_CANCEL",

        approval

      );

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    PENDING
  =======================================================*/

  function pending(userId){

    return ApprovalEngine.pending(

      userId

    );

  }

  /*=======================================================
    HISTORY
  =======================================================*/

  function history(

    documentNo

  ){

    return ApprovalEngine.history(

      documentNo

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    submit,

    approve,

    reject,

    cancel,

    pending,

    history

  };

})();