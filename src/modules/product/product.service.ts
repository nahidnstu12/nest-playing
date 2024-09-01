import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotFoundError } from 'rxjs';
import { CreateProductDto } from './dto/product.dto';
import { Product } from './schemas/Product.schema';

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

  async findAll(): Promise<Product[]> {
    return this.ProductModel.find().exec();
  }

  async findOne(id: string): Promise<Product> {
    const product = this.ProductModel.findById(id);
    if (!product) {
      throw new NotFoundException('Item not found');
    }
    return product;
  }

  async update(updateProductDto, id: string): Promise<Product> {
    const updateData = this.ProductModel.findByIdAndUpdate(
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
