import express from 'express';
import controller from '../controllers/Pizza';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.pizza.create), controller.postPizza);
router.get('/get/:pizzaId', controller.getPizzaById);
router.get('/get', controller.getAllPizzas);
router.get('/get/by-ingredient/:ingredientId', controller.getPizzasByIngredient);
router.get('/get/by-action/:ingredientId', controller.getPizzasByAction);
router.patch('/update/:pizzaId', ValidateSchema(Schemas.pizza.update), controller.updatePizza);
router.delete('/delete/:pizzaId', controller.deletePizza);

export = router;
