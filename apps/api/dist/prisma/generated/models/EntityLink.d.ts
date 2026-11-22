import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type EntityLinkModel = runtime.Types.Result.DefaultSelection<Prisma.$EntityLinkPayload>;
export type AggregateEntityLink = {
    _count: EntityLinkCountAggregateOutputType | null;
    _avg: EntityLinkAvgAggregateOutputType | null;
    _sum: EntityLinkSumAggregateOutputType | null;
    _min: EntityLinkMinAggregateOutputType | null;
    _max: EntityLinkMaxAggregateOutputType | null;
};
export type EntityLinkAvgAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type EntityLinkSumAggregateOutputType = {
    id: number | null;
    importBatchId: number | null;
};
export type EntityLinkMinAggregateOutputType = {
    id: number | null;
    linkType: string | null;
    fromTable: string | null;
    fromKey: string | null;
    toTable: string | null;
    toKey: string | null;
    method: string | null;
    confidence: $Enums.LinkConfidence | null;
    status: $Enums.LinkStatus | null;
    note: string | null;
    confirmedBy: string | null;
    confirmedAt: Date | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EntityLinkMaxAggregateOutputType = {
    id: number | null;
    linkType: string | null;
    fromTable: string | null;
    fromKey: string | null;
    toTable: string | null;
    toKey: string | null;
    method: string | null;
    confidence: $Enums.LinkConfidence | null;
    status: $Enums.LinkStatus | null;
    note: string | null;
    confirmedBy: string | null;
    confirmedAt: Date | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EntityLinkCountAggregateOutputType = {
    id: number;
    linkType: number;
    fromTable: number;
    fromKey: number;
    toTable: number;
    toKey: number;
    method: number;
    confidence: number;
    status: number;
    note: number;
    confirmedBy: number;
    confirmedAt: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EntityLinkAvgAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type EntityLinkSumAggregateInputType = {
    id?: true;
    importBatchId?: true;
};
export type EntityLinkMinAggregateInputType = {
    id?: true;
    linkType?: true;
    fromTable?: true;
    fromKey?: true;
    toTable?: true;
    toKey?: true;
    method?: true;
    confidence?: true;
    status?: true;
    note?: true;
    confirmedBy?: true;
    confirmedAt?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EntityLinkMaxAggregateInputType = {
    id?: true;
    linkType?: true;
    fromTable?: true;
    fromKey?: true;
    toTable?: true;
    toKey?: true;
    method?: true;
    confidence?: true;
    status?: true;
    note?: true;
    confirmedBy?: true;
    confirmedAt?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EntityLinkCountAggregateInputType = {
    id?: true;
    linkType?: true;
    fromTable?: true;
    fromKey?: true;
    toTable?: true;
    toKey?: true;
    method?: true;
    confidence?: true;
    status?: true;
    note?: true;
    confirmedBy?: true;
    confirmedAt?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EntityLinkAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntityLinkWhereInput;
    orderBy?: Prisma.EntityLinkOrderByWithRelationInput | Prisma.EntityLinkOrderByWithRelationInput[];
    cursor?: Prisma.EntityLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EntityLinkCountAggregateInputType;
    _avg?: EntityLinkAvgAggregateInputType;
    _sum?: EntityLinkSumAggregateInputType;
    _min?: EntityLinkMinAggregateInputType;
    _max?: EntityLinkMaxAggregateInputType;
};
export type GetEntityLinkAggregateType<T extends EntityLinkAggregateArgs> = {
    [P in keyof T & keyof AggregateEntityLink]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEntityLink[P]> : Prisma.GetScalarType<T[P], AggregateEntityLink[P]>;
};
export type EntityLinkGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntityLinkWhereInput;
    orderBy?: Prisma.EntityLinkOrderByWithAggregationInput | Prisma.EntityLinkOrderByWithAggregationInput[];
    by: Prisma.EntityLinkScalarFieldEnum[] | Prisma.EntityLinkScalarFieldEnum;
    having?: Prisma.EntityLinkScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EntityLinkCountAggregateInputType | true;
    _avg?: EntityLinkAvgAggregateInputType;
    _sum?: EntityLinkSumAggregateInputType;
    _min?: EntityLinkMinAggregateInputType;
    _max?: EntityLinkMaxAggregateInputType;
};
export type EntityLinkGroupByOutputType = {
    id: number;
    linkType: string;
    fromTable: string;
    fromKey: string;
    toTable: string;
    toKey: string;
    method: string;
    confidence: $Enums.LinkConfidence;
    status: $Enums.LinkStatus;
    note: string | null;
    confirmedBy: string | null;
    confirmedAt: Date | null;
    importBatchId: number | null;
    createdAt: Date;
    updatedAt: Date;
    _count: EntityLinkCountAggregateOutputType | null;
    _avg: EntityLinkAvgAggregateOutputType | null;
    _sum: EntityLinkSumAggregateOutputType | null;
    _min: EntityLinkMinAggregateOutputType | null;
    _max: EntityLinkMaxAggregateOutputType | null;
};
export type GetEntityLinkGroupByPayload<T extends EntityLinkGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EntityLinkGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EntityLinkGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EntityLinkGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EntityLinkGroupByOutputType[P]>;
}>>;
export type EntityLinkWhereInput = {
    AND?: Prisma.EntityLinkWhereInput | Prisma.EntityLinkWhereInput[];
    OR?: Prisma.EntityLinkWhereInput[];
    NOT?: Prisma.EntityLinkWhereInput | Prisma.EntityLinkWhereInput[];
    id?: Prisma.IntFilter<"EntityLink"> | number;
    linkType?: Prisma.StringFilter<"EntityLink"> | string;
    fromTable?: Prisma.StringFilter<"EntityLink"> | string;
    fromKey?: Prisma.StringFilter<"EntityLink"> | string;
    toTable?: Prisma.StringFilter<"EntityLink"> | string;
    toKey?: Prisma.StringFilter<"EntityLink"> | string;
    method?: Prisma.StringFilter<"EntityLink"> | string;
    confidence?: Prisma.EnumLinkConfidenceFilter<"EntityLink"> | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFilter<"EntityLink"> | $Enums.LinkStatus;
    note?: Prisma.StringNullableFilter<"EntityLink"> | string | null;
    confirmedBy?: Prisma.StringNullableFilter<"EntityLink"> | string | null;
    confirmedAt?: Prisma.DateTimeNullableFilter<"EntityLink"> | Date | string | null;
    importBatchId?: Prisma.IntNullableFilter<"EntityLink"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"EntityLink"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"EntityLink"> | Date | string;
};
export type EntityLinkOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    linkType?: Prisma.SortOrder;
    fromTable?: Prisma.SortOrder;
    fromKey?: Prisma.SortOrder;
    toTable?: Prisma.SortOrder;
    toKey?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    confirmedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    confirmedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    importBatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EntityLinkWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    linkType_fromTable_fromKey_toTable_toKey?: Prisma.EntityLinkLinkTypeFromTableFromKeyToTableToKeyCompoundUniqueInput;
    AND?: Prisma.EntityLinkWhereInput | Prisma.EntityLinkWhereInput[];
    OR?: Prisma.EntityLinkWhereInput[];
    NOT?: Prisma.EntityLinkWhereInput | Prisma.EntityLinkWhereInput[];
    linkType?: Prisma.StringFilter<"EntityLink"> | string;
    fromTable?: Prisma.StringFilter<"EntityLink"> | string;
    fromKey?: Prisma.StringFilter<"EntityLink"> | string;
    toTable?: Prisma.StringFilter<"EntityLink"> | string;
    toKey?: Prisma.StringFilter<"EntityLink"> | string;
    method?: Prisma.StringFilter<"EntityLink"> | string;
    confidence?: Prisma.EnumLinkConfidenceFilter<"EntityLink"> | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFilter<"EntityLink"> | $Enums.LinkStatus;
    note?: Prisma.StringNullableFilter<"EntityLink"> | string | null;
    confirmedBy?: Prisma.StringNullableFilter<"EntityLink"> | string | null;
    confirmedAt?: Prisma.DateTimeNullableFilter<"EntityLink"> | Date | string | null;
    importBatchId?: Prisma.IntNullableFilter<"EntityLink"> | number | null;
    createdAt?: Prisma.DateTimeFilter<"EntityLink"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"EntityLink"> | Date | string;
}, "id" | "linkType_fromTable_fromKey_toTable_toKey">;
export type EntityLinkOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    linkType?: Prisma.SortOrder;
    fromTable?: Prisma.SortOrder;
    fromKey?: Prisma.SortOrder;
    toTable?: Prisma.SortOrder;
    toKey?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    confirmedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    confirmedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    importBatchId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EntityLinkCountOrderByAggregateInput;
    _avg?: Prisma.EntityLinkAvgOrderByAggregateInput;
    _max?: Prisma.EntityLinkMaxOrderByAggregateInput;
    _min?: Prisma.EntityLinkMinOrderByAggregateInput;
    _sum?: Prisma.EntityLinkSumOrderByAggregateInput;
};
export type EntityLinkScalarWhereWithAggregatesInput = {
    AND?: Prisma.EntityLinkScalarWhereWithAggregatesInput | Prisma.EntityLinkScalarWhereWithAggregatesInput[];
    OR?: Prisma.EntityLinkScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EntityLinkScalarWhereWithAggregatesInput | Prisma.EntityLinkScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EntityLink"> | number;
    linkType?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    fromTable?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    fromKey?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    toTable?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    toKey?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    method?: Prisma.StringWithAggregatesFilter<"EntityLink"> | string;
    confidence?: Prisma.EnumLinkConfidenceWithAggregatesFilter<"EntityLink"> | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusWithAggregatesFilter<"EntityLink"> | $Enums.LinkStatus;
    note?: Prisma.StringNullableWithAggregatesFilter<"EntityLink"> | string | null;
    confirmedBy?: Prisma.StringNullableWithAggregatesFilter<"EntityLink"> | string | null;
    confirmedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"EntityLink"> | Date | string | null;
    importBatchId?: Prisma.IntNullableWithAggregatesFilter<"EntityLink"> | number | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EntityLink"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"EntityLink"> | Date | string;
};
export type EntityLinkCreateInput = {
    linkType: string;
    fromTable: string;
    fromKey: string;
    toTable: string;
    toKey: string;
    method: string;
    confidence: $Enums.LinkConfidence;
    status?: $Enums.LinkStatus;
    note?: string | null;
    confirmedBy?: string | null;
    confirmedAt?: Date | string | null;
    importBatchId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EntityLinkUncheckedCreateInput = {
    id?: number;
    linkType: string;
    fromTable: string;
    fromKey: string;
    toTable: string;
    toKey: string;
    method: string;
    confidence: $Enums.LinkConfidence;
    status?: $Enums.LinkStatus;
    note?: string | null;
    confirmedBy?: string | null;
    confirmedAt?: Date | string | null;
    importBatchId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EntityLinkUpdateInput = {
    linkType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromTable?: Prisma.StringFieldUpdateOperationsInput | string;
    fromKey?: Prisma.StringFieldUpdateOperationsInput | string;
    toTable?: Prisma.StringFieldUpdateOperationsInput | string;
    toKey?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.EnumLinkConfidenceFieldUpdateOperationsInput | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFieldUpdateOperationsInput | $Enums.LinkStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntityLinkUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    linkType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromTable?: Prisma.StringFieldUpdateOperationsInput | string;
    fromKey?: Prisma.StringFieldUpdateOperationsInput | string;
    toTable?: Prisma.StringFieldUpdateOperationsInput | string;
    toKey?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.EnumLinkConfidenceFieldUpdateOperationsInput | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFieldUpdateOperationsInput | $Enums.LinkStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntityLinkCreateManyInput = {
    id?: number;
    linkType: string;
    fromTable: string;
    fromKey: string;
    toTable: string;
    toKey: string;
    method: string;
    confidence: $Enums.LinkConfidence;
    status?: $Enums.LinkStatus;
    note?: string | null;
    confirmedBy?: string | null;
    confirmedAt?: Date | string | null;
    importBatchId?: number | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EntityLinkUpdateManyMutationInput = {
    linkType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromTable?: Prisma.StringFieldUpdateOperationsInput | string;
    fromKey?: Prisma.StringFieldUpdateOperationsInput | string;
    toTable?: Prisma.StringFieldUpdateOperationsInput | string;
    toKey?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.EnumLinkConfidenceFieldUpdateOperationsInput | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFieldUpdateOperationsInput | $Enums.LinkStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntityLinkUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    linkType?: Prisma.StringFieldUpdateOperationsInput | string;
    fromTable?: Prisma.StringFieldUpdateOperationsInput | string;
    fromKey?: Prisma.StringFieldUpdateOperationsInput | string;
    toTable?: Prisma.StringFieldUpdateOperationsInput | string;
    toKey?: Prisma.StringFieldUpdateOperationsInput | string;
    method?: Prisma.StringFieldUpdateOperationsInput | string;
    confidence?: Prisma.EnumLinkConfidenceFieldUpdateOperationsInput | $Enums.LinkConfidence;
    status?: Prisma.EnumLinkStatusFieldUpdateOperationsInput | $Enums.LinkStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    confirmedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    importBatchId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EntityLinkLinkTypeFromTableFromKeyToTableToKeyCompoundUniqueInput = {
    linkType: string;
    fromTable: string;
    fromKey: string;
    toTable: string;
    toKey: string;
};
export type EntityLinkCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    linkType?: Prisma.SortOrder;
    fromTable?: Prisma.SortOrder;
    fromKey?: Prisma.SortOrder;
    toTable?: Prisma.SortOrder;
    toKey?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    confirmedBy?: Prisma.SortOrder;
    confirmedAt?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EntityLinkAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type EntityLinkMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    linkType?: Prisma.SortOrder;
    fromTable?: Prisma.SortOrder;
    fromKey?: Prisma.SortOrder;
    toTable?: Prisma.SortOrder;
    toKey?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    confirmedBy?: Prisma.SortOrder;
    confirmedAt?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EntityLinkMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    linkType?: Prisma.SortOrder;
    fromTable?: Prisma.SortOrder;
    fromKey?: Prisma.SortOrder;
    toTable?: Prisma.SortOrder;
    toKey?: Prisma.SortOrder;
    method?: Prisma.SortOrder;
    confidence?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    confirmedBy?: Prisma.SortOrder;
    confirmedAt?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EntityLinkSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type EnumLinkConfidenceFieldUpdateOperationsInput = {
    set?: $Enums.LinkConfidence;
};
export type EnumLinkStatusFieldUpdateOperationsInput = {
    set?: $Enums.LinkStatus;
};
export type EntityLinkSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    linkType?: boolean;
    fromTable?: boolean;
    fromKey?: boolean;
    toTable?: boolean;
    toKey?: boolean;
    method?: boolean;
    confidence?: boolean;
    status?: boolean;
    note?: boolean;
    confirmedBy?: boolean;
    confirmedAt?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["entityLink"]>;
export type EntityLinkSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    linkType?: boolean;
    fromTable?: boolean;
    fromKey?: boolean;
    toTable?: boolean;
    toKey?: boolean;
    method?: boolean;
    confidence?: boolean;
    status?: boolean;
    note?: boolean;
    confirmedBy?: boolean;
    confirmedAt?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["entityLink"]>;
export type EntityLinkSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    linkType?: boolean;
    fromTable?: boolean;
    fromKey?: boolean;
    toTable?: boolean;
    toKey?: boolean;
    method?: boolean;
    confidence?: boolean;
    status?: boolean;
    note?: boolean;
    confirmedBy?: boolean;
    confirmedAt?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["entityLink"]>;
export type EntityLinkSelectScalar = {
    id?: boolean;
    linkType?: boolean;
    fromTable?: boolean;
    fromKey?: boolean;
    toTable?: boolean;
    toKey?: boolean;
    method?: boolean;
    confidence?: boolean;
    status?: boolean;
    note?: boolean;
    confirmedBy?: boolean;
    confirmedAt?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EntityLinkOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "linkType" | "fromTable" | "fromKey" | "toTable" | "toKey" | "method" | "confidence" | "status" | "note" | "confirmedBy" | "confirmedAt" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["entityLink"]>;
export type $EntityLinkPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EntityLink";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        linkType: string;
        fromTable: string;
        fromKey: string;
        toTable: string;
        toKey: string;
        method: string;
        confidence: $Enums.LinkConfidence;
        status: $Enums.LinkStatus;
        note: string | null;
        confirmedBy: string | null;
        confirmedAt: Date | null;
        importBatchId: number | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["entityLink"]>;
    composites: {};
};
export type EntityLinkGetPayload<S extends boolean | null | undefined | EntityLinkDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload, S>;
export type EntityLinkCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EntityLinkFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EntityLinkCountAggregateInputType | true;
};
export interface EntityLinkDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EntityLink'];
        meta: {
            name: 'EntityLink';
        };
    };
    findUnique<T extends EntityLinkFindUniqueArgs>(args: Prisma.SelectSubset<T, EntityLinkFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EntityLinkFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EntityLinkFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EntityLinkFindFirstArgs>(args?: Prisma.SelectSubset<T, EntityLinkFindFirstArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EntityLinkFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EntityLinkFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EntityLinkFindManyArgs>(args?: Prisma.SelectSubset<T, EntityLinkFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EntityLinkCreateArgs>(args: Prisma.SelectSubset<T, EntityLinkCreateArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EntityLinkCreateManyArgs>(args?: Prisma.SelectSubset<T, EntityLinkCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EntityLinkCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EntityLinkCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EntityLinkDeleteArgs>(args: Prisma.SelectSubset<T, EntityLinkDeleteArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EntityLinkUpdateArgs>(args: Prisma.SelectSubset<T, EntityLinkUpdateArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EntityLinkDeleteManyArgs>(args?: Prisma.SelectSubset<T, EntityLinkDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EntityLinkUpdateManyArgs>(args: Prisma.SelectSubset<T, EntityLinkUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EntityLinkUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EntityLinkUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EntityLinkUpsertArgs>(args: Prisma.SelectSubset<T, EntityLinkUpsertArgs<ExtArgs>>): Prisma.Prisma__EntityLinkClient<runtime.Types.Result.GetResult<Prisma.$EntityLinkPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EntityLinkCountArgs>(args?: Prisma.Subset<T, EntityLinkCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EntityLinkCountAggregateOutputType> : number>;
    aggregate<T extends EntityLinkAggregateArgs>(args: Prisma.Subset<T, EntityLinkAggregateArgs>): Prisma.PrismaPromise<GetEntityLinkAggregateType<T>>;
    groupBy<T extends EntityLinkGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EntityLinkGroupByArgs['orderBy'];
    } : {
        orderBy?: EntityLinkGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EntityLinkGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEntityLinkGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EntityLinkFieldRefs;
}
export interface Prisma__EntityLinkClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EntityLinkFieldRefs {
    readonly id: Prisma.FieldRef<"EntityLink", 'Int'>;
    readonly linkType: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly fromTable: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly fromKey: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly toTable: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly toKey: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly method: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly confidence: Prisma.FieldRef<"EntityLink", 'LinkConfidence'>;
    readonly status: Prisma.FieldRef<"EntityLink", 'LinkStatus'>;
    readonly note: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly confirmedBy: Prisma.FieldRef<"EntityLink", 'String'>;
    readonly confirmedAt: Prisma.FieldRef<"EntityLink", 'DateTime'>;
    readonly importBatchId: Prisma.FieldRef<"EntityLink", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"EntityLink", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"EntityLink", 'DateTime'>;
}
export type EntityLinkFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where: Prisma.EntityLinkWhereUniqueInput;
};
export type EntityLinkFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where: Prisma.EntityLinkWhereUniqueInput;
};
export type EntityLinkFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where?: Prisma.EntityLinkWhereInput;
    orderBy?: Prisma.EntityLinkOrderByWithRelationInput | Prisma.EntityLinkOrderByWithRelationInput[];
    cursor?: Prisma.EntityLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EntityLinkScalarFieldEnum | Prisma.EntityLinkScalarFieldEnum[];
};
export type EntityLinkFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where?: Prisma.EntityLinkWhereInput;
    orderBy?: Prisma.EntityLinkOrderByWithRelationInput | Prisma.EntityLinkOrderByWithRelationInput[];
    cursor?: Prisma.EntityLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EntityLinkScalarFieldEnum | Prisma.EntityLinkScalarFieldEnum[];
};
export type EntityLinkFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where?: Prisma.EntityLinkWhereInput;
    orderBy?: Prisma.EntityLinkOrderByWithRelationInput | Prisma.EntityLinkOrderByWithRelationInput[];
    cursor?: Prisma.EntityLinkWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EntityLinkScalarFieldEnum | Prisma.EntityLinkScalarFieldEnum[];
};
export type EntityLinkCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntityLinkCreateInput, Prisma.EntityLinkUncheckedCreateInput>;
};
export type EntityLinkCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EntityLinkCreateManyInput | Prisma.EntityLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EntityLinkCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    data: Prisma.EntityLinkCreateManyInput | Prisma.EntityLinkCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EntityLinkUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntityLinkUpdateInput, Prisma.EntityLinkUncheckedUpdateInput>;
    where: Prisma.EntityLinkWhereUniqueInput;
};
export type EntityLinkUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EntityLinkUpdateManyMutationInput, Prisma.EntityLinkUncheckedUpdateManyInput>;
    where?: Prisma.EntityLinkWhereInput;
    limit?: number;
};
export type EntityLinkUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EntityLinkUpdateManyMutationInput, Prisma.EntityLinkUncheckedUpdateManyInput>;
    where?: Prisma.EntityLinkWhereInput;
    limit?: number;
};
export type EntityLinkUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where: Prisma.EntityLinkWhereUniqueInput;
    create: Prisma.XOR<Prisma.EntityLinkCreateInput, Prisma.EntityLinkUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EntityLinkUpdateInput, Prisma.EntityLinkUncheckedUpdateInput>;
};
export type EntityLinkDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
    where: Prisma.EntityLinkWhereUniqueInput;
};
export type EntityLinkDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EntityLinkWhereInput;
    limit?: number;
};
export type EntityLinkDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EntityLinkSelect<ExtArgs> | null;
    omit?: Prisma.EntityLinkOmit<ExtArgs> | null;
};
//# sourceMappingURL=EntityLink.d.ts.map