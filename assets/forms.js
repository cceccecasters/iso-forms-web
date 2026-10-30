/* ISO 紀錄表單 — 表單定義
 * 新增表單時，只要在 FORMS 陣列加一筆，並在 HISTORY 補上版本歷程即可。
 * 版次／生效日必須與 repo 內 docs/文件管制總表.csv 一致。
 */
window.ISO_META = {
  company: "CHANG CHUAN ENTERPRISE CO., LTD.",
  companyCN: "彰銓企業股份有限公司",
  system: "ISO 9001 品質管理系統 · 表單管制",
  repo: "cceccecasters/iso-form-system",
  updated: "2026-10-30"
};

window.ISO_HISTORY = {
  "FRM-QA-001": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "補列驗證項目「客戶承認」，與影響評估之客戶承認需求對應（v1.0 發行檔已含，表單本文補齊）", ""],
    ["2.0", "2026-10-27", "第四節「變更前後對照」新增照片欄，每列可附變更前／後照片", ""],
    ["2.1", "2026-10-30", "對應條文重新對照：補列 §8.5.1（試模與驗證）；內容未變更", ""]
  ],
  "FRM-QA-002": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "統一全形標點；「其他影響」欄位排版調整為單列可讀", ""],
    ["2.0", "2026-10-27", "第四節「變更前後對照」新增照片欄，每列可附變更前／後照片", ""],
    ["2.1", "2026-10-30", "對應條文重新對照：改以 §8.5.6 為主並補列 §8.5.1、§7.2；內容未變更", ""]
  ],
  "FRM-EN-001": [
    ["1.0", "2026-10-28", "初版發行", ""],
    ["1.1", "2026-10-30", "對應條文重新對照：§8.3 展開為 §8.3.2～§8.3.5；內容未變更", ""]
  ],
  "FRM-QA-003": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "修正版本歷程章節編號（十→九）；統一全形括號與標點", ""],
    ["1.2", "2026-10-30", "對應條文重新對照：§8.7 細化為 §8.7.1，補列 §8.2.1；內容未變更", ""]
  ],
  "FRM-QA-004": [
    ["1.0", "2026-10-30", "初版發行：進料不合格品判定、授權與供應商矯正措施", ""],
    ["1.1", "2026-10-30", "名稱修正為「進料不合格品處理暨矯正措施單」，同時對應 8.4.2／8.7.1／10.2；內容未變更", ""],
    ["1.2", "2026-10-30", "對應條文重新對照：§8.4.2 標題更正為「管制的類型與程度」並補列 §8.4.1、§10.2.1；內容未變更", ""]
  ],
  "WF-QA-001": [
    ["1.0", "2026-10-24", "初版發行（將既有 Git 版控與發行做法書面化）", ""]
  ],
  "FRM-QA-005": [
    ["1.0", "2026-10-30", "初版發行：量具校正與管理紀錄（7.1.5.1/7.1.5.2）", ""],
    ["2.0", "2026-10-30", "新增「校正方式」欄位（內校／外校／免校正／委外送驗／報廢）；標準器與環境獨立為第三節", ""]
  ],
  "FRM-QA-006": [
    ["1.0", "2026-10-30", "初版發行：矯正措施單（10.2.1/10.2.2）", ""]
  ],
  "FRM-QA-007": [
    ["1.0", "2026-10-30", "初版發行：客訴與退貨處理單（8.5.5/10.2.1）", ""]
  ],
  "FRM-QA-008": [
    ["1.0", "2026-10-30", "初版發行：內部稽核計畫與報告（9.2.1/9.2.2）", ""]
  ],
  "FRM-QA-009": [
    ["1.0", "2026-10-30", "初版發行：管理審查紀錄（9.3.1/9.3.2/9.3.3）", ""],
    ["2.0", "2026-10-30", "審查輸入刪除「外部供方績效」與「資源充分性」兩項，調整為 7 項", ""]
  ],
  "FRM-QA-010": [
    ["1.0", "2026-10-30", "初版發行：供應商評鑑表（8.4.1）", ""]
  ],
  "FRM-QA-011": [
    ["1.0", "2026-10-30", "初版發行：教育訓練紀錄（7.2/7.3）", ""]
  ],
  "FRM-QA-012": [
    ["1.0", "2026-10-30", "初版發行：訂單與合約審查表（8.2.2/8.2.3/8.2.4）", ""]
  ],
  "FRM-QA-013": [
    ["1.0", "2026-10-30", "初版發行：設備保養點檢紀錄（7.1.3/7.1.4）", ""]
  ],
  "FRM-QA-014": [
    ["1.0", "2026-10-30", "初版發行：風險與機會評估表（6.1）", ""]
  ],
  "FRM-QA-015": [
    ["1.0", "2026-10-30", "初版發行：品質目標與達成計畫（6.2.1/6.2.2）", ""]
  ],
  "FRM-QA-016": [
    ["1.0", "2026-10-30", "初版發行：顧客滿意度調查表（9.1.2）", ""]
  ],
  "FRM-QA-017": [
    ["1.0", "2026-10-30", "初版發行：品質績效分析表（9.1.1/9.1.3）", ""]
  ],
  "FRM-QA-018": [
    ["1.0", "2026-10-30", "初版發行：組織背景與利害關係人分析（4.1/4.2）", ""]
  ],
  "FRM-QA-019": [
    ["1.0", "2026-10-30", "初版發行：職責與權限表（5.3）", ""]
  ],
  "FRM-QA-020": [
    ["1.0", "2026-10-30", "初版發行：顧客財產清冊（8.5.3）", ""]
  ]
};

