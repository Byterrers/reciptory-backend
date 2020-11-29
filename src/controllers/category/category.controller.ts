import { Controller, Get, Res, HttpStatus, Post, Body } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories(@Res() res) {
    const recipes = await this.categoryService.getCategories();
    return res.status(HttpStatus.OK).json(recipes);
  }

  @Post()
  async createCategory(@Body() createCategoryDTO: CategoryDto, @Res() res) {
    const {
      name
    } = createCategoryDTO;
    const newProduct = await this.categoryService.insertCategory(
      name,
    );
    return res.status(HttpStatus.OK).json(newProduct);
  }
}
