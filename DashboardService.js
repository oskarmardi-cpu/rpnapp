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

  function text_(value) {
    return String(value == null ? "" : value).trim();
  }

  function upper_(value) {
    return text_(value).toUpperCase().replace(/\s+/g, " ");
  }

  function select_(sheetName) {
    try {
      return Database.select(Database.MASTER, sheetName) || [];
    } catch (err) {
      Logger.error("DashboardService.select", {sheet: sheetName, error: err});
      return [];
    }
  }

  function findHeaderRow_(values) {
    for (let r = 0; r < values.length; r++) {
      if (upper_(values[r][0]) === "NO") return r;
    }
    return -1;
  }

  function findColumn_(headers, names) {
    const wanted = names.map(upper_);
    for (let i = 0; i < headers.length; i++) {
      if (wanted.indexOf(upper_(headers[i])) >= 0) return i;
    }
    return -1;
  }

  /*=======================================================
    LIVE POPULATION KPI
    Source of truth:
    4 regional used-population sheets.

    TOTAL UNIT USED = count of populated SN cells.
    RFU            = STATUS EPICOR exactly RFU.
    NON RFU        = STATUS EPICOR exactly NON RFU.
  =======================================================*/
  function getPopulationKPI_() {
    const ss = SpreadsheetApp.openById(POPULATION_SPREADSHEET_ID);
    let totalUnit = 0;
    let rfu = 0;
    let nonRfu = 0;
    const source = [];

    POPULATION_SHEETS.forEach(function(sheetName) {
      const ws = ss.getSheetByName(sheetName);
      if (!ws) {
        throw new Error("Sheet populasi tidak ditemukan: " + sheetName);
      }

      const values = ws.getDataRange().getValues();
      const headerRow = findHeaderRow_(values);
      if (headerRow < 0) {
        source.push({sheet: sheetName, units: 0, rfu: 0, nonRfu: 0});
        return;
      }

      const headers = values[headerRow] || [];
      const snCol = findColumn_(headers, ["SN", "SERIAL NUMBER", "SERIAL NO", "SN UNIT"]);
      const epicorCol = findColumn_(headers, ["STATUS EPICOR"]);

      if (snCol < 0) {
        throw new Error("Kolom SN tidak ditemukan pada sheet: " + sheetName);
      }
      if (epicorCol < 0) {
        throw new Error("Kolom STATUS EPICOR tidak ditemukan pada sheet: " + sheetName);
      }

      let sheetUnits = 0;
      let sheetRfu = 0;
      let sheetNonRfu = 0;

      for (let r = headerRow + 1; r < values.length; r++) {
        const sn = text_(values[r][snCol]);
        if (!sn) continue;

        sheetUnits++;
        const epicorStatus = upper_(values[r][epicorCol]);

        if (epicorStatus === "RFU") {
          sheetRfu++;
        } else if (epicorStatus === "NON RFU") {
          sheetNonRfu++;
        }
      }

      totalUnit += sheetUnits;
      rfu += sheetRfu;
      nonRfu += sheetNonRfu;
      source.push({sheet: sheetName, units: sheetUnits, rfu: sheetRfu, nonRfu: sheetNonRfu});
    });

    return {
      totalUnit: totalUnit,
      rfu: rfu,
      nonRfu: nonRfu,
      source: source,
      sourceSpreadsheetId: POPULATION_SPREADSHEET_ID,
      sourceSheets: POPULATION_SHEETS
    };
  }

  function getMovement_() {
    return select_(CONFIG.SHEET.ASSET_MOVEMENT);
  }

  function getUnitDitarik_(movement) {
    return movement.filter(function(item) {
      return upper_(item.TO_STATUS) === "PULL_OUT";
    }).length;
  }

  function getUnitDikirim_(movement) {
    return movement.filter(function(item) {
      const toStatus = upper_(item.TO_STATUS);
      const toBranch = text_(item.TO_BRANCH);
      const toLocation = text_(item.TO_LOCATION);
      if (toStatus === "RENTAL" || toStatus === "READY") return true;
      return !!(toBranch || toLocation);
    }).length;
  }

  function getLoanPart_() {
    const rows = select_(CONFIG.SHEET.LOAN_PART);
    return rows.filter(function(item) {
      const status = upper_(item.STATUS);
      return status === "REQUESTED" || status === "APPROVED" || status === "LOANED";
    }).length;
  }

  function getMonthly_(movement) {
    const result = [0,0,0,0,0,0,0,0,0,0,0,0];
    movement.forEach(function(item) {
      if (!item.MOVEMENT_DATE) return;
      const date = new Date(item.MOVEMENT_DATE);
      if (isNaN(date.getTime())) return;
      const month = date.getMonth();
      if (month >= 0 && month <= 11) result[month]++;
    });
    return result;
  }

  function getActivity_() {
    const rows = select_(CONFIG.SHEET.EVENT_LEDGER);
    rows.sort(function(a, b) {
      const da = new Date(a.CREATED_AT || a.EVENT_DATE || 0).getTime();
      const db = new Date(b.CREATED_AT || b.EVENT_DATE || 0).getTime();
      return db - da;
    });
    return rows.slice(0, 5).map(function(item) {
      return {
        title: item.EVENT_TYPE || "Activity",
        description: item.DOCUMENT_NO || item.REFERENCE_NO || "",
        time: item.EVENT_DATE || item.CREATED_AT || ""
      };
    });
  }

  function buildChart_(kpi, monthly) {
    return {
      status: {
        labels: ["RFU", "NON RFU", "Loan"],
        datasets: [{data: [kpi.rfu, kpi.nonRfu, kpi.loanPart]}]
      },
      monthly: {
        labels: ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Ags","Sep","Okt","Nov","Des"],
        datasets: [{label: "Transaction", data: monthly}]
      }
    };
  }

  function getDashboard() {
    try {
      Auth.check();
      const user = Auth.getUser() || {};
      const populationKpi = getPopulationKPI_();
      const movement = getMovement_();
      const unitDitarik = getUnitDitarik_(movement);
      const unitDikirim = getUnitDikirim_(movement);
      const loanPart = getLoanPart_();
      const monthly = getMonthly_(movement);

      const dashboard = {
        user: {
          id: user.USER_ID || "",
          username: user.USERNAME || "",
          name: user.FULLNAME || "Administrator",
          role: user.ROLE || "",
          branch: user.BRANCH || ""
        },
        kpi: {
          totalUnit: populationKpi.totalUnit,
          unitDitarik: unitDitarik,
          unitDikirim: unitDikirim,
          rfu: populationKpi.rfu,
          nonRfu: populationKpi.nonRfu,
          loanPart: loanPart
        },
        population: populationKpi,
        chart: buildChart_({
          rfu: populationKpi.rfu,
          nonRfu: populationKpi.nonRfu,
          loanPart: loanPart
        }, monthly),
        activity: getActivity_(),
        report: []
      };

      Logger.info("DashboardService", "LIVE POPULATION KPI LOADED", {
        totalUnit: populationKpi.totalUnit,
        rfu: populationKpi.rfu,
        nonRfu: populationKpi.nonRfu,
        source: populationKpi.source
      });

      return Response.success(dashboard, "Dashboard berhasil dimuat dari data populasi live.");
    } catch (err) {
      Logger.error("DashboardService", err);
      return Response.error(err);
    }
  }

  return {getDashboard};
})();