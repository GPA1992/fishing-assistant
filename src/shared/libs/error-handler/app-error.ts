import { HttpStatusCode } from "../../types";


export type AppErrorDetails = {
  kind?: "axios" | "fetch" | "validation" | "domain" | "unknown" | "text";
  method?: string;
  url?: string;
  requestId?: string;
  statusText?: string;
  responseBody?: unknown;
  extra?: Record<string, unknown>;
};

export class AppError extends Error {
  code: HttpStatusCode;
  details?: AppErrorDetails;
  expose: boolean; 
  constructor(input: {
    code: HttpStatusCode;
    message: string;
    details?: AppErrorDetails;
    cause?: unknown;
    expose?: boolean;
  }) {
    super(input.message, { cause: input.cause as any });
    this.code = input.code;
    this.details = input.details;
    this.expose = Boolean(input.expose);
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const appError = (
  code: HttpStatusCode,
  message: string,
  details?: AppErrorDetails,
  cause?: unknown,
  expose?: boolean
) => new AppError({ code, message, details, cause, expose });

export const isAppError = (e: unknown): e is AppError => e instanceof AppError;
