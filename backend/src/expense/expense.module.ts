import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Import de TypeOrmModule pour permettre l'intégration avec TypeORM
import { Category } from '../category/category.entity';
import { ExpenseController } from './expense.controller'; // Le contrôleur pour gérer les routes liées aux dépenses
import { Expense } from './expense.entity'; // L'entité représentant la table "Expense" dans la base de données
import { ExpenseService } from './expense.service'; // Le service qui contient la logique métier pour les dépenses

@Module({
  // On importe ici le module TypeORM avec l'entité Expense
  // Cela permet à NestJS de générer automatiquement un Repository pour Expense
  imports: [TypeOrmModule.forFeature([Expense, Category])],

  // On enregistre le contrôleur ExpenseController
  controllers: [ExpenseController],

  // On enregistre le service ExpenseService, qui sera injectable dans d'autres classes
  providers: [ExpenseService],
})
export class ExpenseModule {} // Le module Expense qui regroupe contrôleur, service et entité liés aux dépenses
