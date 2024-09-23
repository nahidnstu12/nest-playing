import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private ProductModel: Model<Product>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    try {
      const createdProduct = new this.ProductModel(createProductDto);

      return createdProduct.save();
    } catch (err) {
      throw new Error(err);
    }
  }

  async findAll(params): Promise<any> {
    const { page, page_size } = params;
    const countDoc = await this.ProductModel.countDocuments({}).exec();
    const totalPage = Math.ceil(Number(countDoc) / page_size);
    const items = await this.ProductModel.find()
      .skip((page - 1) * page_size)
      .limit(page_size);
    return {
      items: items,
      meta: {
        totalItems: countDoc,
        pages: totalPage,
        currentPage: Number(page),
      },
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.ProductModel.findById(id);

    if (!product) {
      throw new NotFoundException('Item not found');
    }
    return product;
  }

  async update(
    updateProductDto: UpdateProductDto,
    id: string,
  ): Promise<Product> {
    const updateData = await this.ProductModel.findByIdAndUpdate(
      id,
      updateProductDto,
      {
        new: true,
      },
    );
    if (!updateData) {
      throw new NotFoundException('Item not found');
    }
    return updateData;
  }

  async delete(id: string): Promise<string> {
    const product = await this.ProductModel.findByIdAndDelete(id);
    if (!product) {
      throw new NotFoundException('Item not found');
    }
    return 'Product deleted';
  }
}
