import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Action from '../models/Action';

const postAction = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;

  const action = new Action({
    _id: new mongoose.Types.ObjectId(),
    name
  });

  return action
    .save()
    .then((action) => res.status(201).json({ action }))
    .catch((error) => res.status(500).json({ error }));
};

const getActionById = (req: Request, res: Response, next: NextFunction) => {
  const actionId = req.params.actionId;

  return Action.findById(actionId)
    .then((action) => (action ? res.status(200).json({ action }) : res.status(404).json({ message: 'Not found' })))
    .catch((error) => res.status(404).json({ error }));
};

const getAllActions = (req: Request, res: Response, next: NextFunction) => {
  return Action.find()
    .then((actions) => res.status(200).json({ actions }))
    .catch((error) => res.status(500).json({ error }));
};

const updateAction = (req: Request, res: Response, next: NextFunction) => {
  const actionId = req.params.actionId;

  return Action.findById(actionId)
    .then((action) => {
      if (action) {
        action.set(req.body);
        return action
          .save()
          .then((action) => res.status(201).json({ action }))
          .catch((error) => res.status(500).json({ error }));
      } else {
        res.sendStatus(404).json({ message: 'Not found' });
      }
    })
    .catch((error) => res.status(500).json({ error }));
};

const deleteAction = (req: Request, res: Response, next: NextFunction) => {
  const actionId = req.params.actionId;

  return Action.findByIdAndDelete(actionId)
    .then((action) => (action ? res.status(201).json({ action, message: 'Deleted' }) : res.status(404).json({ message: 'not found' })))
    .catch((error) => res.status(500).json({ error }));
};

export default { postAction, getActionById, getAllActions, updateAction, deleteAction };
