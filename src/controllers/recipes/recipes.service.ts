import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* Services */
import { RecipesBookService } from '../recipesBook/recipesBook.service';
import { UsersInfoService } from '../users-info/users-info.service';
import { UsersInventoryService } from '../users-inventory/users-inventory.service';
import { UsersTimelineService } from '../users-timeline/users-timeline.service';
import { ProductService } from '../product/product.service';

/* Entities */
import { RecipeInterface } from './interfaces/recipe.interface';
import { RecipeModel } from './models/recipe.model';
import { NutrientModel } from '../nutrient/models/nutrient.model';
import { PreferenceModel } from '../preference/models/preference.model';
import { AllergyModel } from '../allergy/models/allergy.model';
import { Unit } from '../../shared/enums/unit.enum';

/* Extras */
import * as _ from 'lodash';

@Injectable()
export class RecipesService {
  constructor(
    /*
        InjectModel is a decorator imported from @nestjs/mongoose which allows us to inject a Mongoose model.
        The string it takes is the name defined by us in the RecipesModule.
        The type of the model is imported from mongoose itself.
        The recipeModel is an injected constructor for a Mongoose model (which, under the surface, is approximately a class).
        We will use it to create a JSON-like object which will then be easily "CRUDed" into/from our database.
    */
    @InjectModel('Recipe') private readonly recipeModel: Model<RecipeInterface>,
    @Inject(forwardRef(() => RecipesBookService))
    private readonly recipesBookService: RecipesBookService,
    private readonly usersInfoService: UsersInfoService,
    private readonly usersInventoryService: UsersInventoryService,
    private readonly usersTimelineService: UsersTimelineService,
    private readonly productService: ProductService
  ) {}

  /*
    We are using the async/await solution for handling asynchronous requests to the database.
    By using async/await we are still handling promises, but in a different more-synchronous-looking way.
    Under the surface, it actually does the same stuff than handling a promise by .then():
        this.save().then(
            () => {
                // resolve.
            },
            () => {
                // reject.
            }
        );
    Instead, we could also use Observables.
  */
  async getRecipes(): Promise<RecipeModel[]> {
    const recipes = await this.recipeModel.find().exec();

    return recipes.map((r) => {
      const {
        _id,
        name,
        cookingTime,
        calories,
        ingredients,
        steps,
        nutrients,
        preferences,
        allergies,
        tags,
        author,
        authorId,
        shared,
        rating,
        rates,
        comments,
        originalId,
        isCopy,
        image
      } = r;
      return {
        id: _id,
        name,
        cookingTime,
        calories,
        ingredients,
        steps,
        nutrients,
        preferences,
        allergies,
        tags,
        author,
        authorId,
        shared,
        rating,
        rates,
        comments,
        originalId,
        isCopy,
        image
      };
    });
  }

  async getSharedRecipes() {
    const recipes = await this.recipeModel.find({ shared: true }).exec();

    return recipes.map((r) => {
      const {
        _id,
        name,
        cookingTime,
        calories,
        ingredients,
        steps,
        nutrients,
        preferences,
        allergies,
        tags,
        author,
        authorId,
        shared,
        rating,
        rates,
        comments,
        originalId,
        isCopy,
        image
      } = r;
      return {
        id: _id,
        name,
        cookingTime,
        calories,
        ingredients,
        steps,
        nutrients,
        preferences,
        allergies,
        tags,
        author,
        authorId,
        shared,
        rating,
        rates,
        comments,
        originalId,
        isCopy,
        image
      };
    });
  }

  async getRecipeById(recipeId: string): Promise<RecipeModel> {
    const {
      _id,
      name,
      cookingTime,
      calories,
      ingredients,
      steps,
      nutrients,
      preferences,
      allergies,
      tags,
      author,
      authorId,
      shared,
      rating,
      rates,
      comments,
      originalId,
      isCopy,
      image
    } = await this.findRecipeById(recipeId);

    const recipe = {
      id: _id,
      name,
      cookingTime,
      calories,
      ingredients,
      steps,
      nutrients,
      preferences,
      allergies,
      tags,
      author,
      authorId,
      shared,
      rating,
      rates,
      comments,
      originalId,
      isCopy,
      image
    };

    return recipe;
  }

