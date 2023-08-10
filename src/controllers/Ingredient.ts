import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Ingredient from '../models/Ingredient';

export const saveIngredient = async (name: string, action: string) => {
  const ingredient = new Ingredient({
    _id: new mongoose.Types.ObjectId(),
    name,
    action
  });
  return await ingredient.save();
};

const createIngredient = (req: Request, res: Response, next: NextFunction) => {
  const { name, action } = req.body;

  const ingredient = new Ingredient({
    _id: new mongoose.Types.ObjectId(),
    name,
    action
  });

  return ingredient
    .save()
    .then((ingredient) => res.status(201).json({ ingredient }))
    .catch((error) => res.status(500).json({ error }));
};
const readIngredient = (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.ingredientId;

  return Ingredient.findById(ingredientId)
    .populate('ingredient')
    .then((ingredient) => (ingredient ? res.status(200).json({ ingredient }) : res.sendStatus(404).json({ message: 'Not found' })))
    .catch((error) => res.status(500).json({ error }));
};
const readAllIngredient = (req: Request, res: Response, next: NextFunction) => {
  return Ingredient.find()
    .populate('ingredient')
    .then((ingredients) => res.status(200).json({ ingredients }))
    .catch((error) => res.status(500).json({ error }));
};
const updateIngredient = (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.ingredientId;

  return Ingredient.findById(ingredientId)
    .then((ingredient) => {
      if (ingredient) {
        ingredient.set(req.body);
        return ingredient
          .save()
          .then((ingredient) => res.status(201).json({ ingredient }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.sendStatus(404).json({ message: 'Not found' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
const deleteIngredient = (req: Request, res: Response, next: NextFunction) => {
  const ingredientId = req.params.ingredientId;

  return Ingredient.findByIdAndDelete(ingredientId)
    .then((ingredient) => (ingredient ? res.status(201).json({ ingredient, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
    .catch((error) => res.status(500).json({ error }));
};

export default { createIngredient, readIngredient, readAllIngredient, updateIngredient, deleteIngredient };
