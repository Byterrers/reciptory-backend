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
  Query,
} from '@nestjs/common';

// Guards.
import { AuthGuard } from '@nestjs/passport';

// Services.
import { IngredientService } from './ingredient.service';

// Entities.
import { IngredientDto } from './dto/ingredient.dto';

@Controller('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  /* ingredient CRUD */

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllIngredients(@Res() res) {
    const ingredients = await this.ingredientService.getIngredients();
    return res.status(HttpStatus.OK).json(ingredients);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getIngredient(@Param('id') ingredientId, @Res() res) {
    const ingredient = await this.ingredientService.getIngredientById(
      ingredientId,
    );
    return res.status(HttpStatus.OK).json(ingredient);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createIngredient(
    @Body() createIngredientDTO: IngredientDto,
    @Res() res,
  ) {
    const { name, categoryId } = createIngredientDTO;
    const newIngredient = await this.ingredientService.insertIngredient(
      name,
      categoryId,
    );
    return res.status(HttpStatus.OK).json(newIngredient);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  @Patch(':id')
  async updateIngredient(
    @Param('id') ingredientId,
    @Body() createIngredientDTO: IngredientDto,
    @Res() res,
  ) {
    const { name, categoryId } = createIngredientDTO;
    const updatedIngredient = await this.ingredientService.updateIngredient(
      ingredientId,
      name,
      categoryId,
    );
    return res.status(HttpStatus.OK).json(updatedIngredient);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async deleteIngredient(@Param('id') ingredientId, @Res() res) {
    await this.ingredientService.deleteIngredient(ingredientId);
    return res.status(HttpStatus.OK).json(null);
  }

  /* Search */

  @Get('search/ingredients')
  async searchIngredients(@Query('name') name, @Res() res) {
    const ingredients = await this.ingredientService.searchIngredients(name);
    return res.status(HttpStatus.OK).json(ingredients);
  }
}
