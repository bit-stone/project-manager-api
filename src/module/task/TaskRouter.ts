import Router from "@koa/router";
import { Context } from "koa";
import TaskModel from "./TaskModel";

const router = new Router({ prefix: "/api/task" });

router.post("/project/:projectId", async (ctx: Context, next) => {});

export default router;
