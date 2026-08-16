/*=========================================================
 RPN MANAGEMENT SYSTEM
 AssetDomainService.gs
 Enterprise Edition v5.0
=========================================================*/

const AssetDomainService = (() => {

  "use strict";

  /*=======================================================
    REGISTER ASSET
  =======================================================*/

  function register(data){

    return Database.transaction(function(){

      ValidationEngine.asset(data);

      const asset = AssetEngine.create(data);

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "REGISTER",
        DOCUMENT_NO : asset.ASSET_NO,
        ASSET_ID    : asset.ASSET_ID

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "ASSET",

        asset

      );

      return asset;

    });

  }

  /*=======================================================
    UPDATE ASSET
  =======================================================*/

  function update(assetId,data){

    return Database.transaction(function(){

      const before = AssetEngine.get(assetId);

      const asset = AssetEngine.update(

        assetId,

        data

      );

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "UPDATE",
        DOCUMENT_NO : asset.ASSET_NO,
        ASSET_ID    : assetId

      });

      AuditTrailEngine.update(

        "ASSET",

        before,

        asset

      );

      DashboardEngine.refresh();

      return asset;

    });

  }

  /*=======================================================
    TRANSFER BRANCH
  =======================================================*/

  function transferBranch(

    assetId,

    branch

  ){

    return Database.transaction(function(){

      const asset = AssetEngine.get(assetId);

      AssetEngine.transferBranch(

        assetId,

        branch

      );

      AssetMovementEngine.create({

        ASSET_ID     : assetId,
        DOCUMENT_NO  : "",
        FROM_BRANCH  : asset.CURRENT_BRANCH,
        TO_BRANCH    : branch

      });

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "TRANSFER_BRANCH",
        ASSET_ID    : assetId

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    CHANGE STATUS
  =======================================================*/

  function changeStatus(

    assetId,

    status,

    remark

  ){

    return Database.transaction(function(){

      const before = AssetEngine.get(assetId);

      AssetEngine.updateStatus(

        assetId,

        status

      );

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "STATUS",
        ASSET_ID    : assetId,
        REMARK      : remark

      });

      AuditTrailEngine.status(

        assetId,

        before.CURRENT_STATUS,

        status,

        ""

      );

      PopulationEngine.refresh();

      DashboardEngine.refresh();

    });

  }

  /*=======================================================
    INSTALL COMPONENT
  =======================================================*/

  function installComponent(

    parentAsset,

    childAsset

  ){

    return Database.transaction(function(){

      AssetCompositionEngine.install(

        parentAsset,

        childAsset

      );

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "INSTALL_COMPONENT",
        ASSET_ID    : parentAsset

      });

      AuditTrailEngine.create(

        "COMPONENT",

        {

          PARENT : parentAsset,

          CHILD  : childAsset

        }

      );

    });

  }

  /*=======================================================
    REMOVE COMPONENT
  =======================================================*/

  function removeComponent(

    parentAsset,

    childAsset

  ){

    return Database.transaction(function(){

      AssetCompositionEngine.remove(

        parentAsset,

        childAsset

      );

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "REMOVE_COMPONENT",
        ASSET_ID    : parentAsset

      });

    });

  }

  /*=======================================================
    SCRAP
  =======================================================*/

  function scrap(

    assetId,

    reason

  ){

    return Database.transaction(function(){

      AssetEngine.scrap(

        assetId,

        reason

      );

      TimelineEngine.event({

        MODULE      : "ASSET",
        ACTION      : "SCRAP",
        ASSET_ID    : assetId,
        REMARK      : reason

      });

      PopulationEngine.refresh();

      DashboardEngine.refresh();

      AuditTrailEngine.create(

        "SCRAP",

        {

          ASSET_ID : assetId,

          REASON   : reason

        }

      );

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    register,

    update,

    transferBranch,

    changeStatus,

    installComponent,

    removeComponent,

    scrap

  };

})();