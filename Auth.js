/*=========================================================
 RPN MANAGEMENT SYSTEM
 Auth.gs
 Enterprise Edition v3.2
=========================================================*/

const Auth = (() => {

  "use strict";

  /*=======================================================
    CONFIG RESOLVER
  =======================================================*/

  function getConfig_(){

    if(
      typeof CONFIG === "undefined" ||
      !CONFIG
    ){

      throw new Error(
        "CONFIG belum tersedia."
      );

    }

    return CONFIG;

  }

  /*=======================================================
    DATABASE RESOLVER
  =======================================================*/

  function getDatabase_(){

    if(
      typeof Database === "undefined" ||
      !Database ||
      typeof Database.MASTER === "undefined"
    ){

      throw new Error(
        "Database.MASTER belum tersedia."
      );

    }

    return Database.MASTER;

  }

  /*=======================================================
    SHEET RESOLVER
  =======================================================*/

  function getSheet_(){

    const config = getConfig_();

    if(
      !config.SHEET ||
      !config.SHEET.USER
    ){

      throw new Error(
        "CONFIG.SHEET.USER belum tersedia."
      );

    }

    return config.SHEET.USER;

  }

  /*=======================================================
    LOGIN
  =======================================================*/

  function login(

    username,

    password

  ){

    try{

      RuleEngine.required({

        USERNAME : username,

        PASSWORD : password

      },[

        "USERNAME",

        "PASSWORD"

      ]);

      const database = getDatabase_();

      const sheet = getSheet_();

      const normalizedUsername =

        String(username)

          .trim();

      const user = Repository.first(

        database,

        sheet,

        item => {

          const itemUsername =

            String(

              item.USERNAME || ""

            ).trim();

          const active =

            String(

              item.IS_ACTIVE

            )

            .trim()

            .toUpperCase();

          return (

            itemUsername ===

            normalizedUsername

          ) && (

            active === "TRUE"

          );

        }

      );

      if(!user){

        return Response.error(

          "Username tidak ditemukan atau user tidak aktif."

        );

      }

      /*===================================================
        PASSWORD VALIDATION
      ===================================================*/

      const passwordHash =

        Utility.sha256(

          String(password)

        );

      if(

        String(user.PASSWORD || "")

        !==

        passwordHash

      ){

        return Response.error(

          "Password salah."

        );

      }

      /*===================================================
        CREATE SESSION
      ===================================================*/

      const session =

        createSession_(

          user

        );

      /*===================================================
        HISTORY
      ===================================================*/

      HistoryService.write(

        "LOGIN",

        sheet,

        user.USER_ID,

        {

          USERNAME :

            normalizedUsername

        }

      );

      /*===================================================
        REMOVE PASSWORD
      ===================================================*/

      delete user.PASSWORD;

      /*===================================================
        SUCCESS
      ===================================================*/

      return Response.success({

        USER : user,

        SESSION : session

      });

    }

    catch(err){

      Logger.error(

        "Auth.login",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    LOGOUT
  =======================================================*/

  function logout(){

    const sheet = getSheet_();

    const cache =

      CacheService

      .getUserCache();

    cache.remove(

      "SESSION"

    );

    HistoryService.write(

      "LOGOUT",

      sheet,

      currentUser_()

    );

    return Response.success();

  }

  /*=======================================================
    SESSION
  =======================================================*/

  function getSession(){

    const cache =

      CacheService

      .getUserCache();

    const session =

      cache.get(

        "SESSION"

      );

    if(!session){

      return null;

    }

    return JSON.parse(

      session

    );

  }

  /*=======================================================
    USER
  =======================================================*/

  function getUser(){

    const session =

      getSession();

    return session ?

      session.USER :

      null;

  }

  /*=======================================================
    CHECK LOGIN
  =======================================================*/

  function check(){

    if(

      !getSession()

    ){

      throw new Error(

        "Session berakhir."

      );

    }

    return true;

  }

  /*=======================================================
    HAS ROLE
  =======================================================*/

  function hasRole(

    role

  ){

    const user =

      getUser();

    if(!user){

      return false;

    }

    return (

      user.ROLE ===

      role

    );

  }

  /*=======================================================
    HAS PERMISSION
  =======================================================*/

  function can(

    permission

  ){

    const config = getConfig_();

    const user =

      getUser();

    if(!user){

      return false;

    }

    const list =

      config.PERMISSION[

        user.ROLE

      ] || [];

    return (

      list.indexOf("*") > -1 ||

      list.indexOf(

        permission

      ) > -1

    );

  }

  /*=======================================================
    CREATE SESSION
  =======================================================*/

  function createSession_(

    user

  ){

    const session = {

      TOKEN :

        Utility.uuid(),

      LOGIN_TIME :

        Utility.now(),

      USER : {

        USER_ID :

          user.USER_ID,

        USERNAME :

          user.USERNAME,

        FULLNAME :

          user.FULLNAME,

        ROLE :

          user.ROLE,

        BRANCH :

          user.BRANCH

      }

    };

    CacheService

      .getUserCache()

      .put(

        "SESSION",

        JSON.stringify(

          session

        ),

        21600

      );

    return session;

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    const user =

      getUser();

    return user ?

      user.USERNAME :

      "SYSTEM";

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    login,

    logout,

    check,

    getUser,

    getSession,

    hasRole,

    can

  };

})();