import express from 'express';
import controller from '../controllers/Ingredient';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

router.post('/create', ValidateSchema(Schemas.ingredient.create), controller.createIngredient);
router.get('/get/:ingredientId', controller.readIngredient);
router.get('/get', controller.readAllIngredient);
router.patch('/update/:ingredientId', ValidateSchema(Schemas.ingredient.update), controller.updateIngredient);
router.delete('/delete/:ingredientId', controller.deleteIngredient);

export = router;