import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronRight, Plus, FileText, Share2, Shield, Check, ChevronDown } from "lucide-react";
import dbLogo from "@/imports/image.png";
import dbLogo1 from "@/imports/image-1.png";

type PetType = "dog" | "cat";
type Step = 1 | 2 | 3 | 4;

interface PetInfo {
  petType: PetType;
  breed: string;
  age: string;
  weight: string;
  indoor: boolean;
  walkFrequency: string;
  neutered: boolean;
}

const DOG_BREEDS = [
  "말티즈", "포메라니안", "비숑 프리제", "치와와", "시추",
  "토이 푸들", "닥스훈트", "웰시 코기", "골든 리트리버",
  "래브라도 리트리버", "진돗개", "삽살개", "불독", "기타",
];

const CAT_BREEDS = [
  "코리안 숏헤어", "러시안 블루", "페르시안", "메인쿤",
  "샴", "벵갈", "아비시니안", "노르웨이 숲 고양이", "기타",
];

const WALK_OPTIONS = ["매일", "주 3~4회", "주 1~2회", "거의 안 함"];

interface ReceiptData {
  disease: string;
  tip: string;
  items: { label: string; amount: number }[];
  total: number;
  withInsurance: number;
}

function getReceiptData(info: PetInfo): ReceiptData {
  const isSmallDog =
    info.petType === "dog" &&
    ["말티즈", "포메라니안", "비숑 프리제", "치와와", "시추", "토이 푸들", "닥스훈트"].includes(info.breed);
  const age = parseInt(info.age) || 3;

  if (info.petType === "cat" && age >= 8) {
    return {
      disease: "치주 질환",
      tip: `8살 이후 고양이는 치주 질환 발생 확률이 크게 증가합니다. ${info.breed || "고양이"}는 정기 구강 검진이 필수입니다.`,
      items: [
        { label: "진료비", amount: 55000 },
        { label: "X-ray 검사", amount: 120000 },
        { label: "스케일링 및 발치", amount: 680000 },
        { label: "마취비", amount: 210000 },
        { label: "입원비 (2일)", amount: 180000 },
        { label: "약제비", amount: 45000 },
      ],
      total: 1290000,
      withInsurance: 258000,
    };
  }

  if (isSmallDog) {
    return {
      disease: "슬개골 탈구",
      tip: `슬개골 탈구는 ${info.breed || "소형견"}에게 가장 흔한 정형외과 질환입니다. 조기 수술이 장기 삶의 질을 결정합니다.`,
      items: [
        { label: "진료비", amount: 65000 },
        { label: "X-ray 검사", amount: 95000 },
        { label: "MRI 검사", amount: 650000 },
        { label: "슬개골 교정 수술", amount: 980000 },
        { label: "마취비", amount: 180000 },
        { label: "입원비 (3일)", amount: 270000 },
      ],
      total: 2240000,
      withInsurance: 448000,
    };
  }

  if (info.petType === "dog" && age >= 7) {
    return {
      disease: "심장 사상충 / 심장 질환",
      tip: `7세 이상 ${info.breed || "대형견"}은 심장 질환 및 관절 질환 발생률이 급격히 높아집니다.`,
      items: [
        { label: "진료비", amount: 70000 },
        { label: "혈액검사", amount: 180000 },
        { label: "심장 초음파", amount: 320000 },
        { label: "X-ray 검사 (흉부)", amount: 110000 },
        { label: "약제비 (3개월분)", amount: 210000 },
        { label: "입원비 (2일)", amount: 180000 },
      ],
      total: 1070000,
      withInsurance: 214000,
    };
  }

  return {
    disease: "피부 아토피 / 외이염",
    tip: `${info.breed || "반려견"}은 피부 질환과 외이염이 재발하기 쉽습니다. 만성화되면 연간 치료비가 크게 증가합니다.`,
    items: [
      { label: "진료비", amount: 55000 },
      { label: "피부과 검사", amount: 130000 },
      { label: "알레르기 검사", amount: 280000 },
      { label: "치료 및 처치", amount: 95000 },
      { label: "약제비", amount: 120000 },
      { label: "재진료 (2회)", amount: 90000 },
    ],
    total: 770000,
    withInsurance: 154000,
  };
}

function formatKRW(n: number) {
  return n.toLocaleString("ko-KR") + "원";
}

