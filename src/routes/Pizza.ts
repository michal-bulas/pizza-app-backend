import express from 'express';
import controller from '../controllers/Pizza';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.pizza.create), controller.createPizza);
router.get('/get/:pizzaId', controller.readPizza);
router.get('/get', controller.readAllPizza);
router.patch('/update/:pizzaId', ValidateSchema(Schemas.pizza.update), controller.updatePizza);
router.delete('/delete/:ingredientId', controller.deletePizza);

export = router;
