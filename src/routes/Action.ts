import express from 'express';
import controller from '../controllers/Action';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.action.create), controller.createAction);
router.get('/get/:actionId', controller.readAction);
router.get('/get', controller.readAllAction);
router.patch('/update/:actionId', ValidateSchema(Schemas.action.update), controller.updateAction);
router.delete('/delete/:actionId', controller.deleteAction);

export = router;
