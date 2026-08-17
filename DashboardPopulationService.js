/* RPN MANAGEMENT SYSTEM - DASHBOARD LIVE POPULATION */
const DashboardPopulationService=(()=>{
  "use strict";
  const SPREADSHEET_ID="1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo";
  const SHEET_NAME="POPULASI UNIT USED NASIONAL";
  function norm(v){return String(v==null?"":v).trim().toUpperCase().replace(/\s+/g," ");}
  function read(){
    Auth.check();
    const ws=SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if(!ws)throw new Error("Sheet '"+SHEET_NAME+"' tidak ditemukan.");
    const values=ws.getDataRange().getValues();
    let header=-1;
    for(let r=0;r<values.length;r++){if(norm(values[r][0])==="NO"){header=r;break;}}
    if(header<0)return Response.success({source:SHEET_NAME,totalUnit:0,rfu:0,nonRfu:0,loanPart:0,updatedAt:new Date().toISOString()});
    const headers=values[header].map(String),idx={};
    headers.forEach((h,i)=>idx[norm(h)]=i);
    const serialIdx=["SN","SERIAL NUMBER","SERIAL NO"].map(norm).find(k=>idx[k]!==undefined);
    const statusIdx=["STATUS ACTUAL","STATUS RFU","RFU","STATUS"].map(norm).find(k=>idx[k]!==undefined);
    const rows=values.slice(header+1).filter(r=>{
      if(serialIdx===undefined)return r.some(v=>String(v==null?"":v).trim()!=="");
      return String(r[idx[serialIdx]]==null?"":r[idx[serialIdx]]).trim()!=="";
    });
    let rfu=0,loan=0;
    rows.forEach(r=>{
      const s=statusIdx===undefined?"":norm(r[idx[statusIdx]]);
      if(s.includes("RFU")||s.includes("READY"))rfu++;
      if(s.includes("LOAN"))loan++;
    });
    return Response.success({source:SHEET_NAME,totalUnit:rows.length,rfu:rfu,nonRfu:Math.max(0,rows.length-rfu),loanPart:loan,updatedAt:new Date().toISOString()});
  }
  return{read};
})();