/*=========================================================
 RPN MANAGEMENT SYSTEM
 LockManager.gs
 Enterprise Edition v3.0
=========================================================*/

const LockManager = (() => {

  "use strict";

  /*=======================================================
    SCRIPT LOCK
  =======================================================*/

  function script(timeout){

    const lock =

      LockService

      .getScriptLock();

    lock.waitLock(

      timeout || 30000

    );

    return lock;

  }

  /*=======================================================
    USER LOCK
  =======================================================*/

  function user(timeout){

    const lock =

      LockService

      .getUserLock();

    lock.waitLock(

      timeout || 30000

    );

    return lock;

  }

  /*=======================================================
    DOCUMENT LOCK
  =======================================================*/

  function document(timeout){

    const lock =

      LockService

      .getDocumentLock();

    lock.waitLock(

      timeout || 30000

    );

    return lock;

  }

  /*=======================================================
    EXECUTE
  =======================================================*/

  function execute(

    callback,

    type,

    timeout

  ){

    const lock =

      getLock_(

        type,

        timeout

      );

    try{

      return callback();

    }

    finally{

      lock.releaseLock();

    }

  }

  /*=======================================================
    TRY EXECUTE
  =======================================================*/

  function tryExecute(

    callback,

    type,

    timeout

  ){

    const lock =

      getLockObject_(

        type

      );

    const success =

      lock.tryLock(

        timeout || 1000

      );

    if(!success){

      throw new Error(

        "Resource sedang digunakan."

      );

    }

    try{

      return callback();

    }

    finally{

      lock.releaseLock();

    }

  }

  /*=======================================================
    GET LOCK
  =======================================================*/

  function getLock_(

    type,

    timeout

  ){

    switch(type){

      case "USER":

        return user(timeout);

      case "DOCUMENT":

        return document(timeout);

      default:

        return script(timeout);

    }

  }

  /*=======================================================
    LOCK OBJECT
  =======================================================*/

  function getLockObject_(type){

    switch(type){

      case "USER":

        return LockService

          .getUserLock();

      case "DOCUMENT":

        return LockService

          .getDocumentLock();

      default:

        return LockService

          .getScriptLock();

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    script,

    user,

    document,

    execute,

    tryExecute

  };

})();