import { PreferenceInterface } from '../interfaces/preference.interface';

export class PreferenceModel implements PreferenceInterface {
  id?: string;
  name: string;

  constructor() {}
}
