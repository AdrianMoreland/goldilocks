import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type StocktakeDiscrepancyModel = runtime.Types.Result.DefaultSelection<Prisma.$StocktakeDiscrepancyPayload>;
export type AggregateStocktakeDiscrepancy = {
    _count: StocktakeDiscrepancyCountAggregateOutputType | null;
    _avg: StocktakeDiscrepancyAvgAggregateOutputType | null;
    _sum: StocktakeDiscrepancySumAggregateOutputType | null;
    _min: StocktakeDiscrepancyMinAggregateOutputType | null;
    _max: StocktakeDiscrepancyMaxAggregateOutputType | null;
};
export type StocktakeDiscrepancyAvgAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
};
export type StocktakeDiscrepancySumAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
};
export type StocktakeDiscrepancyMinAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    itemNo: string | null;
    description: string | null;
    issueType: $Enums.DiscrepancyIssueType | null;
    bcShows: string | null;
    physicalFound: string | null;
    serialNo: string | null;
    action: string | null;
    resolved: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StocktakeDiscrepancyMaxAggregateOutputType = {
    id: number | null;
    stocktakeId: number | null;
    itemNo: string | null;
    description: string | null;
    issueType: $Enums.DiscrepancyIssueType | null;
    bcShows: string | null;
    physicalFound: string | null;
    serialNo: string | null;
    action: string | null;
    resolved: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type StocktakeDiscrepancyCountAggregateOutputType = {
    id: number;
    stocktakeId: number;
    itemNo: number;
    description: number;
    issueType: number;
    bcShows: number;
    physicalFound: number;
    serialNo: number;
    action: number;
    resolved: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type StocktakeDiscrepancyAvgAggregateInputType = {
    id?: true;
    stocktakeId?: true;
};
export type StocktakeDiscrepancySumAggregateInputType = {
    id?: true;
    stocktakeId?: true;
};
export type StocktakeDiscrepancyMinAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    itemNo?: true;
    description?: true;
    issueType?: true;
    bcShows?: true;
    physicalFound?: true;
    serialNo?: true;
    action?: true;
    resolved?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StocktakeDiscrepancyMaxAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    itemNo?: true;
    description?: true;
    issueType?: true;
    bcShows?: true;
    physicalFound?: true;
    serialNo?: true;
    action?: true;
    resolved?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type StocktakeDiscrepancyCountAggregateInputType = {
    id?: true;
    stocktakeId?: true;
    itemNo?: true;
    description?: true;
    issueType?: true;
    bcShows?: true;
    physicalFound?: true;
    serialNo?: true;
    action?: true;
    resolved?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type StocktakeDiscrepancyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithRelationInput | Prisma.StocktakeDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | StocktakeDiscrepancyCountAggregateInputType;
    _avg?: StocktakeDiscrepancyAvgAggregateInputType;
    _sum?: StocktakeDiscrepancySumAggregateInputType;
    _min?: StocktakeDiscrepancyMinAggregateInputType;
    _max?: StocktakeDiscrepancyMaxAggregateInputType;
};
export type GetStocktakeDiscrepancyAggregateType<T extends StocktakeDiscrepancyAggregateArgs> = {
    [P in keyof T & keyof AggregateStocktakeDiscrepancy]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateStocktakeDiscrepancy[P]> : Prisma.GetScalarType<T[P], AggregateStocktakeDiscrepancy[P]>;
};
export type StocktakeDiscrepancyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithAggregationInput | Prisma.StocktakeDiscrepancyOrderByWithAggregationInput[];
    by: Prisma.StocktakeDiscrepancyScalarFieldEnum[] | Prisma.StocktakeDiscrepancyScalarFieldEnum;
    having?: Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: StocktakeDiscrepancyCountAggregateInputType | true;
    _avg?: StocktakeDiscrepancyAvgAggregateInputType;
    _sum?: StocktakeDiscrepancySumAggregateInputType;
    _min?: StocktakeDiscrepancyMinAggregateInputType;
    _max?: StocktakeDiscrepancyMaxAggregateInputType;
};
export type StocktakeDiscrepancyGroupByOutputType = {
    id: number;
    stocktakeId: number;
    itemNo: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows: string;
    physicalFound: string;
    serialNo: string | null;
    action: string;
    resolved: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    _count: StocktakeDiscrepancyCountAggregateOutputType | null;
    _avg: StocktakeDiscrepancyAvgAggregateOutputType | null;
    _sum: StocktakeDiscrepancySumAggregateOutputType | null;
    _min: StocktakeDiscrepancyMinAggregateOutputType | null;
    _max: StocktakeDiscrepancyMaxAggregateOutputType | null;
};
export type GetStocktakeDiscrepancyGroupByPayload<T extends StocktakeDiscrepancyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<StocktakeDiscrepancyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof StocktakeDiscrepancyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], StocktakeDiscrepancyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], StocktakeDiscrepancyGroupByOutputType[P]>;
}>>;
export type StocktakeDiscrepancyWhereInput = {
    AND?: Prisma.StocktakeDiscrepancyWhereInput | Prisma.StocktakeDiscrepancyWhereInput[];
    OR?: Prisma.StocktakeDiscrepancyWhereInput[];
    NOT?: Prisma.StocktakeDiscrepancyWhereInput | Prisma.StocktakeDiscrepancyWhereInput[];
    id?: Prisma.IntFilter<"StocktakeDiscrepancy"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeDiscrepancy"> | number;
    itemNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    description?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFilter<"StocktakeDiscrepancy"> | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    physicalFound?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    serialNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    action?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    resolved?: Prisma.BoolFilter<"StocktakeDiscrepancy"> | boolean;
    createdBy?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    createdAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
};
export type StocktakeDiscrepancyOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrder;
    issueType?: Prisma.SortOrder;
    bcShows?: Prisma.SortOrder;
    physicalFound?: Prisma.SortOrder;
    serialNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    action?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    stocktake?: Prisma.StocktakeOrderByWithRelationInput;
};
export type StocktakeDiscrepancyWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.StocktakeDiscrepancyWhereInput | Prisma.StocktakeDiscrepancyWhereInput[];
    OR?: Prisma.StocktakeDiscrepancyWhereInput[];
    NOT?: Prisma.StocktakeDiscrepancyWhereInput | Prisma.StocktakeDiscrepancyWhereInput[];
    stocktakeId?: Prisma.IntFilter<"StocktakeDiscrepancy"> | number;
    itemNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    description?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFilter<"StocktakeDiscrepancy"> | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    physicalFound?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    serialNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    action?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    resolved?: Prisma.BoolFilter<"StocktakeDiscrepancy"> | boolean;
    createdBy?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    createdAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
    stocktake?: Prisma.XOR<Prisma.StocktakeScalarRelationFilter, Prisma.StocktakeWhereInput>;
}, "id">;
export type StocktakeDiscrepancyOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    description?: Prisma.SortOrder;
    issueType?: Prisma.SortOrder;
    bcShows?: Prisma.SortOrder;
    physicalFound?: Prisma.SortOrder;
    serialNo?: Prisma.SortOrderInput | Prisma.SortOrder;
    action?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.StocktakeDiscrepancyCountOrderByAggregateInput;
    _avg?: Prisma.StocktakeDiscrepancyAvgOrderByAggregateInput;
    _max?: Prisma.StocktakeDiscrepancyMaxOrderByAggregateInput;
    _min?: Prisma.StocktakeDiscrepancyMinOrderByAggregateInput;
    _sum?: Prisma.StocktakeDiscrepancySumOrderByAggregateInput;
};
export type StocktakeDiscrepancyScalarWhereWithAggregatesInput = {
    AND?: Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput | Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput[];
    OR?: Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput | Prisma.StocktakeDiscrepancyScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"StocktakeDiscrepancy"> | number;
    stocktakeId?: Prisma.IntWithAggregatesFilter<"StocktakeDiscrepancy"> | number;
    itemNo?: Prisma.StringNullableWithAggregatesFilter<"StocktakeDiscrepancy"> | string | null;
    description?: Prisma.StringWithAggregatesFilter<"StocktakeDiscrepancy"> | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeWithAggregatesFilter<"StocktakeDiscrepancy"> | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringWithAggregatesFilter<"StocktakeDiscrepancy"> | string;
    physicalFound?: Prisma.StringWithAggregatesFilter<"StocktakeDiscrepancy"> | string;
    serialNo?: Prisma.StringNullableWithAggregatesFilter<"StocktakeDiscrepancy"> | string | null;
    action?: Prisma.StringWithAggregatesFilter<"StocktakeDiscrepancy"> | string;
    resolved?: Prisma.BoolWithAggregatesFilter<"StocktakeDiscrepancy"> | boolean;
    createdBy?: Prisma.StringWithAggregatesFilter<"StocktakeDiscrepancy"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"StocktakeDiscrepancy"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"StocktakeDiscrepancy"> | Date | string;
};
export type StocktakeDiscrepancyCreateInput = {
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    stocktake: Prisma.StocktakeCreateNestedOneWithoutDiscrepanciesInput;
};
export type StocktakeDiscrepancyUncheckedCreateInput = {
    id?: number;
    stocktakeId: number;
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeDiscrepancyUpdateInput = {
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    stocktake?: Prisma.StocktakeUpdateOneRequiredWithoutDiscrepanciesNestedInput;
};
export type StocktakeDiscrepancyUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancyCreateManyInput = {
    id?: number;
    stocktakeId: number;
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeDiscrepancyUpdateManyMutationInput = {
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancyUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    stocktakeId?: Prisma.IntFieldUpdateOperationsInput | number;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancyListRelationFilter = {
    every?: Prisma.StocktakeDiscrepancyWhereInput;
    some?: Prisma.StocktakeDiscrepancyWhereInput;
    none?: Prisma.StocktakeDiscrepancyWhereInput;
};
export type StocktakeDiscrepancyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StocktakeDiscrepancyCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    issueType?: Prisma.SortOrder;
    bcShows?: Prisma.SortOrder;
    physicalFound?: Prisma.SortOrder;
    serialNo?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeDiscrepancyAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
};
export type StocktakeDiscrepancyMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    issueType?: Prisma.SortOrder;
    bcShows?: Prisma.SortOrder;
    physicalFound?: Prisma.SortOrder;
    serialNo?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeDiscrepancyMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
    itemNo?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    issueType?: Prisma.SortOrder;
    bcShows?: Prisma.SortOrder;
    physicalFound?: Prisma.SortOrder;
    serialNo?: Prisma.SortOrder;
    action?: Prisma.SortOrder;
    resolved?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type StocktakeDiscrepancySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    stocktakeId?: Prisma.SortOrder;
};
export type StocktakeDiscrepancyCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput[] | Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeDiscrepancyCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
};
export type StocktakeDiscrepancyUncheckedCreateNestedManyWithoutStocktakeInput = {
    create?: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput[] | Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeDiscrepancyCreateManyStocktakeInputEnvelope;
    connect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
};
export type StocktakeDiscrepancyUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput[] | Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeDiscrepancyUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeDiscrepancyCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    disconnect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    delete?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    connect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    update?: Prisma.StocktakeDiscrepancyUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeDiscrepancyUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeDiscrepancyScalarWhereInput | Prisma.StocktakeDiscrepancyScalarWhereInput[];
};
export type StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeNestedInput = {
    create?: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput> | Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput[] | Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput[];
    connectOrCreate?: Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput | Prisma.StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput[];
    upsert?: Prisma.StocktakeDiscrepancyUpsertWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpsertWithWhereUniqueWithoutStocktakeInput[];
    createMany?: Prisma.StocktakeDiscrepancyCreateManyStocktakeInputEnvelope;
    set?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    disconnect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    delete?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    connect?: Prisma.StocktakeDiscrepancyWhereUniqueInput | Prisma.StocktakeDiscrepancyWhereUniqueInput[];
    update?: Prisma.StocktakeDiscrepancyUpdateWithWhereUniqueWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpdateWithWhereUniqueWithoutStocktakeInput[];
    updateMany?: Prisma.StocktakeDiscrepancyUpdateManyWithWhereWithoutStocktakeInput | Prisma.StocktakeDiscrepancyUpdateManyWithWhereWithoutStocktakeInput[];
    deleteMany?: Prisma.StocktakeDiscrepancyScalarWhereInput | Prisma.StocktakeDiscrepancyScalarWhereInput[];
};
export type EnumDiscrepancyIssueTypeFieldUpdateOperationsInput = {
    set?: $Enums.DiscrepancyIssueType;
};
export type StocktakeDiscrepancyCreateWithoutStocktakeInput = {
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput = {
    id?: number;
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeDiscrepancyCreateOrConnectWithoutStocktakeInput = {
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeDiscrepancyCreateManyStocktakeInputEnvelope = {
    data: Prisma.StocktakeDiscrepancyCreateManyStocktakeInput | Prisma.StocktakeDiscrepancyCreateManyStocktakeInput[];
    skipDuplicates?: boolean;
};
export type StocktakeDiscrepancyUpsertWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    update: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedUpdateWithoutStocktakeInput>;
    create: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedCreateWithoutStocktakeInput>;
};
export type StocktakeDiscrepancyUpdateWithWhereUniqueWithoutStocktakeInput = {
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateWithoutStocktakeInput, Prisma.StocktakeDiscrepancyUncheckedUpdateWithoutStocktakeInput>;
};
export type StocktakeDiscrepancyUpdateManyWithWhereWithoutStocktakeInput = {
    where: Prisma.StocktakeDiscrepancyScalarWhereInput;
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateManyMutationInput, Prisma.StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeInput>;
};
export type StocktakeDiscrepancyScalarWhereInput = {
    AND?: Prisma.StocktakeDiscrepancyScalarWhereInput | Prisma.StocktakeDiscrepancyScalarWhereInput[];
    OR?: Prisma.StocktakeDiscrepancyScalarWhereInput[];
    NOT?: Prisma.StocktakeDiscrepancyScalarWhereInput | Prisma.StocktakeDiscrepancyScalarWhereInput[];
    id?: Prisma.IntFilter<"StocktakeDiscrepancy"> | number;
    stocktakeId?: Prisma.IntFilter<"StocktakeDiscrepancy"> | number;
    itemNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    description?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFilter<"StocktakeDiscrepancy"> | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    physicalFound?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    serialNo?: Prisma.StringNullableFilter<"StocktakeDiscrepancy"> | string | null;
    action?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    resolved?: Prisma.BoolFilter<"StocktakeDiscrepancy"> | boolean;
    createdBy?: Prisma.StringFilter<"StocktakeDiscrepancy"> | string;
    createdAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"StocktakeDiscrepancy"> | Date | string;
};
export type StocktakeDiscrepancyCreateManyStocktakeInput = {
    id?: number;
    itemNo?: string | null;
    description: string;
    issueType: $Enums.DiscrepancyIssueType;
    bcShows?: string;
    physicalFound?: string;
    serialNo?: string | null;
    action?: string;
    resolved?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type StocktakeDiscrepancyUpdateWithoutStocktakeInput = {
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancyUncheckedUpdateWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancyUncheckedUpdateManyWithoutStocktakeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    description?: Prisma.StringFieldUpdateOperationsInput | string;
    issueType?: Prisma.EnumDiscrepancyIssueTypeFieldUpdateOperationsInput | $Enums.DiscrepancyIssueType;
    bcShows?: Prisma.StringFieldUpdateOperationsInput | string;
    physicalFound?: Prisma.StringFieldUpdateOperationsInput | string;
    serialNo?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    action?: Prisma.StringFieldUpdateOperationsInput | string;
    resolved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type StocktakeDiscrepancySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    itemNo?: boolean;
    description?: boolean;
    issueType?: boolean;
    bcShows?: boolean;
    physicalFound?: boolean;
    serialNo?: boolean;
    action?: boolean;
    resolved?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeDiscrepancy"]>;
export type StocktakeDiscrepancySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    itemNo?: boolean;
    description?: boolean;
    issueType?: boolean;
    bcShows?: boolean;
    physicalFound?: boolean;
    serialNo?: boolean;
    action?: boolean;
    resolved?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeDiscrepancy"]>;
export type StocktakeDiscrepancySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    stocktakeId?: boolean;
    itemNo?: boolean;
    description?: boolean;
    issueType?: boolean;
    bcShows?: boolean;
    physicalFound?: boolean;
    serialNo?: boolean;
    action?: boolean;
    resolved?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["stocktakeDiscrepancy"]>;
export type StocktakeDiscrepancySelectScalar = {
    id?: boolean;
    stocktakeId?: boolean;
    itemNo?: boolean;
    description?: boolean;
    issueType?: boolean;
    bcShows?: boolean;
    physicalFound?: boolean;
    serialNo?: boolean;
    action?: boolean;
    resolved?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type StocktakeDiscrepancyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "stocktakeId" | "itemNo" | "description" | "issueType" | "bcShows" | "physicalFound" | "serialNo" | "action" | "resolved" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["stocktakeDiscrepancy"]>;
export type StocktakeDiscrepancyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeDiscrepancyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type StocktakeDiscrepancyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    stocktake?: boolean | Prisma.StocktakeDefaultArgs<ExtArgs>;
};
export type $StocktakeDiscrepancyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "StocktakeDiscrepancy";
    objects: {
        stocktake: Prisma.$StocktakePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        stocktakeId: number;
        itemNo: string | null;
        description: string;
        issueType: $Enums.DiscrepancyIssueType;
        bcShows: string;
        physicalFound: string;
        serialNo: string | null;
        action: string;
        resolved: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["stocktakeDiscrepancy"]>;
    composites: {};
};
export type StocktakeDiscrepancyGetPayload<S extends boolean | null | undefined | StocktakeDiscrepancyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload, S>;
export type StocktakeDiscrepancyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<StocktakeDiscrepancyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: StocktakeDiscrepancyCountAggregateInputType | true;
};
export interface StocktakeDiscrepancyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['StocktakeDiscrepancy'];
        meta: {
            name: 'StocktakeDiscrepancy';
        };
    };
    findUnique<T extends StocktakeDiscrepancyFindUniqueArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends StocktakeDiscrepancyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends StocktakeDiscrepancyFindFirstArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyFindFirstArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends StocktakeDiscrepancyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends StocktakeDiscrepancyFindManyArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends StocktakeDiscrepancyCreateArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyCreateArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends StocktakeDiscrepancyCreateManyArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends StocktakeDiscrepancyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends StocktakeDiscrepancyDeleteArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyDeleteArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends StocktakeDiscrepancyUpdateArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyUpdateArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends StocktakeDiscrepancyDeleteManyArgs>(args?: Prisma.SelectSubset<T, StocktakeDiscrepancyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends StocktakeDiscrepancyUpdateManyArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends StocktakeDiscrepancyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends StocktakeDiscrepancyUpsertArgs>(args: Prisma.SelectSubset<T, StocktakeDiscrepancyUpsertArgs<ExtArgs>>): Prisma.Prisma__StocktakeDiscrepancyClient<runtime.Types.Result.GetResult<Prisma.$StocktakeDiscrepancyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends StocktakeDiscrepancyCountArgs>(args?: Prisma.Subset<T, StocktakeDiscrepancyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], StocktakeDiscrepancyCountAggregateOutputType> : number>;
    aggregate<T extends StocktakeDiscrepancyAggregateArgs>(args: Prisma.Subset<T, StocktakeDiscrepancyAggregateArgs>): Prisma.PrismaPromise<GetStocktakeDiscrepancyAggregateType<T>>;
    groupBy<T extends StocktakeDiscrepancyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: StocktakeDiscrepancyGroupByArgs['orderBy'];
    } : {
        orderBy?: StocktakeDiscrepancyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, StocktakeDiscrepancyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetStocktakeDiscrepancyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: StocktakeDiscrepancyFieldRefs;
}
export interface Prisma__StocktakeDiscrepancyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    stocktake<T extends Prisma.StocktakeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.StocktakeDefaultArgs<ExtArgs>>): Prisma.Prisma__StocktakeClient<runtime.Types.Result.GetResult<Prisma.$StocktakePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface StocktakeDiscrepancyFieldRefs {
    readonly id: Prisma.FieldRef<"StocktakeDiscrepancy", 'Int'>;
    readonly stocktakeId: Prisma.FieldRef<"StocktakeDiscrepancy", 'Int'>;
    readonly itemNo: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly description: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly issueType: Prisma.FieldRef<"StocktakeDiscrepancy", 'DiscrepancyIssueType'>;
    readonly bcShows: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly physicalFound: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly serialNo: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly action: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly resolved: Prisma.FieldRef<"StocktakeDiscrepancy", 'Boolean'>;
    readonly createdBy: Prisma.FieldRef<"StocktakeDiscrepancy", 'String'>;
    readonly createdAt: Prisma.FieldRef<"StocktakeDiscrepancy", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"StocktakeDiscrepancy", 'DateTime'>;
}
export type StocktakeDiscrepancyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
};
export type StocktakeDiscrepancyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
};
export type StocktakeDiscrepancyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithRelationInput | Prisma.StocktakeDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeDiscrepancyScalarFieldEnum | Prisma.StocktakeDiscrepancyScalarFieldEnum[];
};
export type StocktakeDiscrepancyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithRelationInput | Prisma.StocktakeDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeDiscrepancyScalarFieldEnum | Prisma.StocktakeDiscrepancyScalarFieldEnum[];
};
export type StocktakeDiscrepancyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    orderBy?: Prisma.StocktakeDiscrepancyOrderByWithRelationInput | Prisma.StocktakeDiscrepancyOrderByWithRelationInput[];
    cursor?: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.StocktakeDiscrepancyScalarFieldEnum | Prisma.StocktakeDiscrepancyScalarFieldEnum[];
};
export type StocktakeDiscrepancyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateInput, Prisma.StocktakeDiscrepancyUncheckedCreateInput>;
};
export type StocktakeDiscrepancyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.StocktakeDiscrepancyCreateManyInput | Prisma.StocktakeDiscrepancyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type StocktakeDiscrepancyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.StocktakeDiscrepancyCreateManyInput | Prisma.StocktakeDiscrepancyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.StocktakeDiscrepancyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type StocktakeDiscrepancyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateInput, Prisma.StocktakeDiscrepancyUncheckedUpdateInput>;
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
};
export type StocktakeDiscrepancyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateManyMutationInput, Prisma.StocktakeDiscrepancyUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    limit?: number;
};
export type StocktakeDiscrepancyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateManyMutationInput, Prisma.StocktakeDiscrepancyUncheckedUpdateManyInput>;
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    limit?: number;
    include?: Prisma.StocktakeDiscrepancyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type StocktakeDiscrepancyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
    create: Prisma.XOR<Prisma.StocktakeDiscrepancyCreateInput, Prisma.StocktakeDiscrepancyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.StocktakeDiscrepancyUpdateInput, Prisma.StocktakeDiscrepancyUncheckedUpdateInput>;
};
export type StocktakeDiscrepancyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
    where: Prisma.StocktakeDiscrepancyWhereUniqueInput;
};
export type StocktakeDiscrepancyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.StocktakeDiscrepancyWhereInput;
    limit?: number;
};
export type StocktakeDiscrepancyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.StocktakeDiscrepancySelect<ExtArgs> | null;
    omit?: Prisma.StocktakeDiscrepancyOmit<ExtArgs> | null;
    include?: Prisma.StocktakeDiscrepancyInclude<ExtArgs> | null;
};
//# sourceMappingURL=StocktakeDiscrepancy.d.ts.map