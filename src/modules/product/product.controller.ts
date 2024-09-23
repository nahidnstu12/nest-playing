import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MongoIdPipe } from 'src/@core/pipe/mongId.pipe';
import { ZodPipe } from 'src/@core/pipe/zod.pipe';
import { CreateProductDto, UpdateProductDto } from './product.dto';
import { Product } from './product.schema';
import { ProductsService } from './product.service';
import {
  createProductSchema,
  updateProductSchema,
} from './product.validaiton.schema';

@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}
  @Get()
  findAll(@Query() params: any): Promise<any> {
    return this.productsService.findAll(params);
  }

  @Post()
  create(
    @Body(new ZodPipe(createProductSchema)) product: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.create(product);
  }

  @Get('/:id')
  findOne(@Param('id', MongoIdPipe) id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Put('/:id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body(new ZodPipe(updateProductSchema)) product: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.update(product, id);
  }

  @Delete('/:id')
  remove(@Param('id', MongoIdPipe) id: string): Promise<string> {
    return this.productsService.delete(id);
  }
}
