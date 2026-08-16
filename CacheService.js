/*=========================================================
 RPN MANAGEMENT SYSTEM
 CacheService.gs
 Enterprise Edition v3.0
=========================================================*/

const CacheManager = (() => {

  "use strict";

  /*=======================================================
    SCRIPT CACHE
  =======================================================*/

  function script(){

    return CacheService

      .getScriptCache();

  }

  /*=======================================================
    USER CACHE
  =======================================================*/

  function user(){

    return CacheService

      .getUserCache();

  }

  /*=======================================================
    DOCUMENT CACHE
  =======================================================*/

  function document(){

    return CacheService

      .getDocumentCache();

  }

  /*=======================================================
    GET
  =======================================================*/

  function get(

    key,

    type

  ){

    return cache_(type)

      .get(key);

  }

  /*=======================================================
    PUT
  =======================================================*/

  function put(

    key,

    value,

    second,

    type

  ){

    cache_(type)

      .put(

        key,

        JSON.stringify(value),

        second ||

        CONFIG.CACHE.MASTER_TTL

      );

  }

  /*=======================================================
    GET JSON
  =======================================================*/

  function getJSON(

    key,

    type

  ){

    const data =

      get(

        key,

        type

      );

    if(!data){

      return null;

    }

    return JSON.parse(

      data

    );

  }

  /*=======================================================
    REMOVE
  =======================================================*/

  function remove(

    key,

    type

  ){

    cache_(type)

      .remove(key);

  }

  /*=======================================================
    REMOVE ALL
  =======================================================*/

  function removeAll(

    keys,

    type

  ){

    cache_(type)

      .removeAll(keys);

  }

  /*=======================================================
    CACHE OBJECT
  =======================================================*/

  function cache_(type){

    switch(type){

      case "USER":

        return user();

      case "DOCUMENT":

        return document();

      default:

        return script();

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    script,

    user,

    document,

    get,

    put,

    getJSON,

    remove,

    removeAll

  };

})();