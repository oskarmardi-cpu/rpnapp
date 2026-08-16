/*=========================================================
 RPN MANAGEMENT SYSTEM
 ExportEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const ExportEngine = (() => {

  "use strict";

  const DATABASE = Database.TRANSACTION;

  const SHEET = CONFIG.SHEET.EXPORT;

  /*=======================================================
    CREATE EXPORT
  =======================================================*/

  function create(data){

    PermissionEngine.exportData();

    ValidationEngine.exportAsset(

      data.ASSET_ID

    );

    return LockManager.execute(function(){

      const exportDoc = {

        EXPORT_ID :

          Utility.uuid(),

        EXPORT_NO :

          DocumentNumberEngine.generate(

            "EXPORT"

          ),

        ASSET_ID :

          data.ASSET_ID,

        CUSTOMER_ID :

          data.CUSTOMER_ID,

        COUNTRY :

          data.COUNTRY,

        CONSIGNEE :

          data.CONSIGNEE,

        SHIPPER :

          data.SHIPPER,

        STATUS :

          "BOOKING",

        CREATED_AT :

          Utility.now(),

        CREATED_BY :

          Auth.getUser().USERNAME

      };

      Repository.insert(

        DATABASE,

        SHEET,

        SpreadsheetService.getHeader(

          DATABASE,

          SHEET

        ),

        exportDoc

      );

      AssetLifecycleEngine.export(

        data.ASSET_ID,

        {

          DOCUMENT_NO :

            exportDoc.EXPORT_NO

        }

      );

      return exportDoc;

    },"DOCUMENT");

  }

  /*=======================================================
    SHIPPING INSTRUCTION
  =======================================================*/

  function shippingInstruction(

    exportId,

    siNumber

  ){

    return updateField_(

      exportId,

      {

        SI_NUMBER :

          siNumber,

        STATUS :

          "SI"

      }

    );

  }

  /*=======================================================
    PACKING LIST
  =======================================================*/

  function packingList(

    exportId,

    number

  ){

    return updateField_(

      exportId,

      {

        PACKING_LIST :

          number,

        STATUS :

          "PACKING"

      }

    );

  }

  /*=======================================================
    COMMERCIAL INVOICE
  =======================================================*/

  function commercialInvoice(

    exportId,

    invoice

  ){

    return updateField_(

      exportId,

      {

        COMMERCIAL_INVOICE :

          invoice,

        STATUS :

          "INVOICE"

      }

    );

  }

  /*=======================================================
    CONTAINER
  =======================================================*/

  function container(

    exportId,

    containerNo,

    sealNo

  ){

    return updateField_(

      exportId,

      {

        CONTAINER_NO :

          containerNo,

        SEAL_NO :

          sealNo,

        STATUS :

          "LOADING"

      }

    );

  }

  /*=======================================================
    BILL OF LADING
  =======================================================*/

  function billOfLading(

    exportId,

    blNumber

  ){

    return updateField_(

      exportId,

      {

        BL_NUMBER :

          blNumber,

        STATUS :

          "BL"

      }

    );

  }

  /*=======================================================
    VESSEL
  =======================================================*/

  function vessel(

    exportId,

    vessel,

    voyage

  ){

    return updateField_(

      exportId,

      {

        VESSEL :

          vessel,

        VOYAGE :

          voyage

      }

    );

  }

  /*=======================================================
    ETD ETA
  =======================================================*/

  function schedule(

    exportId,

    etd,

    eta

  ){

    return updateField_(

      exportId,

      {

        ETD : etd,

        ETA : eta

      }

    );

  }

  /*=======================================================
    CUSTOMS
  =======================================================*/

  function customs(

    exportId,

    status

  ){

    return updateField_(

      exportId,

      {

        CUSTOMS_STATUS :

          status

      }

    );

  }

  /*=======================================================
    FINISH EXPORT
  =======================================================*/

  function finish(

    exportId

  ){

    return updateField_(

      exportId,

      {

        STATUS :

          "FINISHED",

        FINISH_DATE :

          Utility.now()

      }

    );

  }

  /*=======================================================
    UPDATE
  =======================================================*/

  function updateField_(

    exportId,

    values

  ){

    const doc = Repository.findById(

      DATABASE,

      SHEET,

      "EXPORT_ID",

      exportId

    );

    Object.assign(

      doc,

      values

    );

    Repository.save(

      DATABASE,

      SHEET,

      doc

    );

    EventEngine.create({

      EVENT_TYPE :

        CONFIG.EVENT.EXPORT,

      ASSET_ID :

        doc.ASSET_ID,

      DOCUMENT_NO :

        doc.EXPORT_NO,

      DESCRIPTION :

        doc.STATUS

    });

    return doc;

  }

  /*=======================================================
    HISTORY
  =======================================================*/

  function history(

    assetId

  ){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    create,

    shippingInstruction,

    packingList,

    commercialInvoice,

    container,

    billOfLading,

    vessel,

    schedule,

    customs,

    finish,

    history

  };

})();