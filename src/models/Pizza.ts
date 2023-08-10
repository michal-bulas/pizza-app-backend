import mongoose, { Document, Schema } from 'mongoose';

export interface IPizza {
  name: string;
  ingredient: string[];
  action: string[];
}

export interface IPizzaModel extends IPizza, Document {}

const PizzaSchema: Schema = new Schema({
  name: { type: String, required: true },
  ingredient: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ingredient' }],
  action: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Action' }]
});

export default mongoose.model<IPizzaModel>('Pizza', PizzaSchema);
