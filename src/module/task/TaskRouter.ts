import Router from "@koa/router";
import { Context } from "koa";
import TaskModel from "./TaskModel";
import mongoose from "mongoose";

const router = new Router({ prefix: "/api/task" });

router.get("/:refType/:refId", async (ctx: Context, next) => {
  try {
    let taskList = await TaskModel.find({
      refId: ctx.params.refId,
      refType: ctx.params.refType
    });
    ctx.body = {
      success: true,
      message: "",
      data: {
        taskList
      }
    };
  } catch (e) {
    console.error(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

router.post("/list", async (ctx, next) => {
  try {
    const filterObject: {
      workUserId?: string;
      createUserId?: string;
      title?: any;
    } = {};
    const filterInput = ctx.request.body.filterData;

    if (filterInput.workUserId && filterInput.workUserId.length) {
      filterObject["workUserId"] = filterInput.workUserId;
    }

    if (filterInput.createUserId && filterInput.createUserId.length) {
      filterObject["createUserId"] = filterInput.createUserId;
    }

    if (filterInput.titleText && filterInput.titleText.length) {
      filterObject["title"] = { $regex: filterInput.titleText, $options: "i" };
    }

    const taskList = await TaskModel.find(filterObject).sort({ refId: "asc" });

    ctx.body = {
      success: true,
      message: "",
      data: {
        taskList
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

router.post("/add", async (ctx: Context, next) => {
  try {
    const taskData = ctx.request.body.taskData;
    const task = new TaskModel(taskData);

    task._id = mongoose.Types.ObjectId();
    task.isNew = true;

    task.createUserId = ctx.auth.userId;
    task.createMoment = new Date();

    const newTask = await task.save();

    ctx.body = {
      success: true,
      message: "",
      data: {
        taskData: newTask
      }
    };
  } catch (e) {
    console.error(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

router.post("/update-state", async (ctx: Context, next) => {
  try {
    const taskId = ctx.request.body.taskId;
    const newState = ctx.request.body.newState;

    const task = await TaskModel.findById(taskId);
    if (!task) {
      throw Error("Task nicht gefunden");
    }

    if (
      task.createUserId.toHexString() === ctx.auth.userId ||
      task.workUserId.toHexString() === ctx.auth.userId
    ) {
      task.taskState = newState;
      task.changeMoment = new Date();

      const newTask = await task.save();

      ctx.body = {
        success: true,
        message: "",
        data: {
          taskData: newTask
        }
      };
    } else {
      throw Error(
        "Nur der Ersteller/Bearbeiter darf den Status der Aufgabe ändern"
      );
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
