

import { AppResponse } from "../../types";
import { toAppError } from "./to-app-error";

const isProd = process.env.APP_ENV !== "sandbox";

export async function withErrorBoundary<O>(
  fn: () => Promise<O>
): Promise<AppResponse<O>> {
  try {
    const out = await fn();
    return out as AppResponse<O>;
  } catch (e) {
    const err = toAppError(e);

    console.error("AppError", {
      code: err.code,
      message: err.message,
      details: err.details,
      stack: err.stack,
      cause: (err as any).cause,
    });

    return {
      code: err.code,
      message: err.message,
      ...(isProd
        ? err.expose
          ? { details: err.details }
          : {}
        : { details: err.details }),
    } as any;
  }
}
