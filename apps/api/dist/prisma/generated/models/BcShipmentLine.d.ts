import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BcShipmentLineModel = runtime.Types.Result.DefaultSelection<Prisma.$BcShipmentLinePayload>;
export type AggregateBcShipmentLine = {
    _count: BcShipmentLineCountAggregateOutputType | null;
    _avg: BcShipmentLineAvgAggregateOutputType | null;
    _sum: BcShipmentLineSumAggregateOutputType | null;
    _min: BcShipmentLineMinAggregateOutputType | null;
    _max: BcShipmentLineMaxAggregateOutputType | null;
};
export type BcShipmentLineAvgAggregateOutputType = {
    id: number | null;
    lineNo: number | null;
    quantity: runtime.Decimal | null;
    importBatchId: number | null;
};
export type BcShipmentLineSumAggregateOutputType = {
    id: number | null;
    lineNo: number | null;
    quantity: runtime.Decimal | null;
    importBatchId: number | null;
};
export type BcShipmentLineMinAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    documentNo: string | null;
    lineNo: number | null;
    customerNo: string | null;
    itemNo: string | null;
    description: string | null;
    locationCode: string | null;
    quantity: runtime.Decimal | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcShipmentLineMaxAggregateOutputType = {
    id: number | null;
    sourceKey: string | null;
    documentNo: string | null;
    lineNo: number | null;
    customerNo: string | null;
    itemNo: string | null;
    description: string | null;
    locationCode: string | null;
    quantity: runtime.Decimal | null;
    missingFromImport: boolean | null;
    importBatchId: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BcShipmentLineCountAggregateOutputType = {
    id: number;
    sourceKey: number;
    documentNo: number;
    lineNo: number;
    customerNo: number;
    itemNo: number;
    description: number;
    locationCode: number;
    quantity: number;
    missingFromImport: number;
    importBatchId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BcShipmentLineAvgAggregateInputType = {
    id?: true;
    lineNo?: true;
    quantity?: true;
    importBatchId?: true;
};
export type BcShipmentLineSumAggregateInputType = {
    id?: true;
    lineNo?: true;
    quantity?: true;
    importBatchId?: true;
};
export type BcShipmentLineMinAggregateInputType = {
    id?: true;
    sourceKey?: true;
    documentNo?: true;
    lineNo?: true;
    customerNo?: true;
    itemNo?: true;
    description?: true;
    locationCode?: true;
    quantity?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcShipmentLineMaxAggregateInputType = {
    id?: true;
    sourceKey?: true;
    documentNo?: true;
    lineNo?: true;
    customerNo?: true;
    itemNo?: true;
    description?: true;
    locationCode?: true;
    quantity?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BcShipmentLineCountAggregateInputType = {
    id?: true;
    sourceKey?: true;
    documentNo?: true;
    lineNo?: true;
    customerNo?: true;
    itemNo?: true;
    description?: true;
    locationCode?: true;
    quantity?: true;
    missingFromImport?: true;
    importBatchId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BcShipmentLineAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentLineWhereInput;
    orderBy?: Prisma.BcShipmentLineOrderByWithRelationInput | Prisma.BcShipmentLineOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentLineWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BcShipmentLineCountAggregateInputType;
    _avg?: BcShipmentLineAvgAggregateInputType;
    _sum?: BcShipmentLineSumAggregateInputType;
    _min?: BcShipmentLineMinAggregateInputType;
    _max?: BcShipmentLineMaxAggregateInputType;
};
export type GetBcShipmentLineAggregateType<T extends BcShipmentLineAggregateArgs> = {
    [P in keyof T & keyof AggregateBcShipmentLine]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBcShipmentLine[P]> : Prisma.GetScalarType<T[P], AggregateBcShipmentLine[P]>;
};
export type BcShipmentLineGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentLineWhereInput;
    orderBy?: Prisma.BcShipmentLineOrderByWithAggregationInput | Prisma.BcShipmentLineOrderByWithAggregationInput[];
    by: Prisma.BcShipmentLineScalarFieldEnum[] | Prisma.BcShipmentLineScalarFieldEnum;
    having?: Prisma.BcShipmentLineScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BcShipmentLineCountAggregateInputType | true;
    _avg?: BcShipmentLineAvgAggregateInputType;
    _sum?: BcShipmentLineSumAggregateInputType;
    _min?: BcShipmentLineMinAggregateInputType;
    _max?: BcShipmentLineMaxAggregateInputType;
};
export type BcShipmentLineGroupByOutputType = {
    id: number;
    sourceKey: string;
    documentNo: string;
    lineNo: number;
    customerNo: string | null;
    itemNo: string | null;
    description: string | null;
    locationCode: string | null;
    quantity: runtime.Decimal | null;
    missingFromImport: boolean;
    importBatchId: number;
    createdAt: Date;
    updatedAt: Date;
    _count: BcShipmentLineCountAggregateOutputType | null;
    _avg: BcShipmentLineAvgAggregateOutputType | null;
    _sum: BcShipmentLineSumAggregateOutputType | null;
    _min: BcShipmentLineMinAggregateOutputType | null;
    _max: BcShipmentLineMaxAggregateOutputType | null;
};
export type GetBcShipmentLineGroupByPayload<T extends BcShipmentLineGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BcShipmentLineGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BcShipmentLineGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BcShipmentLineGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BcShipmentLineGroupByOutputType[P]>;
}>>;
export type BcShipmentLineWhereInput = {
    AND?: Prisma.BcShipmentLineWhereInput | Prisma.BcShipmentLineWhereInput[];
    OR?: Prisma.BcShipmentLineWhereInput[];
    NOT?: Prisma.BcShipmentLineWhereInput | Prisma.BcShipmentLineWhereInput[];
    id?: Prisma.IntFilter<"BcShipmentLine"> | number;
    sourceKey?: Prisma.StringFilter<"BcShipmentLine"> | string;
    documentNo?: Prisma.StringFilter<"BcShipmentLine"> | string;
    lineNo?: Prisma.IntFilter<"BcShipmentLine"> | number;
    customerNo?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    itemNo?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    description?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    quantity?: Prisma.DecimalNullableFilter<"BcShipmentLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFilter<"BcShipmentLine"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcShipmentLine"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcShipmentLine"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcShipmentLine"> | Date | string;
};
export type BcShipmentLineOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    documentNo?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    itemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentLineWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    sourceKey?: string;
    AND?: Prisma.BcShipmentLineWhereInput | Prisma.BcShipmentLineWhereInput[];
    OR?: Prisma.BcShipmentLineWhereInput[];
    NOT?: Prisma.BcShipmentLineWhereInput | Prisma.BcShipmentLineWhereInput[];
    documentNo?: Prisma.StringFilter<"BcShipmentLine"> | string;
    lineNo?: Prisma.IntFilter<"BcShipmentLine"> | number;
    customerNo?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    itemNo?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    description?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    locationCode?: Prisma.StringNullableFilter<"BcShipmentLine"> | string | null;
    quantity?: Prisma.DecimalNullableFilter<"BcShipmentLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFilter<"BcShipmentLine"> | boolean;
    importBatchId?: Prisma.IntFilter<"BcShipmentLine"> | number;
    createdAt?: Prisma.DateTimeFilter<"BcShipmentLine"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"BcShipmentLine"> | Date | string;
}, "id" | "sourceKey">;
export type BcShipmentLineOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    documentNo?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    itemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    locationCode?: Prisma.SortOrderInput | Prisma.SortOrder;
    quantity?: Prisma.SortOrderInput | Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BcShipmentLineCountOrderByAggregateInput;
    _avg?: Prisma.BcShipmentLineAvgOrderByAggregateInput;
    _max?: Prisma.BcShipmentLineMaxOrderByAggregateInput;
    _min?: Prisma.BcShipmentLineMinOrderByAggregateInput;
    _sum?: Prisma.BcShipmentLineSumOrderByAggregateInput;
};
export type BcShipmentLineScalarWhereWithAggregatesInput = {
    AND?: Prisma.BcShipmentLineScalarWhereWithAggregatesInput | Prisma.BcShipmentLineScalarWhereWithAggregatesInput[];
    OR?: Prisma.BcShipmentLineScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BcShipmentLineScalarWhereWithAggregatesInput | Prisma.BcShipmentLineScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"BcShipmentLine"> | number;
    sourceKey?: Prisma.StringWithAggregatesFilter<"BcShipmentLine"> | string;
    documentNo?: Prisma.StringWithAggregatesFilter<"BcShipmentLine"> | string;
    lineNo?: Prisma.IntWithAggregatesFilter<"BcShipmentLine"> | number;
    customerNo?: Prisma.StringNullableWithAggregatesFilter<"BcShipmentLine"> | string | null;
    itemNo?: Prisma.StringNullableWithAggregatesFilter<"BcShipmentLine"> | string | null;
    description?: Prisma.StringNullableWithAggregatesFilter<"BcShipmentLine"> | string | null;
    locationCode?: Prisma.StringNullableWithAggregatesFilter<"BcShipmentLine"> | string | null;
    quantity?: Prisma.DecimalNullableWithAggregatesFilter<"BcShipmentLine"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolWithAggregatesFilter<"BcShipmentLine"> | boolean;
    importBatchId?: Prisma.IntWithAggregatesFilter<"BcShipmentLine"> | number;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"BcShipmentLine"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"BcShipmentLine"> | Date | string;
};
export type BcShipmentLineCreateInput = {
    sourceKey: string;
    documentNo: string;
    lineNo: number;
    customerNo?: string | null;
    itemNo?: string | null;
    description?: string | null;
    locationCode?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentLineUncheckedCreateInput = {
    id?: number;
    sourceKey: string;
    documentNo: string;
    lineNo: number;
    customerNo?: string | null;
    itemNo?: string | null;
    description?: string | null;
    locationCode?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentLineUpdateInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    documentNo?: Prisma.StringFieldUpdateOperationsInput | string;
    lineNo?: Prisma.IntFieldUpdateOperationsInput | number;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentLineUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    documentNo?: Prisma.StringFieldUpdateOperationsInput | string;
    lineNo?: Prisma.IntFieldUpdateOperationsInput | number;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentLineCreateManyInput = {
    id?: number;
    sourceKey: string;
    documentNo: string;
    lineNo: number;
    customerNo?: string | null;
    itemNo?: string | null;
    description?: string | null;
    locationCode?: string | null;
    quantity?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: boolean;
    importBatchId: number;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BcShipmentLineUpdateManyMutationInput = {
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    documentNo?: Prisma.StringFieldUpdateOperationsInput | string;
    lineNo?: Prisma.IntFieldUpdateOperationsInput | number;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentLineUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    sourceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    documentNo?: Prisma.StringFieldUpdateOperationsInput | string;
    lineNo?: Prisma.IntFieldUpdateOperationsInput | number;
    customerNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    locationCode?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    quantity?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    missingFromImport?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    importBatchId?: Prisma.IntFieldUpdateOperationsInput | number;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BcShipmentLineCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    documentNo?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentLineAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcShipmentLineMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    documentNo?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentLineMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    sourceKey?: Prisma.SortOrder;
    documentNo?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    customerNo?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    locationCode?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    missingFromImport?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BcShipmentLineSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    lineNo?: Prisma.SortOrder;
    quantity?: Prisma.SortOrder;
    importBatchId?: Prisma.SortOrder;
};
export type BcShipmentLineSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    documentNo?: boolean;
    lineNo?: boolean;
    customerNo?: boolean;
    itemNo?: boolean;
    description?: boolean;
    locationCode?: boolean;
    quantity?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["bcShipmentLine"]>;
export type BcShipmentLineSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    documentNo?: boolean;
    lineNo?: boolean;
    customerNo?: boolean;
    itemNo?: boolean;
    description?: boolean;
    locationCode?: boolean;
    quantity?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["bcShipmentLine"]>;
export type BcShipmentLineSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    sourceKey?: boolean;
    documentNo?: boolean;
    lineNo?: boolean;
    customerNo?: boolean;
    itemNo?: boolean;
    description?: boolean;
    locationCode?: boolean;
    quantity?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["bcShipmentLine"]>;
export type BcShipmentLineSelectScalar = {
    id?: boolean;
    sourceKey?: boolean;
    documentNo?: boolean;
    lineNo?: boolean;
    customerNo?: boolean;
    itemNo?: boolean;
    description?: boolean;
    locationCode?: boolean;
    quantity?: boolean;
    missingFromImport?: boolean;
    importBatchId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BcShipmentLineOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "sourceKey" | "documentNo" | "lineNo" | "customerNo" | "itemNo" | "description" | "locationCode" | "quantity" | "missingFromImport" | "importBatchId" | "createdAt" | "updatedAt", ExtArgs["result"]["bcShipmentLine"]>;
export type $BcShipmentLinePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BcShipmentLine";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        sourceKey: string;
        documentNo: string;
        lineNo: number;
        customerNo: string | null;
        itemNo: string | null;
        description: string | null;
        locationCode: string | null;
        quantity: runtime.Decimal | null;
        missingFromImport: boolean;
        importBatchId: number;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["bcShipmentLine"]>;
    composites: {};
};
export type BcShipmentLineGetPayload<S extends boolean | null | undefined | BcShipmentLineDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload, S>;
export type BcShipmentLineCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BcShipmentLineFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BcShipmentLineCountAggregateInputType | true;
};
export interface BcShipmentLineDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BcShipmentLine'];
        meta: {
            name: 'BcShipmentLine';
        };
    };
    findUnique<T extends BcShipmentLineFindUniqueArgs>(args: Prisma.SelectSubset<T, BcShipmentLineFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BcShipmentLineFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BcShipmentLineFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BcShipmentLineFindFirstArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineFindFirstArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BcShipmentLineFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BcShipmentLineFindManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BcShipmentLineCreateArgs>(args: Prisma.SelectSubset<T, BcShipmentLineCreateArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BcShipmentLineCreateManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BcShipmentLineCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BcShipmentLineDeleteArgs>(args: Prisma.SelectSubset<T, BcShipmentLineDeleteArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BcShipmentLineUpdateArgs>(args: Prisma.SelectSubset<T, BcShipmentLineUpdateArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BcShipmentLineDeleteManyArgs>(args?: Prisma.SelectSubset<T, BcShipmentLineDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BcShipmentLineUpdateManyArgs>(args: Prisma.SelectSubset<T, BcShipmentLineUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BcShipmentLineUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BcShipmentLineUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BcShipmentLineUpsertArgs>(args: Prisma.SelectSubset<T, BcShipmentLineUpsertArgs<ExtArgs>>): Prisma.Prisma__BcShipmentLineClient<runtime.Types.Result.GetResult<Prisma.$BcShipmentLinePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BcShipmentLineCountArgs>(args?: Prisma.Subset<T, BcShipmentLineCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BcShipmentLineCountAggregateOutputType> : number>;
    aggregate<T extends BcShipmentLineAggregateArgs>(args: Prisma.Subset<T, BcShipmentLineAggregateArgs>): Prisma.PrismaPromise<GetBcShipmentLineAggregateType<T>>;
    groupBy<T extends BcShipmentLineGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BcShipmentLineGroupByArgs['orderBy'];
    } : {
        orderBy?: BcShipmentLineGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BcShipmentLineGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBcShipmentLineGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BcShipmentLineFieldRefs;
}
export interface Prisma__BcShipmentLineClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BcShipmentLineFieldRefs {
    readonly id: Prisma.FieldRef<"BcShipmentLine", 'Int'>;
    readonly sourceKey: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly documentNo: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly lineNo: Prisma.FieldRef<"BcShipmentLine", 'Int'>;
    readonly customerNo: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly itemNo: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly description: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly locationCode: Prisma.FieldRef<"BcShipmentLine", 'String'>;
    readonly quantity: Prisma.FieldRef<"BcShipmentLine", 'Decimal'>;
    readonly missingFromImport: Prisma.FieldRef<"BcShipmentLine", 'Boolean'>;
    readonly importBatchId: Prisma.FieldRef<"BcShipmentLine", 'Int'>;
    readonly createdAt: Prisma.FieldRef<"BcShipmentLine", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"BcShipmentLine", 'DateTime'>;
}
export type BcShipmentLineFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where: Prisma.BcShipmentLineWhereUniqueInput;
};
export type BcShipmentLineFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where: Prisma.BcShipmentLineWhereUniqueInput;
};
export type BcShipmentLineFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where?: Prisma.BcShipmentLineWhereInput;
    orderBy?: Prisma.BcShipmentLineOrderByWithRelationInput | Prisma.BcShipmentLineOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentLineScalarFieldEnum | Prisma.BcShipmentLineScalarFieldEnum[];
};
export type BcShipmentLineFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where?: Prisma.BcShipmentLineWhereInput;
    orderBy?: Prisma.BcShipmentLineOrderByWithRelationInput | Prisma.BcShipmentLineOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentLineScalarFieldEnum | Prisma.BcShipmentLineScalarFieldEnum[];
};
export type BcShipmentLineFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where?: Prisma.BcShipmentLineWhereInput;
    orderBy?: Prisma.BcShipmentLineOrderByWithRelationInput | Prisma.BcShipmentLineOrderByWithRelationInput[];
    cursor?: Prisma.BcShipmentLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcShipmentLineScalarFieldEnum | Prisma.BcShipmentLineScalarFieldEnum[];
};
export type BcShipmentLineCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentLineCreateInput, Prisma.BcShipmentLineUncheckedCreateInput>;
};
export type BcShipmentLineCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BcShipmentLineCreateManyInput | Prisma.BcShipmentLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentLineCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    data: Prisma.BcShipmentLineCreateManyInput | Prisma.BcShipmentLineCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BcShipmentLineUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentLineUpdateInput, Prisma.BcShipmentLineUncheckedUpdateInput>;
    where: Prisma.BcShipmentLineWhereUniqueInput;
};
export type BcShipmentLineUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BcShipmentLineUpdateManyMutationInput, Prisma.BcShipmentLineUncheckedUpdateManyInput>;
    where?: Prisma.BcShipmentLineWhereInput;
    limit?: number;
};
export type BcShipmentLineUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BcShipmentLineUpdateManyMutationInput, Prisma.BcShipmentLineUncheckedUpdateManyInput>;
    where?: Prisma.BcShipmentLineWhereInput;
    limit?: number;
};
export type BcShipmentLineUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where: Prisma.BcShipmentLineWhereUniqueInput;
    create: Prisma.XOR<Prisma.BcShipmentLineCreateInput, Prisma.BcShipmentLineUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BcShipmentLineUpdateInput, Prisma.BcShipmentLineUncheckedUpdateInput>;
};
export type BcShipmentLineDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
    where: Prisma.BcShipmentLineWhereUniqueInput;
};
export type BcShipmentLineDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcShipmentLineWhereInput;
    limit?: number;
};
export type BcShipmentLineDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcShipmentLineSelect<ExtArgs> | null;
    omit?: Prisma.BcShipmentLineOmit<ExtArgs> | null;
};
//# sourceMappingURL=BcShipmentLine.d.ts.map