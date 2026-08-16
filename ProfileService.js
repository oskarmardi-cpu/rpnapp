/*=========================================================
 RPN MANAGEMENT SYSTEM
 ProfileService.gs
 Enterprise Edition v2.0
=========================================================*/

const ProfileService = (() => {

  "use strict";

  const DATABASE = Database.MASTER;

  const SHEET = CONFIG.SHEET.USER;

  /*=======================================================
    GET PROFILE
  =======================================================*/

  function getProfile(username){

    try{

      const profile = Repository.first(

        DATABASE,

        SHEET,

        item => item.USERNAME === username

      );

      if(!profile){

        return Response.error(

          "User tidak ditemukan."

        );

      }

      delete profile.PASSWORD;

      return Response.success(profile);

    }

    catch(err){

      Logger.error(

        "ProfileService.getProfile",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    UPDATE PROFILE
  =======================================================*/

  function updateProfile(

    username,

    object

  ){

    try{

      const find = SpreadsheetService.find(

        DATABASE,

        SHEET,

        CONFIG.COLUMN.USER.USERNAME,

        username

      );

      if(!find){

        return Response.error(

          "User tidak ditemukan."

        );

      }

      const profile = find.object;

      Object.assign(

        profile,

        object

      );

      profile.UPDATED_AT =

        Utility.now();

      profile.UPDATED_BY =

        currentUser_();

      Repository.update(

        DATABASE,

        SHEET,

        find.row,

        SpreadsheetService.getHeader(

          DATABASE,

          SHEET

        ),

        profile

      );

      HistoryService.write(

        "UPDATE_PROFILE",

        SHEET,

        username,

        profile

      );

      return Response.success(profile);

    }

    catch(err){

      Logger.error(

        "ProfileService.updateProfile",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    CHANGE PASSWORD
  =======================================================*/

  function changePassword(

    username,

    oldPassword,

    newPassword

  ){

    try{

      const find = SpreadsheetService.find(

        DATABASE,

        SHEET,

        CONFIG.COLUMN.USER.USERNAME,

        username

      );

      if(!find){

        return Response.error(

          "User tidak ditemukan."

        );

      }

      const profile = find.object;

      if(

        profile.PASSWORD !==

        Utility.sha256(

          oldPassword

        )

      ){

        return Response.error(

          "Password lama salah."

        );

      }

      profile.PASSWORD =

        Utility.sha256(

          newPassword

        );

      profile.CHANGE_PASSWORD_AT =

        Utility.now();

      Repository.update(

        DATABASE,

        SHEET,

        find.row,

        SpreadsheetService.getHeader(

          DATABASE,

          SHEET

        ),

        profile

      );

      HistoryService.write(

        "CHANGE_PASSWORD",

        SHEET,

        username

      );

      return Response.success({

        message :

        "Password berhasil diubah."

      });

    }

    catch(err){

      Logger.error(

        "ProfileService.changePassword",

        err

      );

      return Response.error(err);

    }

  }

  /*=======================================================
    CHANGE PHOTO
  =======================================================*/

  function changePhoto(

    username,

    photo

  ){

    return updateProfile(

      username,

      {

        PHOTO : photo

      }

    );

  }

  /*=======================================================
    CHANGE SIGNATURE
  =======================================================*/

  function changeSignature(

    username,

    signature

  ){

    return updateProfile(

      username,

      {

        SIGNATURE : signature

      }

    );

  }

  /*=======================================================
    CHANGE WHATSAPP
  =======================================================*/

  function changeWhatsApp(

    username,

    phone

  ){

    return updateProfile(

      username,

      {

        PHONE : phone

      }

    );

  }

  /*=======================================================
    CHANGE EMAIL
  =======================================================*/

  function changeEmail(

    username,

    email

  ){

    return updateProfile(

      username,

      {

        EMAIL : email

      }

    );

  }

  /*=======================================================
    CURRENT USER
  =======================================================*/

  function currentUser_(){

    try{

      return Auth.getUser().username;

    }

    catch(e){

      return "SYSTEM";

    }

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    getProfile,

    updateProfile,

    changePassword,

    changePhoto,

    changeSignature,

    changeWhatsApp,

    changeEmail

  };

})();