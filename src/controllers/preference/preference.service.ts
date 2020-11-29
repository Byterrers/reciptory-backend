import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* Entities */
import { PreferenceInterface } from './interfaces/preference.interface';
import { PreferenceModel } from './models/preference.model';

@Injectable()
export class PreferenceService {
  constructor(
    @InjectModel('Preference')
    private readonly preferenceModel: Model<PreferenceInterface>,
  ) {}

  async getPreferences(): Promise<PreferenceModel[]> {
    const preferences = await this.preferenceModel.find().exec();
    return preferences.map(r => {
      const { _id, name } = r;
      return {
        id: _id,
        name,
      };
    });
  }

  async insertPreference(name: string): Promise<PreferenceModel> {
    const newPreference = new this.preferenceModel({
      name,
    });
    const response = await newPreference.save();
    return response;
  }
}