/* ─── Step 1: Landing ─── */
function StepLanding({ onNext }: { onNext: () => void }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-border bg-white px-6 py-4 flex items-center justify-between">
        <img src={dbLogo} alt="DB손해보험" className="h-8 object-contain" />
        <span className="text-xs text-muted-foreground font-medium tracking-wide">펫보험</span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-secondary text-primary px-4 py-1.5 rounded-full text-xs font-semibold mb-8 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block animate-pulse" />
          DB손해보험과 함께 합니다.
        </div>

        {/* Pet Illustration */}
        <div className="relative mb-8">
          <div className="w-36 h-36 rounded-full bg-secondary flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-7xl select-none">🐾</span>
          </div>
          <div className="absolute -top-2 -right-2 w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Plus className="w-5 h-5 text-white" strokeWidth={2.5} />
          </div>
          <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md border border-border">
            <FileText className="w-5 h-5 text-primary" strokeWidth={2} />
          </div>
        </div>

        {/* Headlines */}
        <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          우리 아이의<br />
          <span className="text-primary">위험 질병군</span>은?
        </h1>
        <p className="text-base text-muted-foreground max-w-sm mb-10 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          AI가 품종과 나이를 바탕으로<br />
          예상 질병과 <strong className="text-foreground font-semibold">치료비 영수증</strong>을 만들어드립니다
        </p>

        {/* CTA */}
        <button
          onClick={onNext}
          className="group flex items-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-2xl font-bold text-base transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        >
          <span>5초 만에 확인하기</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Trust badges */}
        <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-primary" />
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>실제 진료 사례 기반</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-primary" />
            <span style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>개인정보 수집 없음</span>
          </div>
        </div>
      </div>

      <footer className="text-center text-xs text-muted-foreground pb-8 px-6" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
        본 결과는 참고용이며 실제 치료비와 차이가 있을 수 있습니다
      </footer>
    </div>
  );
}

