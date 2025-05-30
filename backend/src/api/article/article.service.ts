/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article } from './article.schema';
import { CreateArticleDto } from './dto/create-article.dto';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ModerateArticleDto } from './dto/moderate-article.dto';
import { ArticleStatus } from './article.schema';

@Injectable()
export class ArticleService {
  moderate(id: string, moderateDto: ModerateArticleDto) {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectModel(Article.name)
    private articleModel: Model<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    try {
      const createdArticle = new this.articleModel({
        ...createArticleDto,
        status: 'pending',
      });
      return await createdArticle.save();
    } catch (error) {
      console.error('Error creating article:', error);
      throw new BadRequestException(
        `Failed to create article: ${error.message}`,
      );
    }
  }

  async createWithBibTeX(bibContent: string, additionalData: any = {}) {
    try {
      console.log('Creating article with BibTeX content');

      // Log DB connection info
      console.log('MongoDB connection info:');
      console.log('- DB_URI:', process.env.DB_URI ? 'Set (hidden)' : 'Not set');
      console.log('- DB_NAME:', process.env.DB_NAME);
      console.log('- Articles collection:', process.env.ARTICLES_COLLECTION);

      // Parse the BibTeX content
      let parsedData = this.parseBibTeX(bibContent);

      if (!parsedData) {
        // Instead of throwing an error, use default values
        console.log('Could not parse BibTeX properly, using default values');
        parsedData = {
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
      }

      // Create article data with explicit defaults for all required fields
      const articleData = {
        title: parsedData.title || 'Title from BibTeX file',
        authors: parsedData.authors || 'Unknown authors',
        journal:
          parsedData.journal || parsedData.booktitle || 'Unknown journal',
        year: parsedData.year
          ? Number(parsedData.year)
          : new Date().getFullYear(),
        volume: parsedData.volume || '',
        number: parsedData.number || '',
        pages: parsedData.pages || '',
        doi: parsedData.doi || '',
        status: 'pending',
        bibTeXSource: bibContent, // Store the raw BibTeX content
      };

      console.log('Saving article with data:', {
        ...articleData,
        bibTeXSource: bibContent ? `${bibContent.substring(0, 50)}...` : 'None',
      });

      // Create and save the article
      const createdArticle = new this.articleModel(articleData);

      try {
        const savedArticle = await createdArticle.save();
        console.log('Article saved successfully with ID:', savedArticle._id);
        console.log('Saved article data:', JSON.stringify(savedArticle));
        return savedArticle;
      } catch (dbError) {
        console.error('MongoDB save error:', dbError);
        throw new Error(`Database error: ${dbError.message}`);
      }
    } catch (error) {
      console.error('Error in createWithBibTeX:', error);
      throw new BadRequestException(
        'Failed to save BibTeX file to database. Please try again.',
      );
    }
  }

  // New method to create an article with only BibTeX content
  async createWithBibTeXOnly(bibContent: string): Promise<Article> {
    try {
      // Parse the BibTeX content
      let parsedData = this.parseBibTeX(bibContent);

      if (!parsedData) {
        // Instead of throwing an error, just use empty default values
        console.log('Could not parse BibTeX properly, using default values');
        parsedData = {
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
      }

      // Log the parsed data
      console.log('Parsed BibTeX data:', parsedData);

      // No field validation - always set default values for required fields
      const articleData = {
        title: parsedData.title || 'Title from BibTeX file',
        authors: parsedData.authors || 'Unknown authors',
        journal:
          parsedData.journal || parsedData.booktitle || 'Unknown journal',
        year: parsedData.year
          ? Number(parsedData.year)
          : new Date().getFullYear(),
        volume: parsedData.volume || '',
        number: parsedData.number || '',
        pages: parsedData.pages || '',
        doi: parsedData.doi || '',
        status: 'pending',
        bibTeXSource: bibContent,
      };

      // Directly create a new document with the mongoose model
      const createdArticle = new this.articleModel(articleData);

      // Save and return the result
      return await createdArticle.save();
    } catch (error) {
      console.error('Error creating article from BibTeX:', error);
      throw new BadRequestException(
        'Failed to process BibTeX file. Please try again or submit manually.',
      );
    }
  }

  // BibTeX parser function
  private parseBibTeX(bibText: string) {
    try {
      console.log('Parsing BibTeX text:', bibText.substring(0, 100) + '...');

      if (!bibText || bibText.trim() === '') {
        console.error('Empty BibTeX content received');
        return null;
      }

      // Match the first entry in the BibTeX file
      const entryMatch = bibText.match(/@(\w+)\s*\{\s*([^,]*),\s*([\s\S]*?)\}/);
      if (!entryMatch) {
        console.error('No valid BibTeX entry found in content');
        return null;
      }

      console.log('BibTeX entry type:', entryMatch[1]);
      console.log('BibTeX entry key:', entryMatch[2]);

      const entries: Record<string, string> = {};

      // Extract all key-value pairs
      const fieldsText = entryMatch[3];
      console.log('Fields text:', fieldsText.substring(0, 100) + '...');

      const fieldMatches = [
        ...fieldsText.matchAll(/\s*(\w+)\s*=\s*\{([\s\S]*?)(?=\},|\}$)/g),
      ];

      console.log('Found fields count:', fieldMatches.length);

      fieldMatches.forEach((match) => {
        const key = match[1].toLowerCase();
        let value = match[2].trim();

        // Handle the authors field specially
        if (key === 'author') {
          value = value
            .split(' and ')
            .map((author) => author.trim())
            .join(', ');
        }

        entries[key] = value;
        console.log(
          `BibTeX field: ${key} = ${value.substring(0, 30)}${value.length > 30 ? '...' : ''}`,
        );
      });

      // Map BibTeX fields to our article fields
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
    } catch (error) {
      console.error('Error parsing BibTeX:', error);
      return null;
    }
  }

  async findAll(status?: ArticleStatus): Promise<Article[]> {
    const query = status ? { status } : {};
    return this.articleModel.find(query).sort({ createdAt: -1 }).exec();
  }

  async findOne(id: string): Promise<Article> {
    return this.articleModel.findById(id).exec();
  }

  async findByIds(ids: string[]): Promise<Article[]> {
    return this.articleModel.find({ _id: { $in: ids } }).exec();
  }
}
