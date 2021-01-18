import mongoose, { Document } from "mongoose";

export const enum TaskState {
  open = "open", // Task ist noch offen und unbearbeitet
  halted = "halted", // Task ist momentan blockiert (z.B. Lieferung erwatet etc)
  progress = "progress", // Task wird gerade bearbeitet
  completed = "completed" // Task ist vollkommen abgeschlossen
}

export const enum TaskRefType {
  project = "project",
  user = "user"
}

export interface TaskInterface extends Document {
  _id: mongoose.Types.ObjectId;
  refId: mongoose.Types.ObjectId;
  refType: TaskRefType;
  title: string; // Aufgabentitel
  taskRef: number; // Fortlaufende Nummer als Referenznummer für eine Aufgabe
  description: string; // Vollständige Beschreibung der Aufgabe. Wird nur bei "geöffneter" Aufgabe angezeigt
  taskState: TaskState; // Status, der ganz vorne angezeigt wird. Anfangs nur als Checkbox gedacht, hat jetzt aber mehrere Stati.
  createUserId: mongoose.Types.ObjectId; // Ersteller der Aufgabe - const
  createMoment: Date; // Erstellmoment
  changeMoment: Date; // Moment der letzten Änderung
  dueMoment: Date;
  workUserId: mongoose.Types.ObjectId; // Bearbeiter der Aufgabe - kann wechseln
  seenBy: [
    {
      userId: mongoose.Types.ObjectId;
      seeMoment: Date;
    }
  ];
}

const TaskSchema = new mongoose.Schema({
  refId: { type: mongoose.Types.ObjectId, required: true },
  refType: { type: String, required: true, default: TaskRefType.project },
  title: { type: String, required: true },
  taskRef: { type: Number },
  description: { type: String },
  taskState: { type: String, required: true },
  createUserId: { type: mongoose.Types.ObjectId, required: true },
  createMoment: { type: Date, default: Date.now },
  changeMoment: { type: Date, default: Date.now },
  dueMoment: { type: Date },
  workUserId: { type: mongoose.Types.ObjectId, required: true },
  seenBy: [
    {
      userId: { type: mongoose.Types.ObjectId, required: true },
      seeMoment: { type: Date, required: true, default: Date.now }
    }
  ]
});

const TaskModel = mongoose.model<TaskInterface>("task", TaskSchema);

export default TaskModel;
