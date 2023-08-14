import { Request, Response, NextFunction } from 'express';
import Ingredient from '../../models/Ingredient';
import ingredient from '../Ingredient';

jest.mock('mongoose');
jest.mock('../../models/Ingredient', () => ({
  find: jest.fn(),
  findById: jest.fn(() => ({ populate: jest.fn() })),
  findOne: jest.fn(),
  create: jest.fn()
}));

describe('Ingredient Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('getIngredientById', () => {
    it('fetches ingredient by ID successfully', async () => {
      const mockIngredient = {};

      (Ingredient.findById as any).mockResolvedValueOnce(mockIngredient);

      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 404 error if ingredient is not found', async () => {
      (Ingredient.findById as any).mockResolvedValueOnce(null);

      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Ingredient.findById as any).mockRejectedValueOnce(mockError);

      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAlIngredients', () => {
    it('fetches all ingredients successfully', async () => {
      const mockIngredients = [{}];
      (Ingredient.find as any).mockResolvedValueOnce(mockIngredients);

      await ingredient.getAlIngredients(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Ingredient.find as any).mockRejectedValueOnce(mockError);

      await ingredient.getAlIngredients(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
