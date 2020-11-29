import { Controller, Get, Res, HttpStatus, Post, Body } from '@nestjs/common';

import { PreferenceService } from './preference.service';
import { PreferenceDto } from './dto/preference.dto';

@Controller('preferences')
export class PreferenceController {
  constructor(private readonly preferenceService: PreferenceService) {}

  // @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAllPreferences(@Res() res) {
    const preferences = await this.preferenceService.getPreferences();
    return res.status(HttpStatus.OK).json(preferences);
  }

  // @UseGuards(AuthGuard('jwt'))
  @Post()
  async createPreference(
    @Body() createPreferenceDTO: PreferenceDto,
    @Res() res,
  ) {
    const { name } = createPreferenceDTO;
    const newPreference = await this.preferenceService.insertPreference(name);
    return res.status(HttpStatus.OK).json(newPreference);
  }
}
