import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Expense } from '../expense/expense.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relation avec les dépenses (1 catégorie peut avoir plusieurs dépenses)
  @OneToMany(() => Expense, (expense) => expense.category)
  expenses: Expense[];
}
