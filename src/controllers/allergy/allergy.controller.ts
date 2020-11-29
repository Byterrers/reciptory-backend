import { Controller, Res, Get, HttpStatus, Post, Body } from '@nestjs/common';

import { AllergyService } from './allergy.service';
import { AllergyDto } from './dto/allergy.dto';

@Controller('allergies')
export class AllergyController {
  constructor(private readonly preferenceService: AllergyService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllAllergies(@Res() res) {
    const allergies = await this.preferenceService.getAllergies();
    return res.status(HttpStatus.OK).json(allergies);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createAllergy(@Body() createAllergyDTO: AllergyDto, @Res() res) {
    const { name } = createAllergyDTO;
    const newAllergy = await this.preferenceService.insertAllergy(name);
    return res.status(HttpStatus.OK).json(newAllergy);
  }
}
