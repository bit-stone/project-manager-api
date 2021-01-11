import mongoose, { Document } from "mongoose";

const enum ProjectState {
  new = "new",
  offer = "offer",
  planning = "planning",
  production = "production",
  installation = "installation",
  warranty = "warranty",
  archived = "archived"
}

export interface ProjectInterface extends Document {
  _id: string;
  title: string;
  location: string;
  description: string;
  createMoment: Date;
  tagList: string[];
  totalState: ProjectState;
}

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  description: { type: String },
  createMoment: { type: Date },
  tagList: [String],
  totalState: {
    type: String,
    required: true,
    enum: [
      "new",
      "offer",
      "planning",
      "production",
      "installation",
      "warranty",
      "archived"
    ]
  }
});

const ProjectModel = mongoose.model<ProjectInterface>("project", ProjectSchema);

export default ProjectModel;
