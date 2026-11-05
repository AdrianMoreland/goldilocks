import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type {
    AliasesResponse,
    DuplicatesResponse,
    LinkDecisionResult,
    OverAllocatedResponse,
    PricingProductOption,
    ReviewLinksResponse,
    ReviewSummary,
    SalesProduct,
    SettleResult,
    UnresolvedLotsResponse,
} from '@goldilocks/shared-types';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestWithUser } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    CreateSalesProductRequestDto,
    LinkDecisionRequestDto,
    MapAliasRequestDto,
} from '../../common/dto/dtos';

/** What the import could not settle by itself. Admin only; decisions are recorded, never applied to trades. */
@ApiTags('review')
@ApiBearerAuth()
@Controller('review')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ReviewController {
    constructor(private readonly review: ReviewService) {}

    @Get('summary')
    @ApiOperation({ summary: 'How many items wait in each review queue.' })
    summary(): Promise<ReviewSummary> {
        return this.review.summary();
    }

    @Get('links')
    @ApiOperation({ summary: 'Pending links, optionally of one type.' })
    links(
        @Query() query: Record<string, string>,
    ): Promise<ReviewLinksResponse> {
        return this.review.links(query);
    }

    @Post('links/decide')
    @HttpCode(200)
    @ApiOperation({ summary: 'Confirm or reject pending links.' })
    decide(
        @Body() body: LinkDecisionRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<LinkDecisionResult> {
        return this.review.decide(body, req.user.email);
    }

    @Post('links/settle')
    @HttpCode(200)
    @ApiOperation({
        summary:
            'Confirm the pending links that make sense, leaving the rest to ask about.',
    })
    settle(@Req() req: RequestWithUser): Promise<SettleResult> {
        return this.review.settle(req.user.email);
    }

    @Get('over-allocated')
    @ApiOperation({
        summary: 'Purchase lines with more sold from them than was bought.',
    })
    overAllocated(
        @Query() query: Record<string, string>,
    ): Promise<OverAllocatedResponse> {
        return this.review.overAllocated(query);
    }

    @Get('unresolved-lots')
    @ApiOperation({ summary: 'Sales whose purchase line is not loaded.' })
    unresolvedLots(
        @Query() query: Record<string, string>,
    ): Promise<UnresolvedLotsResponse> {
        return this.review.unresolvedLots(query);
    }

    @Get('duplicates')
    @ApiOperation({ summary: 'Trades that repeat an earlier reference.' })
    duplicates(
        @Query() query: Record<string, string>,
    ): Promise<DuplicatesResponse> {
        return this.review.duplicates(query);
    }

    @Get('aliases')
    @ApiOperation({
        summary:
            'Product texts not yet tied to a sales product, most used first.',
    })
    aliases(@Query() query: Record<string, string>): Promise<AliasesResponse> {
        return this.review.aliases(query);
    }

    @Get('sales-products')
    @ApiOperation({ summary: 'The specific sales products.' })
    salesProducts(): Promise<SalesProduct[]> {
        return this.review.salesProducts();
    }

    @Get('pricing-products')
    @ApiOperation({
        summary: 'The pricing products a sales product can be tied to.',
    })
    pricingProducts(): Promise<PricingProductOption[]> {
        return this.review.pricingProducts();
    }

    @Post('sales-products')
    @HttpCode(200)
    @ApiOperation({ summary: 'Add a sales product.' })
    createSalesProduct(
        @Body() body: CreateSalesProductRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<SalesProduct> {
        return this.review.createSalesProduct(body, req.user.email);
    }

    @Post('aliases/:id/map')
    @HttpCode(200)
    @ApiOperation({ summary: 'Tie a product text to a sales product.' })
    mapAlias(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: MapAliasRequestDto,
        @Req() req: RequestWithUser,
    ): Promise<{ id: number }> {
        return this.review.mapAlias(id, body, req.user.email);
    }
}
