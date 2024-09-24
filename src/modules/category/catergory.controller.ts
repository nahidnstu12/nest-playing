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
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Category } from './category.schema';
import { CategoryService } from './category.service';
import {
  createCategorySchema,
  updateCategorySchema,
} from './category.validation.schema';
import { ProductResponse } from './category.interface';

@Controller('/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  findAll(@Query() params: any): Promise<any> {
    return this.categoryService.findAll(params);
  }

  @Post()
  create(
    @Body(new ZodPipe(createCategorySchema)) body: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.create(body);
  }
  @Get(':id')
  findOne(
    @Param('id', MongoIdPipe) id: string,
    @Query('with_product') with_product: boolean,
  ): Promise<Category> {
    return this.categoryService.findOne(id, with_product);
  }

  @Get(':id/products')
  findProductsByCategory(
    @Param('id', MongoIdPipe) id: string,
  ): Promise<ProductResponse> {
    return this.categoryService.findProductsByCategory(id);
  }

  @Put(':id')
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body(new ZodPipe(updateCategorySchema)) body: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string): Promise<object> {
    return this.categoryService.delete(id);
  }
}
