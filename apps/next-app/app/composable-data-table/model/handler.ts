import { http, HttpResponse } from "msw";
import { padRuleDb, PAD_RULE_TOTAL } from "./db";

type PadRulesResponseType = {
  items: typeof padRuleDb;
  total: number;
  nextOffset: number | null;
};

export const padRulesHandlers = [
  http.get("/api/pad-rules", ({ request }) => {
    const url = new URL(request.url);

    const offset = Number(url.searchParams.get("offset") ?? "0");
    const limit = Number(url.searchParams.get("limit") ?? "50");

    const safeOffset = Number.isFinite(offset) && offset >= 0 ? offset : 0;
    const safeLimit =
      Number.isFinite(limit) && limit > 0 ? Math.min(limit, 200) : 50;

    const items = padRuleDb.slice(safeOffset, safeOffset + safeLimit);
    const nextOffset =
      safeOffset + items.length >= PAD_RULE_TOTAL
        ? null
        : safeOffset + items.length;

    const body: PadRulesResponseType = {
      items,
      total: PAD_RULE_TOTAL,
      nextOffset,
    };

    return HttpResponse.json(body, { status: 200 });
  }),
];
