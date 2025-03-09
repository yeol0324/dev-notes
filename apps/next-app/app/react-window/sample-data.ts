export type SamplePadRule = {
  cardNum: string;
  koreanType: string;
  money: string;
  endDate: string;
  commitType: string;
  modifyType: string;
  modifyDate: string;
  memo: string;
};

export const TOTAL_COUNT = 50_000;
export const PAGE_SIZE = 50;

const pad2 = (n: number): string => String(n).padStart(2, "0");

export const makeRow = (index: number): SamplePadRule => {
  const n = index + 1;

  const day1 = pad2((n % 28) + 1);
  const day2 = pad2(((n + 7) % 28) + 1);

  return {
    cardNum: `135-7894-${pad2((n % 90) + 10)}`,
    koreanType: n % 2 === 0 ? "국내" : "해외",
    money: `${(n % 900) + 100}1,548`,
    endDate: `2022-04-${day1}`,
    commitType: "적용됨",
    modifyType: n % 2 === 0 ? "반영" : "미반영",
    modifyDate: `2023-07-${day2}`,
    memo: "",
  };
};

// offset부터 limit만큼 생성
export const getSamplePage = (
  offset: number,
  limit: number
): SamplePadRule[] => {
  const safeEnd = Math.min(offset + limit, TOTAL_COUNT);
  const size = Math.max(0, safeEnd - offset);
  return Array.from({ length: size }, (_, i) => makeRow(offset + i));
};

// initial data
export const SAMPLE_PAD_RULE: SamplePadRule[] = getSamplePage(0, PAGE_SIZE);
