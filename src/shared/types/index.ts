
import axios from "axios";

export type PaginationMeta = {
  page: number;
  total: number;
  totalPages: number;
  itemsPerPage: number;
};

export type AppResponse<T = unknown> = {
  code: HttpStatusCode;
  message: string;
  data?: T;
  pagination?: PaginationMeta;
};

export type ErrorShape = {
  code: HttpStatusCode;
  message: string;
};

export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,

  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;





export type HttpStatusCode = (typeof HttpStatus)[keyof typeof HttpStatus];



export type RepoDeps = {
  apiKey?: string;
  http?: typeof axios;
};