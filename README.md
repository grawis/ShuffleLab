# ShuffleLab

ShuffleLab 是一個純前端、免登入的繁體中文隨機工具網站。提供數字抽籤、名單抽籤、團體分組與順序抽籤，適合課堂、活動、報告順序及聚會使用。

## 功能

- 數字抽籤：自訂安全整數範圍、抽取數量及是否允許重複。
- 名單抽籤：手動貼上或由 TXT、CSV 匯入，可抽出一位或多位得主。
- 團體分組：可指定組數或每組人數；每個項目只會分配一次。
- 順序抽籤：將完整名單隨機排序，每個項目恰好出現一次。
- CSV 預覽：支援標題列、欄位及資料列選擇，並即時顯示預計匯入筆數。
- 結果工具：複製文字、全螢幕查看及匯出 PNG。
- 歷史紀錄：在瀏覽器中保存最近 50 筆正式結果。
- 響應式與無障礙：支援桌機、平板、手機、鍵盤操作與 `prefers-reduced-motion`。

## 隱私與公平性

所有名單、匯入檔案、抽籤與圖片產生均在使用者的瀏覽器內完成，不會上傳到伺服器。網站不使用後端、資料庫、帳號或追蹤服務。

正式亂數來自 Web Crypto API：整數映射採 rejection sampling 避免 modulo bias；名單、順序與分組採 Fisher–Yates shuffle。這提供適合一般活動使用的安全亂數，但不代表政府抽獎、公證或法律層級的公平性認證。

## 技術棧

- React + TypeScript
- Vite
- Vitest
- ESLint
- 原生 CSS
- Web Crypto API、Fullscreen API、Canvas API、localStorage
- html2canvas：將結果區域可靠地轉為 PNG

專案沒有加入 UI 或 CSV 第三方套件。CSV 使用專案內的 RFC 4180 相容解析器；PNG 使用 html2canvas 在瀏覽器內產生。

## 本機執行

需要 Node.js 20 或更新版本。

```bash
npm install
npm run dev
```

Vite 會顯示本機網址。其他指令：

```bash
npm run lint       # 靜態檢查
npm run test       # 執行單元測試一次
npm run test:watch # 監看模式
npm run build      # 型別檢查與 production build
npm run preview    # 預覽 production build
```

## TXT 與 CSV 匯入

### TXT

- 以 UTF-8 為主要編碼。
- 一行視為一個項目；前後空白與空白行會被忽略。
- 匯入後只會填入輸入區，不會立刻抽籤。

### CSV

- 支援含引號的逗號、換行與雙引號跳脫，不使用單純的 `split(',')`。
- 預設第一列為標題，可在預覽中取消。
- 可逐欄、逐列選擇，也可全選或取消全選。
- 同一列的多個已選欄位會依原始順序合併為一個項目，預設分隔符號為 `｜`。例如選擇「姓名」與「學號」會產生 `王小明｜A001`。
- 已選欄位中的空白儲存格會忽略；整列結果皆空白時不匯入。
- 確認前可選擇取代目前名單，或加到目前名單後方；取消不會更動名單。
- 儲存格只以純文字顯示，不執行 HTML 或試算表公式。

## 實作限制

- 單一 TXT／CSV 檔案上限：2 MB。
- CSV 有效資料上限：5,000 列。
- 主要支援現代瀏覽器；Web Crypto API 為必要條件。
- PNG 匯出依賴瀏覽器的 Canvas 支援。若瀏覽器限制下載功能，介面會顯示錯誤，可改用複製結果或系統截圖。
- TXT 以 UTF-8 解碼；第一版不自動偵測 Big5 等其他編碼。
- 重新整理不保留尚未抽籤的名單草稿或模式設定。

## localStorage

每次正式結果會保存模式、結果、建立時間及設定摘要。只保留最近 50 筆，超過時自動移除最舊紀錄。暫時動畫內容與輸入名單不會寫入歷史。使用者可在歷史面板中查看或經二次確認後清除全部紀錄。

若瀏覽器停用 localStorage、處於限制較嚴格的私密模式或儲存空間不足，抽籤仍可進行，但網站會提示歷史可能無法保存。

## GitHub Pages 部署

專案已提供 [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)。Vite 使用相對 `base` 路徑，因此可部署到使用者頁面或專案型 Pages 路徑。

1. 將專案提交到 GitHub，預設分支命名為 `main`。
2. 在 repository 的 **Settings → Pages → Build and deployment**，將 Source 設為 **GitHub Actions**。
3. Push 到 `main` 後，workflow 會依序安裝依賴、執行 lint、測試、建置，再部署 `dist/`。
4. 在 repository 的 Actions 頁面確認 `Deploy ShuffleLab to Pages` 成功。

不需要建立 secrets。請勿提交 `.env`、`node_modules/`、`dist/` 或個人名單；這些路徑已列入 `.gitignore`。

## 架構

```text
src/
├─ components/            # 共用導覽、圖示
├─ features/
│  ├─ number-draw/        # 數字設定
│  ├─ name-draw/          # 名單抽取設定
│  ├─ grouping/           # 分組設定
│  ├─ order-draw/         # 順序設定
│  ├─ import/             # TXT / CSV 與預覽
│  ├─ results/            # 結果呈現與操作
│  └─ history/            # 歷史紀錄介面
├─ types/                 # 核心資料型別
└─ utils/                 # 安全亂數、抽取、解析、儲存與 PNG
```

核心亂數與抽籤邏輯均為獨立純函式，不依賴 React。

## 已知限制與可擴充方向

v1.0 不包含後端、登入、雲端同步、多獎項、權重、跨次排除、Undo、多份常用名單、自訂組名、分組限制、音效、主題、多語系或 PWA。這些項目僅適合在首版穩定後另行規劃。
