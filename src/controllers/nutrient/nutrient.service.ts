import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { NutrientInterface } from './interfaces/nutrient.interface';
import { NutrientModel } from './models/nutrient.model';

@Injectable()
export class NutrientService {
  constructor(
    @InjectModel('Nutrient')
    private readonly nutrientModel: Model<NutrientInterface>,
  ) {}

  async getNutrients(): Promise<NutrientModel[]> {
    const nutrients = await this.nutrientModel.find().exec();
    return nutrients.map(r => {
      const { _id, name } = r;
      return {
        id: _id,
        name,
      };
    });
  }

  async insertNutrient(name: string): Promise<NutrientModel> {
    const newNutrient = new this.nutrientModel({
      name,
    });
    const response = await newNutrient.save();
    return response;
  }
}
