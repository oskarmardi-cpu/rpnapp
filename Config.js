/*=========================================================
 RPN MANAGEMENT SYSTEM
 Config.gs
 Enterprise Edition v3.1
 SINGLE DATABASE ARCHITECTURE
=========================================================*/

const CONFIG = Object.freeze({

  /*=======================================================
    APPLICATION
  =======================================================*/

  APP : {

    NAME            : "RPN Management System",
    VERSION         : "3.1.0",
    COMPANY         : "PT Kobexindo Equipment",
    TIMEZONE        : "Asia/Jakarta",
    DATE_FORMAT     : "dd/MM/yyyy",
    DATETIME_FORMAT : "dd/MM/yyyy HH:mm:ss",
    CURRENCY        : "IDR",
    LANGUAGE        : "id"

  },


  /*=======================================================
    SPREADSHEET ID
    SINGLE DATABASE
  =======================================================*/

  SPREADSHEET : {

    MASTER :
      "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo",

    TRANSACTION :
      "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo",

    SYSTEM :
      "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo",

    REPORT :
      "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo"

  },


  /*=======================================================
    MASTER / TRANSACTION / SYSTEM SHEETS
  =======================================================*/

  SHEET : {

    ASSET               : "M_ASSET",
    ASSET_INSTANCE      : "M_ASSET_INSTANCE",
    ASSET_RELATION      : "SYS_ASSET_RELATION",
    BRAND               : "M_BRAND",
    MODEL               : "M_MODEL",
    CUSTOMER            : "M_CUSTOMER",
    USER                : "M_USER",
    BRANCH              : "M_BRANCH",
    WAREHOUSE           : "M_WAREHOUSE",
    LOCATION            : "M_LOCATION",
    PART                : "M_PART",
    VENDOR              : "M_VENDOR",
    FAILURE_CODE        : "M_FAILURE_CODE",
    DAMAGE_CODE         : "M_DAMAGE_CODE",
    ACTION_CODE         : "M_ACTION_CODE",

    WORK_ORDER          : "T_WORK_ORDER",
    WORK_ORDER_DETAIL   : "T_WORK_ORDER_DETAIL",
    PULL_OUT            : "T_PULL_OUT",
    RECEIVING           : "T_RECEIVING",
    INSPECTION          : "T_INSPECTION",
    REPAIR              : "T_REPAIR",
    QC                  : "T_QC",
    RENTAL              : "T_RENTAL",
    RETURN              : "T_RETURN",
    TRANSFER            : "T_TRANSFER",
    RESERVATION         : "T_RESERVATION",
    SALES               : "T_SALES",
    EXPORT              : "T_EXPORT",
    SCRAP               : "T_SCRAP",
    LOAN_PART           : "T_LOAN_PART",
    CANNIBAL             : "T_CANNIBAL",
    STOCK_OPNAME        : "T_STOCK_OPNAME",
    STOCK_ADJUSTMENT    : "T_STOCK_ADJUSTMENT",

    EVENT_LEDGER        : "SYS_EVENT_LEDGER",
    ASSET_MOVEMENT      : "SYS_ASSET_MOVEMENT",
    APPROVAL            : "SYS_APPROVAL",
    HISTORY             : "SYS_HISTORY",
    AUDIT               : "SYS_AUDIT",
    NOTIFICATION        : "SYS_NOTIFICATION",
    SEQUENCE            : "SYS_SEQUENCE",
    SETTING             : "SYS_SETTING"

  },


  /*=======================================================
    ASSET TYPE
  =======================================================*/

  ASSET_TYPE : {

    UNIT           : "UNIT",
    BATTERY        : "BATTERY",
    CHARGER        : "CHARGER",
    TROLLEY        : "TROLLEY",
    ATTACHMENT     : "ATTACHMENT",
    SPARE_PART     : "SPARE_PART",
    TYRE           : "TYRE",
    FORK           : "FORK",
    MAST           : "MAST",
    MOTOR          : "MOTOR",
    CONTROLLER     : "CONTROLLER",
    HYDRAULIC_PUMP : "HYDRAULIC_PUMP",
    OTHER          : "OTHER"

  },


  /*=======================================================
    CONDITION
  =======================================================*/

  CONDITION : {

    GOOD    : "GOOD",
    FAIR    : "FAIR",
    POOR    : "POOR",
    DAMAGED : "DAMAGED",
    SCRAP   : "SCRAP"

  },


  /*=======================================================
    OWNERSHIP
  =======================================================*/

  OWNERSHIP : {

    COMPANY  : "COMPANY",
    CUSTOMER : "CUSTOMER",
    VENDOR   : "VENDOR"

  },


  /*=======================================================
    PRIORITY
  =======================================================*/

  PRIORITY : {

    LOW    : "LOW",
    MEDIUM : "MEDIUM",
    HIGH   : "HIGH",
    URGENT : "URGENT"

  },


  /*=======================================================
    STATUS
  =======================================================*/

  STATUS : {

    AVAILABLE    : "AVAILABLE",
    BOOKED       : "BOOKED",
    RESERVED     : "RESERVED",
    READY        : "READY",
    RENTAL       : "RENTAL",
    RETURN       : "RETURN",
    PULL_OUT     : "PULL_OUT",
    RECEIVING    : "RECEIVING",
    INSPECTION   : "INSPECTION",
    REPAIR       : "REPAIR",
    WAITING_PART : "WAITING_PART",
    QC           : "QC",
    TRANSFER     : "TRANSFER",
    CANNIBAL     : "CANNIBAL",
    SOLD         : "SOLD",
    EXPORT       : "EXPORT",
    SCRAP        : "SCRAP",
    LOST         : "LOST",
    HOLD         : "HOLD"

  },


  /*=======================================================
    WORK ORDER STATUS
  =======================================================*/

  WO_STATUS : {

    OPEN             : "OPEN",
    ASSIGNED         : "ASSIGNED",
    ACCEPTED         : "ACCEPTED",
    ON_PROGRESS      : "ON_PROGRESS",
    WAITING_PART     : "WAITING_PART",
    WAITING_APPROVAL : "WAITING_APPROVAL",
    QC               : "QC",
    READY            : "READY",
    FINISHED         : "FINISHED",
    CLOSED           : "CLOSED",
    CANCELLED        : "CANCELLED"

  },


  /*=======================================================
    RESERVATION STATUS
  =======================================================*/

  RESERVATION_STATUS : {

    WAITING   : "WAITING",
    QUEUE     : "QUEUE",
    CONFIRMED : "CONFIRMED",
    BOOKED    : "BOOKED",
    EXPIRED   : "EXPIRED",
    RELEASED  : "RELEASED",
    CANCELLED : "CANCELLED",
    FINISHED  : "FINISHED"

  },


  /*=======================================================
    APPROVAL STATUS
  =======================================================*/

  APPROVAL_STATUS : {

    DRAFT     : "DRAFT",
    PENDING   : "PENDING",
    APPROVED  : "APPROVED",
    REJECTED  : "REJECTED",
    REVISED   : "REVISED",
    CANCELLED : "CANCELLED"

  },


  /*=======================================================
    EVENT
  =======================================================*/

  EVENT : {

    CREATE_ASSET        : "CREATE_ASSET",
    UPDATE_ASSET        : "UPDATE_ASSET",
    PULL_OUT            : "PULL_OUT",
    RECEIVING           : "RECEIVING",
    INSPECTION          : "INSPECTION",
    REPAIR_START        : "REPAIR_START",
    REPAIR_FINISH       : "REPAIR_FINISH",
    WAITING_PART        : "WAITING_PART",
    QC_PASS             : "QC_PASS",
    QC_REJECT           : "QC_REJECT",
    READY               : "READY",
    RENTAL_OUT          : "RENTAL_OUT",
    RENTAL_RETURN       : "RENTAL_RETURN",
    TRANSFER            : "TRANSFER",
    RESERVATION_CREATE  : "RESERVATION_CREATE",
    RESERVATION_CONFIRM : "RESERVATION_CONFIRM",
    SALES               : "SALES",
    EXPORT              : "EXPORT",
    CANNIBAL            : "CANNIBAL",
    SCRAP               : "SCRAP",
    INSTALL_COMPONENT   : "INSTALL_COMPONENT",
    REMOVE_COMPONENT    : "REMOVE_COMPONENT",
    STOCK_OPNAME        : "STOCK_OPNAME",
    STOCK_ADJUSTMENT    : "STOCK_ADJUSTMENT"

  },


  /*=======================================================
    MOVEMENT
  =======================================================*/

  MOVEMENT : {

    IN       : "IN",
    OUT      : "OUT",
    TRANSFER : "TRANSFER",
    INSTALL  : "INSTALL",
    REMOVE   : "REMOVE",
    CANNIBAL : "CANNIBAL"

  },


  /*=======================================================
    NOTIFICATION
  =======================================================*/

  NOTIFICATION : {

    INFO     : "INFO",
    SUCCESS  : "SUCCESS",
    WARNING  : "WARNING",
    ERROR    : "ERROR",
    APPROVAL : "APPROVAL"

  },


  /*=======================================================
    ROLE
  =======================================================*/

  ROLE : {

    ADMIN      : "ADMIN",
    SUPERVISOR : "SUPERVISOR",
    MECHANIC   : "MECHANIC",
    SERVICE    : "SERVICE",
    RENTAL     : "RENTAL",
    SALES      : "SALES",
    INVENTORY  : "INVENTORY",
    WAREHOUSE  : "WAREHOUSE",
    EXPORT     : "EXPORT",
    IMPORT     : "IMPORT",
    MANAGER    : "MANAGER",
    DIRECTOR   : "DIRECTOR",
    CUSTOMER   : "CUSTOMER",
    GUEST      : "GUEST"

  },


  /*=======================================================
    BRANCH
  =======================================================*/

  BRANCH : {

    LEMAHABANG : "LEMAHABANG",
    SURABAYA   : "SURABAYA",
    MEDAN      : "MEDAN"

  },


  /*=======================================================
    WAREHOUSE
  =======================================================*/

  WAREHOUSE : {

    LA_UNIT     : "LA_UNIT",
    LA_BATTERY  : "LA_BATTERY",
    LA_CHARGER  : "LA_CHARGER",
    LA_PART     : "LA_PART",

    SBY_UNIT    : "SBY_UNIT",
    SBY_BATTERY : "SBY_BATTERY",
    SBY_CHARGER : "SBY_CHARGER",
    SBY_PART    : "SBY_PART",

    MDN_UNIT    : "MDN_UNIT",
    MDN_BATTERY : "MDN_BATTERY",
    MDN_CHARGER : "MDN_CHARGER",
    MDN_PART    : "MDN_PART"

  },


  /*=======================================================
    LOCATION
  =======================================================*/

  LOCATION : {

    YARD           : "YARD",
    WORKSHOP       : "WORKSHOP",
    CUSTOMER_SITE  : "CUSTOMER_SITE",
    RENTAL_POOL    : "RENTAL_POOL",
    USED_STOCK     : "USED_STOCK",
    EXPORT_AREA    : "EXPORT_AREA",
    SCRAP_AREA     : "SCRAP_AREA",
    QC_AREA        : "QC_AREA",
    RECEIVING_AREA : "RECEIVING_AREA"

  },


  /*=======================================================
    DOCUMENT
  =======================================================*/

  DOCUMENT : {

    T_WORK_ORDER       : "WORK_ORDER",
    T_PULL_OUT         : "PULL_OUT",
    T_RECEIVING        : "RECEIVING",
    T_INSPECTION       : "INSPECTION",
    T_REPAIR           : "REPAIR",
    T_QC               : "QC",
    T_RENTAL           : "RENTAL",
    T_RETURN           : "RETURN",
    T_TRANSFER         : "TRANSFER",
    T_RESERVATION      : "RESERVATION",
    T_SALES            : "SALES",
    T_EXPORT           : "EXPORT",
    T_SCRAP            : "SCRAP",
    T_CANNIBAL         : "CANNIBAL",
    T_LOAN_PART        : "LOAN_PART",
    T_STOCK_OPNAME     : "STOCK_OPNAME",
    T_STOCK_ADJUSTMENT : "STOCK_ADJUSTMENT",
    SYS_APPROVAL       : "APPROVAL"

  },


  /*=======================================================
    SALES
  =======================================================*/

  SALES_TYPE : {

    LOCAL  : "LOCAL",
    EXPORT : "EXPORT"

  },


  /*=======================================================
    RENTAL
  =======================================================*/

  RENTAL_TYPE : {

    DAILY   : "DAILY",
    WEEKLY  : "WEEKLY",
    MONTHLY : "MONTHLY",
    YEARLY  : "YEARLY"

  },


  /*=======================================================
    CANNIBAL
  =======================================================*/

  CANNIBAL : {

    RENTAL    : "RENTAL",
    SERVICE   : "SERVICE",
    SALES     : "SALES",
    INVENTORY : "INVENTORY"

  },


  /*=======================================================
    COLUMN
  =======================================================*/

  COLUMN : {

    M_ASSET : {

      ID                 : "ASSET_ID",
      TYPE               : "ASSET_TYPE",
      CATEGORY           : "CATEGORY",
      BRAND              : "BRAND",
      MODEL              : "MODEL",
      SERIAL_NUMBER      : "SERIAL_NUMBER",
      MANUFACTURE_NUMBER : "MANUFACTURE_NUMBER",
      DESCRIPTION        : "DESCRIPTION",
      SPECIFICATION      : "SPECIFICATION",
      YEAR               : "YEAR",
      COLOR              : "COLOR",
      ENGINE_NO          : "ENGINE_NO",
      CHASSIS_NO         : "CHASSIS_NO",
      ACTIVE             : "IS_ACTIVE",
      CREATED_AT         : "CREATED_AT",
      CREATED_BY         : "CREATED_BY",
      UPDATED_AT         : "UPDATED_AT",
      UPDATED_BY         : "UPDATED_BY"

    },


    M_ASSET_INSTANCE : {

      ID                  : "INSTANCE_ID",
      ASSET_ID            : "ASSET_ID",
      CURRENT_STATUS      : "CURRENT_STATUS",
      CURRENT_BRANCH      : "CURRENT_BRANCH",
      CURRENT_WAREHOUSE   : "CURRENT_WAREHOUSE",
      CURRENT_LOCATION    : "CURRENT_LOCATION",
      CURRENT_CUSTOMER    : "CURRENT_CUSTOMER",
      CURRENT_WO          : "CURRENT_WO",
      CURRENT_RESERVATION : "CURRENT_RESERVATION",
      CURRENT_OWNER       : "CURRENT_OWNER",
      CONDITION           : "CURRENT_CONDITION",
      HEALTH_SCORE        : "HEALTH_SCORE",
      HOUR_METER          : "HOUR_METER",
      ODOMETER            : "ODOMETER",
      LAST_EVENT          : "LAST_EVENT",
      LAST_MOVEMENT       : "LAST_MOVEMENT",
      UPDATED_AT          : "UPDATED_AT",
      UPDATED_BY          : "UPDATED_BY"

    },


    M_USER : {

      ID       : "USER_ID",
      USERNAME : "USERNAME",
      PASSWORD : "PASSWORD",
      FULLNAME : "FULLNAME",
      EMAIL    : "EMAIL",
      PHONE    : "PHONE",
      ROLE     : "ROLE",
      BRANCH   : "BRANCH",
      ACTIVE   : "IS_ACTIVE"

    },


    M_CUSTOMER : {

      ID      : "CUSTOMER_ID",
      CODE    : "CUSTOMER_CODE",
      NAME    : "CUSTOMER_NAME",
      ADDRESS : "ADDRESS",
      CITY    : "CITY",
      PIC     : "PIC",
      PHONE   : "PHONE",
      EMAIL   : "EMAIL"

    },


    T_WORK_ORDER : {

      ID          : "WO_ID",
      NUMBER      : "WO_NUMBER",
      ASSET_ID    : "ASSET_ID",
      CUSTOMER_ID : "CUSTOMER_ID",
      BRANCH      : "BRANCH",
      STATUS      : "STATUS",
      MECHANIC    : "MECHANIC",
      SUPERVISOR  : "SUPERVISOR",
      PRIORITY    : "PRIORITY",
      START_DATE  : "START_DATE",
      FINISH_DATE : "FINISH_DATE"

    },


    T_WORK_ORDER_DETAIL : {

      ID           : "DETAIL_ID",
      WO_ID        : "WO_ID",
      PART_NUMBER  : "PART_NUMBER",
      PART_NAME    : "PART_NAME",
      QTY          : "QTY",
      PRICE        : "PRICE",
      TOTAL        : "TOTAL",
      FAILURE_CODE : "FAILURE_CODE",
      DAMAGE_CODE  : "DAMAGE_CODE",
      ACTION_CODE  : "ACTION_CODE"

    },


    T_RESERVATION : {

      ID           : "RESERVATION_ID",
      NUMBER       : "RESERVATION_NO",
      ASSET_ID     : "ASSET_ID",
      CUSTOMER_ID  : "CUSTOMER_ID",
      SALES_ID     : "SALES_ID",
      QUEUE        : "QUEUE_NO",
      STATUS       : "STATUS",
      SALES_ORDER  : "SALES_ORDER_NO",
      REQUEST_DATE : "REQUEST_DATE",
      EXPIRED_DATE : "EXPIRED_DATE"

    },


    SYS_ASSET_RELATION : {

      ID         : "RELATION_ID",
      PARENT     : "PARENT_ASSET_ID",
      CHILD      : "CHILD_ASSET_ID",
      TYPE       : "RELATION_TYPE",
      START_DATE : "START_DATE",
      END_DATE   : "END_DATE",
      ACTIVE     : "ACTIVE"

    },


    SYS_EVENT_LEDGER : {

      ID          : "EVENT_ID",
      NUMBER      : "EVENT_NO",
      TYPE        : "EVENT_TYPE",
      REFERENCE   : "REFERENCE_NO",
      ASSET_ID    : "ASSET_ID",
      DOCUMENT_NO : "DOCUMENT_NO",
      STATUS      : "STATUS",
      BRANCH      : "BRANCH",
      LOCATION    : "LOCATION",
      USER        : "USERNAME",
      DATE        : "EVENT_DATE",
      CREATED_AT  : "CREATED_AT"

    },


    SYS_ASSET_MOVEMENT : {

      ID            : "MOVEMENT_ID",
      EVENT_ID      : "EVENT_ID",
      ASSET_ID      : "ASSET_ID",
      FROM_BRANCH   : "FROM_BRANCH",
      TO_BRANCH     : "TO_BRANCH",
      FROM_WAREHOUSE : "FROM_WAREHOUSE",
      TO_WAREHOUSE   : "TO_WAREHOUSE",
      FROM_LOCATION  : "FROM_LOCATION",
      TO_LOCATION    : "TO_LOCATION",
      FROM_STATUS    : "FROM_STATUS",
      TO_STATUS      : "TO_STATUS",
      MOVEMENT_DATE  : "MOVEMENT_DATE"

    },


    SYS_APPROVAL : {

      ID           : "APPROVAL_ID",
      NUMBER       : "APPROVAL_NO",
      DOCUMENT_NO  : "DOCUMENT_NO",
      DOCUMENT_TYPE : "DOCUMENT_TYPE",
      LEVEL        : "LEVEL",
      APPROVER     : "APPROVER",
      STATUS       : "STATUS",
      REMARK       : "REMARK",
      REQUEST_DATE : "REQUEST_DATE",
      APPROVED_DATE : "APPROVED_DATE"

    },


    SYS_HISTORY : {

      ID         : "HISTORY_ID",
      MODULE     : "MODULE",
      ACTION     : "ACTION",
      REFERENCE  : "REFERENCE",
      DATA       : "DATA",
      USERNAME   : "USERNAME",
      CREATED_AT : "CREATED_AT"

    },


    SYS_AUDIT : {

      ID          : "AUDIT_ID",
      MODULE      : "MODULE",
      ACTION      : "ACTION",
      REFERENCE   : "REFERENCE",
      BEFORE_DATA : "BEFORE_DATA",
      AFTER_DATA  : "AFTER_DATA",
      USERNAME    : "USERNAME",
      IP_ADDRESS  : "IP_ADDRESS",
      CREATED_AT  : "CREATED_AT"

    },


    SYS_NOTIFICATION : {

      ID         : "NOTIFICATION_ID",
      TITLE      : "TITLE",
      MESSAGE    : "MESSAGE",
      USER_ID    : "USER_ID",
      MODULE     : "MODULE",
      REFERENCE  : "REFERENCE_ID",
      TYPE       : "TYPE",
      STATUS     : "STATUS",
      CREATED_AT : "CREATED_AT"

    },


    SYS_SEQUENCE : {

      TYPE        : "DOCUMENT_TYPE",
      PREFIX      : "PREFIX",
      YEAR        : "YEAR",
      MONTH       : "MONTH",
      LAST_NUMBER : "LAST_NUMBER"

    }

  },


  /*=======================================================
    REQUIRED
  =======================================================*/

  REQUIRED : {

    M_ASSET : [
      "ASSET_ID",
      "ASSET_TYPE",
      "SERIAL_NUMBER"
    ],

    M_ASSET_INSTANCE : [
      "INSTANCE_ID",
      "ASSET_ID"
    ],

    M_USER : [
      "USER_ID",
      "USERNAME",
      "ROLE"
    ],

    T_WORK_ORDER : [
      "ASSET_ID",
      "CUSTOMER_ID",
      "BRANCH"
    ],

    T_WORK_ORDER_DETAIL : [
      "WO_ID",
      "PART_NUMBER"
    ],

    T_RESERVATION : [
      "ASSET_ID",
      "CUSTOMER_ID"
    ]

  },


  /*=======================================================
    PERMISSION
  =======================================================*/

  PERMISSION : {

    ADMIN : [
      "*"
    ],

    SUPERVISOR : [
      "WORK_ORDER",
      "APPROVAL",
      "REPORT",
      "RESERVATION",
      "MASTER"
    ],

    MECHANIC : [
      "WORK_ORDER",
      "UPDATE_STATUS",
      "UPLOAD_PHOTO"
    ],

    SALES : [
      "RESERVATION",
      "SALES",
      "REPORT"
    ],

    RENTAL : [
      "RENTAL",
      "RETURN",
      "TRANSFER"
    ],

    INVENTORY : [
      "PART",
      "CANNIBAL",
      "STOCK"
    ],

    WAREHOUSE : [
      "RECEIVING",
      "TRANSFER",
      "LOCATION"
    ],

    EXPORT : [
      "EXPORT",
      "REPORT"
    ],

    MANAGER : [
      "REPORT",
      "APPROVAL",
      "DASHBOARD"
    ]

  },


  /*=======================================================
    WORKFLOW
  =======================================================*/

  WORKFLOW : {

    RENTAL : [
      "PULL_OUT",
      "RECEIVING",
      "INSPECTION",
      "REPAIR",
      "WAITING_PART",
      "QC",
      "READY",
      "BOOKED",
      "RENTAL",
      "RETURN"
    ],

    USED : [
      "READY",
      "BOOKED",
      "SALES",
      "EXPORT"
    ],

    SCRAP : [
      "INSPECTION",
      "SCRAP"
    ],

    CANNIBAL : [
      "READY",
      "CANNIBAL",
      "READY"
    ]

  },


  /*=======================================================
    DASHBOARD
  =======================================================*/

  DASHBOARD : {

    AUTO_REFRESH_SECOND : 30,
    SHOW_NOTIFICATION    : true,
    SHOW_KPI             : true,
    SHOW_BRANCH          : true,
    SHOW_POPULATION      : true,
    SHOW_WORKORDER       : true,
    SHOW_RENTAL          : true,
    SHOW_RESERVATION     : true,
    SHOW_EXPORT          : true,
    SHOW_SALES           : true,
    SHOW_WAITING_PART    : true,
    SHOW_SCRAP           : true

  },


  /*=======================================================
    REPORT
  =======================================================*/

  REPORT : {

    COMPANY_LOGO       : true,
    COMPANY_NAME       : true,
    SHOW_SIGNATURE     : true,
    SHOW_QR_CODE       : true,
    SHOW_GENERATED_TIME : true,
    SHOW_GENERATED_BY  : true,
    DATE_FORMAT        : "dd/MM/yyyy",
    PAPER              : "A4",
    ORIENTATION        : "PORTRAIT"

  },


  /*=======================================================
    WHATSAPP
  =======================================================*/

  WHATSAPP : {

    ENABLED            : true,
    AUTO_NOTIFICATION  : true,
    AUTO_APPROVAL      : false,
    AUTO_STATUS_UPDATE : true,
    AUTO_SEND_REPORT   : true,
    MAX_PHOTO          : 10

  },


  /*=======================================================
    CACHE
  =======================================================*/

  CACHE : {

    ENABLED           : true,
    MASTER_TTL        : 3600,
    TRANSACTION_TTL   : 300,
    DASHBOARD_TTL     : 60

  },


  /*=======================================================
    SYSTEM
  =======================================================*/

  SYSTEM : {

    AUTO_AUDIT          : true,
    AUTO_HISTORY        : true,
    AUTO_EVENT_LEDGER   : true,
    AUTO_MOVEMENT       : true,
    AUTO_NUMBERING      : true,
    AUTO_NOTIFICATION   : true,
    AUTO_REFRESH_STATUS : true,
    SOFT_DELETE         : true,
    DEBUG               : false

  },


  /*=======================================================
    FILE
  =======================================================*/

  FILE : {

    IMAGE_FOLDER  : "",
    REPORT_FOLDER : "",
    EXPORT_FOLDER : "",
    TEMP_FOLDER   : ""

  },


  /*=======================================================
    PAGINATION
  =======================================================*/

  PAGINATION : {

    DEFAULT_LIMIT : 20,
    MAX_LIMIT     : 100,
    DEFAULT_PAGE  : 1

  },


  /*=======================================================
    FORMAT
  =======================================================*/

  FORMAT : {

    DATE     : "dd/MM/yyyy",
    DATETIME : "dd/MM/yyyy HH:mm:ss",
    TIME     : "HH:mm:ss",
    CURRENCY : "#,##0",
    PERCENT  : "0.00%"

  },


  /*=======================================================
    VERSION
  =======================================================*/

  VERSION : {

    SYSTEM   : "3.1.0",
    DATABASE : "3.1.0",
    API      : "3.1.0",
    BUILD    : "Enterprise"

  }

});