/*=========================================================
 RPN MANAGEMENT SYSTEM
 KPIEngine.gs
 Enterprise Edition v4.0
=========================================================*/

const KPIEngine = (() => {

  "use strict";

  /*=======================================================
    CALCULATE
  =======================================================*/

  function calculate(){

    return {

      RENTAL :

        rental(),

      WORKSHOP :

        workshop(),

      USED :

        used(),

      EXPORT :

        exportKPI(),

      INVENTORY :

        inventory(),

      MECHANIC :

        mechanic(),

      BRANCH :

        branch()

    };

  }

  /*=======================================================
    RENTAL KPI
  =======================================================*/

  function rental(){

    const data = Repository.all(

      Database.TRANSACTION,

      CONFIG.SHEET.RENTAL

    );

    return {

      TOTAL :

        data.length,

      ACTIVE :

        data.filter(

          x=>x.STATUS==="OPEN"

        ).length,

      FINISHED :

        data.filter(

          x=>x.STATUS==="FINISHED"

        ).length,

      UTILIZATION :

        utilization()

    };

  }

  /*=======================================================
    WORKSHOP KPI
  =======================================================*/

  function workshop(){

    const wo = Repository.all(

      Database.TRANSACTION,

      CONFIG.SHEET.WORK_ORDER

    );

    return {

      TOTAL :

        wo.length,

      OPEN :

        wo.filter(

          x=>x.STATUS==="OPEN"

        ).length,

      WAITING_PART :

        wo.filter(

          x=>x.STATUS==="WAITING_PART"

        ).length,

      FINISHED :

        wo.filter(

          x=>x.STATUS==="FINISHED"

        ).length

    };

  }

  /*=======================================================
    USED KPI
  =======================================================*/

  function used(){

    return {

      READY :

        PopulationEngine.used().length,

      BOOKED :

        StockEngine.booked(

          CONFIG.ASSET_TYPE.UNIT

        ).length,

      SOLD :

        Repository.find(

          Database.TRANSACTION,

          CONFIG.SHEET.SALES,

          x=>x.STATUS==="FINISHED"

        ).length

    };

  }

  /*=======================================================
    EXPORT KPI
  =======================================================*/

  function exportKPI(){

    const data = Repository.all(

      Database.TRANSACTION,

      CONFIG.SHEET.EXPORT

    );

    return {

      BOOKING :

        data.filter(

          x=>x.STATUS==="BOOKING"

        ).length,

      LOADING :

        data.filter(

          x=>x.STATUS==="LOADING"

        ).length,

      SHIPPING :

        data.filter(

          x=>x.STATUS==="BL"

        ).length,

      FINISHED :

        data.filter(

          x=>x.STATUS==="FINISHED"

        ).length

    };

  }

  /*=======================================================
    INVENTORY KPI
  =======================================================*/

  function inventory(){

    return {

      READY :

        StockEngine.summary()

    };

  }

  /*=======================================================
    MECHANIC KPI
  =======================================================*/

  function mechanic(){

    const wo = Repository.all(

      Database.TRANSACTION,

      CONFIG.SHEET.WORK_ORDER

    );

    const result = {};

    wo.forEach(function(item){

      if(!result[item.MECHANIC]){

        result[item.MECHANIC] = {

          OPEN : 0,

          FINISHED : 0

        };

      }

      if(item.STATUS==="FINISHED"){

        result[item.MECHANIC]

          .FINISHED++;

      }else{

        result[item.MECHANIC]

          .OPEN++;

      }

    });

    return result;

  }

  /*=======================================================
    BRANCH KPI
  =======================================================*/

  function branch(){

    return {

      LEMAHABANG :

        PopulationEngine.branch(

          CONFIG.BRANCH.LEMAHABANG

        ),

      SURABAYA :

        PopulationEngine.branch(

          CONFIG.BRANCH.SURABAYA

        ),

      MEDAN :

        PopulationEngine.branch(

          CONFIG.BRANCH.MEDAN

        )

    };

  }

  /*=======================================================
    UTILIZATION
  =======================================================*/

  function utilization(){

    const total =

      PopulationEngine.summary()

      .UNIT.TOTAL;

    const rental =

      PopulationEngine.rental()

      .length;

    if(total===0){

      return 0;

    }

    return Number(

      (

        rental /

        total *

        100

      ).toFixed(2)

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return{

    calculate,

    rental,

    workshop,

    used,

    export : exportKPI,

    inventory,

    mechanic,

    branch

  };

})();