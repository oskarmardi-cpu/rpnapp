/*=========================================================
 RPN SYSTEM
 DashboardService.gs
 Enterprise Edition - LIVE POPULATION + SUMMARY MOVEMENT
=========================================================*/
const DashboardService = (() => {
  "use strict";

  const POPULATION_SPREADSHEET_ID = "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo";
  const SUMMARY_SPREADSHEET_ID = "1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo";
  const SUMMARY_SHEET_NAME = "SUMMARY";
  const POPULATION_SHEETS = ["POPULASI UNIT USED LEMAH ABANG","POPULASI UNIT USED SURABAYA","POPULASI UNIT USED MEDAN","POPULASI UNIT USED SEMARANG"];

  function text_(value){return String(value==null?"":value).trim();}
  function upper_(value){return text_(value).toUpperCase().replace(/\s+/g," ");}
  function select_(sheetName){try{return Database.select(Database.MASTER,sheetName)||[];}catch(err){Logger.error("DashboardService.select",{sheet:sheetName,error:err});return[];}}
  function findColumn_(headers,names){const wanted=names.map(upper_);for(let i=0;i<headers.length;i++)if(wanted.indexOf(upper_(headers[i]))>=0)return i;return-1;}

  function findHeaderRow_(values){
    let best=-1,bestScore=-1;
    for(let r=0;r<values.length;r++){
      const row=values[r]||[];
      const snCol=findColumn_(row,["SN","SERIAL NUMBER","SERIAL NO","SN UNIT"]);
      const noCol=findColumn_(row,["NO","NO.","NOMOR"]);
      const modelCol=findColumn_(row,["MODEL","UNIT TYPE","TYPE UNIT","TYPE"]);
      if(snCol<0)continue;
      let score=2;
      if(noCol>=0)score+=3;
      if(modelCol>=0)score+=2;
      if(findColumn_(row,["STATUS EPICOR"])>=0)score+=2;
      if(score>bestScore){bestScore=score;best=r;}
    }
    return best;
  }

  function isUnitRow_(row,noCol,modelCol,snCol){
    const sn=text_(row[snCol]);
    if(!sn)return false;
    const no=noCol>=0?text_(row[noCol]):"";
    if(noCol>=0 && !/^\d+$/.test(no))return false;
    const model=upper_(modelCol>=0?row[modelCol]:"");
    if(model.indexOf("CHARGER/BATTERY")>=0||model==="CHARGER"||model==="BATTERY"||model.indexOf("BATTERY/CHARGER")>=0)return false;
    return true;
  }

  function getPopulationKPI_(){
    const ss=SpreadsheetApp.openById(POPULATION_SPREADSHEET_ID);
    let totalUnit=0,rfu=0,nonRfu=0,unclassified=0;
    const source=[];
    POPULATION_SHEETS.forEach(function(sheetName){
      const ws=ss.getSheetByName(sheetName);
      if(!ws)throw new Error("Sheet populasi tidak ditemukan: "+sheetName);
      const values=ws.getDataRange().getValues();
      const headerRow=findHeaderRow_(values);
      if(headerRow<0){source.push({sheet:sheetName,units:0,rfu:0,nonRfu:0,unclassified:0,headerRow:-1});return;}
      const headers=values[headerRow]||[];
      const noCol=findColumn_(headers,["NO","NO.","NOMOR"]);
      const modelCol=findColumn_(headers,["MODEL","UNIT TYPE","TYPE UNIT","TYPE"]);
      const snCol=findColumn_(headers,["SN","SERIAL NUMBER","SERIAL NO","SN UNIT"]);
      const epicorCol=findColumn_(headers,["STATUS EPICOR"]);
      if(snCol<0)throw new Error("Kolom SN tidak ditemukan pada sheet: "+sheetName);
      let sheetUnits=0,sheetRfu=0,sheetNonRfu=0,sheetUnclassified=0,started=false;
      for(let r=headerRow+1;r<values.length;r++){
        const row=values[r]||[];
        const first=noCol>=0?upper_(row[noCol]):upper_(row[0]);
        const rowSn=snCol>=0?text_(row[snCol]):"";
        if(first==="NO"&&findColumn_(row,["SN","SERIAL NUMBER","SERIAL NO","SN UNIT"])>=0)break;
        if(!rowSn){
          if(started){const nextNonEmpty=(values[r+1]||[]).some(function(v){return text_(v)!=="";});if(!nextNonEmpty)break;}
          continue;
        }
        if(!isUnitRow_(row,noCol,modelCol,snCol))continue;
        started=true;
        sheetUnits++;
        const status=epicorCol>=0?upper_(row[epicorCol]):"";
        if(status==="RFU")sheetRfu++;
        else if(status==="NON RFU"||status==="NON-RFU"||status==="NONRFU")sheetNonRfu++;
        else sheetUnclassified++;
      }
      totalUnit+=sheetUnits;rfu+=sheetRfu;nonRfu+=sheetNonRfu;unclassified+=sheetUnclassified;
      source.push({sheet:sheetName,units:sheetUnits,rfu:sheetRfu,nonRfu:sheetNonRfu,unclassified:sheetUnclassified,headerRow:headerRow,statusEpicorColumn:epicorCol>=0});
    });
    return {totalUnit:totalUnit,rfu:rfu,nonRfu:nonRfu,unclassified:unclassified,source:source,sourceSpreadsheetId:POPULATION_SPREADSHEET_ID,sourceSheets:POPULATION_SHEETS,validation:{classified:rfu+nonRfu,difference:totalUnit-(rfu+nonRfu),balanced:totalUnit===(rfu+nonRfu)}};
  }

  function number_(value){if(typeof value==="number")return isFinite(value)?value:0;const raw=text_(value);if(!raw||raw==="-")return 0;const normalized=raw.replace(/\s/g,"").replace(/\.(?=\d{3}(?:\D|$))/g,"").replace(/,/g,".");const parsed=Number(normalized.replace(/[^0-9+\-.]/g,""));return isFinite(parsed)?parsed:0;}
  function movementHeader_(row){return{period:findColumn_(row,["PERIODE","PERIOD","BULAN","MONTH"]),in:findColumn_(row,["IN","UNIT IN","MASUK"]),out:findColumn_(row,["OUT","UNIT OUT","KELUAR"]),balance:findColumn_(row,["BALANCE","SALDO","CURRENT BALANCE"])};}
  function parseDirectMovement_(values){for(let r=0;r<values.length;r++){const row=values[r]||[],h=movementHeader_(row);if(h.period<0||h.in<0||h.out<0||h.balance<0)continue;const rows=[];for(let i=r+1;i<values.length;i++){const source=values[i]||[],period=text_(source[h.period]);if(!period){if(rows.length)break;continue;}if(upper_(period)==="TOTAL")continue;rows.push({period:period,in:number_(source[h.in]),out:number_(source[h.out]),balance:number_(source[h.balance])});}if(rows.length)return rows.slice(-12);}return[];}
  function parseMatrixMovement_(values){let headerRow=-1,periodCols=[];for(let r=0;r<values.length;r++){const row=values[r]||[],label=upper_(row[0]);const hasMonth=row.some(function(v){return /^(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER|JAN|FEB|MAR|APR|MEI|JUN|JUL|AGS|AUG|SEP|OKT|OCT|NOV|DES|DEC)([- ]?\d{2,4})?$/i.test(text_(v));});if((label==="KETERANGAN"||label==="PERIODE")&&hasMonth){headerRow=r;periodCols=row.map(function(v,idx){return{label:text_(v),idx:idx};}).filter(function(x){return x.label&&x.idx>0&&x.label!=="TOTAL";});break;}}if(headerRow<0||!periodCols.length)return[];let inRow=-1,outRow=-1,balanceRow=-1;for(let r=headerRow+1;r<values.length;r++){const label=upper_(values[r][0]);if(label.indexOf("PENARIKAN UNIT USED")>=0||label==="IN"||label.indexOf("UNIT MASUK")>=0)inRow=r;if(label.indexOf("PENGIRIMAN UNIT USED")>=0||label==="OUT"||label.indexOf("UNIT KELUAR")>=0)outRow=r;if(label.indexOf("STOCK UNIT USED - AKHIR")>=0||label==="BALANCE"||label.indexOf("SALDO AKHIR")>=0)balanceRow=r;}if(inRow<0||outRow<0||balanceRow<0)return[];return periodCols.slice(-12).map(function(p){return{period:p.label,in:Math.abs(number_(values[inRow][p.idx])),out:Math.abs(number_(values[outRow][p.idx])),balance:number_(values[balanceRow][p.idx])};});}
  function getSummaryMovement_(){const ss=SpreadsheetApp.openById(SUMMARY_SPREADSHEET_ID),ws=ss.getSheetByName(SUMMARY_SHEET_NAME);if(!ws)throw new Error("Sheet SUMMARY tidak ditemukan pada spreadsheet dashboard.");const values=ws.getDataRange().getValues(),rows=parseDirectMovement_(values),movement=rows.length?rows:parseMatrixMovement_(values);if(!movement.length)throw new Error("Struktur data Movement pada sheet SUMMARY tidak ditemukan. Pastikan tersedia kolom PERIODE, IN, OUT, BALANCE.");const totalIn=movement.reduce(function(sum,item){return sum+number_(item.in);},0),totalOut=movement.reduce(function(sum,item){return sum+number_(item.out);},0),currentBalance=movement.reduce(function(last,item){return item.balance!==0?item.balance:last;},movement[movement.length-1].balance);return{rows:movement,ytd:{totalIn:totalIn,totalOut:totalOut,currentBalance:currentBalance,periodLabel:movement[0].period+" s/d "+movement[movement.length-1].period},sourceSpreadsheetId:SUMMARY_SPREADSHEET_ID,sourceSheet:SUMMARY_SHEET_NAME};}
  function getMovement_(){return select_(CONFIG.SHEET.ASSET_MOVEMENT);}
  function getUnitDitarik_(movement){return movement.filter(function(item){return upper_(item.TO_STATUS)==="PULL_OUT";}).length;}
  function getUnitDikirim_(movement){return movement.filter(function(item){const toStatus=upper_(item.TO_STATUS),toBranch=text_(item.TO_BRANCH),toLocation=text_(item.TO_LOCATION);if(toStatus==="RENTAL"||toStatus==="READY")return true;return!!(toBranch||toLocation);}).length;}
  function getLoanPart_(){return select_(CONFIG.SHEET.LOAN_PART).filter(function(item){const status=upper_(item.STATUS);return status==="REQUESTED"||status==="APPROVED"||status==="LOANED";}).length;}
  function getMonthly_(movement){const result=[0,0,0,0,0,0,0,0,0,0,0,0];movement.forEach(function(item){if(!item.MOVEMENT_DATE)return;const date=new Date(item.MOVEMENT_DATE);if(!isNaN(date.getTime()))result[date.getMonth()]++;});return result;}
  function getActivity_(){const rows=select_(CONFIG.SHEET.EVENT_LEDGER);rows.sort(function(a,b){return new Date(b.CREATED_AT||b.EVENT_DATE||0)-new Date(a.CREATED_AT||a.EVENT_DATE||0);});return rows.slice(0,5).map(function(item){return{title:item.EVENT_TYPE||"Activity",description:item.DOCUMENT_NO||item.REFERENCE_NO||"",time:item.EVENT_DATE||item.CREATED_AT||""};});}
  function buildChart_(kpi,monthly,movement){return{status:{labels:["RFU","NON RFU","Loan"],datasets:[{data:[kpi.rfu,kpi.nonRfu,kpi.loanPart]}]},monthly:{labels:movement.rows.map(function(item){return item.period;}),datasets:[{label:"IN (Unit Masuk)",data:movement.rows.map(function(item){return item.in;})},{label:"OUT (Unit Keluar)",data:movement.rows.map(function(item){return item.out;})},{label:"BALANCE (Saldo Akhir)",data:movement.rows.map(function(item){return item.balance;}),type:"line"}]}};}

  function getDashboard(){
    try{
      Auth.check();
      const user=Auth.getUser()||{};
      const populationKpi=getPopulationKPI_();
      const movement=getMovement_();
      const loanPart=getLoanPart_();
      let summaryMovement=null;
      try{
        summaryMovement=getSummaryMovement_();
      }catch(summaryErr){
        Logger.error("DashboardService.summaryMovement",summaryErr);
        summaryMovement={rows:[],ytd:{totalIn:0,totalOut:0,currentBalance:populationKpi.totalUnit,periodLabel:""},sourceSpreadsheetId:SUMMARY_SPREADSHEET_ID,sourceSheet:SUMMARY_SHEET_NAME,error:summaryErr.message||String(summaryErr)};
      }
      const chartMovement=summaryMovement.rows.length?summaryMovement:{rows:[],ytd:summaryMovement.ytd};
      const dashboard={
        user:{id:user.USER_ID||"",username:user.USERNAME||"",name:user.FULLNAME||"Administrator",role:user.ROLE||"",branch:user.BRANCH||""},
        kpi:{totalUnit:populationKpi.totalUnit,unitDitarik:getUnitDitarik_(movement),unitDikirim:getUnitDikirim_(movement),rfu:populationKpi.rfu,nonRfu:populationKpi.nonRfu,loanPart:loanPart},
        population:populationKpi,
        movement:summaryMovement,
        chart:chartMovement.rows.length?buildChart_(populationKpi,getMonthly_(movement),chartMovement):{status:{labels:["RFU","NON RFU","Loan"],datasets:[{data:[populationKpi.rfu,populationKpi.nonRfu,loanPart]}]},monthly:{labels:[],datasets:[]}},
        activity:getActivity_(),
        report:[]
      };
      Logger.info("DashboardService","Dashboard loaded; population KPI isolated from SUMMARY parser",{population:populationKpi,summary:summaryMovement});
      return Response.success(dashboard,"Dashboard berhasil dimuat dari data populasi regional.");
    }catch(err){
      Logger.error("DashboardService",err);
      return Response.error(err);
    }
  }
  return{getDashboard};
})();