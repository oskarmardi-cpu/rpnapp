/*=========================================================
 RPN MANAGEMENT SYSTEM
 Response.gs
 Enterprise Edition v3.1
 CLIENT-SAFE RESPONSE
=========================================================*/

const Response = (() => {

  "use strict";


  /*=======================================================
    CLIENT SAFE SERIALIZER
  =======================================================*/

  function clientSafe_(value){

    if(value === null || value === undefined){

      return value;

    }


    /*-----------------------------------------------------
      DATE
    -----------------------------------------------------*/

    if(
      Object.prototype.toString.call(value) ===
      "[object Date]"
    ){

      return value.toISOString();

    }


    /*-----------------------------------------------------
      ARRAY
    -----------------------------------------------------*/

    if(Array.isArray(value)){

      return value.map(function(item){

        return clientSafe_(item);

      });

    }


    /*-----------------------------------------------------
      OBJECT
    -----------------------------------------------------*/

    if(typeof value === "object"){

      const result = {};

      Object.keys(value).forEach(function(key){

        const item = value[key];

        if(item === undefined){

          result[key] = null;

        }
        else{

          result[key] = clientSafe_(item);

        }

      });

      return result;

    }


    /*-----------------------------------------------------
      PRIMITIVE
    -----------------------------------------------------*/

    return value;

  }


  /*=======================================================
    SUCCESS
  =======================================================*/

  function success(

    data,

    message

  ){

    return clientSafe_({

      success : true,

      code : 200,

      message :

        message ||

        "Success",

      timestamp :

        Utility.now(),

      data :

        data || null

    });

  }


  /*=======================================================
    CREATED
  =======================================================*/

  function created(

    data,

    message

  ){

    return clientSafe_({

      success : true,

      code : 201,

      message :

        message ||

        "Created",

      timestamp :

        Utility.now(),

      data :

        data || null

    });

  }


  /*=======================================================
    UPDATED
  =======================================================*/

  function updated(

    data,

    message

  ){

    return clientSafe_({

      success : true,

      code : 200,

      message :

        message ||

        "Updated",

      timestamp :

        Utility.now(),

      data :

        data || null

    });

  }


  /*=======================================================
    DELETED
  =======================================================*/

  function deleted(

    message

  ){

    return clientSafe_({

      success : true,

      code : 200,

      message :

        message ||

        "Deleted",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    ERROR
  =======================================================*/

  function error(err){

    let message = "Server error.";

    if(err){

      if(err.message){

        message = String(err.message);

      }
      else{

        message = String(err);

      }

    }


    return clientSafe_({

      success : false,

      code : 500,

      message : message,

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    VALIDATION
  =======================================================*/

  function validation(

    message,

    field

  ){

    return clientSafe_({

      success : false,

      code : 422,

      message :

        message,

      field :

        field || "",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    UNAUTHORIZED
  =======================================================*/

  function unauthorized(

    message

  ){

    return clientSafe_({

      success : false,

      code : 401,

      message :

        message ||

        "Unauthorized",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    FORBIDDEN
  =======================================================*/

  function forbidden(

    message

  ){

    return clientSafe_({

      success : false,

      code : 403,

      message :

        message ||

        "Forbidden",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    NOT FOUND
  =======================================================*/

  function notFound(

    message

  ){

    return clientSafe_({

      success : false,

      code : 404,

      message :

        message ||

        "Data not found",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    CONFLICT
  =======================================================*/

  function conflict(

    message

  ){

    return clientSafe_({

      success : false,

      code : 409,

      message :

        message ||

        "Conflict",

      timestamp :

        Utility.now(),

      data : null

    });

  }


  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    success,

    created,

    updated,

    deleted,

    error,

    validation,

    unauthorized,

    forbidden,

    notFound,

    conflict

  };

})();