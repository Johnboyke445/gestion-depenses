import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from '../category/category.entity';

@Entity()
export class Expense {
  // Identifiant unique auto-incrémenté
  @PrimaryGeneratedColumn()
  id: number;

  // Montant de la dépense
  @Column('decimal')
  amount: number;

  // Date de la dépense
  @Column('date')
  date: string;

  // RELATION ManyToOne vers Category
  @ManyToOne(() => Category, (category) => category.expenses)
  @JoinColumn({ name: 'categoryId' }) // <- ça permet de nommer explicitement la FK
  category: Category;
}
