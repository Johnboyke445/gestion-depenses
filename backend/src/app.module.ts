import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Pour charger les variables d'environnement
import { TypeOrmModule } from '@nestjs/typeorm'; // Pour connecter la base de données
import { CategoryController } from './category/category.controller';
import { Category } from './category/category.entity'; // Import de l'entité
import { CategoryService } from './category/category.service';
import { Expense } from './expense/expense.entity';
import { ExpenseModule } from './expense/expense.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Chargement global des variables d'env
    TypeOrmModule.forRoot({
      type: 'postgres', // Type de base (PostgreSQL)
      host: process.env.DB_HOST, // Hôte DB depuis .env
      port: +process.env.DB_PORT!, // Port DB depuis .env, avec "!" pour dire que ce n'est pas null
      username: process.env.DB_USER, // User DB
      password: process.env.DB_PASS, // Mot de passe DB
      database: process.env.DB_NAME, // Nom de la base
      synchronize: true, // Synchronise la structure des tables (uniquement en dev)
      entities: [Category, Expense], // On indique les entités utilisées
    }),
    TypeOrmModule.forFeature([Category, Expense]),
    ExpenseModule, // Permet d'injecter le repository Category dans les services
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class AppModule {}
