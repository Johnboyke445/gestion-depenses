import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category) // Injection du repository Category pour accéder à la DB
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // Méthode pour récupérer toutes les catégories
  findAll(): Promise<Category[]> {
    return this.categoryRepository.find();
  }

  // Méthode pour chercher une catégorie par son id
  findOne(id: number): Promise<Category | null> {
    return this.categoryRepository.findOneBy({ id });
  }

  // Méthode pour créer une nouvelle catégorie
  create(name: string): Promise<Category> {
    const category = this.categoryRepository.create({ name });
    return this.categoryRepository.save(category);
  }

  // Méthode pour mettre à jour une catégorie
  async update(id: number, name: string): Promise<Category | null> {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) return null;
    category.name = name;
    return this.categoryRepository.save(category);
  }

  // Méthode pour supprimer une catégorie
  async remove(id: number): Promise<boolean> {
    const result = await this.categoryRepository.delete(id);
    return (result.affected ?? 0) > 0;
  }
}
