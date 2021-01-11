import mongoose, { Document } from "mongoose";

export interface UserInterface extends Document {
  loginName: string;
  displayName: string;
  pwHash: string;
  tokenList: string[];
}

const UserSchema = new mongoose.Schema({
  loginName: { type: String, required: true, unique: true },
  displayName: { type: String },
  pwHash: { type: String, required: true, unique: true },
  tokenList: [String]
});

const UserModel = mongoose.model<UserInterface>("user", UserSchema);

export default UserModel;
