/*=========================================================
 RPN MANAGEMENT SYSTEM
 RuleEngine.gs
 Enterprise Edition v1.0
=========================================================*/

const RuleEngine = (() => {

  "use strict";

  /*=======================================================
    VALIDATE REQUIRED
  =======================================================*/

  function required(

    object,

    fields

  ){

    fields.forEach(function(field){

      if(

        Utility.isEmpty(

          object[field]

        )

      ){

        throw new Error(

          field +

          " wajib diisi."

        );

      }

    });

    return true;

  }

  /*=======================================================
    VALIDATE UNIQUE
  =======================================================*/

  function unique(

    database,

    sheet,

    column,

    value,

    message

  ){

    if(

      Database.exists(

        database,

        sheet,

        column,

        value

      )

    ){

      throw new Error(

        message ||

        "Data sudah ada."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE EXISTS
  =======================================================*/

  function exists(

    database,

    sheet,

    column,

    value,

    message

  ){

    if(

      !Database.exists(

        database,

        sheet,

        column,

        value

      )

    ){

      throw new Error(

        message ||

        "Data tidak ditemukan."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE STATUS
  =======================================================*/

  function status(

    current,

    allowed

  ){

    if(

      allowed.indexOf(

        current

      ) === -1

    ){

      throw new Error(

        "Status tidak valid."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE APPROVAL
  =======================================================*/

  function approval(

    role,

    allowedRole

  ){

    if(

      allowedRole.indexOf(

        role

      ) === -1

    ){

      throw new Error(

        "Anda tidak memiliki hak akses."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE DATE
  =======================================================*/

  function date(

    value

  ){

    if(

      !(value instanceof Date)

    ){

      throw new Error(

        "Tanggal tidak valid."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE NUMBER
  =======================================================*/

  function number(

    value

  ){

    if(

      isNaN(value)

    ){

      throw new Error(

        "Harus berupa angka."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE POSITIVE
  =======================================================*/

  function positive(

    value

  ){

    number(value);

    if(

      Number(value) < 0

    ){

      throw new Error(

        "Nilai tidak boleh negatif."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE ARRAY
  =======================================================*/

  function array(

    value

  ){

    if(

      !Array.isArray(

        value

      )

    ){

      throw new Error(

        "Harus berupa Array."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE OBJECT
  =======================================================*/

  function object(

    value

  ){

    if(

      typeof value !== "object" ||

      value === null

    ){

      throw new Error(

        "Harus berupa Object."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE SERIAL NUMBER
  =======================================================*/

  function serialNumber(

    serial

  ){

    if(

      Utility.isEmpty(serial)

    ){

      throw new Error(

        "Serial Number wajib diisi."

      );

    }

    return true;

  }

  /*=======================================================
    VALIDATE WORK ORDER
  =======================================================*/

  function workOrder(

    object

  ){

    required(

      object,

      [

        "WO_NUMBER",

        "ASSET_ID",

        "BRANCH",

        "MECHANIC",

        "SUPERVISOR"

      ]

    );

    return true;

  }

  /*=======================================================
    VALIDATE ASSET
  =======================================================*/

  function asset(

    object

  ){

    required(

      object,

      [

        "ASSET_ID",

        "SERIAL_NUMBER",

        "ASSET_TYPE"

      ]

    );

    return true;

  }

  /*=======================================================
    VALIDATE TRANSACTION
  =======================================================*/

  function transaction(

    object

  ){

    required(

      object,

      [

        "DOCUMENT_NO",

        "DATE",

        "STATUS"

      ]

    );

    return true;

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    required,

    unique,

    exists,

    status,

    approval,

    date,

    number,

    positive,

    array,

    object,

    serialNumber,

    workOrder,

    asset,

    transaction

  };

})();