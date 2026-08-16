/*=========================================================
 RPN MANAGEMENT SYSTEM
 PermissionEngine.gs
 Enterprise Edition v3.0
=========================================================*/

const PermissionEngine = (() => {

  "use strict";

  /*=======================================================
    CHECK LOGIN
  =======================================================*/

  function authenticated(){

    Auth.check();

    return true;

  }

  /*=======================================================
    CHECK ROLE
  =======================================================*/

  function role(role){

    authenticated();

    if(

      !Auth.hasRole(role)

    ){

      throw new Error(

        "Role tidak memiliki hak akses."

      );

    }

    return true;

  }

  /*=======================================================
    CHECK PERMISSION
  =======================================================*/

  function permission(permission){

    authenticated();

    if(

      !Auth.can(permission)

    ){

      throw new Error(

        "Permission ditolak : " +

        permission

      );

    }

    return true;

  }

  /*=======================================================
    CHECK BRANCH
  =======================================================*/

  function branch(branch){

    authenticated();

    const user =

      Auth.getUser();

    if(

      user.ROLE ===

      CONFIG.ROLE.ADMIN

    ){

      return true;

    }

    if(

      user.BRANCH !==

      branch

    ){

      throw new Error(

        "Branch tidak sesuai."

      );

    }

    return true;

  }

  /*=======================================================
    CHECK OWNERSHIP
  =======================================================*/

  function ownership(

    username

  ){

    authenticated();

    const user =

      Auth.getUser();

    if(

      user.ROLE ===

      CONFIG.ROLE.ADMIN

    ){

      return true;

    }

    if(

      user.USERNAME !==

      username

    ){

      throw new Error(

        "Data bukan milik user."

      );

    }

    return true;

  }

  /*=======================================================
    CHECK APPROVAL
  =======================================================*/

  function approval(){

    permission(

      "APPROVAL"

    );

  }

  /*=======================================================
    CHECK REPORT
  =======================================================*/

  function report(){

    permission(

      "REPORT"

    );

  }

  /*=======================================================
    CHECK MASTER
  =======================================================*/

  function master(){

    permission(

      "MASTER"

    );

  }

  /*=======================================================
    CHECK TRANSACTION
  =======================================================*/

  function transaction(){

    permission(

      "TRANSACTION"

    );

  }

  /*=======================================================
    CHECK EXPORT
  =======================================================*/

  function exportData(){

    permission(

      "EXPORT"

    );

  }

  /*=======================================================
    CHECK SALES
  =======================================================*/

  function sales(){

    permission(

      "SALES"

    );

  }

  /*=======================================================
    CHECK RENTAL
  =======================================================*/

  function rental(){

    permission(

      "RENTAL"

    );

  }

  /*=======================================================
    CHECK INVENTORY
  =======================================================*/

  function inventory(){

    permission(

      "INVENTORY"

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    authenticated,

    role,

    permission,

    branch,

    ownership,

    approval,

    report,

    master,

    transaction,

    exportData,

    sales,

    rental,

    inventory

  };

})();