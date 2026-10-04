/**
 * Paste into: Google Sheet → Extensions → Apps Script
 *
 * Deploy → New deployment → Web app
 * - Execute as: Me
 * - Who has access: Anyone   ← required, otherwise RSVP fails with "Access denied"
 *
 * After any code change: Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy
 *
 * Put the Web App URL in .env:
 * NEXT_PUBLIC_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/XXXX/exec
 */

function getSheet_() {
  // Prefer the sheet this script is bound to
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) {
    ss = SpreadsheetApp.openById("1oPvghB__FEtzq_E935PuHnLgfxoHlPsVyxBFAQMxlug");
  }
  return ss.getSheets()[0];
}

function ensureHeaders_(sheet) {
  var headers = [
    "Timestamp",
    "Name",
    "Phone",
    "Attending",
    "Guests",
    "Message",
    "Submitted At (ISO)",
  ];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  }
}

function appendRsvp_(data) {
  var sheet = getSheet_();
  ensureHeaders_(sheet);
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.attending || "",
    data.guests || 0,
    data.message || "",
    data.submittedAt || "",
  ]);
}

function parseBody_(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  var p = (e && e.parameter) || {};
  return {
    name: p.name || "",
    phone: p.phone || "",
    attending: p.attending || "",
    guests: Number(p.guests || 0),
    message: p.message || "",
    submittedAt: p.submittedAt || new Date().toISOString(),
  };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function doPost(e) {
  try {
    appendRsvp_(parseBody_(e));
    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}

function doGet(e) {
  try {
    appendRsvp_(parseBody_(e));
    return json_({ result: "success" });
  } catch (err) {
    return json_({ result: "error", message: String(err) });
  }
}
