/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 *  Andrew Koves
 *  20126313
 *  SPEED Group 3
 *  This service handles logic for articles
 *  It interacts with the database to create, read, update, and moderate articles
 *  The ESLINT stuff at the top is because for some reason ESLINT hates me personally
 *  and doesn't like the way I write code
 */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleDocument, ArticleStatus } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
import { ModerateArticleDto } from './dto/moderate-article.dto';

//Injectable tells Nest this is a service so it can connect to the correct COLLECTION (not database)
@Injectable()
export class ArticleService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<ArticleDocument>,
  ) {}

  /**
   * Creates a new article
   * @param createArticleDto Article data
   * @returns The created article
   * PROMISE: this means that the function WILL retturn an article or throw an error
   * This means that the entire webpage wont just freeze while it waits for the database to respond
   */
  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const newArticle = new this.articleModel({
        ...createArticleDto,
        status: ArticleStatus.PENDING,
      });
      return await newArticle.save();
    } catch (error) {
      throw new BadRequestException(
        `Failed to create article: ${error.message}`,
      );
    }
  }
  /**
   * Creates a new article from a BibTeX file
   * @param bibContent content of the BibTeX file
   * @param additionalData Additional data to include in the article
   * @returns The created article
   * This function parses the BibTeX content and saves it to the database
   */
  async createWithBibTeX(
    bibContent: string,
    additionalData: any = {},
  ): Promise<Article> {
    try {
      const parsedData = this.parseBibTeX(bibContent) || {
        title: '',
        authors: '',
        journal: '',
        year: new Date().getFullYear(),
        volume: '',
        number: '',
        pages: '',
        doi: '',
        booktitle: '',
      };

      const articleData = {
        ...additionalData,
        title: parsedData.title || 'Title from BibTeX file',
        authors: parsedData.authors || 'Unknown authors',
        journal:
          parsedData.journal || parsedData.booktitle || 'Unknown journal',
        year: parsedData.year || new Date().getFullYear(),
        volume: parsedData.volume || '',
        number: parsedData.number || '',
        pages: parsedData.pages || '',
        doi: parsedData.doi || '',
        status: ArticleStatus.PENDING,
        bibTeXSource: bibContent,
      };

      const createdArticle = new this.articleModel(articleData);
      return await createdArticle.save();
    } catch (error) {
      throw new BadRequestException(
        'Failed to save BibTeX file to database. Please try again.',
      );
    }
  }

  /**
   * This function parses a BibTeX entry from a string
   * and extracts relevant fields such as title, authors, journal, year, etc.
   * @param bibText : The BibTeX entry as a string
   * @returns An object containing the extracted fields or null if parsing fails
   * This turns a BibTeX entry into a structured object for the database
   */
  private parseBibTeX(bibText: string) {
    // Normalize all line endings to \n and trim whitespace
    const normalized = bibText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .trim();

    // Remove any empty lines at the end
    const cleaned = normalized.replace(/\n+$/, '');

    // Match the first entry in the BibTeX file (robust to line endings)
    const entryMatch = cleaned.match(/@(\w+)\s*\{\s*([^,]*),\s*([\s\S]*?)\}$/m);
    if (!entryMatch) return null;

    const entryType = entryMatch[1];
    const entries: { [key: string]: string } = {};

    // Extract all key-value pairs (robust to line endings)
    const fieldsText = entryMatch[3];
    const fieldMatches = [
      ...fieldsText.matchAll(/\s*(\w+)\s*=\s*\{([\s\S]*?)\}\s*,?/g),
    ];

    fieldMatches.forEach((match) => {
      const key = match[1].toLowerCase();
      let value = match[2].trim();

      if (key === 'author') {
        value = value
          .split(' and ')
          .map((author) => author.trim())
          .join(', ');
      }

      entries[key] = value;
    });

    return {
      title: entries.title || '',
      authors: entries.author || '',
      journal: entries.journal || entries.booktitle || '',
      year: entries.year ? Number(entries.year) : new Date().getFullYear(),
      volume: entries.volume || '',
      number: entries.number || '',
      pages: entries.pages || '',
      doi: entries.doi || '',
      booktitle: entries.booktitle || '',
    };
  }

  /**
   * Finds all articles, optionally filtered by status its kinda simple
   */
  async findAll(status?: ArticleStatus): Promise<Article[]> {
    const query = status ? { status } : {};
    return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
  }
  //Finds a single article by ID
  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Article[]> {
    return this.articleModel.find({ _id: { $in: ids } }).exec();
  }
  //Finds an article by ID and updates its status
  async moderate(
    id: string,
    moderateDto: ModerateArticleDto,
  ): Promise<Article> {
    try {
      const article = await this.articleModel.findById(id);
      if (!article) {
        throw new NotFoundException(`Article with ID ${id} not found`);
      }

      article.status = moderateDto.status;
      if (moderateDto.moderationNotes) {
        article.moderationComments = moderateDto.moderationNotes;
      }

      return await article.save();
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Error moderating article: ${error.message}`,
      );
    }
  }
}
