/*=========================================================
 RPN SYSTEM
 DashboardService.gs
 Enterprise Edition - LIVE DATA FINAL
=========================================================*/

const DashboardService = (() => {

  "use strict";


  /*=======================================================
    HELPER
  =======================================================*/

  function text_(value) {

    return String(
      value == null ? "" : value
    ).trim();

  }


  function upper_(value) {

    return text_(value).toUpperCase();

  }


  function isTrue_(value) {

    const v = upper_(value);

    return (
      value === true ||
      v === "TRUE" ||
      v === "1" ||
      v === "YES"
    );

  }


  /*=======================================================
    SAFE SELECT
  =======================================================*/

  function select_(sheetName) {

    try {

      return Database.select(
        Database.MASTER,
        sheetName
      ) || [];

    }

    catch (err) {

      Logger.error(
        "DashboardService.select",
        {
          sheet: sheetName,
          error: err
        }
      );

      return [];

    }

  }


  /*=======================================================
    ACTIVE UNIT
  =======================================================*/

  function getUnits_() {

    const assets =
      select_(
        CONFIG.SHEET.ASSET
      );


    const instances =
      select_(
        CONFIG.SHEET.ASSET_INSTANCE
      );


    const unitAsset = {};


    assets.forEach(
      function(asset) {

        if (

          upper_(asset.ASSET_TYPE) ===
          upper_(CONFIG.ASSET_TYPE.UNIT)

        ) {

          unitAsset[
            text_(asset.ASSET_ID)
          ] = asset;

        }

      }
    );


    return instances.filter(
      function(instance) {

        const asset =
          unitAsset[
            text_(instance.ASSET_ID)
          ];


        if (!asset) {

          return false;

        }


        if (

          asset.IS_ACTIVE !== "" &&

          !isTrue_(
            asset.IS_ACTIVE
          )

        ) {

          return false;

        }


        const status =
          upper_(
            instance.CURRENT_STATUS
          );


        return (

          status !== "SOLD" &&

          status !== "SCRAP" &&

          status !== "EXPORT" &&

          status !== "LOST"

        );

      }
    );

  }


  /*=======================================================
    KPI UNIT
  =======================================================*/

  function getUnitKPI_(units) {

    let rfu = 0;


    units.forEach(
      function(unit) {

        const status =
          upper_(
            unit.CURRENT_STATUS
          );


        const condition =
          upper_(
            unit.CURRENT_CONDITION
          );


        if (

          status === "READY" ||

          status === "RFU" ||

          condition === "RFU"

        ) {

          rfu++;

        }

      }
    );


    return {

      totalUnit:
        units.length,

      rfu:
        rfu,

      nonRfu:
        Math.max(
          0,
          units.length - rfu
        )

    };

  }


  /*=======================================================
    MOVEMENT DATA
  =======================================================*/

  function getMovement_() {

    return select_(
      CONFIG.SHEET.ASSET_MOVEMENT
    );

  }


  /*=======================================================
    UNIT DITARIK
    Source: movement TO_STATUS = PULL_OUT
  =======================================================*/

  function getUnitDitarik_(movement) {

    return movement.filter(
      function(item) {

        return (

          upper_(
            item.TO_STATUS
          ) === "PULL_OUT"

        );

      }
    ).length;

  }


  /*=======================================================
    UNIT DIKIRIM
    Source:
    movement menuju branch/location/customer
    dengan status operasional aktif.
  =======================================================*/

  function getUnitDikirim_(movement) {

    return movement.filter(
      function(item) {

        const toStatus =
          upper_(
            item.TO_STATUS
          );


        const toBranch =
          text_(
            item.TO_BRANCH
          );


        const toLocation =
          text_(
            item.TO_LOCATION
          );


        if (

          toStatus === "RENTAL" ||

          toStatus === "READY"

        ) {

          return true;

        }


        return !!(
          toBranch ||
          toLocation
        );

      }
    ).length;

  }


  /*=======================================================
    LOAN PART
  =======================================================*/

  function getLoanPart_() {

    const rows =
      select_(
        CONFIG.SHEET.LOAN_PART
      );


    return rows.filter(
      function(item) {

        const status =
          upper_(
            item.STATUS
          );


        return (

          status === "REQUESTED" ||

          status === "APPROVED" ||

          status === "LOANED"

        );

      }
    ).length;

  }


  /*=======================================================
    MONTHLY TRANSACTION
  =======================================================*/

  function getMonthly_(
    movement
  ) {

    const result = [

      0, 0, 0, 0,

      0, 0, 0, 0,

      0, 0, 0, 0

    ];


    movement.forEach(
      function(item) {

        if (!item.MOVEMENT_DATE) {

          return;

        }


        const date =
          new Date(
            item.MOVEMENT_DATE
          );


        if (
          isNaN(
            date.getTime()
          )
        ) {

          return;

        }


        const month =
          date.getMonth();


        if (
          month >= 0 &&
          month <= 11
        ) {

          result[month]++;

        }

      }
    );


    return result;

  }


  /*=======================================================
    RECENT ACTIVITY
  =======================================================*/

  function getActivity_() {

    const rows =
      select_(
        CONFIG.SHEET.EVENT_LEDGER
      );


    rows.sort(
      function(a, b) {

        const da =
          new Date(
            a.CREATED_AT ||
            a.EVENT_DATE ||
            0
          ).getTime();


        const db =
          new Date(
            b.CREATED_AT ||
            b.EVENT_DATE ||
            0
          ).getTime();


        return db - da;

      }
    );


    return rows
      .slice(0, 5)
      .map(
        function(item) {

          return {

            title:
              item.EVENT_TYPE ||
              "Activity",

            description:
              item.DOCUMENT_NO ||
              item.REFERENCE_NO ||
              "",

            time:
              item.EVENT_DATE ||
              item.CREATED_AT ||
              ""

          };

        }
      );

  }


  /*=======================================================
    CHART
  =======================================================*/

  function buildChart_(
    kpi,
    monthly
  ) {

    return {

      status: {

        labels: [

          "RFU",

          "NON RFU",

          "Loan"

        ],

        datasets: [

          {

            data: [

              kpi.rfu,

              kpi.nonRfu,

              kpi.loanPart

            ]

          }

        ]

      },


      monthly: {

        labels: [

          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "Mei",
          "Jun",
          "Jul",
          "Ags",
          "Sep",
          "Okt",
          "Nov",
          "Des"

        ],

        datasets: [

          {

            label:
              "Transaction",

            data:
              monthly

          }

        ]

      }

    };

  }


  /*=======================================================
    DASHBOARD
  =======================================================*/

  function getDashboard() {

    try {

      Auth.check();


      const user =
        Auth.getUser() || {};


      const units =
        getUnits_();


      const unitKpi =
        getUnitKPI_(
          units
        );


      const movement =
        getMovement_();


      const unitDitarik =
        getUnitDitarik_(
          movement
        );


      const unitDikirim =
        getUnitDikirim_(
          movement
        );


      const loanPart =
        getLoanPart_();


      const monthly =
        getMonthly_(
          movement
        );


      const dashboard = {

        user: {

          id:
            user.USER_ID || "",

          username:
            user.USERNAME || "",

          name:
            user.FULLNAME ||
            "Administrator",

          role:
            user.ROLE || "",

          branch:
            user.BRANCH || ""

        },


        kpi: {

          totalUnit:
            unitKpi.totalUnit,

          unitDitarik:
            unitDitarik,

          unitDikirim:
            unitDikirim,

          rfu:
            unitKpi.rfu,

          nonRfu:
            unitKpi.nonRfu,

          loanPart:
            loanPart

        },


        chart:
          buildChart_(
            {
              rfu:
                unitKpi.rfu,

              nonRfu:
                unitKpi.nonRfu,

              loanPart:
                loanPart
            },

            monthly

          ),


        activity:
          getActivity_(),


        report: []

      };


      Logger.info(

        "DashboardService",

        "LIVE DATA LOADED",

        {

          totalUnit:
            unitKpi.totalUnit,

          unitDitarik:
            unitDitarik,

          unitDikirim:
            unitDikirim,

          rfu:
            unitKpi.rfu,

          nonRfu:
            unitKpi.nonRfu,

          loanPart:
            loanPart

        }

      );


      return Response.success(

        dashboard,

        "Dashboard berhasil dimuat."

      );

    }


    catch (err) {

      Logger.error(

        "DashboardService",

        err

      );


      return Response.error(
        err
      );

    }

  }


  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    getDashboard

  };

})();