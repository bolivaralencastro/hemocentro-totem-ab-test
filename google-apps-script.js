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
 * Validates the incoming data to ensure it meets expected formats and ranges.
 * @param {object} data The data object to validate.
 * @returns {boolean} True if the data is valid, otherwise false.
 */
function isValidData(data) {
  // Validate test results data
  if (data.timeA !== undefined) {
    // Check if all required properties exist and are of correct type
    if (typeof data.timeA !== 'number' || 
        typeof data.timeB !== 'number' || 
        typeof data.errorsA !== 'number' || 
        typeof data.errorsB !== 'number' || 
        typeof data.order !== 'string' || 
        typeof data.timeDifference !== 'number' ||
        (data.scoreA !== null && typeof data.scoreA !== 'number') ||
        (data.scoreB !== null && typeof data.scoreB !== 'number') ||
        typeof data.feedback !== 'string') {
      return false;
    }
    
    // Validate ranges for test timing data
    if (data.timeA < 1000 || data.timeA > 7200000) return false; // 1 second to 2 hours
    if (data.timeB < 1000 || data.timeB > 7200000) return false; // 1 second to 2 hours
    if (data.errorsA < 0 || data.errorsA > 100) return false; // Reasonable error count
    if (data.errorsB < 0 || data.errorsB > 100) return false; // Reasonable error count
    if (Math.abs(data.timeDifference) > 7200000) return false; // 2 hours max difference
    
    // Validate survey data
    if (data.scoreA !== null && (data.scoreA < 1 || data.scoreA > 5)) return false;
    if (data.scoreB !== null && (data.scoreB < 1 || data.scoreB > 5)) return false;
    if (data.feedback.length > 5000) return false; // Limit feedback length

    // Validate order string
    if (!['Original > Nova', 'Nova > Original'].includes(data.order)) return false;
    
    // Check for unexpected properties (prevent injection of extra fields)
    var allowedTestKeys = ['timeA', 'timeB', 'errorsA', 'errorsB', 'order', 'timeDifference', 'scoreA', 'scoreB', 'feedback'];
    for (var key in data) {
      if (!allowedTestKeys.includes(key)) return false;
    }
    
    return true;
  } 
  // Validate hemocentro click data
  else if (data.clickedCenter !== undefined) {
    if (typeof data.city !== 'string' || typeof data.clickedCenter !== 'string') {
      return false;
    }
    
    // Validate string lengths to prevent excessively large inputs
    if (data.city.length > 100 || data.clickedCenter.length > 200) return false;
    
    // Additional validation for expected patterns
    // City and center names should be reasonable strings
    if (!/^[a-zA-Z\u00C0-\u017F\s\-'\.]{2,100}$/.test(data.city)) return false; // Allow letters, accents, spaces, hyphens, apostrophes, periods
    if (!/^[a-zA-Z0-9\u00C0-\u017F\s\-'\.()]{2,200}$/.test(data.clickedCenter)) return false; // Allow letters, numbers, accents, and common chars
    
    // Check for unexpected properties
    var allowedClickKeys = ['city', 'clickedCenter'];
    for (var key2 in data) {
      if (!allowedClickKeys.includes(key2)) return false;
    }
    
    return true;
  }
  
  return false;
}

/**
 * Checks if the request rate is within acceptable limits to prevent flooding.
 * @returns {boolean} True if rate limited, false otherwise.
 */
function isRateLimited() {
  var now = new Date();
  var fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000); // 5 minutes ago
  
  // Get or create a control sheet for tracking request frequency
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var controlSheet = ss.getSheetByName('RequestControl');
  if (!controlSheet) {
    controlSheet = ss.insertSheet('RequestControl');
    // Add headers to control sheet
    controlSheet.getRange('A1:B1').setValues([['Timestamp', 'Endpoint']]);
  }
  
  // Get all timestamps from the control sheet within the last 5 minutes
  var lastRow = controlSheet.getLastRow();
  if (lastRow > 1) {
    var timestampRange = controlSheet.getRange(2, 1, lastRow - 1, 1);
    var timestamps = timestampRange.getValues();
    
    var recentRequests = 0;
    for (var i = 0; i < timestamps.length; i++) {
      var timestamp = timestamps[i][0];
      if (timestamp instanceof Date && timestamp > fiveMinutesAgo) {
        recentRequests++;
      }
    }
    
    // Limit to 100 requests per 5 minutes to account for legitimate usage but prevent abuse
    if (recentRequests > 100) {
      Logger.log('Rate limit exceeded: ' + recentRequests + ' requests in last 5 minutes');
      return true;
    }
  }
  
  return false;
}

/**
 * Records the current request for rate limiting purposes.
 */
function recordRequest() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var controlSheet = ss.getSheetByName('RequestControl');
  if (!controlSheet) {
    controlSheet = ss.insertSheet('RequestControl');
    // Add headers to control sheet
    controlSheet.getRange('A1:B1').setValues([['Timestamp', 'Endpoint']]);
  }
  
  var now = new Date();
  controlSheet.appendRow([now, 'doPost']);
  
  // Clean up old entries (older than 24 hours) to prevent sheet from growing indefinitely
  var twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  var allTimestamps = controlSheet.getRange('A:A').getValues();
  var rowsToDelete = [];
  
  for (var i = allTimestamps.length - 1; i >= 1; i--) { // Start from bottom to avoid index issues
    var cellValue = allTimestamps[i][0];
    if (cellValue instanceof Date && cellValue < twentyFourHoursAgo) {
      rowsToDelete.push(i + 1); // +1 because sheet indexing is 1-based
    }
  }
  
  // Delete rows in reverse order to maintain correct indexing
  for (var j = rowsToDelete.length - 1; j >= 0; j--) {
    controlSheet.deleteRow(rowsToDelete[j]);
  }
}

/**
 * Detects anomalies in the incoming data that might indicate malicious usage.
 * @param {object} data The data to analyze.
 * @param {Date} timestamp The timestamp of the request.
 */
function detectAnomalies(data, timestamp) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var anomalySheet = ss.getSheetByName('Anomalies') || ss.insertSheet('Anomalies');
  
  // Ensure headers exist
  var firstCell = anomalySheet.getRange('A1').getValue();
  if (firstCell === '') {
    anomalySheet.getRange('A1:D1').setValues([['Timestamp', 'Type', 'Details', 'RawData']]);
  }
  
  var issues = [];
  
  // Check for unusually fast times (potential automation)
  if (data.timeA !== undefined) {
    if (data.timeA < 2000) { // Less than 2 seconds seems suspicious for full CPF entry
      issues.push('Unusually fast timeA: ' + data.timeA + 'ms');
    }
    if (data.timeB < 2000) { // Less than 2 seconds seems suspicious
      issues.push('Unusually fast timeB: ' + data.timeB + 'ms');
    }
    
    // Check for unrealistic error patterns
    if (data.timeA < 4000 && data.errorsA > 5) { // Very fast with many errors
      issues.push('Fast time with many errorsA: ' + data.timeA + 'ms, ' + data.errorsA + ' errors');
    }
    if (data.timeB < 4000 && data.errorsB > 5) { // Very fast with many errors
      issues.push('Fast time with many errorsB: ' + data.timeB + 'ms, ' + data.errorsB + ' errors');
    }
  }
  
  // Log any issues found
  if (issues.length > 0) {
    var lastRow = anomalySheet.getLastRow();
    anomalySheet.getRange(lastRow + 1, 1, 1, 4).setValues([[timestamp, 'Data Anomaly', issues.join('; '), JSON.stringify(data)]]);
    Logger.log('Anomaly detected: ' + issues.join('; '));
  }
}

/**
 * Handles POST requests to log data to the Google Sheet.
 * This is the main function that is triggered when your app sends data.
 * @param {object} e The event parameter for a POST request.
 */
function doPost(e) {
  try {
    // Rate limiting check
    if (isRateLimited()) {
      Logger.log('Rate limit exceeded - request blocked');
      return ContentService.createTextOutput(JSON.stringify({ 
        'status': 'error', 
        'message': 'Rate limit exceeded. Please try again later.' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Parse the JSON payload from the request body
    var data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch (parseError) {
      Logger.log('Invalid JSON received: ' + e.postData.contents);
      return ContentService.createTextOutput(JSON.stringify({ 
        'status': 'error', 
        'message': 'Invalid JSON format' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Validate the data format and values
    if (!isValidData(data)) {
      Logger.log('Invalid data received: ' + JSON.stringify(data));
      return ContentService.createTextOutput(JSON.stringify({ 
        'status': 'error', 
        'message': 'Invalid data format or values' 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var timestamp = new Date();
    
    // Anomaly detection
    detectAnomalies(data, timestamp);
    
    // Record the request for rate limiting
    recordRequest();
    
    // Process the data based on type
    if (data.timeA !== undefined) {
      var testSheetHeaders = [
        'Timestamp',
        'Time Original (ms)',
        'Time Nova (ms)',
        'Time Difference (ms)',
        'Errors Original',
        'Errors Nova',
        'Test Order',
        'Score Original',
        'Score Nova',
        'Feedback'
      ];
      var testSheet = getSheet('TestResults', testSheetHeaders);

      testSheet.appendRow([
        timestamp,
        data.timeA,
        data.timeB,
        data.timeDifference,
        data.errorsA,
        data.errorsB,
        data.order,
        data.scoreA,
        data.scoreB,
        data.feedback
      ]);

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
    Logger.log('Request data: ' + (e && e.postData ? e.postData.contents : 'undefined'));
    return ContentService.createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
