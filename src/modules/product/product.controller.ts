import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { ProductsService } from './product.service';
import { Product } from './schemas/product.schema';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  findAll(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() product: CreateProductDto): Promise<Product> {
    return this.productsService.create(product);
  }

  @Get('/:id')
  findOne(@Param('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id') id: string,
    @Body() product: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(product, id);
  }

  @Delete('/:id')
  remove(@Param('id') id: string): Promise<string> {
    return this.productsService.delete(id);
  }
}
