import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { TokensController } from './tokens.controller';
import { TokensService } from './tokens.service';
import { TokenSchema } from './schemas/token.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'ValidToken', schema: TokenSchema },
      { name: 'ExpiredToken', schema: TokenSchema },
    ]),
  ],
  providers: [TokensService],
  controllers: [TokensController],
})
export class TokensModule {}
