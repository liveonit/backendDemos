import { Author } from '@src/entities/Author';
import { Book } from '@src/entities/Book';
import { CreateAuthorBodyType, UpdateAuthorBodyType } from '@src/typeDefs/Author';
import { NotFound } from '@src/utils/errors';
import { FindManyOptions } from 'typeorm';

export class AuthorSvc {
  async getMany(options: FindManyOptions<Author>): Promise<Author[]> {
    return await Author.find({ relations: ['books'], ...options });
  }

  async create(data: CreateAuthorBodyType): Promise<Author> {
    const author = Author.create(data as Author);
    return author.save();
  }

  async getById(id: number): Promise<Author> {
    return Author.findOneOrFail({ where: { id }, relations: ['books'] });
  }

  async updateAuthor(id: number, data: UpdateAuthorBodyType): Promise<Author> {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new Error('Author not found!');
    Object.assign(author, data);
    await author.save();
    return author;
  }

  async deleteAuthor(id: number): Promise<number> {
    const author = await Author.findOne({ where: { id } });
    if (!author) throw new NotFound();
    await author.remove();
    return id;
  }
}

export const authorSvc = new AuthorSvc();
