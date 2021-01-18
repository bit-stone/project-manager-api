import Router from "@koa/router";
import { Context } from "koa";
import ProjectModel from "./ProjectModel";
import mongoose from "mongoose";
import NoteModel, { NoteRefType } from "../note/NoteModel";
import TaskModel, { TaskRefType } from "../task/TaskModel";

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

router.post("/save", async (ctx, next) => {
  try {
    const projectData = ctx.request.body.projectData;
    const project = new ProjectModel(projectData);

    if (projectData && projectData._id && projectData._id.length === 24) {
      // mark as new
      project.isNew = false;
      project._id = mongoose.Types.ObjectId(projectData._id);
    } else {
      project.isNew = true;
      project._id = mongoose.Types.ObjectId();
      project.createMoment = new Date();
      project.isArchived = false;
    }

    // check project data
    await project.validate();

    const savedProject = await project.save();
    console.log(savedProject);

    ctx.body = {
      success: true,
      message: "",
      data: {
        projectData: savedProject
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

router.post("/archive", async (ctx, next) => {
  try {
    const projectId = ctx.request.body.projectId;
    if (projectId && projectId.length === 24) {
      const projectData = await ProjectModel.findById(projectId);

      if (projectData) {
        projectData.isArchived = !projectData.isArchived;

        await projectData.save();

        ctx.body = {
          success: true,
          message: "",
          data: {
            projectData
          }
        };
      } else {
        throw Error("invalid project id");
      }
    }
  } catch (e) {
    console.log(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

router.delete("/:projectId", async (ctx, next) => {
  try {
    const projectId = ctx.params.projectId;
    if (projectId && projectId.length === 24) {
      const removedProject = await ProjectModel.findByIdAndRemove(projectId);
      console.log(removedProject);

      if (removedProject) {
        const noteList = await NoteModel.find({
          refType: NoteRefType.project,
          refId: removedProject._id
        });

        for (let noteItem of noteList) {
          await NoteModel.findByIdAndDelete(noteItem._id);
        }

        const taskList = await TaskModel.find({
          refType: TaskRefType.project,
          refId: removedProject._id
        });

        for (let taskItem of taskList) {
          await TaskModel.findByIdAndDelete(taskItem._id);
        }
      }

      ctx.body = {
        success: true,
        message: "",
        data: {
          removedProject
        }
      };
    } else {
      throw Error("invalid project id");
    }
  } catch (e) {
    console.error(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

export default router;
