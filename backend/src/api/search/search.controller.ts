import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchArticlesQuery } from './search.types'; // Add this import

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('articles')
  async searchArticles(@Query() query: SearchArticlesQuery) {
    // Use the imported type
    const results = await this.searchService.searchArticles(query);
    return {
      success: true,
      data: results,
    };
  }

  @Get('claim')
  async searchByClaim(
    @Query('claim') claim: string,
    @Query('practice') practice?: string,
  ) {
    const results = await this.searchService.searchByClaim(claim, practice);
    return {
      success: true,
      data: results,
    };
  }

  @Get('evidence-table')
  async getEvidenceTable(@Query('practice') practice?: string) {
    const results = await this.searchService.searchEvidenceTable(practice);
    return {
      success: true,
      data: results,
    };
  }
}
