import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Author } from './Author';

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  title!: string;

  @Column({ default: false })
  isPublished!: boolean;

  @Column()
  authorId!: number;

  @ManyToOne(() => Author, (author) => author.books)
  public author?: Author;
}
