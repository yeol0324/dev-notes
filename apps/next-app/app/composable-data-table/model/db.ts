import type { SamplePadRule } from "./sample-data";

const makePadRule = (i: number): SamplePadRule => ({
  id: `rule-${i}`,
  cardNum: `CARD-${String(i).padStart(6, "0")}`,
  koreanType: "유형",
  money: String(1000 + i),
  endDate: "2026-12-31",
  commitType: "타입",
  modifyType: i % 2 === 0 ? "미반영" : "반영",
  modifyDate: "2026-01-19",
  memo: "",
});

export const PAD_RULE_TOTAL = 5000;

export const padRuleDb: SamplePadRule[] = Array.from(
  { length: PAD_RULE_TOTAL },
  (_, idx) => makePadRule(idx + 1),
);
