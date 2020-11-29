import { IUsersInfo } from '../interfaces/users-info.interface';
import { PreferenceModel } from '../../../controllers/preference/models/preference.model';
import { AllergyModel } from '../../../controllers/allergy/models/allergy.model';

export class UsersInfoModel implements IUsersInfo {
  id?: string;
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
