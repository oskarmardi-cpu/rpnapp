/*=========================================================
 RPN MANAGEMENT SYSTEM
 RefurbishService.js
 UPDATE JOB REFURBISH
=========================================================*/

const RefurbishService = (() => {
  "use strict";

  const SHEET_NAME = "T_REFURBISH";

  const HEADERS = [
    "REF_ID","CREATED_AT","CREATED_BY","SCOPE","BRANCH","DATE",
    "UNIT_TYPE","SERIAL_NUMBER","YEAR","HOUR_METER","JOB_TYPE",
    "PROBLEM_DATE","PROBLEM","RFU_PERCENT","RFU_DATE","ACTION",
    "RECOMMENDATIONS","INSTALL_PARTS","WHATSAPP"
  ];

  function save(data){
    Auth.check();
    data = data || {};

    RuleEngine.required(data,[
      "BRANCH","DATE","UNIT_TYPE","SERIAL_NUMBER","JOB_TYPE"
    ]);

    return SpreadsheetService.transaction(function(){
      const ss = SpreadsheetService.open("TRANSACTION");
      let ws = ss.getSheetByName(SHEET_NAME);

      if(!ws){
        ws = ss.insertSheet(SHEET_NAME);
        ws.getRange(1,1,1,HEADERS.length).setValues([HEADERS]);
        ws.setFrozenRows(1);
      }

      const refId = "RFB-" + Utilities.formatDate(
        new Date(), CONFIG.APP.TIMEZONE, "yyyyMMdd-HHmmss"
      );

      const user = Auth.getUser() || {};
      const row = [
        refId,
        new Date(),
        user.USERNAME || user.FULLNAME || "SYSTEM",
        JSON.stringify(data.SCOPE || []),
        data.BRANCH || "",
        data.DATE || "",
        data.UNIT_TYPE || "",
        data.SERIAL_NUMBER || "",
        data.YEAR || "",
        data.HOUR_METER || "",
        data.JOB_TYPE || "",
        data.PROBLEM_DATE || "",
        data.PROBLEM || "",
        Number(data.RFU_PERCENT || 0),
        data.RFU_DATE || "",
        data.ACTION || "",
        JSON.stringify(data.RECOMMENDATIONS || []),
        JSON.stringify(data.INSTALL_PARTS || []),
        data.WHATSAPP || ""
      ];

      ws.getRange(ws.getLastRow()+1,1,1,row.length).setValues([row]);
      SpreadsheetApp.flush();

      return Response.success({
        REF_ID: refId,
        SHEET: SHEET_NAME,
        WHATSAPP: data.WHATSAPP || ""
      });
    });
  }

  function getSheetName(){
    return SHEET_NAME;
  }

  return { save, getSheetName };
})();
