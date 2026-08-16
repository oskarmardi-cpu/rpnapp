/*=========================================================
 RPN MANAGEMENT SYSTEM
 EventEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const EventEngine = (() => {

  "use strict";

  const DATABASE = Database.SYSTEM;

  const SHEET = CONFIG.SHEET.EVENT_LEDGER;

  /*=======================================================
    CREATE EVENT
  =======================================================*/

  function create(data){

    RuleEngine.required(data,[

      "EVENT_TYPE",

      "ASSET_ID"

    ]);

    const header = SpreadsheetService.getHeader(

      DATABASE,

      SHEET

    );

    const event = {

      EVENT_ID :

        Utility.uuid(),

      EVENT_NO :

        DocumentNumberEngine.generate(

          "EVENT"

        ),

      EVENT_TYPE :

        data.EVENT_TYPE,

      DOCUMENT_NO :

        data.DOCUMENT_NO || "",

      REFERENCE_NO :

        data.REFERENCE_NO || "",

      ASSET_ID :

        data.ASSET_ID,

      BRANCH :

        data.BRANCH || "",

      LOCATION :

        data.LOCATION || "",

      STATUS :

        data.STATUS ||

        AssetEngine.getStatus(

          data.ASSET_ID

        ),

      DESCRIPTION :

        data.DESCRIPTION || "",

      USERNAME :

        currentUser_(),

      CREATED_AT :

        Utility.now()

    };

    Repository.insert(

      DATABASE,

      SHEET,

      header,

      event

    );

    HistoryService.write(

      "EVENT",

      SHEET,

      event.EVENT_NO,

      event

    );

    return event;

  }

  /*=======================================================
    GET EVENT
  =======================================================*/

  function get(eventId){

    return Repository.findById(

      DATABASE,

      SHEET,

      CONFIG.COLUMN.SYS_EVENT_LEDGER.ID,

      eventId

    );

  }

  /*=======================================================
    HISTORY BY ASSET
  =======================================================*/

  function history(assetId){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.ASSET_ID===assetId

    );

  }

  /*=======================================================
    HISTORY BY DOCUMENT
  =======================================================*/

  function document(documentNo){

    return Repository.find(

      DATABASE,

      SHEET,

      item =>

        item.DOCUMENT_NO===documentNo

    );

  }

  /*=======================================================
    LAST EVENT
  =======================================================*/

  function last(assetId){

    const list = history(

      assetId

    );

    if(

      !list.length

    ){

      return null;

    }

    list.sort(function(a,b){

      return new Date(

        b.CREATED_AT

      ) -

      new Date(

        a.CREATED_AT

      );

    });

    return list[0];

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      const user =

        Auth.getUser();

      return user ?

        user.USERNAME :

        "SYSTEM";

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

    get,

    history,

    document,

    last

  };

})();