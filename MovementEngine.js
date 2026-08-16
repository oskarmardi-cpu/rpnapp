/*=========================================================
 RPN MANAGEMENT SYSTEM
 MovementEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const MovementEngine = (() => {

  "use strict";

  const DATABASE = Database.SYSTEM;

  const SHEET = CONFIG.SHEET.ASSET_MOVEMENT;

  /*=======================================================
    CREATE MOVEMENT
  =======================================================*/

  function create(data){

    RuleEngine.required(

      data,

      [

        "ASSET_ID",

        "EVENT_ID",

        "FROM_BRANCH",

        "TO_BRANCH",

        "FROM_LOCATION",

        "TO_LOCATION",

        "FROM_STATUS",

        "TO_STATUS"

      ]

    );

    return Database.transaction(function(){

      const header = SpreadsheetService.getHeader(

        DATABASE,

        SHEET

      );

      const movement = {

        MOVEMENT_ID :

          Utility.uuid(),

        EVENT_ID :

          data.EVENT_ID,

        ASSET_ID :

          data.ASSET_ID,

        FROM_BRANCH :

          data.FROM_BRANCH,

        TO_BRANCH :

          data.TO_BRANCH,

        FROM_LOCATION :

          data.FROM_LOCATION,

        TO_LOCATION :

          data.TO_LOCATION,

        FROM_STATUS :

          data.FROM_STATUS,

        TO_STATUS :

          data.TO_STATUS,

        MOVEMENT_DATE :

          Utility.now(),

        CREATED_BY :

          currentUser_(),

        CREATED_AT :

          Utility.now()

      };

      Repository.insert(

        DATABASE,

        SHEET,

        header,

        movement

      );

      StatusEngine.change(

        movement.ASSET_ID,

        movement.TO_STATUS,

        movement.EVENT_ID

      );

      SpreadsheetService.audit(

        "MOVEMENT",

        SHEET,

        movement.ASSET_ID,

        movement

      );

      return movement;

    });

  }

  /*=======================================================
    GET HISTORY
  =======================================================*/

  function history(assetId){

    return Repository.find(

      DATABASE,

      SHEET,

      function(item){

        return item.ASSET_ID === assetId;

      }

    ).sort(function(a,b){

      return new Date(

        b.MOVEMENT_DATE

      ) -

      new Date(

        a.MOVEMENT_DATE

      );

    });

  }

  /*=======================================================
    LAST MOVEMENT
  =======================================================*/

  function last(assetId){

    const list = history(assetId);

    return list.length ?

      list[0] :

      null;

  }

  /*=======================================================
    CURRENT LOCATION
  =======================================================*/

  function location(assetId){

    const movement = last(assetId);

    if(!movement){

      return null;

    }

    return {

      BRANCH :

        movement.TO_BRANCH,

      LOCATION :

        movement.TO_LOCATION,

      STATUS :

        movement.TO_STATUS

    };

  }

  /*=======================================================
    TRANSFER
  =======================================================*/

  function transfer(

    assetId,

    branch,

    location,

    eventId

  ){

    const lastMove = last(assetId);

    if(!lastMove){

      throw new Error(

        "History asset belum ada."

      );

    }

    return create({

      ASSET_ID :

        assetId,

      EVENT_ID :

        eventId,

      FROM_BRANCH :

        lastMove.TO_BRANCH,

      TO_BRANCH :

        branch,

      FROM_LOCATION :

        lastMove.TO_LOCATION,

      TO_LOCATION :

        location,

      FROM_STATUS :

        lastMove.TO_STATUS,

      TO_STATUS :

        lastMove.TO_STATUS

    });

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      if(

        typeof Auth !==

        "undefined"

      ){

        const user =

          Auth.getUser();

        if(user){

          return user.username;

        }

      }

    }

    catch(e){}

    return "SYSTEM";

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    create,

    history,

    last,

    location,

    transfer

  };

})();