import { Author } from '@src/entities/Author';
import { Book } from '@src/entities/Book';
import { CreateBookBodyType, UpdateBookBodyType } from '@src/typeDefs/Book';
import { FindManyOptions } from 'typeorm';

export class BookSvc {
  async getMany(options: FindManyOptions<Book>): Promise<Book[]> {
    return await Book.find({ relations: ['author'], ...options });
  }

  async create(data: CreateBookBodyType): Promise<Book> {
    const book = Book.create(data as Book);
    book.author = await Author.findOneOrFail({ where: { id: data.authorId } });
    await book.save();
    return book;
  }

  async getById(id: number): Promise<Book> {
    return Book.findOneOrFail({ where: { id }, relations: ['author'] });
  }

  async updateBook(
    id: number,
    data: UpdateBookBodyType
  ): Promise<Book> {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error('Book not found!');
    book.author = await Author.findOneOrFail({ where: { id: data.authorId } });
    delete data.authorId;
    Object.assign(book, data);
    const updBook = await book.save();
    return updBook;
  }


  async deleteBook(id: number): Promise<number> {
    const book = await Book.findOne({ where: { id } });
    if (!book) throw new Error('Book not found!');
    await book.remove();
    return id;
  }
}

export const bookSvc = new BookSvc();