/* ─── Step 2: Input ─── */
function StepInput({ onNext }: { onNext: (info: PetInfo) => void }) {
  const [info, setInfo] = useState<PetInfo>({
    petType: "dog",
    breed: "",
    age: "",
    weight: "",
    indoor: true,
    walkFrequency: "주 3~4회",
    neutered: false,
  });

  const breeds = info.petType === "dog" ? DOG_BREEDS : CAT_BREEDS;

  function set<K extends keyof PetInfo>(key: K, val: PetInfo[K]) {
    setInfo((prev) => ({ ...prev, [key]: val }));
  }

  const canProceed = info.breed && info.age;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <img src={dbLogo} alt="DB손해보험" className="h-8 object-contain" />
        <span className="text-xs font-semibold text-muted-foreground tracking-widest">STEP 2 / 3</span>
      </header>

      <div className="flex-1 max-w-lg mx-auto w-full px-5 py-8 pb-24">
        <div className="mb-7">
          <div className="flex gap-1.5 mb-6">
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-primary" />
            <div className="h-1 flex-1 rounded-full bg-muted" />
          </div>
          <h2 className="text-xl font-bold text-foreground mb-1" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>우리 아이 정보 입력</h2>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>정확할수록 더 정밀한 결과를 드립니다</p>
        </div>

        <div className="space-y-5">
          {/* Pet Type */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <label className="text-sm font-semibold text-foreground mb-3 block" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>어떤 반려동물인가요?</label>
            <div className="grid grid-cols-2 gap-3">
              {(["dog", "cat"] as PetType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => { set("petType", type); set("breed", ""); }}
                  className={`py-4 rounded-xl border-2 font-semibold text-sm transition-all ${
                    info.petType === type
                      ? "border-primary bg-secondary text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-primary/40"
                  }`}
                  style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                >
                  <span className="text-2xl block mb-1">{type === "dog" ? "🐶" : "🐱"}</span>
                  {type === "dog" ? "강아지" : "고양이"}
                </button>
              ))}
            </div>
          </div>

          {/* Breed */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <label className="text-sm font-semibold text-foreground mb-3 block" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>품종</label>
            <div className="relative">
              <select
                value={info.breed}
                onChange={(e) => set("breed", e.target.value)}
                className="w-full appearance-none bg-input-background border border-border rounded-xl px-4 py-3 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
              >
                <option value="">품종을 선택하세요</option>
                {breeds.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          {/* Age + Weight */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>나이</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={20}
                    value={info.age}
                    onChange={(e) => set("age", e.target.value)}
                    placeholder="0"
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>살</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-foreground mb-3 block" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>몸무게</label>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    max={80}
                    step={0.1}
                    value={info.weight}
                    onChange={(e) => set("weight", e.target.value)}
                    placeholder="0.0"
                    className="w-full bg-input-background border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">kg</span>
                </div>
              </div>
            </div>
          </div>

          {/* Lifestyle */}
          <div className="bg-white rounded-2xl p-5 border border-border shadow-sm space-y-4">
            <label className="text-sm font-semibold text-foreground block" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>생활 환경</label>

            {/* Indoor toggle */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>실내 생활</span>
              <button
                onClick={() => set("indoor", !info.indoor)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${info.indoor ? "bg-primary" : "bg-switch-background"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${info.indoor ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>

            {/* Walk Frequency */}
            {info.petType === "dog" && (
              <div>
                <p className="text-sm text-foreground mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>산책 빈도</p>
                <div className="grid grid-cols-2 gap-2">
                  {WALK_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => set("walkFrequency", opt)}
                      className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                        info.walkFrequency === opt
                          ? "border-primary bg-secondary text-primary"
                          : "border-border text-muted-foreground hover:border-primary/30"
                      }`}
                      style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Neutered */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>중성화 수술</span>
              <button
                onClick={() => set("neutered", !info.neutered)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${info.neutered ? "bg-primary" : "bg-switch-background"}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${info.neutered ? "translate-x-6" : "translate-x-0"}`} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-5 py-4 safe-b">
        <div className="max-w-lg mx-auto">
          <button
            onClick={() => canProceed && onNext(info)}
            disabled={!canProceed}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 ${
              canProceed
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            AI 영수증 생성하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Step 3: Loading ─── */
const LOADING_MESSAGES = [
  "품종 데이터를 분석하고 있습니다...",
  "실제 진료 사례를 검색 중입니다...",
  "슬개골·관절 질환을 분석 중입니다...",
  "평균 치료비를 계산하고 있습니다...",
  "보험 적용 금액을 산출 중입니다...",
];

function StepLoading({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(interval); return 100; }
        return p + 2;
      });
    }, 50);
    const msgInterval = setInterval(() => {
      setMsgIdx((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 600);
    const timer = setTimeout(onDone, 3000);
    return () => { clearInterval(interval); clearInterval(msgInterval); clearTimeout(timer); };
  }, [onDone]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="w-24 h-24 rounded-full bg-secondary border-2 border-primary/20 flex items-center justify-center mx-auto mb-8 shadow-lg">
          <span className="text-5xl animate-bounce">🐾</span>
        </div>

        <h2 className="text-lg font-bold text-foreground mb-2" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          AI가 실제 진료 사례를 분석하고 있습니다
        </h2>

        <div className="h-2 bg-muted rounded-full overflow-hidden my-6 mx-4">
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={msgIdx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-sm text-muted-foreground"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            {LOADING_MESSAGES[msgIdx]}
          </motion.p>
        </AnimatePresence>

        <div className="mt-8 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-primary/30"
              style={{ animation: `pulse 1.4s ease-in-out ${i * 0.3}s infinite` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Step 4: Receipt ─── */
function StepReceipt({ info, onRestart }: { info: PetInfo; onRestart: () => void }) {
  const receipt = getReceiptData(info);
  const savings = receipt.total - receipt.withInsurance;
  const [shared, setShared] = useState(false);

  const today = new Date();
  const dateStr = `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;

  function handleShare() {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="w-full border-b border-border bg-white px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <img src={dbLogo} alt="DB손해보험" className="h-8 object-contain" />
        <button onClick={onRestart} className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          다시 하기
        </button>
      </header>

      <div className="max-w-lg mx-auto w-full px-5 py-6 pb-24">
        {/* Disease tip */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-5 flex gap-3"
        >
          <span className="text-xl flex-shrink-0">⚠️</span>
          <p className="text-sm text-amber-800 leading-relaxed" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            {receipt.tip}
          </p>
        </motion.div>

        {/* Receipt card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        >
          {/* Receipt header */}
          <div className="bg-primary px-6 py-5 text-primary-foreground">
            <div className="flex items-start justify-between mb-1">
              <div>
                <p className="text-xs opacity-70 mb-0.5" style={{ fontFamily: "'Inter', monospace" }}>MEDICAL RECEIPT</p>
                <h3 className="text-lg font-bold" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>DB동물메디컬센터</h3>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-70" style={{ fontFamily: "'Inter', monospace" }}>진료일</p>
                <p className="text-sm font-semibold" style={{ fontFamily: "'Inter', monospace" }}>{dateStr}</p>
              </div>
            </div>
            <div className="mt-3 inline-flex bg-white/20 rounded-lg px-3 py-1">
              <span className="text-xs font-semibold" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                주요 질환: {receipt.disease}
              </span>
            </div>
          </div>

          {/* Patient info */}
          <div className="px-6 py-3 bg-secondary/50 border-b border-border flex gap-6 text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <span>환자: {info.breed || (info.petType === "dog" ? "강아지" : "고양이")}</span>
            <span>나이: {info.age || "-"}살</span>
            {info.weight && <span>체중: {info.weight}kg</span>}
          </div>

          {/* Line items */}
          <div className="px-6 py-4 border-b border-dashed border-border space-y-3">
            {receipt.items.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{item.label}</span>
                <span className="text-sm font-medium text-foreground tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                  {formatKRW(item.amount)}
                </span>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="px-6 py-4 border-b border-dashed border-border">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>총 진료비</span>
              <span className="text-xl font-bold text-foreground tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatKRW(receipt.total)}
              </span>
            </div>
          </div>

          {/* Comparison */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-3">
              <div>
                <p className="text-xs text-red-600 font-semibold mb-0.5" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>보험이 없다면</p>
                <p className="text-xs text-red-500" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>직접 부담금</p>
              </div>
              <span className="text-lg font-bold text-red-600 tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatKRW(receipt.total)}
              </span>
            </div>

            <div className="flex items-center justify-between bg-secondary rounded-xl px-4 py-3 border border-primary/20">
              <div>
                <p className="text-xs text-primary font-semibold mb-0.5" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>보험이 있었다면</p>
                <p className="text-xs text-primary/70" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>예상 부담금</p>
              </div>
              <span className="text-lg font-bold text-primary tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                {formatKRW(receipt.withInsurance)}
              </span>
            </div>

            {/* Savings */}
            <div className="bg-primary rounded-xl px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                  절감 가능 금액
                </span>
              </div>
              <span className="text-lg font-bold text-primary-foreground tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>
                약 {formatKRW(savings)}
              </span>
            </div>
          </div>

          {/* Receipt footer */}
          <div className="px-6 pb-4">
            <div className="border-t border-dashed border-border pt-4 text-center">
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                * 본 영수증은 AI 예측 결과이며 실제 진료비와 다를 수 있습니다
              </p>
              <div className="flex justify-center gap-1 mt-2">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div key={i} className="w-0.5 h-3 bg-border rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 grid grid-cols-3 gap-3"
        >
          {[
            { icon: "🏥", label: "연간 예상\n의료비", value: formatKRW(Math.round(receipt.total * 1.8)) },
            { icon: "💊", label: "질병 발생\n확률", value: "62%" },
            { icon: "📋", label: "보험료\n월 평균", value: "약 3만원~" },
          ].map((card) => (
            <div key={card.label} className="bg-white border border-border rounded-xl p-3 text-center">
              <span className="text-2xl block mb-1">{card.icon}</span>
              <p className="text-xs text-muted-foreground mb-1 whitespace-pre-line leading-tight" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>{card.label}</p>
              <p className="text-xs font-bold text-foreground tabular-nums" style={{ fontFamily: "'Inter', sans-serif" }}>{card.value}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Sticky actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-5 py-4">
        <div className="max-w-lg mx-auto flex gap-3">
          <button
            onClick={handleShare}
            className={`flex items-center gap-2 px-4 py-4 rounded-2xl border font-semibold text-sm transition-all ${
              shared ? "border-primary bg-secondary text-primary" : "border-border text-muted-foreground hover:border-primary/40"
            }`}
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <Share2 className="w-4 h-4" />
            {shared ? "복사됨!" : "공유"}
          </button>
          <button
            className="flex-1 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
          >
            <span>우리 아이 보험 알아보기</span>
            <img
              src={dbLogo1}
              alt="DB손해보험"
              className="h-5 object-contain"
              style={{ mixBlendMode: "screen", filter: "brightness(10)" }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Root ─── */
export default function App() {
  const [step, setStep] = useState<Step>(1);
  const [petInfo, setPetInfo] = useState<PetInfo | null>(null);

  function goToInput() { setStep(2); }
  function goToLoading(info: PetInfo) { setPetInfo(info); setStep(3); }
  function goToReceipt() { setStep(4); }
  function restart() { setStep(1); setPetInfo(null); }

  return (
    <div className="w-full min-h-screen bg-background" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <StepLanding onNext={goToInput} />
          </motion.div>
        )}
        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
            <StepInput onNext={goToLoading} />
          </motion.div>
        )}
        {step === 3 && (
          <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            <StepLoading onDone={goToReceipt} />
          </motion.div>
        )}
        {step === 4 && petInfo && (
          <motion.div key="step4" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <StepReceipt info={petInfo} onRestart={restart} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
