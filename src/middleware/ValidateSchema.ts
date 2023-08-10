import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IAction } from '../models/Action';
import { IIngredient } from '../models/Ingredient';
import { IPizza } from '../models/Pizza';

export const ValidateSchema = (schema: ObjectSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body);
      next();
    } catch (error) {
      Logging.error(error);
      return res.status(422).json({ error });
    }
  };
};

export const Schemas = {
  action: {
    create: Joi.object<IAction>({
      name: Joi.string().required()
    }),

    update: Joi.object<IAction>({
      name: Joi.string().required()
    })
  },
  ingredient: {
    create: Joi.object<IIngredient>({
      action: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

      name: Joi.string().required()
    }),

    update: Joi.object<IIngredient>({
      action: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),
      name: Joi.string().required()
    })
  },
  pizza: {
    create: Joi.object<IPizza>({
      action: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),

      ingredient: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),

      name: Joi.string().required()
    }),
    update: Joi.object<IPizza>({
      action: Joi.string()
        .regex(/^[0-9a-fA-F]{24}$/)
        .required(),

      ingredient: Joi.array()
        .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
        .required(),

      name: Joi.string().required()
    })
  }
};
