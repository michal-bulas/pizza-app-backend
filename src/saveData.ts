import { config } from './config/config';

const mongoose = require('mongoose');

const { saveIngredient } = require('./controllers/Ingredient');
const { saveAction } = require('./controllers/Action');
const { savePizza } = require('./controllers/Pizza');

mongoose.connect(config.mongo.url, { retryWrites: true, w: 'majority', dbName: `lignumhardPizza` });

async function createExampleData() {
  try {
    // Create actions
    const grateAction = await saveAction('Grate');
    const sliceAction = await saveAction('Slice');
    const bakeAction = await saveAction('Bake');
    const fryAction = await saveAction('Fry');
    const seasonAction = await saveAction('Season');

    // Create ingredients with references to actions

    const tomatoSauce = await saveIngredient('Tomato sauce', seasonAction._id);
    const bbqSauce = await saveIngredient('BBQ Sauce', seasonAction._id);
    const mozzarella = await saveIngredient('Mozzarella', grateAction._id);
    const cheddar = await saveIngredient('Cheddar', grateAction._id);
    const parmesan = await saveIngredient('Parmesan', grateAction._id);
    const tomato = await saveIngredient('Tomato', sliceAction._id);
    const mushroom = await saveIngredient('Mushroom', bakeAction._id);
    const onion = await saveIngredient('Onion', sliceAction._id);
    const chicken = await saveIngredient('Chicken', fryAction._id);
    const beef = await saveIngredient('Beef', bakeAction._id);
    const pepperoni = await saveIngredient('Pepperoni', sliceAction._id);

    // Create pizzas with references to ingredients and actions
    const margheritaPizza = await savePizza('Margherita', [tomatoSauce._id, mozzarella._id], [bakeAction._id, sliceAction._id, seasonAction._id]);

    const pepperoniPizza = await savePizza('Pepperoni', [tomatoSauce._id, mozzarella._id, pepperoni._id], [bakeAction._id, sliceAction._id]);

    const meatyPizza = await savePizza('Meaty', [bbqSauce._id, mozzarella._id, pepperoni._id, chicken._id, beef._id], [bakeAction._id, sliceAction._id, seasonAction._id]);

    const threeCheesePizza = await savePizza('Three cheese', [mozzarella._id, parmesan._id, cheddar._id], [bakeAction._id, sliceAction._id]);

    const bbqChickenPizza = await savePizza('BBQ Chicken', [bbqSauce._id, cheddar._id, chicken._id], [bakeAction._id, sliceAction._id]);

    const supremePizza = await savePizza('Supreme', [bbqSauce._id, mozzarella._id, parmesan._id, chicken._id, beef._id, onion._id, mushroom._id], [bakeAction._id, sliceAction._id]);

    const VeganPizza = await savePizza('Vegan', [tomatoSauce._id, tomato._id, mushroom._id, onion._id], [bakeAction._id, sliceAction._id, seasonAction._id]);

    const tomatoBeefPizza = await savePizza('Tomato Beef', [tomatoSauce._id, cheddar._id, beef._id, tomato._id], [bakeAction._id, sliceAction._id]);

    const tomatoPizza = await savePizza('Tomato', [tomatoSauce._id, parmesan._id, tomato._id], [bakeAction._id, sliceAction._id, seasonAction._id]);

    const doubleSaucePizza = await savePizza('Double Sauce', [tomatoSauce._id, bbqSauce._id], [bakeAction._id, sliceAction._id]);

    const friedPizza = await savePizza('Deep Fried', [bbqSauce._id, onion._id, pepperoni._id], [fryAction._id, sliceAction._id]);

    const allPizza = await savePizza(
      'All in One',
      [bbqSauce._id, tomatoSauce._id, beef._id, tomato._id, mushroom._id, cheddar._id, parmesan._id, mozzarella._id, chicken._id, onion._id, pepperoni._id],
      [fryAction._id, bakeAction._id, sliceAction._id, seasonAction._id]
    );

    console.log('Example data created successfully.');
  } catch (error) {
    console.error('Error creating example data:', error);
  } finally {
    mongoose.connection.close();
  }
}
export default createExampleData;
