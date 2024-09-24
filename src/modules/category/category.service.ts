import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.schema';
import { ProductResponse } from './category.interface';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private CategoryModel: Model<Category>,
  ) {}

  async create(categoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const createdData = new this.CategoryModel(categoryDto);
      return createdData.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(params): Promise<any> {
    const { page, page_size } = params;
    const countDoc = await this.CategoryModel.countDocuments({}).exec();
    const totalPage = Math.ceil(Number(countDoc) / page_size);

    const items = await this.CategoryModel.find({})
      .skip((page - 1) * page_size)
      .limit(page_size);

    return {
      items,
      meta: {
        pages: totalPage || 1,
        current_page: Number(page) || 1,
        total_items: countDoc || 0,
      },
    };
  }

  async findOne(id: string, with_product: boolean): Promise<Category> {
    const objectId = new mongoose.Types.ObjectId(id);

    const pipeline: any = [{ $match: { _id: objectId } }];

    if (with_product) {
      pipeline.push(
        {
          $lookup: {
            from: 'products',
            foreignField: 'categories',
            localField: '_id',
            as: 'products',
          },
        },
        {
          $project: {
            title: 1,
            products: { title: 1, price: 1, _id: 1 },
          },
        },
      );
    } else {
      // When not including products, just return the category fields
      pipeline.push({
        $project: {
          title: 1,
          description: 1,
        },
      });
    }

    const data = await this.CategoryModel.aggregate(pipeline);

    if (!data || data.length === 0) {
      throw new NotFoundException('Category not found');
    }

    return data[0];
  }

  async findProductsByCategory(id: string): Promise<ProductResponse> {
    const objectId = new mongoose.Types.ObjectId(id);

    const data = await this.CategoryModel.aggregate([
      { $match: { _id: objectId } },
      {
        $lookup: {
          from: 'products',
          foreignField: 'categories',
          localField: '_id',
          as: 'products',
        },
      },
      {
        $project: {
          _id: 0,
          products: { title: 1, price: 1, _id: 1 },
        },
      },
    ]);

    if (!data || data.length === 0) {
      throw new NotFoundException('No Product found in this category');
    }

    return { data: data[0].products || [] };
  }

  async update(id: string, body: UpdateCategoryDto): Promise<Category> {
    const data = await this.CategoryModel.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!data) {
      throw new NotFoundException('Items not found');
    }
    return data;
  }
  async delete(id: string): Promise<object> {
    const data = await this.CategoryModel.findByIdAndDelete(id);
    if (!data) {
      throw new NotFoundException('Items not found');
    }
    return { message: 'Category Item deleted' };
  }
}
