import { CategoryInterface } from '../interfaces/category.interface';

export class CategoryModel implements CategoryInterface {
  id?: string;
  name: string;

  constructor() {}
}
