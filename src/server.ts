import Koa from "koa";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import logger from "koa-logger";
import staticServe from "koa-static-server";
import http from "http";
import mount from "koa-mount";
import ratelimit from "koa-ratelimit";

import { config } from "./config";

import AuthMiddleware from "./module/auth/AuthMiddleware";
import AuthRouter from "./module/auth/AuthRouter";

import ProjectRouter from "./module/project/ProjectRouter";
import NoteRouter from "./module/note/NoteRouter";
import TaskRouter from "./module/task/TaskRouter";

import Router from "@koa/router";
import mongoose from "mongoose";

const app = new Koa();
const router = new Router({ prefix: "/api" });

const server = http.createServer(app.callback());
const db = new Map();

router.get("/ping", async (ctx, next) => {
  ctx.body = {
    success: true,
    message: "welcome! brother!"
  };
});

async function initServer() {
  // ratelimit
  app.use(
    ratelimit({
      driver: "memory",
      db: db,
      duration: 60000,
      errorMessage: "Whoa, slow down!",
      id: (ctx) => ctx.ip,
      max: 100,
      disableHeader: false
    })
  );

  // basic request stuff
  app.use(bodyParser());
  app.use(
    cors({
      origin: "*"
    })
  );
  app.use(logger());

  // login routes
  app.use(AuthRouter.routes()).use(AuthRouter.allowedMethods());

  // internal routes
  app.use(AuthMiddleware());
  app.use(router.routes()).use(router.allowedMethods());
  app.use(ProjectRouter.routes()).use(ProjectRouter.allowedMethods());
  app.use(NoteRouter.routes()).use(NoteRouter.allowedMethods());
  app.use(TaskRouter.routes()).use(TaskRouter.allowedMethods());

  // it nothing matches: serve app :)
  app.use(staticServe({ rootDir: "client" }));

  // Datenbankanbindung
  mongoose.set("useCreateIndex", true);
  mongoose.set("useFindAndModify", false);
  await mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  app
    .listen(config.port, async () => {
      console.log(`Server listening on port: ${config.port}`);
    })
    .on("error", (err) => {
      console.error(err);
    });
}

initServer();

export default server;
