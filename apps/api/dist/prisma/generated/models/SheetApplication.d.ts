import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SheetApplicationModel = runtime.Types.Result.DefaultSelection<Prisma.$SheetApplicationPayload>;
export type AggregateSheetApplication = {
    _count: SheetApplicationCountAggregateOutputType | null;
    _avg: SheetApplicationAvgAggregateOutputType | null;
    _sum: SheetApplicationSumAggregateOutputType | null;
    _min: SheetApplicationMinAggregateOutputType | null;
    _max: SheetApplicationMaxAggregateOutputType | null;
};
export type SheetApplicationAvgAggregateOutputType = {
    id: number | null;
    occurrence: number | null;
    lineId: number | null;
    rowQty: number | null;
    appliedQty: number | null;
};
export type SheetApplicationSumAggregateOutputType = {
    id: number | null;
    occurrence: number | null;
    lineId: number | null;
    rowQty: number | null;
    appliedQty: number | null;
};
export type SheetApplicationMinAggregateOutputType = {
    id: number | null;
    referenceKey: string | null;
    occurrence: number | null;
    kind: $Enums.SheetApplicationKind | null;
    branchCode: string | null;
    lineId: number | null;
    rowDate: Date | null;
    rowQty: number | null;
    appliedQty: number | null;
    status: $Enums.SheetApplicationStatus | null;
    note: string | null;
    reason: string | null;
    decidedBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SheetApplicationMaxAggregateOutputType = {
    id: number | null;
    referenceKey: string | null;
    occurrence: number | null;
    kind: $Enums.SheetApplicationKind | null;
    branchCode: string | null;
    lineId: number | null;
    rowDate: Date | null;
    rowQty: number | null;
    appliedQty: number | null;
    status: $Enums.SheetApplicationStatus | null;
    note: string | null;
    reason: string | null;
    decidedBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SheetApplicationCountAggregateOutputType = {
    id: number;
    referenceKey: number;
    occurrence: number;
    kind: number;
    branchCode: number;
    lineId: number;
    rowDate: number;
    rowQty: number;
    appliedQty: number;
    status: number;
    note: number;
    reason: number;
    decidedBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SheetApplicationAvgAggregateInputType = {
    id?: true;
    occurrence?: true;
    lineId?: true;
    rowQty?: true;
    appliedQty?: true;
};
export type SheetApplicationSumAggregateInputType = {
    id?: true;
    occurrence?: true;
    lineId?: true;
    rowQty?: true;
    appliedQty?: true;
};
export type SheetApplicationMinAggregateInputType = {
    id?: true;
    referenceKey?: true;
    occurrence?: true;
    kind?: true;
    branchCode?: true;
    lineId?: true;
    rowDate?: true;
    rowQty?: true;
    appliedQty?: true;
    status?: true;
    note?: true;
    reason?: true;
    decidedBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SheetApplicationMaxAggregateInputType = {
    id?: true;
    referenceKey?: true;
    occurrence?: true;
    kind?: true;
    branchCode?: true;
    lineId?: true;
    rowDate?: true;
    rowQty?: true;
    appliedQty?: true;
    status?: true;
    note?: true;
    reason?: true;
    decidedBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SheetApplicationCountAggregateInputType = {
    id?: true;
    referenceKey?: true;
    occurrence?: true;
    kind?: true;
    branchCode?: true;
    lineId?: true;
    rowDate?: true;
    rowQty?: true;
    appliedQty?: true;
    status?: true;
    note?: true;
    reason?: true;
    decidedBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SheetApplicationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetApplicationWhereInput;
    orderBy?: Prisma.SheetApplicationOrderByWithRelationInput | Prisma.SheetApplicationOrderByWithRelationInput[];
    cursor?: Prisma.SheetApplicationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SheetApplicationCountAggregateInputType;
    _avg?: SheetApplicationAvgAggregateInputType;
    _sum?: SheetApplicationSumAggregateInputType;
    _min?: SheetApplicationMinAggregateInputType;
    _max?: SheetApplicationMaxAggregateInputType;
};
export type GetSheetApplicationAggregateType<T extends SheetApplicationAggregateArgs> = {
    [P in keyof T & keyof AggregateSheetApplication]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSheetApplication[P]> : Prisma.GetScalarType<T[P], AggregateSheetApplication[P]>;
};
export type SheetApplicationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetApplicationWhereInput;
    orderBy?: Prisma.SheetApplicationOrderByWithAggregationInput | Prisma.SheetApplicationOrderByWithAggregationInput[];
    by: Prisma.SheetApplicationScalarFieldEnum[] | Prisma.SheetApplicationScalarFieldEnum;
    having?: Prisma.SheetApplicationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SheetApplicationCountAggregateInputType | true;
    _avg?: SheetApplicationAvgAggregateInputType;
    _sum?: SheetApplicationSumAggregateInputType;
    _min?: SheetApplicationMinAggregateInputType;
    _max?: SheetApplicationMaxAggregateInputType;
};
export type SheetApplicationGroupByOutputType = {
    id: number;
    referenceKey: string;
    occurrence: number;
    kind: $Enums.SheetApplicationKind;
    branchCode: string;
    lineId: number | null;
    rowDate: Date | null;
    rowQty: number;
    appliedQty: number;
    status: $Enums.SheetApplicationStatus;
    note: string | null;
    reason: string | null;
    decidedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: SheetApplicationCountAggregateOutputType | null;
    _avg: SheetApplicationAvgAggregateOutputType | null;
    _sum: SheetApplicationSumAggregateOutputType | null;
    _min: SheetApplicationMinAggregateOutputType | null;
    _max: SheetApplicationMaxAggregateOutputType | null;
};
export type GetSheetApplicationGroupByPayload<T extends SheetApplicationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SheetApplicationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SheetApplicationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SheetApplicationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SheetApplicationGroupByOutputType[P]>;
}>>;
export type SheetApplicationWhereInput = {
    AND?: Prisma.SheetApplicationWhereInput | Prisma.SheetApplicationWhereInput[];
    OR?: Prisma.SheetApplicationWhereInput[];
    NOT?: Prisma.SheetApplicationWhereInput | Prisma.SheetApplicationWhereInput[];
    id?: Prisma.IntFilter<"SheetApplication"> | number;
    referenceKey?: Prisma.StringFilter<"SheetApplication"> | string;
    occurrence?: Prisma.IntFilter<"SheetApplication"> | number;
    kind?: Prisma.EnumSheetApplicationKindFilter<"SheetApplication"> | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFilter<"SheetApplication"> | string;
    lineId?: Prisma.IntNullableFilter<"SheetApplication"> | number | null;
    rowDate?: Prisma.DateTimeNullableFilter<"SheetApplication"> | Date | string | null;
    rowQty?: Prisma.IntFilter<"SheetApplication"> | number;
    appliedQty?: Prisma.IntFilter<"SheetApplication"> | number;
    status?: Prisma.EnumSheetApplicationStatusFilter<"SheetApplication"> | $Enums.SheetApplicationStatus;
    note?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    reason?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    decidedBy?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"SheetApplication"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SheetApplication"> | Date | string;
};
export type SheetApplicationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    referenceKey?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    lineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    rowDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SheetApplicationWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    kind_referenceKey_occurrence?: Prisma.SheetApplicationKindReferenceKeyOccurrenceCompoundUniqueInput;
    AND?: Prisma.SheetApplicationWhereInput | Prisma.SheetApplicationWhereInput[];
    OR?: Prisma.SheetApplicationWhereInput[];
    NOT?: Prisma.SheetApplicationWhereInput | Prisma.SheetApplicationWhereInput[];
    referenceKey?: Prisma.StringFilter<"SheetApplication"> | string;
    occurrence?: Prisma.IntFilter<"SheetApplication"> | number;
    kind?: Prisma.EnumSheetApplicationKindFilter<"SheetApplication"> | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFilter<"SheetApplication"> | string;
    lineId?: Prisma.IntNullableFilter<"SheetApplication"> | number | null;
    rowDate?: Prisma.DateTimeNullableFilter<"SheetApplication"> | Date | string | null;
    rowQty?: Prisma.IntFilter<"SheetApplication"> | number;
    appliedQty?: Prisma.IntFilter<"SheetApplication"> | number;
    status?: Prisma.EnumSheetApplicationStatusFilter<"SheetApplication"> | $Enums.SheetApplicationStatus;
    note?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    reason?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    decidedBy?: Prisma.StringNullableFilter<"SheetApplication"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"SheetApplication"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SheetApplication"> | Date | string;
}, "id" | "kind_referenceKey_occurrence">;
export type SheetApplicationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    referenceKey?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    lineId?: Prisma.SortOrderInput | Prisma.SortOrder;
    rowDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SheetApplicationCountOrderByAggregateInput;
    _avg?: Prisma.SheetApplicationAvgOrderByAggregateInput;
    _max?: Prisma.SheetApplicationMaxOrderByAggregateInput;
    _min?: Prisma.SheetApplicationMinOrderByAggregateInput;
    _sum?: Prisma.SheetApplicationSumOrderByAggregateInput;
};
export type SheetApplicationScalarWhereWithAggregatesInput = {
    AND?: Prisma.SheetApplicationScalarWhereWithAggregatesInput | Prisma.SheetApplicationScalarWhereWithAggregatesInput[];
    OR?: Prisma.SheetApplicationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SheetApplicationScalarWhereWithAggregatesInput | Prisma.SheetApplicationScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SheetApplication"> | number;
    referenceKey?: Prisma.StringWithAggregatesFilter<"SheetApplication"> | string;
    occurrence?: Prisma.IntWithAggregatesFilter<"SheetApplication"> | number;
    kind?: Prisma.EnumSheetApplicationKindWithAggregatesFilter<"SheetApplication"> | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringWithAggregatesFilter<"SheetApplication"> | string;
    lineId?: Prisma.IntNullableWithAggregatesFilter<"SheetApplication"> | number | null;
    rowDate?: Prisma.DateTimeNullableWithAggregatesFilter<"SheetApplication"> | Date | string | null;
    rowQty?: Prisma.IntWithAggregatesFilter<"SheetApplication"> | number;
    appliedQty?: Prisma.IntWithAggregatesFilter<"SheetApplication"> | number;
    status?: Prisma.EnumSheetApplicationStatusWithAggregatesFilter<"SheetApplication"> | $Enums.SheetApplicationStatus;
    note?: Prisma.StringNullableWithAggregatesFilter<"SheetApplication"> | string | null;
    reason?: Prisma.StringNullableWithAggregatesFilter<"SheetApplication"> | string | null;
    decidedBy?: Prisma.StringNullableWithAggregatesFilter<"SheetApplication"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SheetApplication"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SheetApplication"> | Date | string;
};
export type SheetApplicationCreateInput = {
    referenceKey: string;
    occurrence?: number;
    kind: $Enums.SheetApplicationKind;
    branchCode: string;
    lineId?: number | null;
    rowDate?: Date | string | null;
    rowQty: number;
    appliedQty?: number;
    status?: $Enums.SheetApplicationStatus;
    note?: string | null;
    reason?: string | null;
    decidedBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SheetApplicationUncheckedCreateInput = {
    id?: number;
    referenceKey: string;
    occurrence?: number;
    kind: $Enums.SheetApplicationKind;
    branchCode: string;
    lineId?: number | null;
    rowDate?: Date | string | null;
    rowQty: number;
    appliedQty?: number;
    status?: $Enums.SheetApplicationStatus;
    note?: string | null;
    reason?: string | null;
    decidedBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SheetApplicationUpdateInput = {
    referenceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    occurrence?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumSheetApplicationKindFieldUpdateOperationsInput | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    rowDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rowQty?: Prisma.IntFieldUpdateOperationsInput | number;
    appliedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSheetApplicationStatusFieldUpdateOperationsInput | $Enums.SheetApplicationStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SheetApplicationUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    referenceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    occurrence?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumSheetApplicationKindFieldUpdateOperationsInput | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    rowDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rowQty?: Prisma.IntFieldUpdateOperationsInput | number;
    appliedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSheetApplicationStatusFieldUpdateOperationsInput | $Enums.SheetApplicationStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SheetApplicationCreateManyInput = {
    id?: number;
    referenceKey: string;
    occurrence?: number;
    kind: $Enums.SheetApplicationKind;
    branchCode: string;
    lineId?: number | null;
    rowDate?: Date | string | null;
    rowQty: number;
    appliedQty?: number;
    status?: $Enums.SheetApplicationStatus;
    note?: string | null;
    reason?: string | null;
    decidedBy?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SheetApplicationUpdateManyMutationInput = {
    referenceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    occurrence?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumSheetApplicationKindFieldUpdateOperationsInput | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    rowDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rowQty?: Prisma.IntFieldUpdateOperationsInput | number;
    appliedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSheetApplicationStatusFieldUpdateOperationsInput | $Enums.SheetApplicationStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SheetApplicationUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    referenceKey?: Prisma.StringFieldUpdateOperationsInput | string;
    occurrence?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumSheetApplicationKindFieldUpdateOperationsInput | $Enums.SheetApplicationKind;
    branchCode?: Prisma.StringFieldUpdateOperationsInput | string;
    lineId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    rowDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rowQty?: Prisma.IntFieldUpdateOperationsInput | number;
    appliedQty?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumSheetApplicationStatusFieldUpdateOperationsInput | $Enums.SheetApplicationStatus;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    reason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SheetApplicationKindReferenceKeyOccurrenceCompoundUniqueInput = {
    kind: $Enums.SheetApplicationKind;
    referenceKey: string;
    occurrence: number;
};
export type SheetApplicationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    referenceKey?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    rowDate?: Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    decidedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SheetApplicationAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
};
export type SheetApplicationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    referenceKey?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    rowDate?: Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    decidedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SheetApplicationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    referenceKey?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    branchCode?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    rowDate?: Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    decidedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SheetApplicationSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    occurrence?: Prisma.SortOrder;
    lineId?: Prisma.SortOrder;
    rowQty?: Prisma.SortOrder;
    appliedQty?: Prisma.SortOrder;
};
export type EnumSheetApplicationKindFieldUpdateOperationsInput = {
    set?: $Enums.SheetApplicationKind;
};
export type EnumSheetApplicationStatusFieldUpdateOperationsInput = {
    set?: $Enums.SheetApplicationStatus;
};
export type SheetApplicationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    referenceKey?: boolean;
    occurrence?: boolean;
    kind?: boolean;
    branchCode?: boolean;
    lineId?: boolean;
    rowDate?: boolean;
    rowQty?: boolean;
    appliedQty?: boolean;
    status?: boolean;
    note?: boolean;
    reason?: boolean;
    decidedBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["sheetApplication"]>;
export type SheetApplicationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    referenceKey?: boolean;
    occurrence?: boolean;
    kind?: boolean;
    branchCode?: boolean;
    lineId?: boolean;
    rowDate?: boolean;
    rowQty?: boolean;
    appliedQty?: boolean;
    status?: boolean;
    note?: boolean;
    reason?: boolean;
    decidedBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["sheetApplication"]>;
export type SheetApplicationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    referenceKey?: boolean;
    occurrence?: boolean;
    kind?: boolean;
    branchCode?: boolean;
    lineId?: boolean;
    rowDate?: boolean;
    rowQty?: boolean;
    appliedQty?: boolean;
    status?: boolean;
    note?: boolean;
    reason?: boolean;
    decidedBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["sheetApplication"]>;
export type SheetApplicationSelectScalar = {
    id?: boolean;
    referenceKey?: boolean;
    occurrence?: boolean;
    kind?: boolean;
    branchCode?: boolean;
    lineId?: boolean;
    rowDate?: boolean;
    rowQty?: boolean;
    appliedQty?: boolean;
    status?: boolean;
    note?: boolean;
    reason?: boolean;
    decidedBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SheetApplicationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "referenceKey" | "occurrence" | "kind" | "branchCode" | "lineId" | "rowDate" | "rowQty" | "appliedQty" | "status" | "note" | "reason" | "decidedBy" | "createdAt" | "updatedAt", ExtArgs["result"]["sheetApplication"]>;
export type $SheetApplicationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SheetApplication";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        referenceKey: string;
        occurrence: number;
        kind: $Enums.SheetApplicationKind;
        branchCode: string;
        lineId: number | null;
        rowDate: Date | null;
        rowQty: number;
        appliedQty: number;
        status: $Enums.SheetApplicationStatus;
        note: string | null;
        reason: string | null;
        decidedBy: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["sheetApplication"]>;
    composites: {};
};
export type SheetApplicationGetPayload<S extends boolean | null | undefined | SheetApplicationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload, S>;
export type SheetApplicationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SheetApplicationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SheetApplicationCountAggregateInputType | true;
};
export interface SheetApplicationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SheetApplication'];
        meta: {
            name: 'SheetApplication';
        };
    };
    findUnique<T extends SheetApplicationFindUniqueArgs>(args: Prisma.SelectSubset<T, SheetApplicationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SheetApplicationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SheetApplicationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SheetApplicationFindFirstArgs>(args?: Prisma.SelectSubset<T, SheetApplicationFindFirstArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SheetApplicationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SheetApplicationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SheetApplicationFindManyArgs>(args?: Prisma.SelectSubset<T, SheetApplicationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SheetApplicationCreateArgs>(args: Prisma.SelectSubset<T, SheetApplicationCreateArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SheetApplicationCreateManyArgs>(args?: Prisma.SelectSubset<T, SheetApplicationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SheetApplicationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SheetApplicationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SheetApplicationDeleteArgs>(args: Prisma.SelectSubset<T, SheetApplicationDeleteArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SheetApplicationUpdateArgs>(args: Prisma.SelectSubset<T, SheetApplicationUpdateArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SheetApplicationDeleteManyArgs>(args?: Prisma.SelectSubset<T, SheetApplicationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SheetApplicationUpdateManyArgs>(args: Prisma.SelectSubset<T, SheetApplicationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SheetApplicationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SheetApplicationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SheetApplicationUpsertArgs>(args: Prisma.SelectSubset<T, SheetApplicationUpsertArgs<ExtArgs>>): Prisma.Prisma__SheetApplicationClient<runtime.Types.Result.GetResult<Prisma.$SheetApplicationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SheetApplicationCountArgs>(args?: Prisma.Subset<T, SheetApplicationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SheetApplicationCountAggregateOutputType> : number>;
    aggregate<T extends SheetApplicationAggregateArgs>(args: Prisma.Subset<T, SheetApplicationAggregateArgs>): Prisma.PrismaPromise<GetSheetApplicationAggregateType<T>>;
    groupBy<T extends SheetApplicationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SheetApplicationGroupByArgs['orderBy'];
    } : {
        orderBy?: SheetApplicationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SheetApplicationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSheetApplicationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SheetApplicationFieldRefs;
}
export interface Prisma__SheetApplicationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SheetApplicationFieldRefs {
    readonly id: Prisma.FieldRef<"SheetApplication", 'Int'>;
    readonly referenceKey: Prisma.FieldRef<"SheetApplication", 'String'>;
    readonly occurrence: Prisma.FieldRef<"SheetApplication", 'Int'>;
    readonly kind: Prisma.FieldRef<"SheetApplication", 'SheetApplicationKind'>;
    readonly branchCode: Prisma.FieldRef<"SheetApplication", 'String'>;
    readonly lineId: Prisma.FieldRef<"SheetApplication", 'Int'>;
    readonly rowDate: Prisma.FieldRef<"SheetApplication", 'DateTime'>;
    readonly rowQty: Prisma.FieldRef<"SheetApplication", 'Int'>;
    readonly appliedQty: Prisma.FieldRef<"SheetApplication", 'Int'>;
    readonly status: Prisma.FieldRef<"SheetApplication", 'SheetApplicationStatus'>;
    readonly note: Prisma.FieldRef<"SheetApplication", 'String'>;
    readonly reason: Prisma.FieldRef<"SheetApplication", 'String'>;
    readonly decidedBy: Prisma.FieldRef<"SheetApplication", 'String'>;
    readonly createdAt: Prisma.FieldRef<"SheetApplication", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"SheetApplication", 'DateTime'>;
}
export type SheetApplicationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where: Prisma.SheetApplicationWhereUniqueInput;
};
export type SheetApplicationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where: Prisma.SheetApplicationWhereUniqueInput;
};
export type SheetApplicationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where?: Prisma.SheetApplicationWhereInput;
    orderBy?: Prisma.SheetApplicationOrderByWithRelationInput | Prisma.SheetApplicationOrderByWithRelationInput[];
    cursor?: Prisma.SheetApplicationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetApplicationScalarFieldEnum | Prisma.SheetApplicationScalarFieldEnum[];
};
export type SheetApplicationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where?: Prisma.SheetApplicationWhereInput;
    orderBy?: Prisma.SheetApplicationOrderByWithRelationInput | Prisma.SheetApplicationOrderByWithRelationInput[];
    cursor?: Prisma.SheetApplicationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetApplicationScalarFieldEnum | Prisma.SheetApplicationScalarFieldEnum[];
};
export type SheetApplicationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where?: Prisma.SheetApplicationWhereInput;
    orderBy?: Prisma.SheetApplicationOrderByWithRelationInput | Prisma.SheetApplicationOrderByWithRelationInput[];
    cursor?: Prisma.SheetApplicationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetApplicationScalarFieldEnum | Prisma.SheetApplicationScalarFieldEnum[];
};
export type SheetApplicationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetApplicationCreateInput, Prisma.SheetApplicationUncheckedCreateInput>;
};
export type SheetApplicationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SheetApplicationCreateManyInput | Prisma.SheetApplicationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SheetApplicationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    data: Prisma.SheetApplicationCreateManyInput | Prisma.SheetApplicationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SheetApplicationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetApplicationUpdateInput, Prisma.SheetApplicationUncheckedUpdateInput>;
    where: Prisma.SheetApplicationWhereUniqueInput;
};
export type SheetApplicationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SheetApplicationUpdateManyMutationInput, Prisma.SheetApplicationUncheckedUpdateManyInput>;
    where?: Prisma.SheetApplicationWhereInput;
    limit?: number;
};
export type SheetApplicationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetApplicationUpdateManyMutationInput, Prisma.SheetApplicationUncheckedUpdateManyInput>;
    where?: Prisma.SheetApplicationWhereInput;
    limit?: number;
};
export type SheetApplicationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where: Prisma.SheetApplicationWhereUniqueInput;
    create: Prisma.XOR<Prisma.SheetApplicationCreateInput, Prisma.SheetApplicationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SheetApplicationUpdateInput, Prisma.SheetApplicationUncheckedUpdateInput>;
};
export type SheetApplicationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
    where: Prisma.SheetApplicationWhereUniqueInput;
};
export type SheetApplicationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetApplicationWhereInput;
    limit?: number;
};
export type SheetApplicationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetApplicationSelect<ExtArgs> | null;
    omit?: Prisma.SheetApplicationOmit<ExtArgs> | null;
};
//# sourceMappingURL=SheetApplication.d.ts.map