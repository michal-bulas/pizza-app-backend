import express from 'express';
import controller from '../controllers/Action';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.action.create), controller.postAction);
router.get('/get/:actionId', controller.getActionById);
router.get('/get', controller.getAllActions);
router.patch('/update/:actionId', ValidateSchema(Schemas.action.update), controller.updateAction);
router.delete('/delete/:actionId', controller.deleteAction);

export = router;
