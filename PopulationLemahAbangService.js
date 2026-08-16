/*=========================================================
 RPN MANAGEMENT SYSTEM
 PopulationLemahAbangService.js
 External population source + transaction sync
=========================================================*/
const PopulationLemahAbangService = (() => {
  "use strict";

  const SPREADSHEET_ID = "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo";
  const SHEET_NAME = "POPULASI UNIT USED LEMAH ABANG";
  const EDIT_URL = "https://docs.google.com/spreadsheets/d/1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo/edit";

  const ALIAS = {
    SERIAL: ["SERIAL NUMBER","SERIAL NO","SN UNIT","SN","SERIAL","SERIAL NUMBER UNIT"],
    UNIT_TYPE: ["UNIT TYPE","TYPE UNIT","TYPE","MODEL","UNIT"],
    YEAR: ["YEAR","TAHUN"],
    HM: ["HOUR METER","HM","HOUR METER UNIT"],
    BRANCH: ["CABANG","BRANCH","LOCATION","LOKASI"],
    RFU: ["STATUS RFU","RFU","RFU %","STATUS RFU %"],
    RFU_DATE: ["RFU DATE","TANGGAL RFU"],
    ACTION: ["ACTION","TINDAKAN"],
    BATTERY_SN: ["BATTERY SN","SERIAL NUMBER BATTERY","SN BATTERY","BATTERY SERIAL"],
    CHARGER_SN: ["CHARGER SN","SERIAL NUMBER CHARGER","SN CHARGER","CHARGER SERIAL"],
    BATTERY_UNIT: ["BATTERY UNIT","BATTERY PASANGAN","UNIT BATTERY"],
    CHARGER_UNIT: ["CHARGER UNIT","CHARGER PASANGAN","UNIT CHARGER"],
    STATUS: ["STATUS","UNIT STATUS","STATUS UNIT"],
    CUSTOMER: ["CUSTOMER","PELANGGAN"],
    UPDATED_AT: ["UPDATED AT","LAST UPDATE","UPDATE DATE","UPDATED"],
    UPDATED_BY: ["UPDATED BY","UPDATE BY","PIC UPDATE"]
  };

  function norm_(v){ return String(v == null ? "" : v).trim().toUpperCase().replace(/\s+/g," "); }
  function sheet_(){
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const ws = ss.getSheetByName(SHEET_NAME);
    if(!ws) throw new Error("Sheet '"+SHEET_NAME+"' tidak ditemukan.");
    return ws;
  }
  function headerMap_(headers){
    const map = {};
    headers.forEach((h,i)=>{
      const n=norm_(h);
      Object.keys(ALIAS).forEach(k=>{ if(ALIAS[k].some(a=>norm_(a)===n) && map[k]===undefined) map[k]=i; });
    });
    return map;
  }
  function matrix_(){
    const ws=sheet_(), values=ws.getDataRange().getValues();
    if(!values.length) return {ws,headers:[],rows:[],map:{}};
    const headers=values[0].map(String);
    return {ws,headers,rows:values.slice(1),map:headerMap_(headers)};
  }
  function read(){
    Auth.check();
    const x=matrix_();
    const rows=x.rows.map((r,i)=>({ROW_NUMBER:i+2,VALUES:r}));
    const user=Auth.getUser()||{};
    return Response.success({SHEET:SHEET_NAME,HEADERS:x.headers,ROWS:rows,EDITABLE:user.ROLE==="ADMIN"||user.ROLE==="SUPERVISOR",EDIT_URL:EDIT_URL});
  }
  function set_(ws,row,col,value){ if(col!==undefined) ws.getRange(row,col+1).setValue(value); }
  function value_(row,map,key){ return map[key]===undefined ? "" : row[map[key]]; }
  function findBySerial_(x,serial){
    const target=norm_(serial); if(!target || x.map.SERIAL===undefined) return -1;
    for(let i=0;i<x.rows.length;i++) if(norm_(x.rows[i][x.map.SERIAL])===target) return i+2;
    return -1;
  }
  function ensureAssetRow_(x, assetType, serial, unitSerial){
    if(!serial) return;
    const ws=x.ws, serialCol=x.map.SERIAL;
    if(serialCol===undefined) return;
    let row=findBySerial_(x,serial);
    if(row<0){
      const last=Math.max(ws.getLastRow()+1,2);
      row=last;
      set_(ws,row,serialCol,serial);
      if(x.map.BRANCH!==undefined) set_(ws,row,x.map.BRANCH,"Lemah Abang");
    }
    if(assetType==="BATTERY" && x.map.BATTERY_UNIT!==undefined) set_(ws,row,x.map.BATTERY_UNIT,unitSerial||"");
    if(assetType==="CHARGER" && x.map.CHARGER_UNIT!==undefined) set_(ws,row,x.map.CHARGER_UNIT,unitSerial||"");
  }
  function detachPrevious_(x, unitSerial, kind){
    if(!unitSerial || x.map.SERIAL===undefined) return;
    const ws=x.ws;
    for(let i=0;i<x.rows.length;i++){
      const row=i+2, r=x.rows[i];
      if(norm_(r[x.map.SERIAL])!==norm_(unitSerial)) continue;
      if(kind==="BATTERY" && x.map.BATTERY_SN!==undefined) set_(ws,row,x.map.BATTERY_SN,"NA");
      if(kind==="CHARGER" && x.map.CHARGER_SN!==undefined) set_(ws,row,x.map.CHARGER_SN,"NA");
    }
  }
  function updateFromRefurbish(data){
    if(!data || norm_(data.BRANCH)!=="LEMAH ABANG") return {UPDATED:false,REASON:"BRANCH_NOT_LEMAH_ABANG"};
    const x=matrix_(), ws=x.ws, now=new Date(), user=Auth.getUser()||{};
    const unitSerial=data.SERIAL_NUMBER || data.SN_UNIT || "";
    let row=findBySerial_(x,unitSerial);
    if(row<0 && unitSerial && x.map.SERIAL!==undefined){ row=Math.max(ws.getLastRow()+1,2); set_(ws,row,x.map.SERIAL,unitSerial); }
    if(row<0) return {UPDATED:false,REASON:"SERIAL_NUMBER_COLUMN_NOT_FOUND"};

    const write=(key,val)=>{ if(x.map[key]!==undefined && val!==undefined && val!=="") set_(ws,row,x.map[key],val); };
    write("UNIT_TYPE",data.UNIT_TYPE);
    write("YEAR",data.YEAR);
    write("HM",data.HOUR_METER || data.HM);
    write("BRANCH","Lemah Abang");
    write("RFU",data.RFU_PERCENT);
    write("RFU_DATE",data.RFU_DATE);
    write("ACTION",data.ACTION);
    write("CUSTOMER",data.CUSTOMER);
    write("UPDATED_AT",now);
    write("UPDATED_BY",user.FULLNAME||user.USERNAME||"SYSTEM");

    const category=norm_(data.CATEGORY);
    if(category==="PENARIKAN UNIT") write("STATUS","PENARIKAN");
    if(category==="PENGIRIMAN UNIT") write("STATUS","PENGIRIMAN");
    if(category==="LOAN SPAREPART") write("STATUS","LOAN SPAREPART");
    if(category==="PERBAIKAN UNIT" && data.RFU_PERCENT!==undefined) write("STATUS",Number(data.RFU_PERCENT)>=100?"RFU":"REPAIR");

    if(category==="PENGIRIMAN UNIT"){
      const battery=data.BATTERY_IN||"";
      const charger=data.CHARGER_SN||"";
      if(x.map.BATTERY_SN!==undefined && battery){ detachPrevious_(x,unitSerial,"BATTERY"); write("BATTERY_SN",battery); ensureAssetRow_(x,"BATTERY",battery,unitSerial); }
      if(x.map.CHARGER_SN!==undefined && charger){ detachPrevious_(x,unitSerial,"CHARGER"); write("CHARGER_SN",charger); ensureAssetRow_(x,"CHARGER",charger,unitSerial); }
    }
    SpreadsheetApp.flush();
    return {UPDATED:true,ROW_NUMBER:row,CATEGORY:category,SERIAL_NUMBER:unitSerial};
  }
  function assertManualEdit_(){
    Auth.check();
    const user=Auth.getUser()||{};
    if(user.ROLE!=="ADMIN" && user.ROLE!=="SUPERVISOR") throw new Error("Edit populasi hanya untuk ADMIN dan SUPERVISOR.");
  }
  function editCell(rowNumber,columnIndex,value){
    assertManualEdit_();
    const ws=sheet_();
    if(rowNumber<2 || columnIndex<0) throw new Error("Posisi data tidak valid.");
    ws.getRange(Number(rowNumber),Number(columnIndex)+1).setValue(value);
    SpreadsheetApp.flush();
    return Response.success({ROW_NUMBER:rowNumber,COLUMN_INDEX:columnIndex});
  }
  return {read,updateFromRefurbish,editCell,getEditUrl:()=>EDIT_URL};
})();