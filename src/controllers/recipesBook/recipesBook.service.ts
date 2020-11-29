import {
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
  ConflictException
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// Entities.
import { IRecipesBook } from './interfaces/recipesBook.interface';
import { RecipesBookModel } from './models/recipesBook.model';

// Outside services.
import { RecipesService } from '../recipes/recipes.service';

@Injectable()
export class RecipesBookService {
  constructor(
    @InjectModel('RecipesBook')
    private readonly recipesBookModel: Model<IRecipesBook>,
    @Inject(forwardRef(() => RecipesService))
    private readonly recipesService: RecipesService
  ) {}

  /* RecipesBook CRUD */

  async getRecipesBooks(): Promise<RecipesBookModel[]> {
    const recipesBooks = await this.recipesBookModel.find().exec();
    return recipesBooks.map((r) => {
      const { _id, name, recipes, userId, favorite } = r;
      return {
        id: _id,
        name,
        recipes,
        userId,
        favorite
      };
    });
  }

  async getRecipesBookById(recipesBookId: string): Promise<RecipesBookModel> {
    const {
      _id,
      name,
      recipes,
      userId,
      favorite
    } = await this.findRecipesBookById(recipesBookId);
    const recipesBook = {
      id: _id,
      name,
      recipes,
      userId,
      favorite
    };
    return recipesBook;
  }

  async getAdvancedRecipesBookById(
    recipesBookId: string
  ): Promise<RecipesBookModel> {
    const recipesBook = await this.findRecipesBookById(recipesBookId);

    const advancedRecipes = [];
    for await (const recipeId of recipesBook.recipes) {
      const {
        _id,
        name,
        steps,
        cookingTime,
        ingredients,
        nutrients,
        preferences,
        allergies,
        tags,
        image,
        rating,
        rates,
        comments,
        author,
        authorId,
        originalId,
        isCopy,
        shared
      } = await this.recipesService.findRecipeById(recipeId);
      const recipe = {
        id: _id,
        name,
        steps,
        cookingTime,
        ingredients,
        nutrients,
        preferences,
        allergies,
        tags,
        image,
        rating,
        rates,
        comments,
        author,
        authorId,
        originalId,
        isCopy,
        shared
      };
      advancedRecipes.push(recipe);
    }

    const recipesBookDto = {
      id: recipesBook._id,
      name: recipesBook.name,
      recipes: advancedRecipes,
      userId: recipesBook.userId,
      favorite: recipesBook.favorite
    };

    return recipesBookDto;
  }

  async insertRecipesBook(
    name: string,
    recipes: string[],
    userId: string,
    favorite: boolean
  ): Promise<RecipesBookModel> {
    const newRecipesBook = new this.recipesBookModel({
      name,
      recipes,
      userId,
      favorite
    });
    const response = await newRecipesBook.save();
    return response;
  }

  async updateRecipesBook(
    recipesBookId: string,
    name: string,
    recipes: string[],
    userId: string,
    favorite: boolean
  ): Promise<RecipesBookModel> {
    const updateRecipesBook = await this.findRecipesBookById(recipesBookId);

    if (name) {
      updateRecipesBook.name = name;
    }

    if (recipes) {
      updateRecipesBook.recipes = recipes;
    }

    if (userId) {
      updateRecipesBook.userId = userId;
    }

    if (favorite !== undefined && favorite !== null) {
      updateRecipesBook.favorite = favorite;
    }

    const updatedRecipesBook = await updateRecipesBook.save();

    const response = {
      id: updatedRecipesBook._id.toHexString(),
      name: updatedRecipesBook.name,
      recipes: updatedRecipesBook.recipes,
      userId: updatedRecipesBook.userId,
      favorite: updatedRecipesBook.favorite
    };

    return response;
  }

  async deleteRecipesBook(recipesBookId: string) {
    const response = await this.recipesBookModel
      .deleteOne({ _id: recipesBookId })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find the recipes book.');
    }
  }

  /* User Books */

  async insertUserRecipesBook(
    name: string,
    recipes: string[],
    userId: string,
    favorite: boolean
  ) {
    /* Checking for no duplicated names within the user's recipes books */
    const userRecipesBooks = await this.findRecipesBooksByUserId(userId);

    const existsRecipesBookWithSameName = userRecipesBooks.find(
      (p) => p.name === name
    );

    if (existsRecipesBookWithSameName) {
      throw new ConflictException(
        `You already have a recipes book named ${name} in your inventory`
      );
    }

    /* Insert user recipes book */

    const newRecipes = [];
    for await (const recipeId of recipes) {
      const recipe = await this.recipesService.findRecipeById(recipeId);
      let newRecipeId;

      if (recipe.authorId !== userId) {
        const newRecipe = Object.assign({}, recipe);

        newRecipe.isNew = true;
        newRecipe.shared = false;

        const newRecipeSaved = await newRecipe.save();
        newRecipeId = newRecipeSaved._id;
      } else {
        newRecipeId = recipeId;
      }

      newRecipes.push(newRecipeId);
    }

    const newRecipesBook = new this.recipesBookModel({
      name,
      newRecipes,
      userId,
      favorite
    });
    const response = await newRecipesBook.save();
    return response;
  }

  async updateUserRecipesBook(
    recipesBookId: string,
    name: string,
    recipes: string[],
    userId: string,
    favorite: boolean
  ) {
    const updateRecipesBook = await this.findRecipesBookById(recipesBookId);

    if (name) {
      updateRecipesBook.name = name;
    }

    const updatedRecipesBook = await updateRecipesBook.save();

    const response = {
      id: updatedRecipesBook._id.toHexString(),
      name: updatedRecipesBook.name,
      recipes: updatedRecipesBook.recipes,
      userId: updatedRecipesBook.userId,
      favorite: updatedRecipesBook.favorite
    };

    return response;
  }

  async takeRecipeOutFromBook(recipesBookId: string, recipeId: string) {
    const updateRecipesBook = await this.findRecipesBookById(recipesBookId);

    updateRecipesBook.recipes = (updateRecipesBook.recipes as string[]).filter(
      (r) => r !== recipeId
    );

    const updatedRecipesBook = await updateRecipesBook.save();

    const response = {
      id: updatedRecipesBook._id.toHexString(),
      name: updatedRecipesBook.name,
      recipes: updatedRecipesBook.recipes,
      userId: updatedRecipesBook.userId,
      favorite: updatedRecipesBook.favorite
    };

    return response;
  }

  /* User stuff getters */

  async getUserFavoriteRecipeBook(userId: string) {
    const userFavoriteRecipesBook = (await this.findUserFavoriteRecipesBookByUserId(
      userId
    )) as RecipesBookModel;

    const userFavoriteRecipes = [];
    for await (const userRecipeId of userFavoriteRecipesBook.recipes) {
      const {
        _id,
        name,
        steps,
        cookingTime,
        ingredients,
        nutrients,
        preferences,
        allergies,
        tags,
        image,
        shared
      } = await this.recipesService.findRecipeById(userRecipeId);
      const recipe = {
        id: _id,
        name,
        steps,
        cookingTime,
        ingredients,
        nutrients,
        preferences,
        allergies,
        tags,
        image,
        shared
      };
      userFavoriteRecipes.push(recipe);
    }

    userFavoriteRecipesBook.recipes = userFavoriteRecipes;

    return userFavoriteRecipesBook;
  }

  async getUserNonFavoriteRecipesBooks(userId: string) {
    const userRecipesBooks = (await this.findUserNonFavoriteRecipesBooksByUserId(
      userId
    )) as any[];

    const userRecipesBooksDto = [];
    for await (const userRecipeBook of userRecipesBooks) {
      const userRecipeBookDto = Object.assign({}, userRecipeBook);
      userRecipeBookDto.recipes = [];
      for await (const userRecipeId of userRecipeBook.recipes) {
        const {
          _id,
          name,
          steps,
          cookingTime,
          ingredients,
          nutrients,
          preferences,
          allergies,
          tags,
          image,
          shared
        } = await this.recipesService.findRecipeById(userRecipeId);
        const recipe = {
          id: _id,
          name,
          steps,
          cookingTime,
          ingredients,
          nutrients,
          preferences,
          allergies,
          tags,
          image,
          shared
        };
        userRecipeBookDto.recipes.push(recipe);
      }
      userRecipesBooksDto.push(userRecipeBookDto);
    }

    return userRecipesBooksDto;
  }

  async getRecipesBooksByUserId(userId: string) {
    const userRecipesBooks = (await this.findRecipesBooksByUserId(
      userId
    )) as any[];

    const userRecipesBooksDto = [];
    for await (const userRecipeBook of userRecipesBooks) {
      const userRecipeBookDto = Object.assign({}, userRecipeBook);
      userRecipeBookDto.recipes = [];
      for await (const userRecipeId of userRecipeBook.recipes) {
        const {
          _id,
          name,
          steps,
          cookingTime,
          ingredients,
          nutrients,
          preferences,
          allergies,
          tags,
          image,
          shared
        } = await this.recipesService.findRecipeById(userRecipeId);
        const recipe = {
          id: _id,
          name,
          steps,
          cookingTime,
          ingredients,
          nutrients,
          preferences,
          allergies,
          tags,
          image,
          shared
        };
        userRecipeBookDto.recipes.push(recipe);
      }
      userRecipesBooksDto.push(userRecipeBookDto);
    }

    return userRecipesBooksDto;
  }

  /* Util */

  async findRecipesBookById(recipesBookId: string) {
    let recipesBook;

    try {
      recipesBook = await this.recipesBookModel.findById(recipesBookId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    if (!recipesBook) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    return recipesBook;
  }

  async findRecipesBooksByUserId(userId: string) {
    let userRecipesBooks;

    try {
      userRecipesBooks = await this.recipesBookModel
        .find({ userId: new RegExp(userId, 'i') })
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    if (!userRecipesBooks) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    return userRecipesBooks.map((r) => {
      return {
        id: r._id.toHexString(),
        name: r.name,
        recipes: r.recipes,
        userId: r.userId,
        favorite: r.favorite
      };
    });
  }

  async findUserFavoriteRecipesBookByUserId(userId: string) {
    let userFavoriteRecipesBook;

    try {
      userFavoriteRecipesBook = await this.recipesBookModel.findOne({
        userId: new RegExp(userId, 'i'),
        favorite: true
      });
    } catch (e) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    if (!userFavoriteRecipesBook) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    return {
      id: userFavoriteRecipesBook._id,
      name: userFavoriteRecipesBook.name,
      recipes: userFavoriteRecipesBook.recipes as string[],
      userId: userFavoriteRecipesBook.userId,
      favorite: userFavoriteRecipesBook.favorite
    };
  }

  async findUserNonFavoriteRecipesBooksByUserId(userId: string) {
    let userNonFavoriteRecipesBooks;

    try {
      userNonFavoriteRecipesBooks = await this.recipesBookModel
        .find({
          userId: new RegExp(userId, 'i'),
          favorite: false
        })
        .exec();
    } catch (e) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    if (!userNonFavoriteRecipesBooks) {
      throw new NotFoundException('Could not find your recipes book.');
    }

    return userNonFavoriteRecipesBooks.map((r) => {
      return {
        id: r._id.toHexString(),
        name: r.name,
        recipes: r.recipes,
        userId: r.userId,
        favorite: r.favorite
      };
    });
  }
}
