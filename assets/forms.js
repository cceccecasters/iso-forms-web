/* ISO 紀錄表單 — 表單定義
 * 新增表單時，只要在 FORMS 陣列加一筆，並在 HISTORY 補上版本歷程即可。
 * 版次／生效日必須與 repo 內 docs/文件管制總表.csv 一致。
 */
window.ISO_META = {
  company: "CHANG CHUAN ENTERPRISE CO., LTD.",
  companyCN: "彰銓企業股份有限公司",
  system: "ISO 9001 品質管理系統 · 表單管制",
  repo: "cceccecasters/iso-form-system",
  updated: "2026-10-24"
};

window.ISO_HISTORY = {
  "FRM-QA-001": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "補列驗證項目「客戶承認」，與影響評估之客戶承認需求對應（v1.0 發行檔已含，表單本文補齊）", ""],
    ["2.0", "2026-10-27", "第四節「變更前後對照」新增照片欄，每列可附變更前／後照片", ""]
  ],
  "FRM-QA-002": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "統一全形標點；「其他影響」欄位排版調整為單列可讀", ""],
    ["2.0", "2026-10-27", "第四節「變更前後對照」新增照片欄，每列可附變更前／後照片", ""]
  ],
  "FRM-EN-001": [
    ["1.0", "2026-10-28", "初版發行", ""]
  ],
  "FRM-QA-003": [
    ["1.0", "2026-10-22", "初版發行", ""],
    ["1.1", "2026-10-24", "修正版本歷程章節編號（十→九）；統一全形括號與標點", ""]
  ],
  "FRM-QA-004": [
    ["1.0", "2026-10-30", "初版發行：進料不合格品判定、授權與供應商矯正措施", ""],
    ["1.1", "2026-10-30", "名稱修正為「進料不合格品處理暨矯正措施單」，同時對應 8.4.2／8.7.1／10.2；內容未變更", ""]
  ],
  "WF-QA-001": [
    ["1.0", "2026-10-24", "初版發行（將既有 Git 版控與發行做法書面化）", ""]
  ]
};

window.ISO_FORMS = [
  {
    id: "FRM-QA-001",
    title: "模具變更單",
    prefix: "MV",
    version: "2.0",
    effective: "2026-10-27",
    clause: "ISO 9001:2015 §8.5.6 變更管制",
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
    version: "2.0",
    effective: "2026-10-27",
    clause: "ISO 9001:2015 §8.1 作業規劃與管制、§8.5.6 變更管制",
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
    version: "1.1",
    effective: "2026-10-24",
    clause: "ISO 9001:2015 §8.6 產品與服務之放行、§8.7 不符合輸出之管制",
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
    version: "1.0",
    effective: "2026-10-28",
    clause: "ISO 9001:2015 §8.3 設計與開發／§8.5.1 生產管制",
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
    version: "1.1",
    effective: "2026-10-30",
    clause: "ISO 9001:2015 §8.4.2 外部提供的過程、產品與服務之管制、§8.7.1 不符合輸出之管制、§10.2 不合格與矯正措施",
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
  }
];
