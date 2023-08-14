import { Request, Response, NextFunction } from 'express';
import Action from '../../models/Action';
import actions from '../Action';

jest.mock('../../models/Action', () => ({
  set: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findById: jest.fn(),
  findByIdAndDelete: jest.fn()
}));

describe('Actions Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const next: NextFunction = jest.fn();

  beforeEach(() => {
    req = {
      body: {},
      params: {}
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      sendStatus: jest.fn().mockReturnThis()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getActionById', () => {
    it('should fetch an action by ID and return 200 status', async () => {
      const mockAction = { name: 'testAction' };

      (Action.findById as jest.Mock).mockResolvedValueOnce(mockAction);

      req.params = { actionId: 'mockId' };

      await actions.getActionById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ action: mockAction });
    });

    it('should return 404 status if action is not found', async () => {
      const mockAction = null;

      (Action.findById as jest.Mock).mockResolvedValueOnce(mockAction);

      req.params = { actionId: 'mockId' };

      await actions.getActionById(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Not found' });
    });
  });

  describe('getAllActions', () => {
    it('should fetch all actions and return 200 status', async () => {
      const mockActions = [{ name: 'testAction1' }, { name: 'testAction2' }];

      (Action.find as jest.Mock).mockResolvedValueOnce(mockActions);

      await actions.getAllActions(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ actions: mockActions });
    });
  });

  describe('updateAction', () => {
    it('should update an action and return 201 status', async () => {
      const mockAction = {
        set: jest.fn(),
        save: jest.fn().mockResolvedValueOnce({ name: 'updatedAction' })
      };

      (Action.findById as jest.Mock).mockResolvedValueOnce(mockAction);

      req.params = { actionId: 'mockId' };
      req.body = { name: 'updatedAction' };

      await actions.updateAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ action: { name: 'updatedAction' } });
    });

    it('should return 500 if theres a database error during update', async () => {
      const mockAction = { set: jest.fn(), save: jest.fn().mockRejectedValue(new Error('DB Error')) };
      Action.findById = jest.fn().mockResolvedValue(mockAction);

      req.params = { actionId: 'someId' };
      req.body = { name: 'updatedAction' };

      await actions.updateAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error('DB Error') });
    });

    it('should return 500 if theres a database error during findById', async () => {
      Action.findById = jest.fn().mockRejectedValue(new Error('DB Error'));

      req.params = { actionId: 'someId' };

      await actions.updateAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: new Error('DB Error') });
    });
  });

  describe('deleteAction', () => {
    it('should delete an action and return 201 status with a message', async () => {
      const mockAction = { name: 'testAction' };

      (Action.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(mockAction);

      req.params = { actionId: 'mockId' };

      await actions.deleteAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ action: mockAction, message: 'Deleted' });
    });

    it('should return 404 status if action to delete is not found', async () => {
      (Action.findByIdAndDelete as jest.Mock).mockResolvedValueOnce(null);

      req.params = { actionId: 'mockId' };

      await actions.deleteAction(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'not found' });
    });
  });
});
