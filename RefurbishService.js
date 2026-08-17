/*=========================================================
 RPN MANAGEMENT SYSTEM
 RefurbishService.js
 FIX #2 — SAVE PENGIRIMAN -> POPULATION SYNC
=========================================================*/
const RefurbishService = (() => {
  "use strict";

  const SHEET_NAME = "T_REFURBISH";
  const HEADERS = [
    "REF_ID",
    "CREATED_AT",
    "CREATED_BY",
    "CATEGORY",
    "BRANCH",
    "PAYLOAD_JSON"
  ];

  function text_(v) {
    return String(v == null ? "" : v).trim();
  }

  function normalizeShippingPayload_(data) {
    const d = Object.assign({}, data || {});

    /* UI currently uses these names for the shipping component fields. */
    if (!text_(d.BATTERY_SPARE_SN)) {
      d.BATTERY_SPARE_SN = text_(d.BATTERY_SPARE_1) || text_(d.BATTERY_SPARE_2);
    }
    if (!text_(d.TROLLEY_SN)) {
      d.TROLLEY_SN = text_(d.TROLLY);
    }
    if (!text_(d.BATTERY_SN)) {
      d.BATTERY_SN = text_(d.BATTERY_IN);
    }
    if (!text_(d.SN_UNIT)) {
      d.SN_UNIT = text_(d.SERIAL_NUMBER);
    }

    return d;
  }

  function validate_(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Data Update Job Refurbish tidak valid.");
    }

    const category = text_(data.CATEGORY).toUpperCase();
    const branch = text_(data.BRANCH);

    if (!branch) throw new Error("Cabang wajib diisi.");
    if (!category) throw new Error("Kategori wajib dipilih.");

    if (category === "PERBAIKAN UNIT") {
      if (!text_(data.DATE) || !text_(data.UNIT_TYPE) || !text_(data.SERIAL_NUMBER)) {
        throw new Error("Tanggal, Unit Type dan Serial Number wajib diisi.");
      }
    }

    if (category === "PENARIKAN UNIT" || category === "PENGIRIMAN UNIT") {
      if (!text_(data.SN_UNIT) && !text_(data.SERIAL_NUMBER)) {
        throw new Error("SN Unit wajib diisi untuk transaksi " + category + ".");
      }
    }
  }

  function ensureSheet_() {
    const ss = SpreadsheetService.open("TRANSACTION");
    let ws = ss.getSheetByName(SHEET_NAME);

    if (!ws) {
      ws = ss.insertSheet(SHEET_NAME);
      ws.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      ws.setFrozenRows(1);
    } else if (ws.getLastRow() === 0) {
      ws.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
      ws.setFrozenRows(1);
    }

    return ws;
  }

  function createRefId_() {
    return "RFB-" + Utilities.formatDate(
      new Date(),
      CONFIG.APP.TIMEZONE,
      "yyyyMMdd-HHmmss-SSS"
    );
  }

  function save(data) {
    Auth.check();
    data = normalizeShippingPayload_(data || {});
    validate_(data);

    return SpreadsheetService.transaction(function () {
      const ws = ensureSheet_();
      const now = new Date();
      const refId = createRefId_();
      const user = Auth.getUser() || {};
      const createdBy = text_(user.USERNAME) || text_(user.FULLNAME) || "SYSTEM";
      const category = text_(data.CATEGORY);
      const branch = text_(data.BRANCH);
      const payload = JSON.stringify(data);
      const row = ws.getLastRow() + 1;

      ws.getRange(row, 1, 1, HEADERS.length).setValues([[
        refId,
        now,
        createdBy,
        category,
        branch,
        payload
      ]]);

      SpreadsheetApp.flush();

      let populationSync = {
        UPDATED: false,
        REASON: "NOT_SHIPPING"
      };

      /* FIX #2: only PENGIRIMAN UNIT triggers population synchronization. */
      if (category.toUpperCase() === "PENGIRIMAN UNIT") {
        if (typeof PopulationLemahAbangService === "undefined") {
          throw new Error("PopulationLemahAbangService tidak tersedia.");
        }

        console.log("REFURBISH FIX #2: population sync start", {
          branch: branch,
          snUnit: data.SN_UNIT,
          battery: data.BATTERY_SN,
          batterySpare: data.BATTERY_SPARE_SN,
          charger: data.CHARGER_SN,
          trolley: data.TROLLEY_SN
        });

        populationSync = PopulationLemahAbangService.updateFromRefurbish(data);

        console.log("REFURBISH FIX #2: population sync response", populationSync);
      }

      SpreadsheetApp.flush();

      return Response.success({
        SAVED: true,
        REF_ID: refId,
        SHEET: SHEET_NAME,
        ROW_NUMBER: row,
        CREATED_BY: createdBy,
        CATEGORY: category,
        BRANCH: branch,
        POPULATION_SYNC: populationSync
      }, "Update Job Refurbish berhasil disimpan ke Spreadsheet.");
    });
  }

  function getSheetName() {
    return SHEET_NAME;
  }

  return {
    save,
    getSheetName
  };
})();
