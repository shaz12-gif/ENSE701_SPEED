/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';

// Import models from their respective modules
import { Article } from '../article/article.schema';
import { Evidence } from '../evidence/evidence.schema';
import { SearchArticlesQuery, SearchArticlesResult } from './search.types';

interface SearchConditions {
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>;
  _id?: { $in: Array<any> };
  year?: number;
}

interface ClaimConditions {
  claim: { $regex: string; $options: string };
  practice?: string;
}

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(Evidence.name) private evidenceModel: Model<Evidence>,
  ) {}

  async searchArticles(
    query: SearchArticlesQuery,
  ): Promise<SearchArticlesResult> {
    const {
      term,
      practice,
      year,
      sort = 'newest',
      limit = 20,
      page = 1,
    } = query;

    // Build search conditions
    const conditions: SearchConditions = {};

    if (term) {
      conditions.$or = [
        { title: { $regex: term, $options: 'i' } },
        { authors: { $regex: term, $options: 'i' } },
        { journal: { $regex: term, $options: 'i' } },
      ];
    }

    if (practice) {
      // Get evidence items for this practice
      const evidenceItems = await this.evidenceModel
        .find({ practice })
        .distinct('articleId');

      if (evidenceItems.length === 0) {
        return {
          articles: [],
          pagination: {
            total: 0,
            page: Number(page),
            limit: Number(limit),
            pages: 0,
          },
        };
      }

      conditions._id = { $in: evidenceItems };
    }

    if (year) {
      conditions.year = typeof year === 'string' ? parseInt(year, 10) : year;
    }

    // Apply sorting
    let sortOptions: { [key: string]: SortOrder } = {};
    switch (sort) {
      case 'newest':
        sortOptions = { year: -1, createdAt: -1 };
        break;
      case 'oldest':
        sortOptions = { year: 1, createdAt: 1 };
        break;
      case 'title':
        sortOptions = { title: 1 };
        break;
      default:
        sortOptions = { createdAt: -1 };
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    const parsedLimit = Number(limit);

    // Execute search
    try {
      const [articles, total] = await Promise.all([
        this.articleModel
          .find(conditions)
          .sort(sortOptions)
          .skip(skip)
          .limit(parsedLimit)
          .exec() as Promise<Article[]>, // Add explicit type assertion here
        this.articleModel.countDocuments(conditions),
      ]);

      return {
        articles,
        pagination: {
          total,
          page: Number(page),
          limit: parsedLimit,
          pages: Math.ceil(total / parsedLimit),
        },
      };
    } catch (error) {
      console.error('Error in searchArticles:', error);
      return {
        articles: [],
        pagination: {
          total: 0,
          page: Number(page),
          limit: parsedLimit,
          pages: 0,
        },
        error: 'An error occurred while searching articles',
      };
    }
  }

  async searchByClaim(claim: string, practice?: string) {
    try {
      // Find evidence matching claim and optional practice
      const conditions: ClaimConditions = {
        claim: { $regex: claim, $options: 'i' },
      };

      if (practice) {
        conditions.practice = practice;
      }

      const evidence = await this.evidenceModel.find(conditions).exec();

      // Get unique article IDs from evidence
      const articleIds = [...new Set(evidence.map((e) => e.articleId))];

      // Return early if no evidence found
      if (articleIds.length === 0) {
        return [];
      }

      // Get article details
      const articles = await this.articleModel
        .find({ _id: { $in: articleIds } })
        .exec();

      // Combine articles with their evidence
      const results = articles.map((article) => {
        const articleEvidence = evidence.filter(
          // eslint-disable-next-line @typescript-eslint/no-base-to-string
          (e) => e.articleId.toString() === article._id.toString(),
        );

        // Calculate agreement stats
        const supports = articleEvidence.filter((e) => e.supportsClaim).length;
        const opposes = articleEvidence.length - supports;

        return {
          article,
          evidence: articleEvidence,
          stats: {
            total: articleEvidence.length,
            supports,
            opposes,
            agreementRatio:
              articleEvidence.length > 0
                ? supports / articleEvidence.length
                : 0,
          },
        };
      });

      return results;
    } catch (error) {
      console.error('Error in searchByClaim:', error);
      return [];
    }
  }

  async searchEvidenceTable(practice?: string) {
    try {
      // Get all relevant evidence
      const conditions: { practice?: string } = {};
      if (practice) {
        conditions.practice = practice;
      }

      const evidence = await this.evidenceModel.find(conditions).exec();

      // Return early if no evidence found
      if (evidence.length === 0) {
        return [];
      }

      // Group by claim
      const claimGroups = evidence.reduce<Record<string, Evidence[]>>(
        (groups, item) => {
          if (!groups[item.claim]) {
            groups[item.claim] = [];
          }
          groups[item.claim].push(item);
          return groups;
        },
        {},
      );

      // Process each claim group
      const results = Object.entries(claimGroups).map(
        ([claim, items]: [string, Evidence[]]) => {
          const supports = items.filter((item) => item.supportsClaim).length;
          const opposes = items.length - supports;

          return {
            claim,
            totalEvidence: items.length,
            supports,
            opposes,
            agreementRatio: supports / items.length,
            evidenceItems: items,
          };
        },
      );

      // Sort by agreement ratio (highest first)
      return results.sort((a, b) => b.agreementRatio - a.agreementRatio);
    } catch (error) {
      console.error('Error in searchEvidenceTable:', error);
      return [];
    }
  }
}
