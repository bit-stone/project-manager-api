import mongoose, { Document } from "mongoose";

const enum TaskState {
  open = "open", // Task ist noch offen und unbearbeitet
  completed = "completed", // Task ist vollkommen abgeschlossen
  blocked = "blocked", // Task ist momentan blockiert (z.B. Lieferung erwatet etc)
  archived = "archived", // Task wurde archiviert (zu Dokuzwecken, damit nicht alles gelöscht werden muss)
  progress = "progress", // Task wird gerade bearbeitet
  denied = "denied" // Task wurde vom Bearbeiter abgelehnt -> Kommentar prüfe
}

export interface TaskInterface extends Document {
  _id: string;
  title: string;
  description: string;
  taskState: TaskState;
  projectId: string; // Kann leer sein, wenn Aufgabe keinem Projekt zugeordnet ist (für private Aufgaben z.B.)
  createUserId: string; // Ersteller der Aufgabe - const
  workUserId: string; // Bearbeiter der Aufgabe - kann wechseln
}

const TaskSchema = new mongoose.Schema({});

const TaskModel = mongoose.model<TaskInterface>("task", TaskSchema);

export default TaskModel;
