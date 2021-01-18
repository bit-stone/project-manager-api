import mongoose, { Document } from "mongoose";

const enum ProjectState {
  new = "new",
  offer = "offer",
  offerRejected = "offerRejected",
  planning = "planning",
  production = "production",
  installation = "installation",
  warranty = "warranty"
}

export interface ProjectInterface extends Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  location: string;
  isArchived: boolean;
  description: string;
  createMoment: Date;
  tagList: string[];
  totalState: ProjectState;
}

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String },
  isArchived: { type: Boolean, default: false, required: true },
  description: { type: String },
  createMoment: { type: Date, default: () => Date.now() },
  tagList: [String],
  totalState: {
    type: String,
    required: true,
    enum: [
      "new",
      "offer",
      "offerRejected",
      "planning",
      "production",
      "installation",
      "warranty"
    ],
    default: "new"
  }
});

const ProjectModel = mongoose.model<ProjectInterface>("project", ProjectSchema);

export default ProjectModel;
