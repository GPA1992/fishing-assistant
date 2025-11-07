import { join } from "node:path";
import Fastify from "fastify";
import cors from "@fastify/cors";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import swagger from "@fastify/swagger";
import swaggerUI from "@fastify/swagger-ui";
import fastifyAutoload from "@fastify/autoload";
import ajvFormats from "ajv-formats";
import dotenv from "dotenv";
import redisPlugin from "./plugins/redis";
dotenv.config();

async function buildApp() {
  const app = Fastify({
    logger: true,
    trustProxy: true,
    ajv: {
      customOptions: {
        coerceTypes: true,
        removeAdditional: "all",
        useDefaults: true,
        allErrors: true,
      },
      plugins: [ajvFormats],
    },
  }).withTypeProvider<TypeBoxTypeProvider>();

  app.register(redisPlugin);
  await app.register(cors, {
    origin: (origin, cb) => cb(null, true),
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  });

  await app.register(swagger, {
    openapi: {
      info: { title: "API", version: "1.0.0" },
      servers: [{ url: "/" }],
      components: {
        securitySchemes: {
          bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(swaggerUI, {
    routePrefix: "/docs",
    staticCSP: true,
    uiConfig: { docExpansion: "list", deepLinking: true },
  });

  void app.register(fastifyAutoload, {
    dir: join(__dirname, "routes"),
  });

  app.get("/ping", async (req, rep) => {
    const pong = await (app.redis as any).ping();
    return { pong };
  });

  return app;
}

const start = async () => {
  const app = await buildApp();

  const PORT = Number(process.env.PORT ?? 3000);
  const HOST = process.env.HOST ?? "0.0.0.0";

  // shutdown gracioso
  const close = async () => {
    app.log.info("shutting down");
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", close);
  process.on("SIGTERM", close);

  try {
    const address = await app.listen({ port: PORT, host: HOST });
    app.log.info(`Server: ${address}`);
    app.log.info(`Docs:   ${address}/docs`);
    app.log.info(`OpenAPI ${address}/docs/json`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
