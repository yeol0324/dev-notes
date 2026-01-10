import type { OffsetPageResponseType } from "../lib/use-infinite-offset";
import type { ApiSortType } from "../lib/use-sorting";
import type { PadRuleType } from "./sample-data";

export type PadRuleListParamsType = {
  q: string;
  sort: ApiSortType;
};

export type PadRuleListResponseType = OffsetPageResponseType<PadRuleType>;

export const fetchPadRules = async (args: {
  offset: number;
  limit: number;
  params: PadRuleListParamsType;
}): Promise<PadRuleListResponseType> => {
  const { offset, limit, params } = args;

  const sp = new URLSearchParams();
  sp.set("offset", String(offset));
  sp.set("limit", String(limit));
  if (params.q) sp.set("q", params.q);

  if (params.sort) {
    sp.set("sortField", params.sort.field);
    sp.set("sortDir", params.sort.direction);
  }

  const res = await fetch(`/api/pad-rules?${sp.toString()}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`Failed to fetch pad rules: ${res.status}`);

  return (await res.json()) as PadRuleListResponseType;
};