window.ISO_FORMS = [
  {
    id: "FRM-QA-001",
    title: "模具變更單",
    prefix: "MV",
    version: "2.1",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.5.6 變更管制（主）、§8.5.1 生產與服務提供的管制（試模與量產驗證）",
    purpose: "模具尺寸、結構、材質變更之申請、評估、驗證與核准",
        listFields: [
      { k: "s0.product", l: "產品名稱" },
      { k: "s0.itemNo", l: "廠內料號" },
      { k: "s0.moldNo", l: "模具編號" }
    ],
sections: [
      {
        h: "一、基本資料",
        type: "pairs",
        rows: [
          [{ k: "no", l: "變更單號", serial: true }, { k: "applyDate", l: "申請日期", t: "date", req: true }],
          [{ k: "dept", l: "申請部門" }, { k: "applicant", l: "申請人", req: true }],
          [{ k: "product", l: "產品名稱" }, { k: "itemNo", l: "廠內料號" }],
          [{ k: "moldNo", l: "模具編號" }, { k: "moldName", l: "模具名稱／穴數" }],
          [{ k: "supplier", l: "模具供應商" }, { k: "transferDate", l: "模具移交日", t: "date" }]
        ]
      },
      {
        h: "二、變更類別（可複選）",
        type: "checks",
        k: "category",
        items: ["尺寸變更", "外觀變更", "材質變更", "結構變更", "模具壽命改善", "客訴／不良改善", "產能提升"],
        other: true
      },
      { h: "三、變更原因說明", type: "textarea", k: "reason", hint: "敘述現況問題、不良率／客訴件數等量化依據", req: true },
      {
        h: "四、變更前後對照",
        type: "grid",
        k: "compare",
        cols: ["項次", "變更部位", "變更前", "變更後", "差異說明", "照片"],
        photo: true,
        numeric: true,
        rows: 3
      },
      {
        h: "五、影響評估",
        type: "assess",
        k: "impact",
        items: [
          { l: "產品尺寸／公差" },
          { l: "承重規格（kg）", note: "原 ______ kg → 新 ______ kg" },
          { l: "組裝性／互換性" },
          { l: "模具費用", note: "金額" },
          { l: "產品單價", note: "原 ______ → 新 ______" },
          { l: "交期" },
          { l: "在庫品／在製品", note: "數量" },
          { l: "安規／認證", note: "需重測項目" },
          { l: "客戶承認需求", opts: ["否", "是"], note: "承認文件編號" }
        ]
      },
      {
        h: "六、驗證方式與結果",
        type: "verify",
        k: "verify",
        rows: ["試模次數", "首件檢驗（FAI）", "尺寸全檢（關鍵尺寸）", "承重／荷重測試", "壽命／滾動測試", "客戶承認"],
        conclusion: ["可量產", "有條件量產", "不可量產"],
        condition: true
      },
      {
        h: "七、核准",
        type: "sig",
        k: "sign",
        rows: ["申請人", "部門主管", "品保主管", "廠長／總經理"]
      },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-002",
    title: "流程變更單",
    prefix: "PC",
    version: "2.1",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.5.6 變更管制（主）、§8.5.1 生產與服務提供的管制、§7.2 能力（作業標準與訓練）",
    purpose: "製程參數、設備、治具、作業順序變更之 4M1E 評估與驗證",
        listFields: [
      { k: "s0.process", l: "製程名稱" },
      { k: "s0.station", l: "工作站／機台" },
      { k: "s0.product", l: "產品名稱" }
    ],
sections: [
      {
        h: "一、基本資料",
        type: "pairs",
        rows: [
          [{ k: "no", l: "變更單號", serial: true }, { k: "applyDate", l: "申請日期", t: "date", req: true }],
          [{ k: "dept", l: "申請部門" }, { k: "applicant", l: "申請人", req: true }],
          [{ k: "product", l: "產品名稱" }, { k: "itemNo", l: "廠內料號" }],
          [{ k: "process", l: "製程名稱" }, { k: "station", l: "工作站／機台編號" }],
          [{ k: "customer", l: "相關客戶" }, { k: "orderScope", l: "適用訂單／批量" }]
        ]
      },
      {
        h: "二、變更類別（可複選）",
        type: "checks",
        k: "category",
        items: ["製程參數變更", "設備／機台變更", "治具／模具變更", "作業順序變更", "檢驗方式變更", "供應商／外包變更", "作業環境變更"],
        other: true
      },
      { h: "三、變更原因說明", type: "textarea", k: "reason", hint: "敘述現況問題、不良率、產能瓶頸、客訴等量化依據", req: true },
      {
        h: "四、變更前後對照",
        type: "grid",
        k: "compare",
        cols: ["項次", "變更項目", "變更前", "變更後", "差異說明", "照片"],
        photo: true,
        numeric: true,
        rows: 3
      },
      {
        h: "五、4M1E 風險評估",
        type: "m1e",
        k: "m1e",
        rows: [
          ["Man 人員", "技能、訓練需求"],
          ["Machine 設備", "精度、稼動率"],
          ["Material 材料", "材質、供應穩定"],
          ["Method 方法", "參數、標準書"],
          ["其他", ""]
        ]
      },
      {
        h: "六、驗證方式與結果",
        type: "verify",
        k: "verify",
        rows: ["試產批量", "首件檢驗", "製程能力 Cpk", "不良率比較", "可靠度／壽命測試"],
        cols: ["驗證項目", "要求", "結果", "判定"],
        presets: { "製程能力 Cpk": "≥ ______", "不良率比較": "變更前 ___% → 變更後 ___%" },
        conclusion: ["可正式導入", "有條件導入", "不導入"],
        condition: true
      },
      {
        h: "七、文件與訓練",
        type: "docs",
        k: "docs",
        rows: ["作業標準書（SOP）", "檢驗標準（SIP）", "失效模式分析（FMEA）", "控制計畫（Control Plan）", "教育訓練記錄"]
      },
      {
        h: "八、會簽",
        type: "sig",
        k: "countersign",
        rows: ["生產部", "品保部"],
        opinion: true
      },
      {
        h: "九、核准",
        type: "sig",
        k: "sign",
        rows: ["申請人", "部門主管", "品保主管", "廠長／總經理"]
      },
      { h: "十、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-003",
    title: "出貨同意單（讓步接收）",
    prefix: "SA",
    version: "1.2",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.6 產品與服務的放行、§8.7.1 不符合輸出的管制（讓步接收授權）、§8.2.1 顧客溝通",
    purpose: "偏離規格品之讓步接收、客戶同意與出貨條件管制",
    usage: "產品偏離規格或客戶要求，經評估可讓步接收並須取得客戶同意後出貨者。",
        listFields: [
      { k: "s0.product", l: "產品名稱" },
      { k: "s0.customer", l: "客戶名稱" },
      { k: "s0.lot", l: "批號／製造日期" }
    ],
    applicantKey: "s7.sign.0.name",
sections: [
      {
        h: "一、基本資料",
        type: "pairs",
        rows: [
          [{ k: "no", l: "同意單號", serial: true }, { k: "applyDate", l: "申請日期", t: "date", req: true }],
          [{ k: "customer", l: "客戶名稱" }, { k: "contact", l: "客戶聯絡人" }],
          [{ k: "orderNo", l: "訂單號碼" }, { k: "custItem", l: "客戶料號" }],
          [{ k: "product", l: "產品名稱" }, { k: "itemNo", l: "廠內料號" }],
          [{ k: "qty", l: "數量" }, { k: "lot", l: "批號／製造日期" }],
          [{ k: "shipDate", l: "預定出貨日", t: "date" }, { k: "qty2", l: "數量" }]
        ]
      },
      {
        h: "二、偏離規格描述",
        type: "defect",
        k: "defect",
        stages: ["進料", "製程", "成品", "客戶端"]
      },
      {
        h: "三、原因分析",
        type: "textarea",
        k: "cause",
        rows: 3,
        extras: [
          { k: "car", l: "矯正措施單號（CAR）" },
          { k: "carState", l: "開立狀態", opts: ["尚未開立", "不需要"] }
        ]
      },
      {
        h: "四、風險評估",
        type: "assess",
        k: "risk",
        items: [
          { l: "功能／性能" },
          { l: "承重／安全" },
          { l: "外觀" },
          { l: "組裝／互換性" },
          { l: "法規／安規" },
          { l: "客戶產線影響" }
        ],
        footer: [
          { k: "riskLevel", l: "風險等級", opts: ["低", "中", "高"] },
          { k: "assessor", l: "評估人" }
        ]
      },
      {
        h: "五、客戶同意",
        type: "customer",
        k: "agree",
        notify: ["是", "否"],
        methods: ["書面簽回", "Email", "傳真"]
      },
      {
        h: "六、出貨條件",
        type: "ship",
        k: "ship",
        items: [
          { v: "僅限本批", note: "批號" },
          { v: "限量", note: "數量 pcs" },
          { v: "產品加註標示／區隔包裝", note: "方式" },
          { v: "價格折讓", note: "金額" },
          { v: "後續批次須符合原規格", note: "改善完成日" },
          { v: "其他", note: "說明" }
        ]
      },
      {
        h: "七、會簽",
        type: "sig",
        k: "countersign",
        rows: ["品保部", "生產部", "業務部"],
        opinion: true
      },
      {
        h: "八、核准",
        type: "sig",
        k: "sign",
        rows: ["申請人", "品保主管", "業務主管", "廠長／總經理", "董事長（如各部門無法統一決策）"]
      },
      { h: "九、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-EN-001",
    title: "新模具開發單",
    prefix: "DV",
    version: "1.1",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.3.2 設計與開發規劃、§8.3.3 設計與開發輸入、§8.3.4 設計與開發管制、§8.3.5 設計與開發輸出、§8.5.1 生產與服務提供的管制",
    listFields: [
      { k: "s0.product", l: "產品名稱" },
      { k: "s0.moldName", l: "模具名稱／穴數" },
      { k: "s0.customer", l: "客戶名稱" }
    ],
    sections: [
      {
        h: "一、基本資料",
        type: "pairs",
        rows: [
          [{ k: "no", l: "開發單號", serial: true }, { k: "applyDate", l: "申請日期", t: "date", req: true }],
          [{ k: "dept", l: "申請部門" }, { k: "applicant", l: "申請人", req: true }],
          [{ k: "customer", l: "客戶名稱" }, { k: "contact", l: "客戶聯絡人" }],
          [{ k: "product", l: "產品名稱" }, { k: "itemNo", l: "廠內料號" }],
          [{ k: "moldName", l: "模具名稱／穴數" }, { k: "moldType", l: "模具類型（新開／複製／移轉）" }],
          [{ k: "dueDate", l: "預定交模日", t: "date" }, { k: "mpDate", l: "需求量產日", t: "date" }]
        ]
      },
      {
        h: "二、開發需求（設計輸入）",
        type: "table",
        k: "spec",
        rows: 8,
        rowLabels: ["產品材質", "產品尺寸／重量", "關鍵尺寸與公差", "表面處理要求", "產能需求", "適用機台", "客戶規格文件編號", "法規／安規要求"],
        cols: [{ l: "項目", static: true, w: "24%" }, { l: "內容" }]
      },
      {
        h: "三、開發計畫與進度",
        type: "table",
        k: "plan",
        rows: 6,
        rowLabels: ["模具設計", "模具製作", "試模", "樣品量測（FAI）", "客戶送樣承認", "量產移轉"],
        cols: [
          { l: "項次", num: true, w: "7%" },
          { l: "工作項目", static: true, w: "23%" },
          { l: "負責人／廠商", w: "20%" },
          { l: "預定完成", w: "14%" },
          { l: "實際完成", w: "14%" },
          { l: "狀態", opts: ["未開始", "進行中", "完成"], w: "22%" }
        ]
      },
      {
        h: "四、設計審查與驗證",
        type: "table",
        k: "review",
        rows: 3,
        rowLabels: ["設計審查日期", "參與單位", "審查結論"],
        cols: [{ l: "項目", static: true, w: "24%" }, { l: "內容（通過／有條件通過／退回重設計）" }]
      },
      {
        h: "驗證結果",
        type: "verify",
        k: "verify",
        rows: ["試模次數", "尺寸全檢（FAI）", "外觀檢查", "功能／承重測試", "模具壽命評估", "客戶承認"],
        presets: { "尺寸全檢（FAI）": "關鍵尺寸　　項全檢", "外觀檢查": "無毛邊、縮水、氣孔", "客戶承認": "承認文件編號" },
        conclusion: ["可量產", "有條件量產", "不可量產"]
      },
      {
        h: "五、開發成本",
        type: "table",
        k: "cost",
        rows: 6,
        rowLabels: ["模具費", "設計費", "試模費", "修改費", "其他", "合計"],
        cols: [
          { l: "項目", static: true, w: "26%" },
          { l: "金額（未稅）", ph: "0" },
          { l: "備註" }
        ]
      },
      {
        h: "",
        type: "table",
        k: "costTerms",
        rows: 2,
        rowLabels: ["分攤方式", "付款條件"],
        cols: [{ l: "項目", static: true, w: "26%" }, { l: "內容（一次性認列／攤入單價　元／件）" }]
      },
      {
        h: "六、風險與對策",
        type: "table",
        k: "risk",
        rows: 3,
        cols: [
          { l: "風險項目", w: "26%" },
          { l: "影響（品質／交期／成本）", w: "26%" },
          { l: "等級", opts: ["低", "中", "高"], w: "20%" },
          { l: "對策" }
        ]
      },
      {
        h: "七、核准",
        type: "sig",
        k: "sign",
        rows: ["申請人", "工程主管", "品保主管", "廠長／總經理"]
      },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-004",
    title: "進料不合格品處理暨矯正措施單",
    prefix: "IQ",
    version: "1.2",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.4.1 一般、§8.4.2 管制的類型與程度（收貨查驗）、§8.7.1 不符合輸出的管制、§10.2.1 不合格與矯正措施",
    purpose: "收貨檢驗不合格之判定、授權放行與供應商矯正措施追溯",
    usage: "收貨檢驗（IQC）判定不合格，或上線使用時發現原物料、委外加工品不符規格，須判定處理方式、留下授權紀錄並要求供應商矯正者。",
    listFields: [
      { k: "s0.product", l: "產品名稱" },
      { k: "s0.supplier", l: "供應商名稱" },
      { k: "s0.lot", l: "進料批號" }
    ],
    sections: [
      {
        h: "一、基本資料",
        type: "pairs",
        rows: [
          [{ k: "no", l: "不合格單號", serial: true }, { k: "applyDate", l: "通報日期", t: "date", req: true }],
          [{ k: "dept", l: "申請部門" }, { k: "applicant", l: "通報人", req: true }],
          [{ k: "supplier", l: "供應商名稱" }, { k: "supplierCode", l: "供應商代碼" }],
          [{ k: "poNo", l: "採購單號" }, { k: "inDate", l: "進料日期", t: "date" }],
          [{ k: "product", l: "產品名稱" }, { k: "itemNo", l: "廠內料號" }],
          [{ k: "lot", l: "進料批號" }, { k: "qty", l: "進料數量（pcs）" }],
          [{ k: "sampleQty", l: "抽樣數（pcs）" }, { k: "defectQty", l: "不良數量（pcs）" }],
          [{ k: "defectRate", l: "不良率（%）" }, { k: "basis", l: "檢驗依據（SIP／圖面編號）" }]
        ]
      },
      {
        h: "二、檢驗與判定",
        type: "table",
        k: "inspect",
        rows: 4,
        cols: [
          { l: "檢驗項目", w: "26%" },
          { l: "規格要求", w: "32%" },
          { l: "檢驗結果" },
          { l: "判定", opts: ["合格", "不合格"], w: "20%" }
        ]
      },
      {
        h: "",
        type: "pairs",
        rows: [
          [{ k: "inspMethod", l: "檢驗方式（全檢／抽樣 AQL）" }, { k: "inspector", l: "檢驗員" }]
        ]
      },
      {
        h: "三、不良現象描述",
        type: "defect",
        k: "defect",
        stages: ["收貨檢驗", "上線使用", "委外加工回廠", "客戶端反映"]
      },
      {
        h: "",
        type: "checks",
        k: "defectType",
        items: ["尺寸", "外觀", "材質", "功能／性能", "包裝／標示", "文件／證明文件"],
        other: true
      },
      {
        h: "四、原因分析",
        type: "textarea",
        k: "cause",
        rows: 3,
        hint: "敘述造成不良的可能原因（供應商製程、運輸、本公司規格或保管）",
        extras: [
          { k: "owner", l: "責任歸屬", opts: ["供應商", "運輸過程", "本公司", "待確認"] }
        ]
      },
      {
        h: "五、處理判定（8.7.1）",
        type: "table",
        k: "disposition",
        rows: 5,
        rowLabels: ["退貨／換貨", "特採（讓步接收）", "全檢挑選（選別）", "報廢", "轉其他用途／降級使用"],
        cols: [
          { l: "處理方式", static: true, w: "34%" },
          { l: "採用", opts: ["否", "是"], w: "20%" },
          { l: "數量／說明" }
        ]
      },
      {
        h: "六、授權與客戶同意（未經授權不得放行）",
        type: "table",
        k: "auth",
        rows: 4,
        rowLabels: ["授權人（品保主管）", "授權日期", "授權範圍（批號／數量）", "客戶同意（FRM-QA-003 單號）"],
        cols: [
          { l: "項目", static: true, w: "34%" },
          { l: "內容" }
        ]
      },
      {
        h: "",
        type: "pairs",
        rows: [
          [{ k: "needCustomer", l: "是否需客戶書面同意（是／否）" }, { k: "custAgreeDate", l: "客戶同意日期", t: "date" }]
        ]
      },
      {
        h: "七、供應商矯正措施與追溯（10.2）",
        type: "checks",
        k: "carType",
        items: ["8D 報告", "CAR 矯正措施單", "供應商現場輔導", "不需矯正措施"],
        other: true
      },
      {
        h: "",
        type: "table",
        k: "car",
        rows: 6,
        rowLabels: ["矯正措施單號", "要求回覆期限", "供應商回覆日期", "對策內容摘要", "索賠／扣款金額", "有效性確認方式"],
        cols: [
          { l: "項目", static: true, w: "30%" },
          { l: "內容（期限請填 YYYY-MM-DD）" }
        ]
      },
      {
        h: "",
        type: "pairs",
        rows: [
          [{ k: "carResult", l: "有效性確認結果（有效／無效／未確認）" }, { k: "supplierGrade", l: "供應商評鑑調整（維持／降級／停用／觀察）" }]
        ]
      },
      {
        h: "八、結案",
        type: "pairs",
        rows: [
          [{ k: "closeDate", l: "結案日期", t: "date" }, { k: "closer", l: "結案人員" }],
          [{ k: "closeNote", l: "處置結果說明" }, { k: "stockNote", l: "庫存／在製品處理" }]
        ]
      },
      {
        h: "九、會簽",
        type: "sig",
        k: "countersign",
        rows: ["品保部", "採購部", "生管／倉儲"],
        opinion: true
      },
      {
        h: "十、核准",
        type: "sig",
        k: "sign",
        rows: ["通報人", "品保主管", "採購主管", "廠長／總經理"]
      },
      { h: "十一、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-005",
    title: "量具校正與管理紀錄",
    prefix: "GA",
    version: "2.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §7.1.5.1 一般、§7.1.5.2 量測追溯",
    purpose: "量具校正與管理紀錄之紀錄、判定與簽核",
    usage: "量測與監控設備（卡尺、分厘卡、投影機、拉力計、磅秤等）之校正、驗收、判定與追溯；校正不合格時評估過去量測結果之有效性。",
    listFields: [
      { k: "s0.cdate", l: "校正日期" },
      { k: "s0.gauge", l: "量具名稱" },
      { k: "s0.asset", l: "資產編號" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "校正單號", serial: true }, { k: "cdate", l: "校正日期", t: "date", req: true }], [{ k: "gauge", l: "量具名稱", req: true }, { k: "asset", l: "資產編號" }], [{ k: "model", l: "廠牌／型號" }, { k: "range", l: "量測範圍" }], [{ k: "resolve", l: "解析度／精度" }, { k: "dept", l: "使用單位" }], [{ k: "keeper", l: "保管人" }, { k: "cycle", l: "校正週期（月）" }], [{ k: "nextdate", l: "下次校正日", t: "date" }, { k: "place", l: "存放位置" }]] },
      { h: "二、校正方式", type: "checks", k: "m0", items: ["內校", "外校", "免校正（僅外觀檢查）", "委外送驗", "報廢"] },
      { h: "三、標準器與環境", type: "table", k: "m1", rows: 3, rowLabels: ["標準器編號", "標準器校正日", "環境（溫度／濕度）"], cols: [{ l: "項目", w: "26%", static: true }, { l: "內容" }] },
      { h: "四、校正結果", type: "table", k: "r1", rows: 5, rowLabels: ["1", "2", "3", "4", "5"], cols: [{ l: "校正點", w: "8%", num: true }, { l: "標準值" }, { l: "實測值" }, { l: "誤差" }, { l: "判定", w: "18%", opts: ["合格", "不合格"] }] },
      { h: "五、綜合判定與處置", type: "table", k: "j1", rows: 3, rowLabels: ["最大誤差", "既有量測結果之影響", "需調整或維修"], cols: [{ l: "項目", w: "30%", static: true }, { l: "內容" }] },
      { h: "", type: "table", k: "j2", rows: 1, rowLabels: ["綜合判定"], cols: [{ l: "項目", w: "30%", static: true }, { l: "說明" }, { l: "判定", w: "18%", opts: ["合格", "不合格"] }] },
      { h: "六、不合格追溯與處置說明", type: "textarea", k: "x1", rows: 3, hint: "校正不合格時，說明受影響期間、批號、已量測產品之重驗或回收處置" },
      { h: "七、簽核", type: "sig", k: "g1", rows: ["校正人員", "品保主管"] },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-006",
    title: "矯正措施單",
    prefix: "CA",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §10.2.1 不合格與矯正措施、§10.2.2 文件化資訊",
    purpose: "矯正措施單之紀錄、判定與簽核",
    usage: "發生客訴、進料／製程／成品不合格、內外部稽核缺失或管理審查決議時，用以記錄原因分析、矯正措施與有效性確認。FRM-QA-003、FRM-QA-004、FRM-QA-007、FRM-QA-008 之矯正措施單號均指向本表。",
    listFields: [
      { k: "s0.cdate", l: "開立日期" },
      { k: "s0.owner", l: "開立人" },
      { k: "s0.dept", l: "責任單位" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "矯正單號", serial: true }, { k: "cdate", l: "開立日期", t: "date", req: true }], [{ k: "owner", l: "開立人", req: true }, { k: "dept", l: "責任單位" }], [{ k: "source", l: "來源單號（客訴／不合格／稽核）" }, { k: "related", l: "相關表單編號" }]] },
      { h: "二、不合格來源", type: "checks", k: "c1", items: ["客訴", "進料不合格", "製程不合格", "成品不合格", "內部稽核", "外部稽核", "管理審查", "供應商"] },
      { h: "三、不合格描述", type: "textarea", k: "x1", rows: 3, hint: "發生時間、地點、批次、數量、具體現象" },
      { h: "四、立即處置（遏制）", type: "textarea", k: "x2", rows: 2, hint: "隔離、重工、全檢、停止出貨等；含完成日" },
      { h: "五、原因分析", type: "textarea", k: "x3", rows: 3, hint: "5 Why／魚骨圖／8D 分析結果；區分真因與表徵", extras: [{ k: "method", l: "分析方法", opts: ["5 Why", "魚骨圖", "8D", "其他"] }] },
      { h: "六、矯正措施", type: "table", k: "t1", rows: 4, rowLabels: ["1", "2", "3", "4"], cols: [{ l: "項次", w: "8%", num: true }, { l: "措施內容" }, { l: "責任人", w: "14%" }, { l: "預定完成日", w: "14%", t: "date" }, { l: "完成日", w: "14%", t: "date" }] },
      { h: "七、有效性確認", type: "table", k: "t2", rows: 3, rowLabels: ["確認方式", "確認日期", "再發次數"], cols: [{ l: "項目", w: "26%", static: true }, { l: "內容" }] },
      { h: "", type: "table", k: "t3", rows: 1, rowLabels: ["有效性判定"], cols: [{ l: "項目", w: "26%", static: true }, { l: "說明" }, { l: "結果", w: "22%", opts: ["有效", "無效", "待觀察"] }] },
      { h: "八、結案說明", type: "textarea", k: "x4", rows: 2, hint: "是否需更新風險清單、作業標準或 FMEA" },
      { h: "九、簽核", type: "sig", k: "g1", rows: ["責任人", "責任主管", "品保主管", "管理者代表"] },
      { h: "十、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-007",
    title: "客訴與退貨處理單",
    prefix: "CP",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.5.5 交貨後活動、§10.2.1 不合格與矯正措施",
    purpose: "客訴與退貨處理單之紀錄、判定與簽核",
    usage: "客戶反映品質、交期、包裝或服務問題，或發生退貨時使用；判定客訴成立與否、退換貨處理方式，並連結矯正措施單。",
    listFields: [
      { k: "s0.cdate", l: "受理日期" },
      { k: "s0.cust", l: "客戶名稱" },
      { k: "s0.contact", l: "客戶聯絡人" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "客訴單號", serial: true }, { k: "cdate", l: "受理日期", t: "date", req: true }], [{ k: "cust", l: "客戶名稱", req: true }, { k: "contact", l: "客戶聯絡人" }], [{ k: "cordno", l: "客戶單號" }, { k: "product", l: "產品名稱" }], [{ k: "lot", l: "批號／序號" }, { k: "shipdate", l: "出貨日期", t: "date" }], [{ k: "qty", l: "數量（pcs）" }, { k: "receive", l: "受理人" }]] },
      { h: "二、客訴類別", type: "checks", k: "c1", items: ["品質", "交期", "包裝", "標示／文件", "運輸損壞", "服務", "其他"], other: true },
      { h: "三、客訴內容", type: "textarea", k: "x1", rows: 3, hint: "客戶描述之現象、發生時間、影響範圍" },
      { h: "四、客訴判定", type: "table", k: "t1", rows: 2, rowLabels: ["判定理由", "責任歸屬"], cols: [{ l: "項目", w: "26%", static: true }, { l: "內容" }] },
      { h: "", type: "table", k: "t1b", rows: 1, rowLabels: ["客訴是否成立"], cols: [{ l: "項目", w: "26%", static: true }, { l: "說明" }, { l: "結果", w: "24%", opts: ["成立", "不成立", "待確認"] }] },
      { h: "五、退換貨處理", type: "table", k: "t2", rows: 5, rowLabels: ["退貨", "換貨", "重工／選別", "折讓", "報廢"], cols: [{ l: "處理方式", w: "28%", static: true }, { l: "採用", w: "12%", opts: ["否", "是"] }, { l: "數量／說明" }] },
      { h: "六、原因分析與矯正措施", type: "pairs", rows: [[{ k: "cause", l: "原因分析" }, { k: "car", l: "矯正措施單號" }]] },
      { h: "七、客戶回覆", type: "pairs", rows: [[{ k: "replydate", l: "回覆日期", t: "date" }, { k: "replyby", l: "回覆人" }], [{ k: "custok", l: "客戶確認", req: true }, { k: "close", l: "結案日", t: "date" }]] },
      { h: "八、簽核", type: "sig", k: "g1", rows: ["業務", "品保", "廠長"], opinion: true },
      { h: "九、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-008",
    title: "內部稽核計畫與報告",
    prefix: "IA",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §9.2.1 內部稽核、§9.2.2 稽核方案",
    purpose: "內部稽核計畫與報告之紀錄、判定與簽核",
    usage: "年度內部稽核之計畫、查檢結果、不符合事項與結論；亦適用外部稽核前之預稽。",
    listFields: [
      { k: "s0.adate", l: "稽核日期" },
      { k: "s0.scope", l: "稽核範圍／條文" },
      { k: "s0.area", l: "受稽單位" }
    ],
    sections: [
      { h: "一、稽核基本資料", type: "pairs", rows: [[{ k: "no", l: "稽核編號", serial: true }, { k: "adate", l: "稽核日期", t: "date", req: true }], [{ k: "scope", l: "稽核範圍／條文", req: true }, { k: "area", l: "受稽單位" }], [{ k: "auditor", l: "稽核員" }, { k: "guide", l: "陪同人員" }], [{ k: "last", l: "前次稽核日", t: "date" }, { k: "standard", l: "稽核依據" }]] },
      { h: "二、稽核類別", type: "checks", k: "c1", items: ["內部稽核", "外部稽核", "供應商稽核", "追蹤稽核"] },
      { h: "三、稽核時程", type: "table", k: "t1", rows: 4, rowLabels: ["1", "2", "3", "4"], cols: [{ l: "時間", w: "16%" }, { l: "條文／過程" }, { l: "稽核員", w: "20%" }, { l: "備註" }] },
      { h: "四、查檢結果", type: "table", k: "t2", rows: 8, rowLabels: ["1", "2", "3", "4", "5", "6", "7", "8"], cols: [{ l: "條文", w: "12%" }, { l: "查核事項" }, { l: "結果", w: "22%", opts: ["符合", "觀察", "不符合"] }, { l: "說明" }] },
      { h: "五、不符合事項", type: "table", k: "t3", rows: 4, rowLabels: ["1", "2", "3", "4"], cols: [{ l: "項次", w: "8%", num: true }, { l: "條文", w: "12%" }, { l: "不符合描述" }, { l: "等級", w: "14%", opts: ["重大", "輕微"] }, { l: "矯正單號", w: "16%" }] },
      { h: "六、稽核結論", type: "textarea", k: "x1", rows: 3, hint: "系統有效性之整體評價、建議事項" },
      { h: "七、簽核", type: "sig", k: "g1", rows: ["稽核員", "稽核組長", "管理者代表"] },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-009",
    title: "管理審查紀錄",
    prefix: "MR",
    version: "2.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §9.3.1 一般、§9.3.2 管理審查輸入、§9.3.3 管理審查輸出",
    purpose: "管理審查紀錄之紀錄、判定與簽核",
    usage: "定期（至少每年一次）由最高管理者審查品質管理系統之適用性、充分性與有效性；記錄七項輸入之結論與決議。",
    listFields: [
      { k: "s0.mdate", l: "會議日期" },
      { k: "s0.chair", l: "主席" },
      { k: "s0.attend", l: "出席人員" }
    ],
    sections: [
      { h: "一、會議基本資料", type: "pairs", rows: [[{ k: "no", l: "紀錄編號", serial: true }, { k: "mdate", l: "會議日期", t: "date", req: true }], [{ k: "chair", l: "主席", req: true }, { k: "attend", l: "出席人員" }], [{ k: "observer", l: "列席人員" }, { k: "last", l: "上次審查日", t: "date" }]] },
      { h: "二、審查輸入（9.3.2）", type: "table", k: "t1", rows: 7, rowLabels: ["前次決議執行情形", "內外部議題之變更", "顧客滿意與回饋", "品質目標達成情形", "不合格與矯正措施", "稽核結果", "風險與機會措施有效性"], cols: [{ l: "輸入項目", w: "30%", static: true }, { l: "報告人", w: "14%" }, { l: "摘要" }] },
      { h: "三、審查輸出（9.3.3）", type: "table", k: "t2", rows: 5, rowLabels: ["1", "2", "3", "4", "5"], cols: [{ l: "項次", w: "8%", num: true }, { l: "決議事項" }, { l: "責任人", w: "14%" }, { l: "完成日", w: "16%", t: "date" }] },
      { h: "四、結論與資源需求", type: "textarea", k: "x1", rows: 3, hint: "QMS 是否持續適用、充分、有效；需投入之資源" },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["主席", "記錄", "管理者代表"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-010",
    title: "供應商評鑑表",
    prefix: "SE",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.4.1 一般（外部供方之選擇、評估與再評估）",
    purpose: "供應商評鑑表之紀錄、判定與簽核",
    usage: "新供應商登錄、年度再評鑑或重大品質事件後之複評；評鑑結果決定合格、條件合格或不合格，並作為合格供應商名錄之依據。",
    listFields: [
      { k: "s0.sdate", l: "評鑑日期" },
      { k: "s0.vendor", l: "供應商名稱" },
      { k: "s0.code", l: "供應商代碼" }
    ],
    sections: [
      { h: "一、供應商資料", type: "pairs", rows: [[{ k: "no", l: "評鑑編號", serial: true }, { k: "sdate", l: "評鑑日期", t: "date", req: true }], [{ k: "vendor", l: "供應商名稱", req: true }, { k: "code", l: "供應商代碼" }], [{ k: "contact", l: "聯絡人" }, { k: "phone", l: "電話" }], [{ k: "item", l: "供應項目" }, { k: "scale", l: "資本額／員工數" }]] },
      { h: "二、評鑑方式", type: "checks", k: "c1", items: ["書面審查", "現場評鑑", "樣品試作", "既有交貨實績"] },
      { h: "三、評鑑項目", type: "table", k: "t1", rows: 6, rowLabels: ["品質系統", "製程能力", "交期配合", "價格競爭力", "服務與回應", "環安衛"], cols: [{ l: "項目", w: "24%", static: true }, { l: "配分", w: "12%" }, { l: "得分", w: "12%" }, { l: "說明" }] },
      { h: "四、總分與等級", type: "table", k: "t2", rows: 3, rowLabels: ["總分", "合格門檻", "備註"], cols: [{ l: "項目", w: "24%", static: true }, { l: "內容" }] },
      { h: "", type: "table", k: "t3", rows: 1, rowLabels: ["評鑑等級"], cols: [{ l: "項目", w: "24%", static: true }, { l: "說明" }, { l: "判定", w: "22%", opts: ["A", "B", "C", "D"] }] },
      { h: "五、評鑑結論", type: "checks", k: "c2", items: ["合格供應商", "條件合格（限期改善）", "不合格", "暫停交易"] },
      { h: "六、缺失與改善要求", type: "textarea", k: "x1", rows: 3, hint: "缺失項目、要求完成日、追蹤方式" },
      { h: "七、簽核", type: "sig", k: "g1", rows: ["評鑑人員", "採購", "品保主管", "廠長"] },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-011",
    title: "教育訓練紀錄",
    prefix: "TR",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §7.2 能力、§7.3 認知",
    purpose: "教育訓練紀錄之紀錄、判定與簽核",
    usage: "新人訓練、在職訓練、專業技能、環安衛與內部講師培訓之紀錄；作為人員能力與資格認定之證據。",
    listFields: [
      { k: "s0.tdate", l: "上課日期" },
      { k: "s0.course", l: "課程名稱" },
      { k: "s0.teacher", l: "講師" }
    ],
    sections: [
      { h: "一、訓練基本資料", type: "pairs", rows: [[{ k: "no", l: "訓練編號", serial: true }, { k: "tdate", l: "上課日期", t: "date", req: true }], [{ k: "course", l: "課程名稱", req: true }, { k: "teacher", l: "講師" }], [{ k: "hours", l: "時數" }, { k: "place", l: "地點" }], [{ k: "host", l: "主辦單位" }, { k: "method", l: "授課方式" }]] },
      { h: "二、訓練類別", type: "checks", k: "c1", items: ["新人訓練", "在職訓練", "專業技能", "環安衛", "內部講師", "外部訓練"] },
      { h: "三、學員名單", type: "table", k: "t1", rows: 8, rowLabels: ["1", "2", "3", "4", "5", "6", "7", "8"], cols: [{ l: "項次", w: "8%", num: true }, { l: "姓名" }, { l: "部門", w: "20%" }, { l: "職稱", w: "18%" }, { l: "簽到", w: "16%" }] },
      { h: "四、訓練內容摘要", type: "textarea", k: "x1", rows: 3, hint: "主要綱要、教材或講義編號" },
      { h: "五、成效評估", type: "table", k: "t2", rows: 4, rowLabels: ["筆試", "實作", "問卷", "主管觀察"], cols: [{ l: "評估方式", w: "24%", static: true }, { l: "分數／結果" }, { l: "判定", w: "18%", opts: ["合格", "不合格"] }] },
      { h: "六、資格認定", type: "pairs", rows: [[{ k: "cert", l: "認定項目／資格" }, { k: "valid", l: "有效期限", t: "date" }]] },
      { h: "七、簽核", type: "sig", k: "g1", rows: ["講師", "主辦單位", "單位主管"] },
      { h: "八、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-012",
    title: "訂單與合約審查表",
    prefix: "OR",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.2.2 決定產品與服務要求、§8.2.3 審查產品與服務要求、§8.2.4 產品與服務要求的變更",
    purpose: "訂單與合約審查表之紀錄、判定與簽核",
    usage: "接單前確認規格、品質、交期、包裝、價格與法規要求之符合能力；客戶要求變更時記錄變更事項與文件更新。",
    listFields: [
      { k: "s0.rdate", l: "審查日期" },
      { k: "s0.cust", l: "客戶名稱" },
      { k: "s0.order", l: "訂單／合約號" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "審查編號", serial: true }, { k: "rdate", l: "審查日期", t: "date", req: true }], [{ k: "cust", l: "客戶名稱", req: true }, { k: "order", l: "訂單／合約號" }], [{ k: "product", l: "產品名稱" }, { k: "qty", l: "數量" }], [{ k: "duedate", l: "要求交期", t: "date" }, { k: "amount", l: "金額" }]] },
      { h: "二、要求確認", type: "table", k: "t1", rows: 7, rowLabels: ["產品規格", "品質要求", "交期能力", "包裝方式", "價格與付款", "法規要求", "售後服務"], cols: [{ l: "項目", w: "20%", static: true }, { l: "客戶要求" }, { l: "本公司能力" }, { l: "差異", w: "14%" }, { l: "判定", w: "16%", opts: ["符合", "待確認", "不符"] }] },
      { h: "三、審查結論", type: "table", k: "t2", rows: 2, rowLabels: ["條件說明", "核准層級"], cols: [{ l: "項目", w: "22%", static: true }, { l: "內容" }] },
      { h: "", type: "table", k: "t3", rows: 1, rowLabels: ["審查結論"], cols: [{ l: "項目", w: "22%", static: true }, { l: "說明" }, { l: "結果", w: "26%", opts: ["可接受", "有條件接受", "無法接受"] }] },
      { h: "四、要求變更記錄（8.2.4）", type: "textarea", k: "x1", rows: 3, hint: "變更項目、客戶文件編號、需更新之內部文件與版次" },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["業務", "生管", "品保", "廠長"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-013",
    title: "設備保養點檢紀錄",
    prefix: "EQ",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §7.1.3 基礎設施、§7.1.4 過程運作之環境",
    purpose: "設備保養點檢紀錄之紀錄、判定與簽核",
    usage: "生產與量測設備之日／週／月／年度保養點檢、故障維修與備品更換紀錄，確保基礎設施維持在可用狀態。",
    listFields: [
      { k: "s0.edate", l: "日期" },
      { k: "s0.equip", l: "設備名稱" },
      { k: "s0.ecode", l: "設備編號" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "紀錄編號", serial: true }, { k: "edate", l: "日期", t: "date", req: true }], [{ k: "equip", l: "設備名稱", req: true }, { k: "ecode", l: "設備編號" }], [{ k: "dept", l: "使用單位" }, { k: "keeper", l: "操作人員" }]] },
      { h: "二、保養類別", type: "checks", k: "c1", items: ["日點檢", "週保養", "月保養", "年度保養", "故障維修", "精度校正後"] },
      { h: "三、點檢項目", type: "table", k: "t1", rows: 8, rowLabels: ["外觀清潔", "潤滑狀態", "運轉聲音／震動", "精度確認", "安全裝置", "管路與空壓", "電控與指示燈", "周遭環境（7.1.4）"], cols: [{ l: "項目", w: "26%", static: true }, { l: "結果", w: "20%", opts: ["正常", "異常", "不適用"] }, { l: "說明" }] },
      { h: "四、異常與處理", type: "textarea", k: "x1", rows: 3, hint: "異常現象、處理方式、是否停機、是否影響產品" },
      { h: "五、備品更換與下次保養", type: "pairs", rows: [[{ k: "part", l: "更換零件" }, { k: "partqty", l: "數量" }], [{ k: "nextdate", l: "下次保養日", t: "date" }, { k: "cost", l: "費用" }]] },
      { h: "六、簽核", type: "sig", k: "g1", rows: ["操作人員", "設備維護", "單位主管"] },
      { h: "七、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-014",
    title: "風險與機會評估表",
    prefix: "RI",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §6.1 處理風險與機會之行動",
    purpose: "風險與機會評估表之紀錄、判定與簽核",
    usage: "依 4.1 組織背景與 4.2 利害關係人，辨識品質管理系統層級之風險與機會，評估等級並訂定因應措施；每年或環境重大變化時更新。",
    listFields: [
      { k: "s0.rdate", l: "評估日期" },
      { k: "s0.scope", l: "評估範圍" },
      { k: "s0.members", l: "參與人員" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "評估編號", serial: true }, { k: "rdate", l: "評估日期", t: "date", req: true }], [{ k: "scope", l: "評估範圍" }, { k: "members", l: "參與人員" }], [{ k: "review", l: "下次檢視日", t: "date" }, { k: "basis", l: "評估依據" }]] },
      { h: "二、風險與機會清單", type: "table", k: "t1", rows: 6, rowLabels: ["1", "2", "3", "4", "5", "6"], cols: [{ l: "項次", w: "7%", num: true }, { l: "描述" }, { l: "類別", w: "12%", opts: ["風險", "機會"] }, { l: "可能性", w: "11%", opts: ["低", "中", "高"] }, { l: "影響", w: "11%", opts: ["低", "中", "高"] }, { l: "等級", w: "11%", opts: ["低", "中", "高"] }] },
      { h: "三、因應措施", type: "table", k: "t2", rows: 5, rowLabels: ["1", "2", "3", "4", "5"], cols: [{ l: "項次", w: "7%", num: true }, { l: "對應項次", w: "12%" }, { l: "措施內容" }, { l: "責任人", w: "13%" }, { l: "完成日", w: "14%", t: "date" }] },
      { h: "四、有效性評估", type: "textarea", k: "x1", rows: 3, hint: "措施是否降低風險／掌握機會；殘餘風險是否可接受" },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["評估人員", "管理者代表"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-015",
    title: "品質目標與達成計畫",
    prefix: "QO",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §6.2.1 品質目標、§6.2.2 品質目標之達成規劃",
    purpose: "品質目標與達成計畫之紀錄、判定與簽核",
    usage: "年度品質目標之訂定、衡量方式、目標值與達成情形；每季或每月檢討一次，未達成者提出改善行動。",
    listFields: [
      { k: "s0.year", l: "年度" },
      { k: "s0.maker", l: "制定人" },
      { k: "s0.idate", l: "制定日期" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "目標編號", serial: true }, { k: "year", l: "年度", req: true }], [{ k: "maker", l: "制定人" }, { k: "idate", l: "制定日期", t: "date" }], [{ k: "review", l: "檢討頻率" }, { k: "lastreview", l: "最近檢討日", t: "date" }]] },
      { h: "二、目標與達成情形", type: "table", k: "t1", rows: 5, rowLabels: ["1", "2", "3", "4", "5"], cols: [{ l: "項次", w: "7%", num: true }, { l: "目標項目" }, { l: "衡量指標" }, { l: "目標值", w: "11%" }, { l: "實際值", w: "11%" }, { l: "判定", w: "13%", opts: ["達成", "未達成"] }] },
      { h: "三、達成計畫", type: "table", k: "t2", rows: 4, rowLabels: ["1", "2", "3", "4"], cols: [{ l: "項次", w: "7%", num: true }, { l: "措施" }, { l: "責任人", w: "14%" }, { l: "資源需求", w: "20%" }, { l: "完成日", w: "14%", t: "date" }] },
      { h: "四、檢討與改善", type: "textarea", k: "x1", rows: 3, hint: "未達成原因、改善行動、是否需開立矯正措施單" },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["制定", "核准"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-016",
    title: "顧客滿意度調查表",
    prefix: "CS",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §9.1.2 顧客滿意度",
    purpose: "顧客滿意度調查表之紀錄、判定與簽核",
    usage: "定期（至少每年）調查顧客對產品品質、交期、服務與技術支援之滿意程度，作為績效評估與改善之輸入。",
    listFields: [
      { k: "s0.sdate", l: "調查日期" },
      { k: "s0.cust", l: "客戶名稱" },
      { k: "s0.contact", l: "回覆人" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "調查編號", serial: true }, { k: "sdate", l: "調查日期", t: "date", req: true }], [{ k: "cust", l: "客戶名稱", req: true }, { k: "contact", l: "回覆人" }], [{ k: "product", l: "產品／服務" }, { k: "channel", l: "回覆方式" }]] },
      { h: "二、滿意度評分", type: "table", k: "t1", rows: 7, rowLabels: ["產品品質", "交期準確", "包裝與標示", "服務回應速度", "技術支援", "價格競爭力", "整體滿意度"], cols: [{ l: "項目", w: "24%", static: true }, { l: "評分", opts: ["很滿意", "滿意", "普通", "不滿意", "很不滿意"] }, { l: "說明", w: "26%" }] },
      { h: "三、顧客意見", type: "textarea", k: "x1", rows: 3, hint: "具體建議、抱怨事項、期望改善方向" },
      { h: "四、統計結果", type: "pairs", rows: [[{ k: "score", l: "總分" }, { k: "grade", l: "滿意度等級" }]] },
      { h: "五、後續處理", type: "pairs", rows: [[{ k: "need", l: "是否需改善" }, { k: "car", l: "矯正措施單／客訴單號" }]] },
      { h: "六、簽核", type: "sig", k: "g1", rows: ["調查人員", "品保主管"] },
      { h: "七、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-017",
    title: "品質績效分析表",
    prefix: "QP",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §9.1.1 一般（監控、量測、分析與評估）、§9.1.3 分析與評估",
    purpose: "品質績效分析表之紀錄、判定與簽核",
    usage: "每月或每季彙整品質指標（不良率、客訴件數、退貨率、逾期交期、供應商不良），分析趨勢並提出改善行動。",
    listFields: [
      { k: "s0.period", l: "分析期間" },
      { k: "s0.maker", l: "製表人" },
      { k: "s0.idate", l: "製表日期" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "分析編號", serial: true }, { k: "period", l: "分析期間", req: true }], [{ k: "maker", l: "製表人" }, { k: "idate", l: "製表日期", t: "date" }]] },
      { h: "二、指標統計", type: "table", k: "t1", rows: 6, rowLabels: ["1", "2", "3", "4", "5", "6"], cols: [{ l: "項次", w: "7%", num: true }, { l: "指標名稱" }, { l: "前期", w: "11%" }, { l: "本期", w: "11%" }, { l: "目標", w: "11%" }, { l: "趨勢", w: "13%", opts: ["上升", "下降", "持平"] }, { l: "判定", w: "13%", opts: ["達標", "未達標"] }] },
      { h: "三、分析", type: "textarea", k: "x1", rows: 3, hint: "主要變異原因、與前期差異、影響層面" },
      { h: "四、改善行動", type: "table", k: "t2", rows: 4, rowLabels: ["1", "2", "3", "4"], cols: [{ l: "項次", w: "7%", num: true }, { l: "議題" }, { l: "行動" }, { l: "責任人", w: "13%" }, { l: "完成日", w: "14%", t: "date" }] },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["製表", "品保主管", "廠長"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-018",
    title: "組織背景與利害關係人分析",
    prefix: "CT",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §4.1 了解組織及其背景、§4.2 了解利害關係人之需求與期望",
    purpose: "組織背景與利害關係人分析之紀錄、判定與簽核",
    usage: "辨識影響品質管理系統的內外部議題與利害關係人需求，作為 6.1 風險與機會評估之輸入；每年或環境重大變化時更新。",
    listFields: [
      { k: "s0.cdate", l: "分析日期" },
      { k: "s0.ver", l: "版本" },
      { k: "s0.members", l: "參與人員" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "分析編號", serial: true }, { k: "cdate", l: "分析日期", t: "date", req: true }], [{ k: "ver", l: "版本" }, { k: "members", l: "參與人員" }], [{ k: "review", l: "下次檢視日", t: "date" }, { k: "scope", l: "QMS 範圍" }]] },
      { h: "二、外部議題", type: "table", k: "t1", rows: 6, rowLabels: ["法律法規", "技術", "競爭", "市場", "文化與社會", "經濟"], cols: [{ l: "類別", w: "20%", static: true }, { l: "議題" }, { l: "影響", w: "12%", opts: ["低", "中", "高"] }, { l: "因應" }] },
      { h: "三、內部議題", type: "table", k: "t2", rows: 5, rowLabels: ["價值觀與文化", "知識與技術", "績效", "資源", "組織變動"], cols: [{ l: "類別", w: "20%", static: true }, { l: "議題" }, { l: "影響", w: "12%", opts: ["低", "中", "高"] }, { l: "因應" }] },
      { h: "四、利害關係人", type: "table", k: "t3", rows: 6, rowLabels: ["1", "2", "3", "4", "5", "6"], cols: [{ l: "項次", w: "7%", num: true }, { l: "利害關係人" }, { l: "需求與期望" }, { l: "影響", w: "11%", opts: ["低", "中", "高"] }, { l: "因應與監控方式" }] },
      { h: "五、簽核", type: "sig", k: "g1", rows: ["分析人員", "管理者代表"] },
      { h: "六、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-019",
    title: "職責與權限表",
    prefix: "RA",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §5.3 組織的角色、職責與權限",
    purpose: "職責與權限表之紀錄、判定與簽核",
    usage: "界定各職務在品質管理系統中之職責、權限與代理人，確保 5.3 所要求之指派與溝通有文件化證據。",
    listFields: [
      { k: "s0.ver", l: "版本" },
      { k: "s0.idate", l: "生效日期" },
      { k: "s0.maker", l: "製表人" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "表單編號", serial: true }, { k: "ver", l: "版本", req: true }], [{ k: "idate", l: "生效日期", t: "date" }, { k: "maker", l: "製表人" }], [{ k: "approve", l: "核准人" }, { k: "review", l: "下次檢視日", t: "date" }]] },
      { h: "二、職務與權限", type: "table", k: "t1", rows: 8, rowLabels: ["1", "2", "3", "4", "5", "6", "7", "8"], cols: [{ l: "項次", w: "7%", num: true }, { l: "職稱", w: "16%" }, { l: "所屬單位", w: "12%" }, { l: "主要職責" }, { l: "QMS 權限" }, { l: "代理人", w: "11%" }] },
      { h: "三、簽核", type: "sig", k: "g1", rows: ["製表", "核准"] },
      { h: "四、版本歷程", type: "history" }
    ]
  },
  {
    id: "FRM-QA-020",
    title: "顧客財產清冊",
    prefix: "CU",
    version: "1.0",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.5.3 顧客或外部提供者的財產",
    purpose: "顧客財產清冊之紀錄、判定與簽核",
    usage: "登錄客戶提供之模具、治具、量規、樣品、圖面與智慧財產；發生遺失、損壞或不適用時須向客戶報告並留存紀錄。",
    listFields: [
      { k: "s0.udate", l: "更新日期" },
      { k: "s0.dept", l: "保管單位" },
      { k: "s0.keeper", l: "保管人" }
    ],
    sections: [
      { h: "一、基本資料", type: "pairs", rows: [[{ k: "no", l: "清冊編號", serial: true }, { k: "udate", l: "更新日期", t: "date", req: true }], [{ k: "dept", l: "保管單位" }, { k: "keeper", l: "保管人" }]] },
      { h: "二、財產清單", type: "table", k: "t1", rows: 8, rowLabels: ["1", "2", "3", "4", "5", "6", "7", "8"], cols: [{ l: "項次", w: "6%", num: true }, { l: "客戶", w: "14%" }, { l: "財產名稱" }, { l: "型號／編號", w: "14%" }, { l: "數量", w: "8%" }, { l: "存放地點", w: "11%" }, { l: "狀態", w: "12%", opts: ["良好", "損壞", "遺失"] }] },
      { h: "三、異常與通報", type: "textarea", k: "x1", rows: 3, hint: "遺失／損壞／不適用之處理與客戶通報日期（8.5.3 要求）" },
      { h: "四、簽核", type: "sig", k: "g1", rows: ["保管人", "單位主管", "品保主管"] },
      { h: "五、版本歷程", type: "history" }
    ]
  }
];
