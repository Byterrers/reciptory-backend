import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Res,
  HttpStatus,
  Param,
  Patch
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { RecipesBookService } from './recipesBook.service';

// Entities.
import { RecipesBookDto } from './dto/recipesBook.dto';

@Controller('recipes-book')
export class RecipesBookController {
  constructor(private readonly recipesBookService: RecipesBookService) {}

  /* RecipesBooks CRUD */

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllRecipesBooks(@Res() res) {
    const recipesBooks = await this.recipesBookService.getRecipesBooks();
    return res.status(HttpStatus.OK).json(recipesBooks);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getRecipesBook(@Param('id') recipesBookId, @Res() res) {
    const recipesBook = await this.recipesBookService.getAdvancedRecipesBookById(
      recipesBookId
    );
    return res.status(HttpStatus.OK).json(recipesBook);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createRecipesBook(
    @Body() createRecipesBookDTO: RecipesBookDto,
    @Res() res
  ) {
    const { name, recipes, userId, favorite } = createRecipesBookDTO;
    const newRecipesBook = await this.recipesBookService.insertRecipesBook(
      name,
      recipes,
      userId,
      favorite
    );
    return res.status(HttpStatus.OK).json(newRecipesBook);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateRecipesBook(
    @Param('id') recipesBookId,
    @Body() createRecipesBookDTO: RecipesBookDto,
    @Res() res
  ) {
    const { name, recipes, userId, favorite } = createRecipesBookDTO;
    const updatedRecipesBook = await this.recipesBookService.updateRecipesBook(
      recipesBookId,
      name,
      recipes,
      userId,
      favorite
    );

    return res.status(HttpStatus.OK).json(updatedRecipesBook);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteRecipesBook(@Param('id') recipesBookId, @Res() res) {
    await this.recipesBookService.deleteRecipesBook(recipesBookId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* User related */

  @Post('user-recipes-book')
  async createUserRecipesBook(
    @Body() createRecipesBookDTO: RecipesBookDto,
    @Res() res
  ) {
    const { name, recipes, userId, favorite } = createRecipesBookDTO;
    const newRecipesBook = await this.recipesBookService.insertUserRecipesBook(
      name,
      recipes,
      userId,
      favorite
    );
    return res.status(HttpStatus.OK).json(newRecipesBook);
  }

  @Put('user-recipes-book/:id')
  @Patch('user-recipes-book/:id')
  async updateUserRecipesBook(
    @Param('id') recipesBookId,
    @Body() updateRecipesBookDTO: RecipesBookDto,
    @Res() res
  ) {
    const { name, recipes, userId, favorite } = updateRecipesBookDTO;
    const updatedRecipesBook = await this.recipesBookService.updateUserRecipesBook(
      recipesBookId,
      name,
      recipes,
      userId,
      favorite
    );
    return res.status(HttpStatus.OK).json(updatedRecipesBook);
  }

  @Put('user-recipes-book/:id/take-out-recipe/:recipeId')
  @Patch('user-recipes-book/:id/take-out-recipe/:recipeId')
  async takeRecipeOutFromBook(
    @Param('id') recipesBookId,
    @Param('recipeId') recipeId,
    @Res() res
  ) {
    const updatedRecipesBook = await this.recipesBookService.takeRecipeOutFromBook(
      recipesBookId,
      recipeId
    );
    return res.status(HttpStatus.OK).json(updatedRecipesBook);
  }

  /* Outsider getters */

  @Get(':id/favoriteRecipesBook')
  async getFavoriteRecipesBookByUserId(@Param('id') userId, @Res() res) {
    const recipesBook = await this.recipesBookService.getUserFavoriteRecipeBook(
      userId
    );
    return res.status(HttpStatus.OK).json(recipesBook);
  }

  @Get(':id/nonFavoriteRecipesBooks')
  async getNonFavoriteRecipesBooksByUserId(@Param('id') userId, @Res() res) {
    const recipesBooks = await this.recipesBookService.getUserNonFavoriteRecipesBooks(
      userId
    );
    return res.status(HttpStatus.OK).json(recipesBooks);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id/recipes-books')
  async getRecipesBooksByUserId(@Param('id') userId, @Res() res) {
    const recipesBooks = await this.recipesBookService.getRecipesBooksByUserId(
      userId
    );
    return res.status(HttpStatus.OK).json(recipesBooks);
  }
}
