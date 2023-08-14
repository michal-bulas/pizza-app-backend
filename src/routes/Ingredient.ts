import express from 'express';
import controller from '../controllers/Ingredient';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.ingredient.create), controller.postIngredient);
router.get('/get/:ingredientId', controller.getIngredientById);
router.get('/get', controller.getAlIngredients);
router.get('/get/by-action/:actionId', controller.getIngredientsByAction);
router.patch('/get/update/:ingredientId', ValidateSchema(Schemas.ingredient.update), controller.updateIngredient);
router.delete('/delete/:ingredientId', controller.deleteIngredient);

export = router;
