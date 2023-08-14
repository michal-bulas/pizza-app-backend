import { Request, Response, NextFunction } from 'express';
import Pizza from '../../models/Pizza';
import pizza from '../Pizza';

jest.mock('mongoose');
jest.mock('../../models/Pizza', () => {
  return {
    findByIdAndDelete: jest.fn(),
    find: jest.fn(),
    findById: jest.fn()
  };
});

describe('Pizza Controllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {}, params: {} as any };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      sendStatus: jest.fn().mockReturnThis()
    };

    next = jest.fn();
  });

  describe('getPizzaById', () => {
    it('fetches pizza by ID successfully', async () => {
      const mockPizza = {};

      (Pizza.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(mockPizza)
      }));

      await pizza.getPizzaById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 404 error if pizza is not found', async () => {
      (Pizza.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValueOnce(null)
      }));

      await pizza.getPizzaById(req as Request, res as Response, next);

      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Pizza.findById as jest.Mock).mockImplementationOnce(() => ({
        populate: jest.fn().mockRejectedValueOnce(mockError)
      }));

      await pizza.getPizzaById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAllPizzas', () => {
    it('fetches all pizzas successfully', async () => {
      const mockPizzas = [{}];
      (Pizza.find as jest.Mock).mockResolvedValueOnce(mockPizzas);

      await pizza.getAllPizzas(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Pizza.find as jest.Mock).mockRejectedValueOnce(mockError);

      await pizza.getAllPizzas(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getPizzasByIngredient', () => {
    it('fetches pizzas by ingredient successfully', async () => {
      const mockPizzas = [{}];
      (Pizza.find as jest.Mock).mockResolvedValueOnce(mockPizzas);
      (req.params as any).ingredientId = 'someIngredientId';

      await pizza.getPizzasByIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ pizzas: mockPizzas });
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Pizza.find as jest.Mock).mockRejectedValueOnce(mockError);
      (req.params as any).ingredientId = 'someIngredientId';

      await pizza.getPizzasByIngredient(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError });
    });
  });

  describe('getPizzasByAction', () => {
    it('fetches pizzas by action successfully', async () => {
      const mockPizzas = [{}];
      (Pizza.find as jest.Mock).mockResolvedValueOnce(mockPizzas);
      (req.params as any).ingredientId = 'someActionId';

      await pizza.getPizzasByAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ pizzas: mockPizzas });
    });

    it('returns a 500 error if there is an exception', async () => {
      const mockError = new Error('Error');
      (Pizza.find as jest.Mock).mockRejectedValueOnce(mockError);
      (req.params as any).ingredientId = 'someActionId';

      await pizza.getPizzasByAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: mockError });
    });
  });

  describe('updatePizza', () => {
    it('updates a pizza successfully', async () => {
      const mockPizza = { set: jest.fn(), save: jest.fn().mockResolvedValueOnce({}) };
      (Pizza.findById as jest.Mock).mockResolvedValueOnce(mockPizza);

      await pizza.updatePizza(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns a 404 error if pizza is not found', async () => {
      (Pizza.findById as jest.Mock).mockResolvedValueOnce(null);

      await pizza.updatePizza(req as Request, res as Response, next);

      expect(res.sendStatus).toHaveBeenCalledWith(404);
    });

    it('returns a 500 error if there is an exception while updating', async () => {
      const mockPizza = { set: jest.fn(), save: jest.fn().mockRejectedValueOnce(new Error('Error')) };
      (Pizza.findById as jest.Mock).mockResolvedValueOnce(mockPizza);

      await pizza.updatePizza(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deletePizza', () => {
    it('deletes a pizza successfully', async () => {
      const mockPizza = {};
      (Pizza.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockPizza);

      await pizza.deletePizza(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });

    it('returns a 404 error if pizza is not found', async () => {
      (Pizza.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      await pizza.deletePizza(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('returns a 500 error if there is an exception while deleting', async () => {
      const mockError = new Error('Error');
      (Pizza.findByIdAndDelete as jest.Mock).mockRejectedValueOnce(mockError);

      await pizza.deletePizza(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
