import { Injectable, NotFoundException } from '@nestjs/common';

// Mongoose.
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { IToken } from './interfaces/token.interface';
import { TokenModel } from './models/token.model';

@Injectable()
export class TokensService {
  constructor(
    @InjectModel('ValidToken') private readonly validTokenModel: Model<IToken>,
    @InjectModel('ExpiredToken')
    private readonly expiredTokenModel: Model<IToken>,
  ) {}

  async insertValidToken(token: string): Promise<TokenModel> {
    const newValidToken = new this.validTokenModel({
      token,
    });

    const response = await newValidToken.save();
    return response;
  }

  async insertExpiredToken(token: string): Promise<TokenModel> {
    const newExpiredToken = new this.expiredTokenModel({
      token,
    });

    const response = await newExpiredToken.save();
    return response;
  }

  async deleteValidToken(validToken: string) {
    const response = await this.validTokenModel
      .deleteOne({ _id: validToken })
      .exec();
    if (response.n === 0) {
      throw new NotFoundException('Could not find token.');
    }
  }
}
