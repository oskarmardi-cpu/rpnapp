/*=========================================================
 RPN MANAGEMENT SYSTEM
 WorkflowService.gs
 Enterprise Edition v3.0
=========================================================*/

const WorkflowService = (() => {

  "use strict";

  /*=======================================================
    READY
  =======================================================*/

  function ready(

    assetId,

    payload

  ){

    PermissionEngine.transaction();

    return Response.success(

      AssetLifecycleEngine.ready(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    RENTAL
  =======================================================*/

  function rental(

    assetId,

    payload

  ){

    PermissionEngine.rental();

    return Response.success(

      AssetLifecycleEngine.rental(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    RETURN
  =======================================================*/

  function returnAsset(

    assetId,

    payload

  ){

    PermissionEngine.rental();

    return Response.success(

      AssetLifecycleEngine.return(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    REPAIR
  =======================================================*/

  function repair(

    assetId,

    payload

  ){

    PermissionEngine.transaction();

    return Response.success(

      AssetLifecycleEngine.repair(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    WAITING PART
  =======================================================*/

  function waitingPart(

    assetId,

    payload

  ){

    PermissionEngine.transaction();

    return Response.success(

      AssetLifecycleEngine.waitingPart(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    QC
  =======================================================*/

  function qc(

    assetId,

    payload

  ){

    PermissionEngine.transaction();

    return Response.success(

      AssetLifecycleEngine.qc(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    BOOKING
  =======================================================*/

  function booking(

    assetId,

    payload

  ){

    PermissionEngine.sales();

    return Response.success(

      AssetLifecycleEngine.booked(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    SALES
  =======================================================*/

  function sales(

    assetId,

    payload

  ){

    PermissionEngine.sales();

    return Response.success(

      AssetLifecycleEngine.sales(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    EXPORT
  =======================================================*/

  function exportAsset(

    assetId,

    payload

  ){

    PermissionEngine.exportData();

    return Response.success(

      AssetLifecycleEngine.export(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    CANNIBAL
  =======================================================*/

  function cannibal(

    assetId,

    payload

  ){

    PermissionEngine.inventory();

    return Response.success(

      AssetLifecycleEngine.cannibal(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    SCRAP
  =======================================================*/

  function scrap(

    assetId,

    payload

  ){

    PermissionEngine.transaction();

    return Response.success(

      AssetLifecycleEngine.scrap(

        assetId,

        payload

      )

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    ready,

    rental,

    return : returnAsset,

    repair,

    waitingPart,

    qc,

    booking,

    sales,

    export : exportAsset,

    cannibal,

    scrap

  };

})();