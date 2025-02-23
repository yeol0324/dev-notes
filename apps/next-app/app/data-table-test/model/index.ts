import { setupWorker } from "msw/browser";
import { padRulesHandlers } from "./handler";

export const handlers = [...padRulesHandlers];

export const worker = setupWorker(...handlers);
