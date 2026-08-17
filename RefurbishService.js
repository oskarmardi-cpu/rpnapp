/*=========================================================
 RPN MANAGEMENT SYSTEM
 RefurbishService.js
 FIX #1 — SAVE UPDATE JOB REFURBISH

 Scope FIX #1:
 - Persist form data to T_REFURBISH.
 - Do NOT yet route to Pengiriman/Populasi.
 - Do NOT mutate POPULASI UNIT USED.
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

  function validate_(data) {
    if (!data || typeof data !== "object") {
      throw new Error("Data Update Job Refurbish tidak valid.");
    }

    const category = text_(data.CATEGORY).toUpperCase();
    const branch = text_(data.BRANCH);

    if (!branch) {
      throw new Error("Cabang wajib diisi.");
    }

    if (!category) {
      throw new Error("Kategori wajib dipilih.");
    }

    if (category === "PERBAIKAN UNIT") {
      if (!text_(data.DATE) || !text_(data.UNIT_TYPE) || !text_(data.SERIAL_NUMBER)) {
        throw new Error("Tanggal, Unit Type dan Serial Number wajib diisi.");
      }
    }

    if (category === "PENARIKAN UNIT" || category === "PENGIRIMAN UNIT") {
      if (!text_(data.SN_UNIT)) {
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
    data = data || {};
    validate_(data);

    return SpreadsheetService.transaction(function () {
      const ws = ensureSheet_();
      const now = new Date();
      const refId = createRefId_();
      const user = Auth.getUser() || {};
      const createdBy = text_(user.USERNAME) || text_(user.FULLNAME) || "SYSTEM";
      const payload = JSON.stringify(data);
      const row = ws.getLastRow() + 1;

      ws.getRange(row, 1, 1, HEADERS.length).setValues([[
        refId,
        now,
        createdBy,
        text_(data.CATEGORY),
        text_(data.BRANCH),
        payload
      ]]);

      SpreadsheetApp.flush();

      return Response.success({
        SAVED: true,
        REF_ID: refId,
        SHEET: SHEET_NAME,
        ROW_NUMBER: row,
        CREATED_BY: createdBy,
        CATEGORY: text_(data.CATEGORY),
        BRANCH: text_(data.BRANCH),
        POPULATION_SYNC: {
          UPDATED: false,
          REASON: "FIX_1_SAVE_ONLY"
        }
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
