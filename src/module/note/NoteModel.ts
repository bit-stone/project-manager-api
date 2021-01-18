import mongoose, { Document } from "mongoose";

export enum NoteRefType {
  project = "project",
  task = "task"
}

export interface NoteInterface extends Document {
  _id: string;
  refType: NoteRefType;
  refId: mongoose.Types.ObjectId;
  createUserId: mongoose.Types.ObjectId;
  createMoment: Date;
  message: string;
}

const NoteSchema = new mongoose.Schema({
  refType: { type: String, required: true },
  refId: { type: mongoose.Types.ObjectId, required: true },
  createUserId: { type: mongoose.Types.ObjectId, required: true },
  createMoment: { type: Date, default: () => Date.now() },
  message: { type: String, required: true }
});

const NoteModel = mongoose.model<NoteInterface>("note", NoteSchema);

export default NoteModel;
