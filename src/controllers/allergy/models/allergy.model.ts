import { AllergyInterface } from '../interfaces/allergy.interface';

export class AllergyModel implements AllergyInterface {
  id?: string;
  name: string;

  constructor() {}
}
