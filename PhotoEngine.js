/*=========================================================
 RPN MANAGEMENT SYSTEM
 PhotoEngine.gs
 Enterprise Edition v5.0
=========================================================*/

const PhotoEngine = (() => {

  "use strict";

  /*=======================================================
    PHOTO CATEGORY
  =======================================================*/

  const CATEGORY = {

    BEFORE      : "BEFORE",

    DURING      : "DURING",

    AFTER       : "AFTER",

    NAMEPLATE   : "NAMEPLATE",

    HOURMETER   : "HOURMETER",

    DAMAGE      : "DAMAGE",

    PART        : "PART",

    DELIVERY    : "DELIVERY",

    RETURN      : "RETURN",

    OTHER       : "OTHER"

  };

  /*=======================================================
    UPLOAD PHOTO
  =======================================================*/

  function upload(data){

    validate_(data);

    return FileManagerEngine.upload({

      MODULE :

        data.MODULE,

      CATEGORY :

        data.CATEGORY,

      DOCUMENT_NO :

        data.DOCUMENT_NO,

      ASSET_ID :

        data.ASSET_ID,

      BRANCH :

        data.BRANCH,

      BLOB :

        data.BLOB

    });

  }

  /*=======================================================
    BEFORE
  =======================================================*/

  function before(data){

    data.CATEGORY = CATEGORY.BEFORE;

    return upload(data);

  }

  /*=======================================================
    DURING
  =======================================================*/

  function during(data){

    data.CATEGORY = CATEGORY.DURING;

    return upload(data);

  }

  /*=======================================================
    AFTER
  =======================================================*/

  function after(data){

    data.CATEGORY = CATEGORY.AFTER;

    return upload(data);

  }

  /*=======================================================
    DAMAGE
  =======================================================*/

  function damage(data){

    data.CATEGORY = CATEGORY.DAMAGE;

    return upload(data);

  }

  /*=======================================================
    PART
  =======================================================*/

  function part(data){

    data.CATEGORY = CATEGORY.PART;

    return upload(data);

  }

  /*=======================================================
    NAMEPLATE
  =======================================================*/

  function nameplate(data){

    data.CATEGORY = CATEGORY.NAMEPLATE;

    return upload(data);

  }

  /*=======================================================
    HOUR METER
  =======================================================*/

  function hourMeter(data){

    data.CATEGORY = CATEGORY.HOURMETER;

    return upload(data);

  }

  /*=======================================================
    DOCUMENT
  =======================================================*/

  function byDocument(documentNo){

    return FileManagerEngine

      .byDocument(documentNo);

  }

  /*=======================================================
    ASSET
  =======================================================*/

  function byAsset(assetId){

    return FileManagerEngine

      .byAsset(assetId);

  }

  /*=======================================================
    CATEGORY
  =======================================================*/

  function byCategory(

    documentNo,

    category

  ){

    return byDocument(

      documentNo

    ).filter(

      x =>

        x.CATEGORY===category

    );

  }

  /*=======================================================
    SERVICE REPORT PHOTO
  =======================================================*/

  function serviceReport(documentNo){

    return {

      BEFORE :

        byCategory(

          documentNo,

          CATEGORY.BEFORE

        ),

      DURING :

        byCategory(

          documentNo,

          CATEGORY.DURING

        ),

      AFTER :

        byCategory(

          documentNo,

          CATEGORY.AFTER

        ),

      DAMAGE :

        byCategory(

          documentNo,

          CATEGORY.DAMAGE

        ),

      PART :

        byCategory(

          documentNo,

          CATEGORY.PART
        ),

      NAMEPLATE :

        byCategory(

          documentNo,

          CATEGORY.NAMEPLATE

        ),

      HOURMETER :

        byCategory(

          documentNo,

          CATEGORY.HOURMETER

        )

    };

  }

  /*=======================================================
    VALIDATE
  =======================================================*/

  function validate_(data){

    if(!data.BLOB){

      throw new Error(

        "Photo wajib diisi."

      );

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    CATEGORY,

    upload,

    before,

    during,

    after,

    damage,

    part,

    nameplate,

    hourMeter,

    byDocument,

    byAsset,

    byCategory,

    serviceReport

  };

})();