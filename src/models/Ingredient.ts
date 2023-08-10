import mongoose, { Document, Schema } from 'mongoose';

export interface IIngredient {
  name: string;
  action: string;
}

export interface IIngredientModel extends IIngredient, Document {}

const IngredientSchema: Schema = new Schema({
  name: { type: String, required: true },
  action: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Action' }
});

export default mongoose.model<IIngredientModel>('Ingredient', IngredientSchema);
