import { Controller, Get, Res, Post, Body, HttpStatus } from '@nestjs/common';
import { NutrientService } from './nutrient.service';
import { NutrientDto } from './dto/nutrient.dto';

@Controller('nutrients')
export class NutrientController {
  constructor(private readonly nutrientService: NutrientService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllNutrients(@Res() res) {
    const nutrients = await this.nutrientService.getNutrients();
    return res.status(HttpStatus.OK).json(nutrients);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createNutrient(@Body() createNutrientDTO: NutrientDto, @Res() res) {
    const { name } = createNutrientDTO;
    const newNutrient = await this.nutrientService.insertNutrient(name);
    return res.status(HttpStatus.OK).json(newNutrient);
  }
}
