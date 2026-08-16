/*=========================================================
  DIRECT DASHBOARD
=========================================================*/

function dashboardGet() {
  try {
    Auth.check();
    Logger.info("Code.dashboardGet","Dashboard request");
    return DashboardService.getDashboard();
  } catch (err) {
    Logger.error("Code.dashboardGet",err);
    return Response.error(err);
  }
}

function doGet(e) {
  try {
    return HtmlService
      .createTemplateFromFile("01_Index")
      .evaluate()
      .setTitle("RPN Management System")
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  } catch (err) {
    Logger.error("Code.doGet",err);
    return HtmlService.createHtmlOutput(
      "<h3>RPN Management System</h3>"+
      "<p>Terjadi kesalahan saat membuka aplikasi.</p>"+
      "<pre>"+String(err.message||err)+"</pre>"
    );
  }
}

function authLogin(username,password) {
  try {
    username=String(username||"").trim();
    password=String(password||"");
    Logger.info("Code.authLogin",{username:username});
    return Auth.login(username,password);
  } catch(err) {
    Logger.error("Code.authLogin",err);
    return Response.error(err);
  }
}

/*=========================================================
  REFURBISH VIEW / SAVE
=========================================================*/

function renderRefurbish(){
  Auth.check();
  return HtmlService
    .createTemplateFromFile("25_Refurbish")
    .evaluate()
    .getContent();
}

function saveRefurbish(data){
  try{
    return RefurbishService.save(data || {});
  }catch(err){
    Logger.error("Code.saveRefurbish",err);
    return Response.error(err);
  }
}

/*=========================================================
  HTML INCLUDE HELPER
=========================================================*/

function include(filename) {
  return HtmlService
    .createHtmlOutputFromFile(filename)
    .getContent();
}
