import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './Book';

@Entity()
export class Author extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  country?: string;

  @Column()
  age!: number;

  @OneToMany(() => Book, (book) => book.author)
  public books?: Book[];
}
