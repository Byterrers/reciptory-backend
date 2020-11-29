import { IUsersInfo } from '../interfaces/users-info.interface';
import { PreferenceModel } from '../../../controllers/preference/models/preference.model';
import { AllergyModel } from 'src/controllers/allergy/models/allergy.model';

export class UsersInfoDto implements IUsersInfo {
  userId: string;
  username: string;
  name: string;
  gender: string;
  country: string;
  city: string;
  avatar: string;
  preferences: PreferenceModel[];
  allergies: AllergyModel[];
  userShoppingLists: string[];
    following: string[];
  followers: string[];

  constructor() {}
}
