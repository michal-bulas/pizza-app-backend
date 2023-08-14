import { Request, Response, NextFunction } from 'express';
import Ingredient from '../../models/Ingredient';
import ingredient from '../Ingredient';

jest.mock('mongoose');
jest.mock('../../models/Ingredient', () => ({
  find: jest.fn(),
  findById: jest.fn(() => ({ populate: jest.fn() })),
  create: jest.fn(),
  findByIdAndDelete: jest.fn()
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

      (Ingredient.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockIngredient)
      }));

      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 404 error if ingredient is not found', async () => {
      (Ingredient.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(null)
      }));
      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Ingredient.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockRejectedValueOnce(mockError)
      }));
      await ingredient.getIngredientById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAlIngredients', () => {
    it('fetches all ingredients successfully', async () => {
      const mockIngredients = [{}];
      (Ingredient.find as jest.Mock).mockResolvedValueOnce(mockIngredients);

      await ingredient.getAlIngredients(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Ingredient.find as jest.Mock).mockRejectedValueOnce(mockError);

      await ingredient.getAlIngredients(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getIngredientsByAction', () => {
    it('fetches ingredients by action successfully', async () => {
      const mockIngredients = [{}];
      (Ingredient.find as jest.Mock).mockResolvedValueOnce(mockIngredients);

      (req.params as any).actionId = 'someActionId';

      await ingredient.getIngredientsByAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ ingredients: mockIngredients });
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Ingredient.find as jest.Mock).mockRejectedValueOnce(mockError);

      (req.params as any).actionId = 'someActionId'; //

      await ingredient.getIngredientsByAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError });
    });
  });

  describe('updateIngredient', () => {
    it('updates an ingredient successfully', async () => {
      const mockIngredient = { set: jest.fn(), save: jest.fn().mockResolvedValueOnce({}) };
      (Ingredient.findById as jest.Mock).mockResolvedValueOnce(mockIngredient);

      (req.params as any).ingredientId = 'someIngredientId';

      await ingredient.updateIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
    it('returns a 404 error if ingredient is not found', async () => {
      (Ingredient.findById as jest.Mock).mockResolvedValueOnce(null);

      await ingredient.updateIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    });

    it('returns a 500 error if there is an exception while updating', async () => {
      const mockError = new Error('Error');
      const mockIngredient = { set: jest.fn(), save: jest.fn().mockRejectedValueOnce(mockError) };
      (Ingredient.findById as jest.Mock).mockResolvedValueOnce(mockIngredient);

      (req.params as any).ingredientId = 'someIngredientId';

      await ingredient.updateIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError });
    });
  });
  describe('Ingredient Controllers › deleteIngredient', () => {
    it('deletes an ingredient successfully', async () => {
      const mockIngredient = { name: 'Tomato' }; // mock the ingredient as needed
      (Ingredient.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockIngredient);

      await ingredient.deleteIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ ingredient: mockIngredient, message: 'Deleted' });
    });

    it('returns a 404 error if ingredient is not found', async () => {
      (Ingredient.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      await ingredient.deleteIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'not found' });
    });

    it('returns a 500 error if there is an exception during deletion', async () => {
      const mockError = new Error('Error during deletion');
      (Ingredient.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(mockError);

      await ingredient.deleteIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError });
    });
  });
});
