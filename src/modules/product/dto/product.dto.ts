import { PartialType } from '@nestjs/mapped-types';

export class CreateProductDto {
  title: string;
  body: string;
  price: number;

  tags: string[];

  status: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
