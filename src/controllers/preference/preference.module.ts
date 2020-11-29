import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PreferenceController } from './preference.controller';
import { PreferenceService } from './preference.service';
import { PreferenceSchema } from './schemas/preference.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Preference', schema: PreferenceSchema },
    ]),
  ],
  providers: [PreferenceService],
  controllers: [PreferenceController],
})
export class PreferenceModule {}
