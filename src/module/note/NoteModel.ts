import mongoose, { Document } from "mongoose";

export enum NoteRefType {
  project = "project",
  task = "task"
}

export interface NoteInterface extends Document {
  _id: string;
  refType: NoteRefType;
  refId: string;
  createUserId: string;
  message: string;
}

const NoteSchema = new mongoose.Schema({
  refType: { type: String, required: true },
  refId: { type: String, required: true },
  createUserId: { type: String, required: true },
  createMoment: { type: Date },
  message: { type: String, required: true }
});

const NoteModel = mongoose.model<NoteInterface>("note", NoteSchema);

export default NoteModel;
