import type { OpenAPIObject } from '@nestjs/swagger';
import type { ApiEndpoint } from '@goldilocks/shared-types';
export declare class ApiCatalogueService {
    private document;
    setDocument(document: OpenAPIObject): void;
    list(): ApiEndpoint[];
    private resolve;
    private example;
}
//# sourceMappingURL=api-catalogue.service.d.ts.map