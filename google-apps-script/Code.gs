const HEADERS = [
  "timestamp",
  "time",
  "game",
  "name",
  "department",
  "phone",
  "email",
  "score",
  "correct",
  "wrong",
  "total",
  "accuracy",
  "maxCombo",
  "title",
  "duration",
  "userAgent",
];

function json(obj, code) {
  const out = ContentService.createTextOutput(JSON.stringify(obj));
  out.setMimeType(ContentService.MimeType.JSON);
  return out;
}

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName("results") || ss.getSheets()[0];
  if (!sh) sh = ss.insertSheet("results");
  const first = sh.getRange(1, 1, 1, HEADERS.length).getValues()[0];
  if (!first[0]) {
    sh.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sh.setFrozenRows(1);
  }
  return sh;
}

function parseBody_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("missing_body");
  }
  return JSON.parse(e.postData.contents);
}

function doPost(e) {
  try {
    const data = parseBody_(e);
    if (data.action === "leaderboard") {
      return json({ ok: true, rows: top5_() });
    }
    if (!data.name || data.score === undefined || data.score === null) {
      return json({ ok: false, error: "missing_fields" });
    }
    const sh = sheet_();
    const row = HEADERS.map(function (key) {
      const v = data[key];
      return v === undefined || v === null ? "" : v;
    });
    sh.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function doGet(e) {
  try {
    if (e && e.parameter && e.parameter.action === "leaderboard") {
      return json({ ok: true, rows: top5_() });
    }
    return json({ ok: true, status: "ready" });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function top5_() {
  const sh = sheet_();
  const last = sh.getLastRow();
  if (last < 2) return [];
  const values = sh.getRange(2, 1, last - 1, HEADERS.length).getValues();
  const nameI = HEADERS.indexOf("name");
  const deptI = HEADERS.indexOf("department");
  const scoreI = HEADERS.indexOf("score");
  return values
    .map(function (r) {
      return {
        name: String(r[nameI] || ""),
        department: String(r[deptI] || ""),
        score: Number(r[scoreI]) || 0,
      };
    })
    .filter(function (r) {
      return r.name;
    })
    .sort(function (a, b) {
      return b.score - a.score;
    })
    .slice(0, 5);
}
