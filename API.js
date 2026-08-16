/*=========================================================
 RPN MANAGEMENT SYSTEM
 API.gs
 Enterprise Edition v4.0
 REST API Gateway
=========================================================*/

const API = (() => {

  "use strict";

  /*=======================================================
    POST
  =======================================================*/

  function doPost(e){

    try{

      const request = JSON.parse(

        e.postData.contents

      );

      const method =

        request.method;

      const payload =

        request.payload || {};

      Auth.check();

      const result = Router.execute(

        method,

        payload

      );

      return output_(result);

    }

    catch(err){

      Logger.error(

        "API.POST",

        err

      );

      return output_(

        Response.error(err)

      );

    }

  }

  /*=======================================================
    GET
  =======================================================*/

  function doGet(e){

    try{

      const method =

        e.parameter.method;

      const payload =

        e.parameter;

      delete payload.method;

      const result = Router.execute(

        method,

        payload

      );

      return output_(result);

    }

    catch(err){

      Logger.error(

        "API.GET",

        err

      );

      return output_(

        Response.error(err)

      );

    }

  }

  /*=======================================================
    OUTPUT
  =======================================================*/

  function output_(result){

    return ContentService

      .createTextOutput(

        JSON.stringify(result)

      )

      .setMimeType(

        ContentService

        .MimeType.JSON

      );

  }

  /*=======================================================
    HEALTH CHECK
  =======================================================*/

  function health(){

    return Response.success({

      APPLICATION :

        CONFIG.APP.NAME,

      VERSION :

        CONFIG.VERSION.SYSTEM,

      SERVER_TIME :

        Utility.now(),

      STATUS :

        "ONLINE"

    });

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    doGet,

    doPost,

    health

  };

})();