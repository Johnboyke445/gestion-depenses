import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../category/category.entity';
import { Expense } from './expense.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Récupérer toutes les dépenses
  // findAll avec la catégorie jointe
  findAll(): Promise<Expense[]> {
    return this.expenseRepository.find({ relations: ['category'] });
}

  // Récupérer une dépense par id
  async findOne(id: number): Promise<Expense> {
    const expense = await this.expenseRepository.findOne({
      where: { id },
      relations: ['category'], //très important ici
});

    if (!expense) {
      throw new Error(`Expense with id ${id} not found`);
}

    return expense;
}

  // Créer une nouvelle dépense
  async create(expenseData: Partial<Expense> & { categoryId: number }): Promise< Expense> {
    const { amount, date, categoryId } = expenseData;

    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new Error(`Category with ID ${categoryId} not found`);
    }

    const expense = this.expenseRepository.create({
      amount,
      date,
      category,
    });

    return this.expenseRepository.save(expense);
  }

  // Mettre à jour une dépense existante
  async update(id: number, expenseData: Partial<Expense>): Promise<Expense> {
    await this.expenseRepository.update(id, expenseData);
    return this.findOne(id);
  }

  // Supprimer une dépense
  async delete(id: number): Promise<void> {
    await this.expenseRepository.delete(id);
  }

  // Résumé des dépenses par mois et par catégorie
  async getMonthlySummary(): Promise<any[]> {
    return this.expenseRepository
      .createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .select([
        "TO_CHAR(expense.date, 'YYYY-MM') AS month",
        'category.name AS category',
        'SUM(expense.amount) AS total',
      ])
      .groupBy(" month, category.name")
      .orderBy('month', 'DESC')
      .getRawMany();
}

}
