var page = HtmlService.createTemplateFromFile('page');
var reporter = SpreadsheetApp.openById('1Mg2SzPN1xMx0JblDTqe8fMFuXxlLjD2dCf_bWnwTaVo').getActiveSheet();
var hidden = SpreadsheetApp.openById('1-srIy434g7EplGvy1ZtGWTbggG8eKDiT9Rm4_iApuDE').getActiveSheet();

function doPost (e) {
  page['msg'] = 'received the value!';
  if ('date' in e.parameter && 'message' in e.parameter) {
    reporter.appendRow([e.parameter.date, e.parameter.message]);
  } else {
    page['msg'] = '';
  }
  if ('json' in e.parameter) {
    page['msg'] = 'received the value!';
    hidden.appendRow([e.parameter.json]);
  }
  return page.evaluate().setSandboxMode(HtmlService.SandboxMode.IFRAME);
}

Logger.log(typeof doPost);
