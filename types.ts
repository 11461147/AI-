export interface SlideContent {
  title: string;
  points: string[];
  keyMessage: string;
  speakerNotes: string;
}

export interface PresentationData {
  topic: string;
  slides: SlideContent[];
}

export enum AppState {
  INPUT = 'INPUT',
  GENERATING = 'GENERATING',
  PRESENTING = 'PRESENTING',
}

export const DEFAULT_PROMPT = `演講主題：如何使用 AI 做專題

重點內容：
1. 用 AI 找資料：強調 AI 是搜尋與整理助手，務必查證原文 (Fact check)。
2. 工具適配性：不同任務找不同工具（如：發想、寫程式、修圖），不要一招打天下。
3. 避免偏置（多視角提問示範）：
   - 核心概念：將同一核心問題，設定給不同 AI 人設，並在不同對話視窗提問。
   - 示範題目：大學生是否該用 AI 寫作業？
   - 支持方問法：「你是教育改革推動者，請列舉 AI 輔助作業如何提升學生批判性思考。」
   - 反對方問法：「你是傳統嚴謹派教授，請分析過度依賴 AI 對學生基礎能力養成的危害。」
   - 中立問法：「你是客觀教育觀察家，請比較使用與不使用的優缺點，並給出平衡建議。」
4. 發散與收斂：AI 負責發散（給點子），人類負責收斂（做決策）。
5. 實作心法：大任務拆小步驟。慢慢來，比較快 (Slow is smooth, smooth is fast)。
   - 核心概念：將大任務拆解成極小的步驟執行。
   - 實戰案例（程式開發）：
     - 不要一次執行 AI 給的所有程式碼，容易產生黑箱錯誤。
     - 應像 Jupyter Notebook 一樣分塊 (Cells) 執行。
     - Step 1：先跑環境設定與參數 (Setup & Config)。
     - Step 2：防禦性載入，檢查檔案是否存在 (Data Check)。
     - Step 3：邏輯驗證，打印運算過程 (Logic Verification)。
   - 分段驗證，才是最快的捷徑。
6. 核心價值：保留直覺，AI 是副駕駛，你是駕駛。`;