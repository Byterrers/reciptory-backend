import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

/* Entities */
import { CategoryInterface } from './interfaces/category.interface';
import { CategoryModel } from './models/category.model';
import { CategoryDto } from './dto/category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel('Category')
    private readonly categoryModel: Model<CategoryInterface>,
  ) {}

  async getCategories(): Promise<CategoryModel[]> {
    const categories = await this.categoryModel.find().exec();

    return categories.map(r => {
      const { _id, name } = r;
      return {
        id: _id,
        name,
      };
    });
  }

  async insertCategory(name: string): Promise<CategoryModel> {
    const newCategory = new this.categoryModel({
      name
    });

    const response = await newCategory.save();
    return response;
  }

  async findCategoryById(categoryId: string) {
    let category;

    try {
      category = await this.categoryModel.findById(categoryId).exec();
    } catch (e) {
      throw new NotFoundException('Could not find category.');
    }

    if (!category) {
      throw new NotFoundException('Could not find category.');
    }

    return category;
  }
}
