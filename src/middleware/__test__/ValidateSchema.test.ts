import { Response, Request, NextFunction } from 'express';
import { ValidateSchema, Schemas } from '../ValidateSchema';
import Logging from '../../library/Logging';

jest.mock('../../library/Logging');

describe('Middleware: ValidateSchema', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      body: {}
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    next = jest.fn();
  });

  describe('Action Schema Validation', () => {
    it('validates action create schema successfully', async () => {
      req.body = { name: 'sample action' };
      await ValidateSchema(Schemas.action.create)(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('invalidates action create schema with missing fields', async () => {
      req.body = {};
      await ValidateSchema(Schemas.action.create)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });

    it('validates action update schema successfully', async () => {
      req.body = { name: 'updated action' };
      await ValidateSchema(Schemas.action.update)(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('invalidates action update schema with missing fields', async () => {
      req.body = {};
      await ValidateSchema(Schemas.action.update)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });
  });

  describe('Ingredient Schema Validation', () => {
    it('validates ingredient create schema successfully', async () => {
      req.body = {
        action: '5f3a1295b6502b2ba4212e89',
        name: 'sample ingredient'
      };
      await ValidateSchema(Schemas.ingredient.create)(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('invalidates ingredient create schema with missing fields', async () => {
      req.body = { action: '5f3a1295b6502b2ba4212e89' };
      await ValidateSchema(Schemas.ingredient.create)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });

    it('validates ingredient update schema successfully', async () => {
      req.body = {
        action: '5f3a1295b6502b2ba4212e89',
        name: 'updated ingredient'
      };
      await ValidateSchema(Schemas.ingredient.update)(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('invalidates ingredient update schema with missing fields', async () => {
      req.body = { action: '5f3a1295b6502b2ba4212e89' };
      await ValidateSchema(Schemas.ingredient.update)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });
  });

  describe('Pizza Schema Validation', () => {
    const validPizzaPayload = {
      action: ['5f3a1295b6502b2ba4212e89'],
      ingredient: ['5f3a1295b6502b2ba4212e89'],
      name: 'sample pizza'
    };

    it('validates pizza create schema successfully', async () => {
      req.body = validPizzaPayload;
      await ValidateSchema(Schemas.pizza.create)(req as Request, res as Response, next);

      expect(next).toHaveBeenCalled();
    });

    it('invalidates pizza create schema with missing fields', async () => {
      req.body = { action: ['5f3a1295b6502b2ba4212e89'] };
      await ValidateSchema(Schemas.pizza.create)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });

    it('invalidates pizza update schema with missing fields', async () => {
      req.body = { action: ['5f3a1295b6502b2ba4212e89'] };
      await ValidateSchema(Schemas.pizza.update)(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(422);
      expect(Logging.error).toHaveBeenCalled();
    });
  });
});
