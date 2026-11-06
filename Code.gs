/**
 * Devankshi's 1st Birthday — RSVP collector
 * Sheet columns: Timestamp | Name | Attending | Guests | Note | Device
 * Set NOTIFY_EMAIL to get an email for every RSVP (leave '' to disable).
 */
const NOTIFY_EMAIL = 'vishnu.m.kumar@gmail.com';
const SHEET_NAME = 'RSVPs';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sh = ss.getSheetByName(SHEET_NAME);
    if (!sh) {
      sh = ss.insertSheet(SHEET_NAME);
      sh.appendRow(['Timestamp', 'Name', 'Attending', 'Guests', 'Note', 'Device']);
      sh.getRange(1, 1, 1, 6).setFontWeight('bold').setBackground('#E7E3FF');
      sh.setFrozenRows(1);
      sh.setColumnWidths(1, 6, 160);
    }
    const d = JSON.parse(e.postData.contents || '{}');
    const name = String(d.name || '').trim().slice(0, 60);
    if (!name) return out({ ok: false, error: 'name required' });

    // If the same name replies again, update their row instead of adding a duplicate
    const data = sh.getDataRange().getValues();
    let rowIdx = -1;
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][1]).trim().toLowerCase() === name.toLowerCase()) { rowIdx = i + 1; break; }
    }
    const row = [new Date(), name, d.attending === 'Yes' ? 'Yes' : 'No', Number(d.guests) || 0, String(d.note || '').slice(0, 140), String(d.ua || '')];
    if (rowIdx > 0) sh.getRange(rowIdx, 1, 1, 6).setValues([row]); else sh.appendRow(row);

    if (NOTIFY_EMAIL) {
      const total = countYes(sh);
      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: `RSVP: ${name} — ${row[2]} (${row[3]} guests)`,
        body: `${name} replied "${row[2]}" with ${row[3]} guest(s).\n${row[4] ? 'Note: ' + row[4] + '\n' : ''}\nTotal attending so far: ${total.families} families, ${total.guests} guests.\n\nSheet: ${ss.getUrl()}`
      });
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, msg: 'RSVP endpoint is live' }); }

function countYes(sh) {
  const v = sh.getDataRange().getValues();
  let families = 0, guests = 0;
  for (let i = 1; i < v.length; i++) if (v[i][2] === 'Yes') { families++; guests += Number(v[i][3]) || 0; }
  return { families, guests };
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
