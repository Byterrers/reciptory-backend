import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';

@Module({
  imports: [
    UtilsService,
  ],
  exports: [UtilsService],
  controllers: [UtilsController],
})
export class UtilsModule {}
