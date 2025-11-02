
import { HttpStatus, HttpStatusCode } from "../../types";
import { AppError, appError, AppErrorDetails, isAppError } from "./app-error";

type MaybeAxiosError = Error & {
  isAxiosError?: boolean;
  code?: string;
  status?: number;
  statusCode?: number;
  response?: { status?: number; statusText?: string; data?: any };
  request?: any;
  config?: { method?: string; url?: string };
};

export function toAppError(raw: unknown): AppError {
  if (isAppError(raw)) return raw;

  const e = raw as MaybeAxiosError;

  if (e?.isAxiosError) {
    const code =
      e.response?.status ??
      (typeof (e as any).statusCode === "number"
        ? (e as any).statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR);

    const body = e.response?.data;
    const bodyMsg =
      typeof body === "string"
        ? body
        : body?.error_description || body?.errorMessage || body?.message;

    const message = bodyMsg || e.message || "HTTP_ERROR";

    return appError(
      code,
      message,
      {
        kind: "axios",
        method: e.config?.method?.toUpperCase(),
        url: e.config?.url,
        statusText: e.response?.statusText,
        responseBody: body,
      },
      e,
      code < 500
    );
  }

  if (
    (e as any)?.name === "FetchError" ||
    (e as any)?.cause?.name === "FetchError"
  ) {
    const code =
      typeof (e as any)?.status === "number"
        ? (e as any).status
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = (e as any)?.message || "FETCH_ERROR";
    return appError(code, message, { kind: "fetch" }, e, code < 500);
  }

  const code =
    typeof (e as any)?.status === "number"
      ? (e as any).status
      : typeof (e as any)?.statusCode === "number"
      ? (e as any).statusCode
      : HttpStatus.INTERNAL_SERVER_ERROR;

  const message = (e as any)?.message || (e as any)?.error || "UNKNOWN_ERROR";

  return appError(code, message, { kind: "unknown" }, e, code < 500);
}

/**
 * Lança um erro convertido para AppError.
 * @param raw Valor de erro desconhecido a ser convertido
 * @param raw Ou um erro conhecido no formato
 * {status: HttpStatus, message: string }.
 * @throws {AppError} Sempre lança o erro convertido.
 */
export function throwAsAppError(
  raw: unknown,
  overrides?: {
    message?: string;
    code?: HttpStatusCode;
    details?: AppErrorDetails;
    expose?: boolean;
  }
): never {
  const base = toAppError(raw);

  throw new AppError({
    code: overrides?.code ?? base.code,
    message: overrides?.message ?? base.message,
    details: overrides?.details ?? base.details,
    cause: base, // mantém encadeamento
    expose: overrides?.expose ?? base.expose,
  });
}
