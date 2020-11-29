import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* Entities */
import { AllergyInterface } from './interfaces/allergy.interface';
import { AllergyModel } from './models/allergy.model';

@Injectable()
export class AllergyService {
  constructor(
    @InjectModel('Allergy')
    private readonly ingredientModel: Model<AllergyInterface>,
  ) {}

  async getAllergies(): Promise<AllergyModel[]> {
    const allergies = await this.ingredientModel.find().exec();
    return allergies.map(r => {
      const { _id, name } = r;
      return {
        id: _id,
        name,
      };
    });
  }

  async insertAllergy(name: string): Promise<AllergyModel> {
    const newAllergy = new this.ingredientModel({
      name,
    });
    const response = await newAllergy.save();
    return response;
  }
}
