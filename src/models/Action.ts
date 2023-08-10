import mongoose, { Document, Schema } from 'mongoose';

export interface IAction {
  name: string;
}

export interface IActionModel extends IAction, Document {}

const ActionSchema: Schema = new Schema({
  name: { type: String, required: true }
});

export default mongoose.model<IActionModel>('Action', ActionSchema);
