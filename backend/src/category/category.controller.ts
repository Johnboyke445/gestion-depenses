import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Category } from './category.entity';
import { CategoryService } from './category.service';

@Controller('categories') // important
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  findAll(): Promise<Category[]> {
    return this.categoryService.findAll();
  }

  @Post()
  async create(@Body('name') name: string) {
    return this.categoryService.create(name);
  }

  @Put(':id')
  async update(@Param('id') id: number, @Body('name') name: string) {
    return this.categoryService.update(id, name);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<boolean> {
    return this.categoryService.remove(id);
  }
}
