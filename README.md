# 淡江大學社團博覽會 · 60 秒專注力挑戰賽

掃 QR Code → 填資料 → 玩 60 秒 Stroop 挑戰 → 看稱號 → 成績寫進 Google Sheet → 寄結果信。

現場公共裝置、手機優先、不用登入、不用下載 App。

---

## 專案結構

```
backend/
  public/index.html        單檔前端（掃碼玩的那一頁）
  server.js                Node 原生 HTTP API（寄信 / Google Sheet / 排行榜）
  package.json
  .env.example
google-apps-script/Code.gs Google Sheet 接收端
src/                       預覽環境同一套遊戲與 API
.env.example               環境變數範本（不要把真實密碼提交進 Git）
```

敏感資訊（SMTP 密碼、Google Script、金鑰）只放 Zeabur Environment Variables，前端看不到。

---

## 一、建立 Zeabur Project

1. 把這個專案推到 GitHub。
2. 打開 [Zeabur](https://zeabur.com) → New Project。
3. 連 GitHub repo。

建議先做 **一個 Web Service**（最省事，社博當天夠用）：

- Root Directory：`backend`
- Runtime：Node
- Build / Install：`npm install`
- Start：`npm start`（即 `node server.js`）
- Port：服務會讀 `PORT`（Zeabur 會自動注入）

這樣同一個網址同時提供 `index.html` 遊戲頁與 `/api/*`。

若要拆成兩個服務，見下方「前後端分開」。

---

## 二、部署 frontend（單檔）

**方案 A（推薦）**：不要單獨部前端，讓 `backend/server.js` 直接送出 `backend/public/index.html`。

**方案 B**：Zeabur Static Site

- 把 `backend/public/index.html` 當成網站根目錄的 `index.html`
- 並在頁面裡設定 `window.API_BASE_URL`（見第九點）

部完後記下前端網址，例如 `https://focus.zeabur.app`。

---

## 三、部署 backend

Zeabur → Add Service → GitHub 同一個 repo。

- Root Directory：`backend`
- Install：`npm install`
- Start：`npm start`

健康檢查路徑：`/api/health`

---

## 四、Environment Variables 放哪裡

在 **backend 那個 Zeabur Service → Variables** 填，不要寫進程式、不要放進 `index.html`。

| 變數 | 說明 |
| --- | --- |
| `PORT` | Zeabur 會自動給，通常不用手填 |
| `FRONTEND_URL` | 前端網址。前後端同一個網址可填 `*` 或該網址 |
| `GOOGLE_SCRIPT_URL` | Apps Script Web App 網址 |
| `SMTP_HOST` | 例如 `smtp.gmail.com` |
| `SMTP_PORT` | `587`（或 `465`） |
| `SMTP_SECURE` | `false`（587）或 `true`（465） |
| `SMTP_USER` | 寄信帳號 |
| `SMTP_PASS` | 應用程式密碼，不是登入密碼 |
| `SMTP_FROM` | 例如 `淡江大學禪學社 <you@gmail.com>` |
| `CLUB_NAME` | 預設 `淡江大學禪學社` |
| `CONTACT_EMAIL` | 社團聯絡信箱（可空） |

沒填 Google / SMTP 時遊戲仍可玩，只是不寫表、不寄信。

---

## 五、設定 Google Apps Script

1. 打開 [Google Apps Script](https://script.google.com) → 新增專案。
2. 把 `google-apps-script/Code.gs` 全部貼上。
3. 上方「服務」不用加。確認綁定的是下面建立的試算表：選 **擴充功能尚未出現時**，在 Apps Script 專案設定把容器綁到該 Sheet，或直接從 Sheet：擴充功能 → Apps Script。
4. 部署 → 新增部署作業 → 類型選 **網頁應用程式**。
   - 執行身分：我
   - 存取對象：**任何人**
5. 授權 Google 帳號。
6. 複製 Web App 網址（`https://script.google.com/macros/s/.../exec`）填到 `GOOGLE_SCRIPT_URL`。

若之後改程式碼，必須 **新增部署作業** 或「管理部署作業 → 編輯 → 新版本」，舊網址才會吃到更新。

---

## 六、建立 Google Sheet

1. 新增試算表，第一個工作表可改名 `results`。
2. 不必手打表頭：第一次成功寫入時，Script 會自動填：

`timestamp | time | game | name | department | phone | email | score | correct | wrong | total | accuracy | maxCombo | title | duration | userAgent`

3. 時間 `time` 為台北時間，例如 `2026/09/06 20:30:15`。

---

## 七、設定 SMTP

以 Gmail 為例：

1. Google 帳號開啟兩步驟驗證。
2. 建立「應用程式密碼」。
3. `SMTP_HOST=smtp.gmail.com`
4. `SMTP_PORT=587`
5. `SMTP_SECURE=false`
6. `SMTP_USER=你的Gmail`
7. `SMTP_PASS=應用程式密碼`

其他信箱（Outlook、社團網域）改 host/port 即可。寄信失敗不會讓結果頁崩潰。

---

## 八、取得 backend domain

Zeabur 服務 → Networking / Domain，會看到例如：

`https://tku-focus-api.zeabur.app`

用來測 `/api/health`，也是前端 `API_BASE_URL` 的值（若前後端分開）。

---

## 九、index.html 如何設定 `API_BASE_URL`

檔案在 `backend/public/index.html`，開頭的 script：

```js
const API_BASE_URL = window.API_BASE_URL || "";
```

- **前後端同一個 Zeabur 網址**：維持空字串。
- **分開部署**：在 `index.html` 加一行，或於頁面載入前設定：

```html
<script>window.API_BASE_URL = "https://你的後端.zeabur.app";</script>
```

同時把後端 `FRONTEND_URL` 設成前端網址，避免 CORS 擋掉。

---

## 十、測試 `/api/health`

瀏覽器或任何環境打開：

`https://你的後端網址/api/health`

應回：

```json
{ "status": "ok" }
```

---

## API

| 方法 | 路徑 | 說明 |
| --- | --- | --- |
| `GET` | `/api/health` | 健康檢查 |
| `POST` | `/api/register` | 驗證姓名 / 系級 / 電話 / Email，可寄「挑戰開始」信 |
| `POST` | `/api/result` | 寫入 Google Sheet、寄結果信。只應提交一次 |
| `GET` | `/api/leaderboard` | 前五名（只回 name / department / score，不含電話與 Email） |

`POST /api/result` JSON：

```json
{
  "timestamp": 1770000000000,
  "time": "2026/09/06 20:30:15",
  "game": "game1",
  "name": "小華",
  "department": "資工一A",
  "phone": "0912345678",
  "email": "a@b.com",
  "score": 1200,
  "correct": 10,
  "wrong": 2,
  "total": 12,
  "accuracy": 83,
  "maxCombo": 6,
  "title": "Lv.2 潛力領袖",
  "duration": 60
}
```

成功回應：

```json
{
  "ok": true,
  "sheetSaved": true,
  "emailSent": true,
  "sheetsConfigured": true,
  "smtpConfigured": true
}
```

---

## 遊戲規則（現場說明 10 秒）

中央大字的「意思」和「顏色」永遠不一樣。

- 指令是【字面意思】：點那個字寫的顏色。
- 指令是【視覺顏色】：點文字實際的顏色。
- 每 3 秒換一次指令；連續答對 3 題也會立刻切換。
- 答對 +100，Combo ≥ 5 時 +200，答錯 −50（不會低於 0）。

稱號：

- ≥ 3000　Lv.4 卓越領袖
- 2000–2999　Lv.3 穩定領航者
- 1000–1999　Lv.2 潛力領袖
- < 1000　Lv.1 心靈修煉者

---

## 社博當天建議

1. 用後端網址（或同一個網址）產生 QR Code，貼在攤位。
2. 平板／手機開這頁當示範機；「再挑戰一次」會清掉上一個人的姓名、電話、Email。
3. 不要把成績頁截圖含電話／Email 公佈在社群。排行榜只顯示姓名、系級、分數。

---

## 已知限制

- Google Sheet / SMTP 未設定時，遊戲仍可完成，成績只留在當下畫面，並顯示友善提示。
- 未接 Google Sheet 時，TOP 5 只存在該後端行程記憶體，重啟就消失。
- 後端有簡單 IP 頻率限制，不是完整防弊系統。
- 寄信與寫表走外部服務，現場網路不穩時可能失敗，但不會卡住結果頁。
- 本預覽環境與 Zeabur 單檔版規則相同；社博請以 Zeabur 網址給同學掃。
