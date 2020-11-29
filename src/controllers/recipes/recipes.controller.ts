import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Req,
  Res,
  Headers,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  Query
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { RecipesService } from './recipes.service';

// Entities.
import { RecipeDto } from './dto/recipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllRecipes(@Res() res) {
    const recipes = await this.recipesService.getRecipes();
    return res.status(HttpStatus.OK).json(recipes);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get('shared')
  async getAllSharedRecipes(@Res() res) {
    const recipes = await this.recipesService.getSharedRecipes();
    return res.status(HttpStatus.OK).json(recipes);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getRecipe(@Param('id') recipeId, @Res() res) {
    const recipe = await this.recipesService.getRecipeById(recipeId);
    return res.status(HttpStatus.OK).json(recipe);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRecipe(@Body() createRecipeDTO: RecipeDto, @Res() res) {
    const {
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
    } = createRecipeDTO;
    const newProduct = await this.recipesService.insertRecipe(
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
    );
    return res.status(HttpStatus.OK).json(newProduct);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateRecipe(
    @Param('id') recipeId,
    @Body() updateRecipeDTO: RecipeDto,
    @Res() res
  ) {
    const {
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
    } = updateRecipeDTO;
    const updatedRecipe = await this.recipesService.updateRecipe(
      recipeId,
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
    );
    return res.status(HttpStatus.OK).json(updatedRecipe);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteRecipe(@Param('id') recipeId, @Res() res) {
    await this.recipesService.deleteRecipe(recipeId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* Search */

  // @UseGuards(AuthGuard('jwt'))
  @Get('search/recipes')
  async searchRecipes(
    @Query('name') name: string,
    @Query('byInventory') byInventory: string,
    @Query('byPreferences') byPreferences: string,
    @Query('byAllergies') byAllergies: string,
    @Query('userId') userId: string,
    @Res() res
  ) {
    const recipes = await this.recipesService.searchRecipes(
      name,
      byInventory,
      byPreferences,
      byAllergies,
      userId
    );
    return res.status(HttpStatus.OK).json(recipes);
  }

  @Get('search-by-ingredient/recipes')
  async searchRecipesByIngredient(@Query('ingredient') ingredient, @Res() res) {
    const recipes = await this.recipesService.searchRecipesByIngredient(
      ingredient
    );
    return res.status(HttpStatus.OK).json(recipes);
  }

  @Get('search/:userId/suggestedRecipes')
  async searchSuggestedRecipes(userId: string, @Res() res) {
    const suggestedRecipes = await this.recipesService.searchSuggestedRecipes(
      userId
    );
    return res.status(HttpStatus.OK).json(suggestedRecipes);
  }

  /* User recipes */

  // @UseGuards(AuthGuard('jwt'))
  @Post('user-recipes/:id')
  async createUserRecipe(
    @Param('id') userId,
    @Body() createRecipeDTO: RecipeDto,
    @Res() res
  ) {
    const {
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
    } = createRecipeDTO;
    const newProduct = await this.recipesService.insertUserRecipe(
      userId,
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
    );
    return res.status(HttpStatus.OK).json(newProduct);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':recipeId/user-recipe/:recipeBookId')
  async deleteUserRecipe(
    @Param('recipeId') recipeId,
    @Param('recipeBookId') recipeBookId,
    @Res() res
  ) {
    await this.recipesService.deleteUserRecipe(recipeBookId, recipeId);
    return res.status(HttpStatus.OK).json(null);
  }

  @Delete(':recipeId/user-recipes/:userId')
  async advancedDeleteUserRecipe(
    @Param('recipeId') recipeId,
    @Param('userId') userId,
    @Res() res
  ) {
    await this.recipesService.advancedDeleteUserRecipe(recipeId, userId);
    return res.status(HttpStatus.OK).json(null);
  }

  @Put(':recipeId/cook-recipe/:userId')
  async cookRecipe(
    @Param('recipeId') recipeId,
    @Param('userId') userId,
    @Res() res
  ) {
    await this.recipesService.cookRecipe(recipeId, userId);
    return res.status(HttpStatus.OK).json(null);
  }

  @Put(':recipeId/add-recipe-ingredients/:userId')
  async addRecipeIngredientsToShoppingList(
    @Param('recipeId') recipeId,
    @Param('userId') userId,
    @Res() res
  ) {
    const response = await this.recipesService.addRecipeIngredientsToShoppingList(
      recipeId,
      userId
    );
    return res.status(HttpStatus.OK).json(response);
  }

  /* Community */

  @Put(':recipeId/share-recipe')
  async shareRecipe(
    @Param('recipeId') recipeId,
    @Body() sharedValue,
    @Res() res
  ) {
    const { shared } = sharedValue;
    const newRating = await this.recipesService.shareRecipe(recipeId, shared);
    return res.status(HttpStatus.OK).json(newRating);
  }

  @Put(':recipeId/rate-recipe')
  async rateRecipe(@Param('recipeId') recipeId, @Body() rate, @Res() res) {
    const newRating = await this.recipesService.rateRecipe(recipeId, rate);
    return res.status(HttpStatus.OK).json(newRating);
  }

  @Put(':recipeId/comment-recipe')
  async commentRecipe(
    @Param('recipeId') recipeId,
    @Body() comment,
    @Res() res
  ) {
    const newComment = await this.recipesService.commentRecipe(
      recipeId,
      comment
    );
    return res.status(HttpStatus.OK).json(newComment);
  }

  @Post(':recipeId/save-recipe/:recipesBookId')
  async saveRecipe(
    @Param('recipeId') recipeId,
    @Param('recipesBookId') recipesBookId,
    @Body() recipeUserInfo,
    @Res() res
  ) {
    const { userId, author } = recipeUserInfo;
    await this.recipesService.saveRecipe(
      recipeId,
      recipesBookId,
      userId,
      author
    );
    return res.status(HttpStatus.OK).json(true);
  }
}
