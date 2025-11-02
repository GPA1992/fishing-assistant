import { Type, type TSchema, type Static,  } from "@sinclair/typebox";

export const PaginationMetaSchema = Type.Object(
  {
    page: Type.Integer({ minimum: 1 }),
    itemsPerPage: Type.Integer({ minimum: 1 }),
    total: Type.Integer({ minimum: 0 }),
    totalPages: Type.Integer({ minimum: 0 }),
  },
  { additionalProperties: false }
);

export function DataResponseSchema<T extends TSchema>(dataSchema: T) {
  return Type.Object(
    {
      message: Type.String(),
      data: Type.Optional(dataSchema),
      pagination: Type.Optional(PaginationMetaSchema),
      code: Type.String(),
    },
    { additionalProperties: false }
  );
}

export const VoidResponseSchema = Type.Object(
  {
    message: Type.String(),
    code: Type.Number(),
  },
  { additionalProperties: false }
);



export type PaginationMeta = Static<typeof PaginationMetaSchema>;

export type AppResponse<T extends TSchema> = Static<
  ReturnType<typeof DataResponseSchema<T>>
>;