  async insertRecipe(
    name: string,
    cookingTime: string,
    calories: number,
    ingredients: any[],
    steps: string[],
    nutrients: NutrientModel[],
    preferences: PreferenceModel[],
    allergies: AllergyModel[],
    tags: string[],
    author: string,
    authorId: string,
    shared: boolean,
    rating: number,
    rates: [],
    comments: [],
    originalId: string,
    isCopy: boolean,
    image: string
  ): Promise<RecipeModel> {
    /*
        Creating a new recipe by using Mongoose models.
        By using a Mongoose model we create an special JSO which allows us to easily communicate with our database.
        We use our recipeModel class propery/attribute (so we need to use this.) and then it's used as a constructor for the Mongoose model.
        The constructor takes a JSON which has to pair the attributes defined in our RecipeInterface.
    */
    const timestamp = new Date();

    const newRecipe = new this.recipeModel({
      /*
        TypeScript short-cut for:
        name: name,
        description: description,
        calories: calories
      */
      name,
      cookingTime,
      calories,
      ingredients,
      steps,
      nutrients,
      preferences,
      allergies,
      tags,
      author,
      authorId,
      shared,
      rating,
      rates,
      comments,
      originalId,
      isCopy,
      image,
      timestamp
    });

    /* Save function is provided by Mongoose in order to simplify server <-> database information exchange. */
    const response = await newRecipe.save();
    return response;
  }

  async updateRecipe(
    recipeId: string,
    name: string,
    cookingTime: string,
    calories: number,
    ingredients: any[],
    steps: string[],
    nutrients: NutrientModel[],
    preferences: PreferenceModel[],
    allergies: AllergyModel[],
    tags: string[],
    author: string,
    authorId: string,
    shared: boolean,
    rating: number,
    rates: [],
    comments: [],
    originalId: string,
    isCopy: boolean,
    image: string
  ): Promise<RecipeModel> {
    const updatedRecipe = await this.findRecipeById(recipeId);

    if (name) {
      updatedRecipe.name = name;
    }

    if (cookingTime) {
      updatedRecipe.cookingTime = cookingTime;
    }

    if (calories) {
      updatedRecipe.calories = calories;
    }

    if (ingredients) {
      updatedRecipe.ingredients = ingredients;
    }

    if (steps) {
      updatedRecipe.steps = steps;
    }

    if (nutrients) {
      updatedRecipe.nutrients = nutrients;
    }

    if (preferences) {
      updatedRecipe.preferences = preferences;
    }

    if (allergies) {
      updatedRecipe.allergies = allergies;
    }

    if (tags) {
      updatedRecipe.tags = tags;
    }

    if (shared !== undefined && shared !== null) {
      updatedRecipe.shared = shared;
    }

    if (author) {
      updatedRecipe.author = author;
    }

    if (authorId) {
      updatedRecipe.authorId = authorId;
    }

    if (rating) {
      updatedRecipe.rating = rating;
    }

    if (rates) {
      updatedRecipe.rates = rates;
    }

    if (comments) {
      updatedRecipe.comments = comments;
    }

    if (originalId) {
      updatedRecipe.originalId = originalId;
    }

    if (isCopy !== undefined && isCopy !== null) {
      updatedRecipe.isCopy = false;
    }

    if (image) {
      updatedRecipe.image = image;
    }

    updatedRecipe.timestamp = new Date();

    const response = await updatedRecipe.save();
    return response;
  }

