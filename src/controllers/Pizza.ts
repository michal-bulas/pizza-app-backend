import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Pizza from '../models/Pizza';

const postPizza = (req: Request, res: Response, next: NextFunction) => {
  const { name, ingredient, action } = req.body;

  const pizza = new Pizza({
    _id: new mongoose.Types.ObjectId(),
    name,
    ingredient,
    action
  });

  return pizza
    .save()
    .then((pizza) => res.status(201).json({ pizza }))
    .catch((error) => res.status(500).json({ error }));
};

const getPizzaById = (req: Request, res: Response, next: NextFunction) => {
  const pizzaId = req.params.pizzaId;

  return Pizza.findById(pizzaId)
    .then((pizza) => (pizza ? res.status(200).json({ pizza }) : res.sendStatus(404).json({ message: 'Not found' })))
    .catch((error) => res.status(500).json({ error }));
};

const getAllPizzas = (req: Request, res: Response, next: NextFunction) => {
  return Pizza.find()
    .then((pizzas) => res.status(200).json({ pizzas }))
    .catch((error) => res.status(500).json({ error }));
};

const updatePizza = (req: Request, res: Response, next: NextFunction) => {
  const pizzaId = req.params.pizzaId;

  return Pizza.findById(pizzaId).then((pizza) => {
    if (pizza) {
      pizza.set(req.body);
      return pizza
        .save()
        .then((pizza) => res.status(201).json({ pizza }))
        .catch((error) => res.status(500).json({ error }));
    } else {
      res.sendStatus(404).json({ message: 'Not found' });
    }
  });
};

const deletePizza = (req: Request, res: Response, next: NextFunction) => {
  const pizzaId = req.params.pizzaId;

  return Pizza.findByIdAndDelete(pizzaId)
    .then((pizza) => (pizza ? res.status(201).json({ pizza, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
    .catch((error) => res.status(500).json({ error }));
};

export default { postPizza, getPizzaById, getAllPizzas, updatePizza, deletePizza };
