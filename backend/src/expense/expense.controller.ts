import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
} from '@nestjs/common';
import { Expense } from './expense.entity'; // Entité
import { ExpenseService } from './expense.service'; // Service métier

@Controller('expense') // Le préfixe de toutes les routes sera /expense
export class ExpenseController {
  constructor(private readonly expenseService: ExpenseService) {}

  // GET /expense : récupère toutes les dépenses
  @Get()
  getAll(): Promise<Expense[]> {
    return this.expenseService.findAll();
  }

  // GET /expense/:id : récupère une dépense par ID
  @Get(':id')
  getOne(@Param('id') id: string): Promise<Expense> {
    return this.expenseService.findOne(+id);
  }

  // POST /expense : crée une nouvelle dépense
  @Post()
  create(@Body() expenseData: any) {
    return this.expenseService.create(expenseData);
  }

  // PUT /expense/:id : met à jour une dépense
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() expenseData: Partial<Expense>,
  ): Promise<Expense> {
    return this.expenseService.update(+id, expenseData);
  }

  // DELETE /expense/:id : supprime une dépense
  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.expenseService.delete(+id);
  }

  @Get('summary/monthly')
  getMonthlySummary() {
    return this.expenseService.getMonthlySummary();
}
}
