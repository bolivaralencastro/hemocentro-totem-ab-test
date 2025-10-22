/**
 * README:
 * 1. Open your Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Delete any existing code in the Code.gs file.
 * 4. Copy and paste all the code from this file into the Code.gs file.
 * 5. Click the "Save project" icon (floppy disk).
 * 6. Click "Deploy" > "New deployment".
 * 7. In the "Select type" dialog (gear icon), choose "Web app".
 * 8. In the form:
 *    - Description: "Hemocentro Test Data Logger" (or similar)
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (important for receiving data from the app)
 * 9. Click "Deploy".
 * 10. Authorize the script when prompted. It will ask for permission to manage your spreadsheets.
 * 11. After deploying, copy the "Web app URL".
 * 12. Paste this URL into the `LOGGING_URL` constant in `src/services/data-logger.service.ts` in your Angular app.
 * 13. Any future changes to this script require you to deploy again ("Deploy" > "Manage deployments", select your deployment, click the pencil icon, and choose "New version").
 */

/**
 * A utility function to get or create a sheet and set its headers.
 * @param {string} name The name of the sheet.
 * @param {Array<string>} headers An array of header strings.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The sheet object.
 */
function getSheet(name, headers) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    // Set headers only if the sheet is brand new
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.setFrozenRows(1);
    // Auto-resize columns for better readability
    for (var i = 1; i <= headers.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  return sheet;
}

/**
 * Handles POST requests to log data to the Google Sheet.
 * This is the main function that is triggered when your app sends data.
 * @param {object} e The event parameter for a POST request.
 */
function doPost(e) {
  try {
    // Parse the JSON payload from the request body
    var data = JSON.parse(e.postData.contents);
    var timestamp = new Date();

    // Check if it's a test result payload
    if (data.timeA !== undefined) {
      var testSheetHeaders = [
        'Timestamp',
        'Time Original (ms)',
        'Time Nova (ms)',
        'Time Difference (ms)',
        'Errors Original',
        'Errors Nova',
        'Test Order'
      ];
      var testSheet = getSheet('TestResults', testSheetHeaders);

      testSheet.appendRow([
        timestamp,
        data.timeA,
        data.timeB,
        data.timeDifference, // Use the pre-calculated difference from the client
        data.errorsA,
        data.errorsB,
        data.order
      ]);

    // Check if it's a hemocentro click payload
    } else if (data.clickedCenter !== undefined) {
      var clickSheetHeaders = ['Timestamp', 'City', 'Clicked Center'];
      var clickSheet = getSheet('HemocentroClicks', clickSheetHeaders);

      clickSheet.appendRow([
        timestamp,
        data.city,
        data.clickedCenter
      ]);
    }

    // Return a success response
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Log any errors for debugging and return an error response
    Logger.log('Error in doPost: ' + error.toString());
    Logger.log('Request data: ' + e.postData.contents);
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
