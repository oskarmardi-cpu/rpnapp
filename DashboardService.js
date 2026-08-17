/*=========================================================
 RPN SYSTEM
 DashboardService.gs
 Enterprise Edition - LIVE POPULATION KPI
=========================================================*/
const DashboardService = (() => {
  "use strict";

  const POPULATION_SPREADSHEET_ID = "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo";
  const POPULATION_SHEETS = [
    "POPULASI UNIT USED LEMAH ABANG",
    "POPULASI UNIT USED SURABAYA",
    "POPULASI UNIT USED MEDAN",
    "POPULASI UNIT USED SEMARANG"
  ];

  function text_(value) { return String(value == null ? "" : value).trim(); }
  function upper_(value) { return text_(value).toUpperCase().replace(/\s+/g, " "); }

  function select_(sheetName) {
    try { return Database.select(Database.MASTER, sheetName) || []; }
    catch (err) { Logger.error("DashboardService.select", {sheet: sheetName, error: err}); return []; }
  }

  function findHeaderRow_(values) {
    for (let r = 0; r < values.length; r++) if (upper_(values[r][0]) === "NO") return r;
    return -1;
  }

  function findColumn_(headers, names) {
    const wanted = names.map(upper_);
    for (let i = 0; i < headers.length; i++) if (wanted.indexOf(upper_(headers[i])) >= 0) return i;
    return -1;
  }

  /*=======================================================
    POPULATION KPI — SOURCE OF TRUTH

    Each regional sheet is evaluated independently.
    A unit exists only when SN is populated.

    TOTAL UNIT USED = actual SN count across the 4 sheets.
    RFU            = actual rows with STATUS EPICOR = RFU.
    NON RFU        = actual rows with STATUS EPICOR = NON RFU.

    IMPORTANT:
    NON RFU is NEVER calculated as TOTAL - RFU.
    Rows with blank/other STATUS EPICOR are reported as
    UNCLASSIFIED so source data is not silently altered.
  =======================================================*/
  function getPopulationKPI_() {
    const ss = SpreadsheetApp.openById(POPULATION_SPREADSHEET_ID);
    let totalUnit = 0, rfu = 0, nonRfu = 0, unclassified = 0;
    const source = [];

    POPULATION_SHEETS.forEach(function(sheetName) {
      const ws = ss.getSheetByName(sheetName);
      if (!ws) throw new Error("Sheet populasi tidak ditemukan: " + sheetName);

      const values = ws.getDataRange().getValues();
      const headerRow = findHeaderRow_(values);
      if (headerRow < 0) {
        source.push({sheet: sheetName, units: 0, rfu: 0, nonRfu: 0, unclassified: 0});
        return;
      }

      const headers = values[headerRow] || [];
      const snCol = findColumn_(headers, ["SN", "SERIAL NUMBER", "SERIAL NO", "SN UNIT"]);
      const epicorCol = findColumn_(headers, ["STATUS EPICOR"]);
      if (snCol < 0) throw new Error("Kolom SN tidak ditemukan pada sheet: " + sheetName);
      if (epicorCol < 0) throw new Error("Kolom STATUS EPICOR tidak ditemukan pada sheet: " + sheetName);

      let sheetUnits = 0, sheetRfu = 0, sheetNonRfu = 0, sheetUnclassified = 0;

      for (let r = headerRow + 1; r < values.length; r++) {
        const sn = text_(values[r][snCol]);
        if (!sn) continue;

        sheetUnits++;
        const status = upper_(values[r][epicorCol]);
        if (status === "RFU") sheetRfu++;
        else if (status === "NON RFU" || status === "NON-RFU" || status === "NONRFU") sheetNonRfu++;
        else sheetUnclassified++;
      }

      totalUnit += sheetUnits;
      rfu += sheetRfu;
      nonRfu += sheetNonRfu;
      unclassified += sheetUnclassified;

      source.push({
        sheet: sheetName,
        units: sheetUnits,
        rfu: sheetRfu,
        nonRfu: sheetNonRfu,
        unclassified: sheetUnclassified
      });
    });

    return {
      totalUnit: totalUnit,
      rfu: rfu,
      nonRfu: nonRfu,
      unclassified: unclassified,
      source: source,
      sourceSpreadsheetId: POPULATION_SPREADSHEET_ID,
      sourceSheets: POPULATION_SHEETS,
      validation: {
        classified: rfu + nonRfu,
        difference: totalUnit - (rfu + nonRfu),
        balanced: totalUnit === (rfu + nonRfu)
      }
    };
  }

  function getMovement_() { return select_(CONFIG.SHEET.ASSET_MOVEMENT); }
  function getUnitDitarik_(movement) { return movement.filter(item => upper_(item.TO_STATUS) === "PULL_OUT").length; }
  function getUnitDikirim_(movement) {
    return movement.filter(function(item) {
      const toStatus = upper_(item.TO_STATUS), toBranch = text_(item.TO_BRANCH), toLocation = text_(item.TO_LOCATION);
      if (toStatus === "RENTAL" || toStatus === "READY") return true;
      return !!(toBranch || toLocation);
    }).length;
  }
  function getLoanPart_() {
    return select_(CONFIG.SHEET.LOAN_PART).filter(function(item) {
      const status = upper_(item.STATUS);
      return status === "REQUESTED" || status === "APPROVED" || status === "LOANED";
    }).length;
  }
  function getMonthly_(movement) {
    const result = [0,0,0,0,0,0,0,0,0,0,0,0];
    movement.forEach(function(item) {
      if (!item.MOVEMENT_DATE) return;
      const date = new Date(item.MOVEMENT_DATE);
      if (!isNaN(date.getTime())) result[date.getMonth()]++;
    });
    return result;
  }
  function getActivity_() {
    const rows = select_(CONFIG.SHEET.EVENT_LEDGER);
    rows.sort((a,b) => new Date(b.CREATED_AT || b.EVENT_DATE || 0) - new Date(a.CREATED_AT || a.EVENT_DATE || 0));
    return rows.slice(0,5).map(item => ({title:item.EVENT_TYPE || "Activity",description:item.DOCUMENT_NO || item.REFERENCE_NO || "",time:item.EVENT_DATE || item.CREATED_AT || ""}));
  }
  function buildChart_(kpi, monthly) {
    return {
      status:{labels:["RFU","NON RFU","Loan"],datasets:[{data:[kpi.rfu,kpi.nonRfu,kpi.loanPart]}]},
      monthly:{labels:["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"],datasets:[{label:"Transaction",data:monthly}]}
    };
  }

  function getDashboard() {
    try {
      Auth.check();
      const user = Auth.getUser() || {};
      const populationKpi = getPopulationKPI_();
      const movement = getMovement_();
      const loanPart = getLoanPart_();

      const dashboard = {
        user:{id:user.USER_ID||"",username:user.USERNAME||"",name:user.FULLNAME||"Administrator",role:user.ROLE||"",branch:user.BRANCH||""},
        kpi:{
          totalUnit:populationKpi.totalUnit,
          unitDitarik:getUnitDitarik_(movement),
          unitDikirim:getUnitDikirim_(movement),
          rfu:populationKpi.rfu,
          nonRfu:populationKpi.nonRfu,
          loanPart:loanPart
        },
        population:populationKpi,
        chart:buildChart_(populationKpi, getMonthly_(movement)),
        activity:getActivity_(),
        report:[]
      };

      Logger.info("DashboardService", "LIVE REGIONAL POPULATION KPI", populationKpi);
      return Response.success(dashboard,"Dashboard berhasil dimuat dari 4 populasi regional live.");
    } catch(err) {
      Logger.error("DashboardService",err);
      return Response.error(err);
    }
  }

  return {getDashboard};
})();