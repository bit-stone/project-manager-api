import Router from "@koa/router";
import { Context } from "koa";
import NoteModel, { NoteRefType } from "./NoteModel";

const router = new Router({ prefix: "/api/note" });

// Notizen zu einem refType/refId anzeigen
router.get("/:refType/:refId", async (ctx, next) => {
  try {
    const noteList = await NoteModel.find({
      refId: ctx.params.refId,
      refType: ctx.params.refType
    }).sort({ createMoment: -1 });
    ctx.body = {
      success: true,
      message: "",
      data: {
        noteList
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

// Neue Notiz anlegen
router.post("/add", async (ctx: Context, next) => {
  try {
    const inputData = ctx.request.body;
    if (inputData.message.length) {
      const noteItem = new NoteModel({
        refType: inputData.refType,
        refId: inputData.refId,
        createUserId: ctx.auth.userId,
        createMoment: new Date(),
        message: inputData.message
      });
      const newItem = await noteItem.save();

      ctx.body = {
        success: true,
        message: "",
        data: {
          noteItem: newItem
        }
      };
    } else {
      throw Error("Bitte eine Notiz angeben");
    }
  } catch (e) {
    console.error(e);
    ctx.body = {
      success: false,
      message: e.message
    };
  }
});

// Notiz entfernen
router.post("/remove", async (ctx: Context, next) => {
  try {
    // check if user is owner of this note
    const noteId = ctx.request.body.noteId;
    if (!noteId) {
      throw Error("Ungültige Notiz-ID");
    }
    const noteData = await NoteModel.findById(noteId);
    if (!noteData) {
      throw Error("Ungültige Notiz-ID");
    }

    if (noteData.createUserId.toHexString() === ctx.auth.userId) {
      const removedNote = await NoteModel.findByIdAndRemove(noteData._id);
      ctx.body = {
        success: true,
        message: "",
        data: {
          removedNote
        }
      };
    } else {
      throw Error("Nur der Ersteller darf Notizen entfernen");
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