  async deleteRecipe(recipeId: string) {
    const response = await this.recipeModel.deleteOne({ _id: recipeId }).exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find recipe.');
    }
  }

  /* User related */

  async insertUserRecipe(
    userId: string,
    name: string,
    cookingTime: string,
    calories: number,
    ingredients: any[],
    steps: string[],
    nutrients: NutrientModel[],
    preferences: PreferenceModel[],
    allergies: AllergyModel[],
    tags: string[],
    author: string,
    authorId: string,
    shared: boolean,
    rating: number,
    rates: [],
    comments: [],
    originalId: string,
    isCopy: boolean,
    image: string
  ): Promise<RecipeModel> {
    const newRecipe = new this.recipeModel({
      name,
      cookingTime,
      calories,
      ingredients,
      steps,
      nutrients,
      preferences,
      allergies,
      tags,
      author,
      authorId,
      shared,
      rating,
      rates,
      comments,
      originalId,
      isCopy,
      // image, // uncomment after fair
      image: 'placeholder',
      timestamp: new Date()
    });

    const newInsertedRecipe = await newRecipe.save();

    /* Update user's recipes book. */
    const userRecipesBook = await this.recipesBookService.findUserFavoriteRecipesBookByUserId(
      userId
    );
    const userRecipes = userRecipesBook.recipes as string[];
    userRecipes.push(newInsertedRecipe._id.toHexString());

    await this.recipesBookService.updateRecipesBook(
      userRecipesBook.id,
      null,
      userRecipes,
      null,
      null
    );

    /* Update user's timeline. */
    if (shared) {
      const event = {
        userId,
        recipeId: newInsertedRecipe._id.toHexString(),
        image,
        content: `${author} has published a new recipe (${name})!`,
        timestamp: new Date()
      };
      this.usersTimelineService.addEventToUsersTimeline(userId, event);
    }

    return newInsertedRecipe;
  }

  async deleteUserRecipe(recipesBookId: string, recipeId: string) {
    const response = await this.recipeModel.deleteOne({ _id: recipeId }).exec();

    const userRecipesBook = await this.recipesBookService.getRecipesBookById(
      recipesBookId
    );
    let userRecipes = userRecipesBook.recipes as string[];
    userRecipes = userRecipes.filter((r) => r !== recipeId);

    await this.recipesBookService.updateRecipesBook(
      userRecipesBook.id,
      null,
      userRecipes,
      null,
      null
    );

    if (response.n === 0) {
      throw new NotFoundException('Could not find recipe.');
    }
  }

  async advancedDeleteUserRecipe(recipeId: string, userId: string) {
    const response = await this.recipeModel.deleteOne({ _id: recipeId }).exec();

    const userRecipesBooks = await this.recipesBookService.findRecipesBooksByUserId(
      userId
    );

    for await (const userRecipesBook of userRecipesBooks) {
      let userRecipes = userRecipesBook.recipes as string[];

      if (userRecipes.find((r) => r === recipeId)) {
        userRecipes = userRecipes.filter((r) => r !== recipeId);

        await this.recipesBookService.updateRecipesBook(
          userRecipesBook.id,
          null,
          userRecipes,
          null,
          null
        );
      }
    }

    if (response.n === 0) {
      throw new NotFoundException('Could not find recipe.');
    }
  }

  async cookRecipe(recipeId: string, userId: string) {
    const userInventory = await this.usersInventoryService.getUserInventoryByUserId(
      userId
    );
    const recipe = await this.getRecipeById(recipeId);

    const recipeIngredients = recipe.ingredients as any[];
    const userInventoryProducts = [
      ...userInventory.refrigerator,
      ...userInventory.freezer,
      ...userInventory.pantry,
      ...userInventory.others
    ] as any[];

    let updatedQuantity;
    for await (const recipeIngredient of recipeIngredients) {
      for await (const product of userInventoryProducts) {
        if (recipeIngredient.ingredient.id === product.ingredient.id) {
          const ingredientUnit: Unit = Unit.getUnit(recipeIngredient.unit);
          const productUnit: Unit = Unit.getUnit(product.unit);
          if (
            ingredientUnit
              .getMeassurement()
              .includes(productUnit.getMeassurement()) ||
            productUnit
              .getMeassurement()
              .includes(ingredientUnit.getMeassurement())
          ) {
            if (ingredientUnit.getValue() === productUnit.getValue()) {
              updatedQuantity = product.quantity - recipeIngredient.quantity;
            } else {
              updatedQuantity =
                product.quantity * productUnit.getConversionRatio() -
                recipeIngredient.quantity * ingredientUnit.getConversionRatio();

              switch (productUnit.getValue()) {
                case 'kg':
                  updatedQuantity = updatedQuantity * 1000;
                  break;
                case 'l':
                  updatedQuantity = updatedQuantity * 1000;
                  break;
                default:
                  break;
              }
            }

            if (updatedQuantity < 0) {
              updatedQuantity = 0;
            }

            const {
              id,
              name,
              ingredient,
              quantity,
              unit,
              expirationDate
            } = product;

            await this.productService.updateProduct(
              id.toHexString(),
              name,
              ingredient,
              updatedQuantity,
              unit,
              expirationDate
            );
          }
        }
      }
    }
  }

  async addRecipeIngredientsToShoppingList(recipeId: string, userId: string) {
    const userInfo = await this.usersInfoService.getUserInfoByUserId(userId);
    let userShoppingList = userInfo.userShoppingLists as string[];

    const recipe = await this.getRecipeById(recipeId);
    const recipeIngredients = recipe.ingredients.map(
      (i) => i.ingredient.name
    ) as string[];

    const difference = _.difference(recipeIngredients, userShoppingList);

    userShoppingList = [...userShoppingList, ...difference];

    const {
      id,
      username,
      name,
      gender,
      country,
      city,
      avatar,
      preferences,
      allergies,
      following,
      followers,
      ...rest
    } = userInfo;

    const response = await this.usersInfoService.updateUsersInfo(
      id,
      userId,
      username,
      name,
      gender,
      country,
      city,
      avatar,
      preferences,
      allergies,
      userShoppingList,
      following,
      followers
    );

    return response;
  }

  /* Community */

  async shareRecipe(recipeId: string, shared: boolean) {
    const updatedRecipe = await this.findRecipeById(recipeId);

    if (shared !== undefined && shared !== null) {
      updatedRecipe.shared = shared;
    }

    const response = await updatedRecipe.save();
    return response;
  }

  async rateRecipe(recipeId: string, rate: any) {
    const userId = rate.userId;

    const ratedRecipe = await this.findRecipeById(recipeId);

    let rates = ratedRecipe.rates as any[];

    rates = rates.filter((r) => r.userId !== userId);

    rates.push(rate);

    const newRating =
      rates
        .map((r) => r.rating)
        .reduce((a, b) => {
          return a + b;
        }) / rates.length;

    ratedRecipe.rates = rates;
    ratedRecipe.rating = newRating;

    await ratedRecipe.save();

    return newRating;
  }

  async commentRecipe(recipeId: string, newComment: any) {
    const commentedRecipe = await this.findRecipeById(recipeId);

    commentedRecipe.comments.push(newComment);

    await commentedRecipe.save();

    return newComment;
  }

  async saveRecipe(
    recipeId: string,
    recipesBookId: string,
    userId: string,
    newAuthor: string
  ) {
    const recipe = await this.findRecipeById(recipeId);

    const userRecipesBook = await this.recipesBookService.findRecipesBookById(
      recipesBookId
    );

    const userRecipes = userRecipesBook.recipes as string[];

    if (userId !== recipe.authorId) {
      const newRecipe = new this.recipeModel({
        name: recipe.name,
        cookingTime: recipe.cookingTime,
        calories: recipe.calories,
        ingredients: recipe.ingredients,
        steps: recipe.steps,
        nutrients: recipe.nutrients,
        preferences: recipe.preferences,
        allergies: recipe.allergies,
        tags: recipe.tags,
        author: newAuthor,
        authorId: userId,
        shared: false,
        rating: 0,
        rates: [],
        comments: [],
        originalId: recipe._id,
        isCopy: true,
        image: recipe.image
      });

      const newInsertedRecipe = await newRecipe.save();

      userRecipes.push(newInsertedRecipe._id.toHexString());
    } else {
      userRecipes.push(recipeId);
    }

    await this.recipesBookService.updateRecipesBook(
      userRecipesBook.id,
      null,
      userRecipes,
      null,
      null
    );
  }

  /* Search */

  async searchRecipes(
    name: string,
    byInventory: string,
    byPreferences: string,
    byAllergies: string,
    userId: string
  ) {
    let recipes;

    try {
      recipes = await this.recipeModel
        .find({ name: new RegExp(`.*(${name}).*`, 'gi'), shared: true })
        .exec();
    } catch (e) {
      return [];
    }

    if (!recipes) {
      return [];
    }

    recipes = recipes.map((r) => {
      return {
        id: r._id.toHexString(),
        name: r.name,
        cookingTime: r.cookingTime,
        calories: r.calories,
        ingredients: r.ingredients,
        steps: r.steps,
        nutrients: r.nutrients,
        preferences: r.preferences,
        allergies: r.allergies,
        tags: r.tags,
        shared: r.shared,
        rating: r.rating,
        rates: r.rates,
        comments: r.comments,
        originalId: r.originalId,
        isCopy: r.isCopy,
        image: r.image
      };
    });

    if (byInventory === 'true') {
      recipes = await this.filterByInventory(recipes, userId);
    }

    // if (recipes.length === 0) {
    //   return [];
    // }

    if (byPreferences === 'true') {
      recipes = await this.filterByPreferences(recipes, userId);
    }

    // if (recipes.length === 0) {
    //   return [];
    // }

    if (byAllergies === 'true') {
      recipes = await this.filterByAllergies(recipes, userId);
    }

    // if (recipes.length === 0) {
    //   return [];
    // }

    return recipes;
  }

  async searchRecipesByIngredient(ingredient: string) {
    let recipes = [];

    try {
      recipes = await this.recipeModel
        .find({
          ingredients: {
            $elemMatch: {
              'ingredient.name': new RegExp(`.*(${ingredient}).*`, 'gi')
            }
          },
          shared: true
        })
        .exec();
    } catch (e) {
      return [];
    }

    if (!recipes) {
      return [];
    }

    return recipes.map((r) => {
      return {
        id: r._id.toHexString(),
        name: r.name,
        cookingTime: r.cookingTime,
        calories: r.calories,
        ingredients: r.ingredients,
        steps: r.steps,
        nutrients: r.nutrients,
        preferences: r.preferences,
        allergies: r.allergies,
        tags: r.tags,
        shared: r.shared,
        rating: r.rating,
        rates: r.rates,
        comments: r.comments,
        originalId: r.originalId,
        isCopy: r.isCopy,
        image: r.image
      };
    });
  }

  async searchSuggestedRecipes(userId: string) {
    const userInventory = await this.usersInventoryService.getUserInventoryByUserId(
      userId
    );
    const userInventoryProducts = [
      ...userInventory.refrigerator,
      ...userInventory.freezer,
      ...userInventory.pantry,
      ...userInventory.others
    ].map((p) => p.ingredient.name) as string[];
    const sharedRecipes = await this.getSharedRecipes();

    const suggestedRecipes = [];
    for await (const sharedRecipe of sharedRecipes) {
      const recipeIngredients = sharedRecipe.ingredients.map(
        (i) => i.ingredient.name
      ) as string[];
      const difference = _.difference(recipeIngredients, userInventoryProducts);
      if (difference.length === 0) {
        suggestedRecipes.push(sharedRecipe);
      }
    }

    return suggestedRecipes;
  }

  /* Utilities. */

  async findRecipeById(recipeId: string) {
    let recipe;

    try {
      recipe = await this.recipeModel.findById(recipeId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find recipe.');
    }

    if (!recipe) {
      throw new NotFoundException('Could not find recipe.');
    }

    return recipe;
  }

  async filterByInventory(recipes: RecipeModel[], userId: string) {
    const userInventory = await this.usersInventoryService.getUserInventoryByUserId(
      userId
    );
    const userInventoryProducts = [
      ...userInventory.refrigerator,
      ...userInventory.freezer,
      ...userInventory.pantry,
      ...userInventory.others
    ].map((p) => p.ingredient.name) as string[];

    const filteredRecipes = [];
    for await (const recipe of recipes) {
      const recipeIngredients = recipe.ingredients.map(
        (i) => i.ingredient.name
      ) as string[];
      const difference = _.difference(recipeIngredients, userInventoryProducts);
      if (difference.length === 0) {
        filteredRecipes.push(recipe);
      }
    }

    return filteredRecipes;
  }

  async filterByPreferences(recipes: RecipeModel[], userId: string) {
    const userInfo = await this.usersInfoService.getUserInfoByUserId(userId);
    const userPreferencesNames = userInfo.preferences.map(
      (p) => p.name
    ) as string[];

    if (userPreferencesNames.length === 0) {
      return recipes;
    }

    const filteredRecipes = [];
    for await (const recipe of recipes) {
      const recipePreferences = recipe.preferences.map(
        (p) => p.name
      ) as string[];

      if (recipePreferences.length > 0) {
        const difference = _.difference(recipePreferences, userPreferencesNames);
        if (difference.length < recipePreferences.length) {
          filteredRecipes.push(recipe);
        }
      }
    }

    return filteredRecipes;
  }

  async filterByAllergies(recipes: RecipeModel[], userId: string) {
    const userInfo = await this.usersInfoService.getUserInfoByUserId(userId);
    const userAllergiesNames = userInfo.allergies.map(
      (a) => a.name
    ) as string[];

    if (userAllergiesNames.length === 0) {
      return recipes;
    }

    const filteredRecipes = [];
    for await (const recipe of recipes) {
      const recipeAllergies = recipe.allergies.map((a) => a.name) as string[];
      if (recipeAllergies.length === 0) {
        filteredRecipes.push(recipe);
      } else {
        const difference = _.difference(recipeAllergies, userAllergiesNames);
        if (difference.length === recipeAllergies.length) {
          filteredRecipes.push(recipe);
        }
      }
    }

    return filteredRecipes;
  }
}
