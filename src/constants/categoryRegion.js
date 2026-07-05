// Swagger 기준 카테고리/지역 enum 값 <-> 화면 표시용 한글 라벨 매핑
export const CATEGORY_OPTIONS = [
  { label: "축제", code: "FESTIVAL" },
  { label: "공연", code: "PERFORMANCE" },
  { label: "행사", code: "EVENT" },
  { label: "체험", code: "EXPERIENCE" },
  { label: "쇼핑", code: "SHOPPING" },
  { label: "자연", code: "NATURE" },
  { label: "역사", code: "HISTORY" },
  { label: "가족", code: "FAMILY" },
  { label: "음식", code: "FOOD" },
];

export const REGION_OPTIONS = [
  { label: "강원", code: "GANGWON" },
  { label: "경기", code: "GYEONGGI" },
  { label: "대구", code: "DAEGU" },
  { label: "부산", code: "BUSAN" },
  { label: "서울", code: "SEOUL" },
  { label: "인천", code: "INCHEON" },
  { label: "전남", code: "JEONNAM" },
  { label: "제주", code: "JEJU" },
  { label: "기타", code: "ETC" },
];

export const CATEGORY_LABEL_TO_CODE = Object.fromEntries(
  CATEGORY_OPTIONS.map(({ label, code }) => [label, code])
);
export const CATEGORY_CODE_TO_LABEL = Object.fromEntries(
  CATEGORY_OPTIONS.map(({ label, code }) => [code, label])
);
export const REGION_LABEL_TO_CODE = Object.fromEntries(
  REGION_OPTIONS.map(({ label, code }) => [label, code])
);
export const REGION_CODE_TO_LABEL = Object.fromEntries(
  REGION_OPTIONS.map(({ label, code }) => [code, label])
);
