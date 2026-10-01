import {
    Body,
    Controller,
    Get,
    Param,
    Patch,
    Post,
    Req,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { KbSlugSchema } from '@goldilocks/shared-types';
import {
    JwtAuthGuard,
    type RequestWithUser,
} from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import {
    KbDocumentDto,
    KbDocumentListResponseDto,
    SetKbStatusRequestDto,
    UpdateKbDocumentRequestDto,
} from '../../common/dto/dtos';
import { KnowledgeService } from './knowledge.service';

@ApiTags('knowledge')
@Controller('knowledge')
export class KnowledgeController {
    constructor(private readonly knowledge: KnowledgeService) {}

    // Any signed-in user (the global JwtAuthGuard already requires a token):
    // the SOPs are for the whole desk, not just admins.
    @Get('documents')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'All SOPs the caller may read, with their Markdown',
        description:
            'Drafts are included (the reader badges them). Retired SOPs are returned to admins only. ' +
            'The set is small, so the web app loads it once and searches it locally.',
    })
    @ApiResponse({ status: 200, type: KbDocumentListResponseDto })
    async listDocuments(
        @Req() request: RequestWithUser,
    ): Promise<KbDocumentListResponseDto> {
        return {
            documents: await this.knowledge.listDocuments(request.user.admin),
        };
    }

    @Patch('documents/:slug')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: "Edit a SOP's title, owner and text (admin)",
        description:
            'Changing the text or title sends an approved SOP back to draft. Refuses edits that would break a link to or from another SOP.',
    })
    @ApiResponse({ status: 200, type: KbDocumentDto })
    async updateDocument(
        @Param('slug', new ZodValidationPipe(KbSlugSchema)) slug: string,
        @Body() body: UpdateKbDocumentRequestDto,
        @Req() request: RequestWithUser,
    ): Promise<KbDocumentDto> {
        return this.knowledge.updateDocument(slug, body, request.user.email);
    }

    @Post('documents/:slug/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @ApiBearerAuth()
    @ApiOperation({
        summary: 'Approve, return to draft, or retire a SOP (admin)',
        description:
            'Approving bumps the version and dates the SOP, and is refused while any [TODO] remains.',
    })
    @ApiResponse({ status: 201, type: KbDocumentDto })
    async setStatus(
        @Param('slug', new ZodValidationPipe(KbSlugSchema)) slug: string,
        @Body() body: SetKbStatusRequestDto,
        @Req() request: RequestWithUser,
    ): Promise<KbDocumentDto> {
        return this.knowledge.setStatus(slug, body.status, request.user.email);
    }
}
