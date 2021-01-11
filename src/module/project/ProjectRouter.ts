import Router from "@koa/router";
import { Context } from "koa";
import ProjectModel from "./ProjectModel";

const router = new Router({ prefix: "/api/project" });

router.get("/", async (ctx, next) => {
  try {
    const projectList = await ProjectModel.find({});
    ctx.body = {
      success: true,
      message: "",
      data: {
        projectList
      }
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

router.get("/:id", async (ctx: Context, next) => {
  try {
    const projectData = await ProjectModel.findById(ctx.params.id);
    console.log(ctx.auth);
    if (projectData) {
      ctx.body = {
        success: true,
        message: "",
        data: {
          projectData
        }
      };
    } else {
      throw Error("Projekt wurde nicht gefunden");
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

export default router;
