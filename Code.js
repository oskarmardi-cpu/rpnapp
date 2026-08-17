/*=========================================================
  DIRECT DASHBOARD / RPN ENTRY POINTS
=========================================================*/
function dashboardGet() { try { Auth.check(); Logger.info("Code.dashboardGet","Dashboard request"); return DashboardService.getDashboard(); } catch (err) { Logger.error("Code.dashboardGet",err); return Response.error(err); } }
function doGet(e) { try { return HtmlService.createTemplateFromFile("01_Index").evaluate().setTitle("RPN Management System").setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); } catch (err) { Logger.error("Code.doGet",err); return HtmlService.createHtmlOutput("<h3>RPN Management System</h3><p>Terjadi kesalahan saat membuka aplikasi.</p><pre>"+String(err.message||err)+"</pre>"); } }
function authLogin(username,password) { try { username=String(username||"").trim(); password=String(password||""); Logger.info("Code.authLogin",{username:username}); return Auth.login(username,password); } catch(err){Logger.error("Code.authLogin",err);return Response.error(err);} }
function renderRefurbish(){Auth.check();return HtmlService.createTemplateFromFile("25_Refurbish").evaluate().getContent();}
function saveRefurbish(data){try{return RefurbishService.save(data||{});}catch(err){Logger.error("Code.saveRefurbish",err);return Response.error(err);}}
function renderPopulationLemahAbang(){Auth.check();return HtmlService.createTemplateFromFile("26_PopulasiLemahAbang").evaluate().getContent();}
function getPopulationLemahAbang(){try{return PopulationLemahAbangService.read();}catch(err){Logger.error("Code.getPopulationLemahAbang",err);return Response.error(err);}}
function editPopulationLemahAbang(rowNumber,columnIndex,value){try{return PopulationLemahAbangService.editCell(rowNumber,columnIndex,value);}catch(err){Logger.error("Code.editPopulationLemahAbang",err);return Response.error(err);}}
function getPopulationLemahAbangEditUrl(){Auth.check();return PopulationLemahAbangService.getEditUrl();}
function renderPopulationRegional(branch){Auth.check();return HtmlService.createTemplate("27_PopulasiRegional").evaluate().getContent();}
function getPopulationRegional(branch){try{return PopulationRegionalService.read(branch);}catch(err){Logger.error("Code.getPopulationRegional",err);return Response.error(err);}}
function editPopulationRegional(branch,rowNumber,columnIndex,value){try{return PopulationRegionalService.edit(branch,rowNumber,columnIndex,value);}catch(err){Logger.error("Code.editPopulationRegional",err);return Response.error(err);}}
function getPopulationRegionalEditUrl(branch){Auth.check();return "https://docs.google.com/spreadsheets/d/1m9NIKo6eCYLAy_WJ_9FZlxjw2kGqcz8ey2wnm7P8CDo/edit";}
function include(filename){return HtmlService.createHtmlOutputFromFile(filename).getContent();}
