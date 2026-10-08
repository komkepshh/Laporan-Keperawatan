/**
 * Backend Google Drive untuk PWA Laporan Harian Kepala Ruangan.
 * Pasang di Google Sheet: Extensions > Apps Script. Deploy sebagai Web app
 * (Execute as: Me, Who has access: Anyone).
 */
const TOKEN = '';   // dikosongkan = sinkron otomatis tanpa kode. Isi kode bila ingin dikunci.
const FOLDER_NAME = 'Laporan Harian Kepala Ruangan';

function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName('Laporan');
  if (!s) {
    s = ss.insertSheet('Laporan');
    s.getRange('A:C').setNumberFormat('@');
    s.appendRow(['Kunci', 'Tanggal', 'Ruang', 'Kepala Ruangan', 'Pasien Akhir', 'BOR %', 'Status Tenaga', 'Masalah', 'Diperbarui', 'JSON']);
    s.setFrozenRows(1);
  }
  return s;
}

function folder_() {
  const it = DriveApp.getFoldersByName(FOLDER_NAME);
  return it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
}

function doGet(e) {
  const p = e.parameter || {};
  if (TOKEN && p.token !== TOKEN) return out_({ ok: false, error: 'Kode rahasia salah' });
  const s = sheet_(), n = s.getLastRow() - 1;
  const rows = n > 0 ? s.getRange(2, 1, n, 10).getValues() : [];
  const from = p.from || '';
  const reports = rows
    .filter(r => String(r[1]) >= from)
    .map(r => { try { return JSON.parse(r[9]); } catch (x) { return null; } })
    .filter(Boolean);
  return out_({ ok: true, reports: reports });
}

function doPost(e) {
  let b;
  try { b = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: 'Data rusak' }); }
  if (TOKEN && b.token !== TOKEN) return out_({ ok: false, error: 'Kode rahasia salah' });
  const r = b.report, lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const key = r.tanggal + '|' + r.ruang, ring = r.ringkas || {};
    const teks = r.teks; delete r.teks;
    const s = sheet_(), n = s.getLastRow() - 1;
    const keys = n > 0 ? s.getRange(2, 1, n, 1).getValues().flat() : [];
    const row = [key, r.tanggal, r.ruang, r.kepala, ring.pasien, ring.bor, ring.tenaga, r.masalah || '', new Date(), JSON.stringify(r)];
    const i = keys.indexOf(key);
    if (i >= 0) s.getRange(i + 2, 1, 1, row.length).setValues([row]); else s.appendRow(row);
    docFor_(r, teks);
    return out_({ ok: true });
  } finally { lock.release(); }
}

function docFor_(r, teks) {
  const f = folder_(), name = r.tanggal + ' - ' + r.ruang, it = f.getFilesByName(name);
  let d;
  if (it.hasNext()) d = DocumentApp.openById(it.next().getId());
  else { d = DocumentApp.create(name); DriveApp.getFileById(d.getId()).moveTo(f); }
  const body = d.getBody().clear();
  String(teks || '').split('\n').forEach(l => {
    if (l.indexOf('# ') === 0) body.appendParagraph(l.slice(2)).setHeading(DocumentApp.ParagraphHeading.HEADING2);
    else body.appendParagraph(l);
  });
  d.saveAndClose();
}
