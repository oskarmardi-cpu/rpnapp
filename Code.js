/*=========================================================
  DIRECT DASHBOARD
=========================================================*/

function dashboardGet() {

  try {

    /*=====================================================
      CHECK SESSION
    =====================================================*/

    Auth.check();


    /*=====================================================
      LOG
    =====================================================*/

    Logger.info(

      "Code.dashboardGet",

      "Dashboard request"

    );


    /*=====================================================
      GET DASHBOARD
    =====================================================*/

    return DashboardService.getDashboard();

  }


  catch (err) {

    Logger.error(

      "Code.dashboardGet",

      err

    );


    return Response.error(

      err

    );

  }

}function doGet(e) {

  try {

    return HtmlService
      .createTemplateFromFile("01_Index")
      .evaluate()
      .setTitle("RPN Management System")
      .setXFrameOptionsMode(
        HtmlService.XFrameOptionsMode.ALLOWALL
      );

  } catch (err) {

    Logger.error(
      "Code.doGet",
      err
    );

    return HtmlService.createHtmlOutput(
      "<h3>RPN Management System</h3>" +
      "<p>Terjadi kesalahan saat membuka aplikasi.</p>" +
      "<pre>" +
      String(err.message || err) +
      "</pre>"
    );

  }

}/*=========================================================
  DIRECT AUTH LOGIN
=========================================================*/

function authLogin(
  username,
  password
) {

  try {

    username =
      String(
        username || ""
      ).trim();

    password =
      String(
        password || ""
      );

    Logger.info(
      "Code.authLogin",
      {
        username: username
      }
    );

    const result =
      Auth.login(
        username,
        password
      );

    /*
     * Kembalikan response asli
     * dari Auth.login().
     */

    return result;

  }

  catch (err) {

    Logger.error(
      "Code.authLogin",
      err
    );

    return Response.error(
      err
    );

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