import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type CustomerOrderEvidenceModel = runtime.Types.Result.DefaultSelection<Prisma.$CustomerOrderEvidencePayload>;
export type AggregateCustomerOrderEvidence = {
    _count: CustomerOrderEvidenceCountAggregateOutputType | null;
    _avg: CustomerOrderEvidenceAvgAggregateOutputType | null;
    _sum: CustomerOrderEvidenceSumAggregateOutputType | null;
    _min: CustomerOrderEvidenceMinAggregateOutputType | null;
    _max: CustomerOrderEvidenceMaxAggregateOutputType | null;
};
export type CustomerOrderEvidenceAvgAggregateOutputType = {
    id: number | null;
    itemId: number | null;
};
export type CustomerOrderEvidenceSumAggregateOutputType = {
    id: number | null;
    itemId: number | null;
};
export type CustomerOrderEvidenceMinAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    kind: $Enums.EvidenceKind | null;
    reference: string | null;
    note: string | null;
    observedOn: Date | null;
    recordedBy: string | null;
    createdAt: Date | null;
};
export type CustomerOrderEvidenceMaxAggregateOutputType = {
    id: number | null;
    itemId: number | null;
    kind: $Enums.EvidenceKind | null;
    reference: string | null;
    note: string | null;
    observedOn: Date | null;
    recordedBy: string | null;
    createdAt: Date | null;
};
export type CustomerOrderEvidenceCountAggregateOutputType = {
    id: number;
    itemId: number;
    kind: number;
    reference: number;
    note: number;
    observedOn: number;
    recordedBy: number;
    createdAt: number;
    _all: number;
};
export type CustomerOrderEvidenceAvgAggregateInputType = {
    id?: true;
    itemId?: true;
};
export type CustomerOrderEvidenceSumAggregateInputType = {
    id?: true;
    itemId?: true;
};
export type CustomerOrderEvidenceMinAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    reference?: true;
    note?: true;
    observedOn?: true;
    recordedBy?: true;
    createdAt?: true;
};
export type CustomerOrderEvidenceMaxAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    reference?: true;
    note?: true;
    observedOn?: true;
    recordedBy?: true;
    createdAt?: true;
};
export type CustomerOrderEvidenceCountAggregateInputType = {
    id?: true;
    itemId?: true;
    kind?: true;
    reference?: true;
    note?: true;
    observedOn?: true;
    recordedBy?: true;
    createdAt?: true;
    _all?: true;
};
export type CustomerOrderEvidenceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    orderBy?: Prisma.CustomerOrderEvidenceOrderByWithRelationInput | Prisma.CustomerOrderEvidenceOrderByWithRelationInput[];
    cursor?: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CustomerOrderEvidenceCountAggregateInputType;
    _avg?: CustomerOrderEvidenceAvgAggregateInputType;
    _sum?: CustomerOrderEvidenceSumAggregateInputType;
    _min?: CustomerOrderEvidenceMinAggregateInputType;
    _max?: CustomerOrderEvidenceMaxAggregateInputType;
};
export type GetCustomerOrderEvidenceAggregateType<T extends CustomerOrderEvidenceAggregateArgs> = {
    [P in keyof T & keyof AggregateCustomerOrderEvidence]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCustomerOrderEvidence[P]> : Prisma.GetScalarType<T[P], AggregateCustomerOrderEvidence[P]>;
};
export type CustomerOrderEvidenceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    orderBy?: Prisma.CustomerOrderEvidenceOrderByWithAggregationInput | Prisma.CustomerOrderEvidenceOrderByWithAggregationInput[];
    by: Prisma.CustomerOrderEvidenceScalarFieldEnum[] | Prisma.CustomerOrderEvidenceScalarFieldEnum;
    having?: Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CustomerOrderEvidenceCountAggregateInputType | true;
    _avg?: CustomerOrderEvidenceAvgAggregateInputType;
    _sum?: CustomerOrderEvidenceSumAggregateInputType;
    _min?: CustomerOrderEvidenceMinAggregateInputType;
    _max?: CustomerOrderEvidenceMaxAggregateInputType;
};
export type CustomerOrderEvidenceGroupByOutputType = {
    id: number;
    itemId: number;
    kind: $Enums.EvidenceKind;
    reference: string | null;
    note: string | null;
    observedOn: Date | null;
    recordedBy: string;
    createdAt: Date;
    _count: CustomerOrderEvidenceCountAggregateOutputType | null;
    _avg: CustomerOrderEvidenceAvgAggregateOutputType | null;
    _sum: CustomerOrderEvidenceSumAggregateOutputType | null;
    _min: CustomerOrderEvidenceMinAggregateOutputType | null;
    _max: CustomerOrderEvidenceMaxAggregateOutputType | null;
};
export type GetCustomerOrderEvidenceGroupByPayload<T extends CustomerOrderEvidenceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CustomerOrderEvidenceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CustomerOrderEvidenceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CustomerOrderEvidenceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CustomerOrderEvidenceGroupByOutputType[P]>;
}>>;
export type CustomerOrderEvidenceWhereInput = {
    AND?: Prisma.CustomerOrderEvidenceWhereInput | Prisma.CustomerOrderEvidenceWhereInput[];
    OR?: Prisma.CustomerOrderEvidenceWhereInput[];
    NOT?: Prisma.CustomerOrderEvidenceWhereInput | Prisma.CustomerOrderEvidenceWhereInput[];
    id?: Prisma.IntFilter<"CustomerOrderEvidence"> | number;
    itemId?: Prisma.IntFilter<"CustomerOrderEvidence"> | number;
    kind?: Prisma.EnumEvidenceKindFilter<"CustomerOrderEvidence"> | $Enums.EvidenceKind;
    reference?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    observedOn?: Prisma.DateTimeNullableFilter<"CustomerOrderEvidence"> | Date | string | null;
    recordedBy?: Prisma.StringFilter<"CustomerOrderEvidence"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerOrderEvidence"> | Date | string;
    item?: Prisma.XOR<Prisma.CustomerOrderItemScalarRelationFilter, Prisma.CustomerOrderItemWhereInput>;
};
export type CustomerOrderEvidenceOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    observedOn?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    item?: Prisma.CustomerOrderItemOrderByWithRelationInput;
};
export type CustomerOrderEvidenceWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.CustomerOrderEvidenceWhereInput | Prisma.CustomerOrderEvidenceWhereInput[];
    OR?: Prisma.CustomerOrderEvidenceWhereInput[];
    NOT?: Prisma.CustomerOrderEvidenceWhereInput | Prisma.CustomerOrderEvidenceWhereInput[];
    itemId?: Prisma.IntFilter<"CustomerOrderEvidence"> | number;
    kind?: Prisma.EnumEvidenceKindFilter<"CustomerOrderEvidence"> | $Enums.EvidenceKind;
    reference?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    observedOn?: Prisma.DateTimeNullableFilter<"CustomerOrderEvidence"> | Date | string | null;
    recordedBy?: Prisma.StringFilter<"CustomerOrderEvidence"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerOrderEvidence"> | Date | string;
    item?: Prisma.XOR<Prisma.CustomerOrderItemScalarRelationFilter, Prisma.CustomerOrderItemWhereInput>;
}, "id">;
export type CustomerOrderEvidenceOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    reference?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    observedOn?: Prisma.SortOrderInput | Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.CustomerOrderEvidenceCountOrderByAggregateInput;
    _avg?: Prisma.CustomerOrderEvidenceAvgOrderByAggregateInput;
    _max?: Prisma.CustomerOrderEvidenceMaxOrderByAggregateInput;
    _min?: Prisma.CustomerOrderEvidenceMinOrderByAggregateInput;
    _sum?: Prisma.CustomerOrderEvidenceSumOrderByAggregateInput;
};
export type CustomerOrderEvidenceScalarWhereWithAggregatesInput = {
    AND?: Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput | Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput[];
    OR?: Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput | Prisma.CustomerOrderEvidenceScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"CustomerOrderEvidence"> | number;
    itemId?: Prisma.IntWithAggregatesFilter<"CustomerOrderEvidence"> | number;
    kind?: Prisma.EnumEvidenceKindWithAggregatesFilter<"CustomerOrderEvidence"> | $Enums.EvidenceKind;
    reference?: Prisma.StringNullableWithAggregatesFilter<"CustomerOrderEvidence"> | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"CustomerOrderEvidence"> | string | null;
    observedOn?: Prisma.DateTimeNullableWithAggregatesFilter<"CustomerOrderEvidence"> | Date | string | null;
    recordedBy?: Prisma.StringWithAggregatesFilter<"CustomerOrderEvidence"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"CustomerOrderEvidence"> | Date | string;
};
export type CustomerOrderEvidenceCreateInput = {
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
    item: Prisma.CustomerOrderItemCreateNestedOneWithoutEvidenceInput;
};
export type CustomerOrderEvidenceUncheckedCreateInput = {
    id?: number;
    itemId: number;
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
};
export type CustomerOrderEvidenceUpdateInput = {
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    item?: Prisma.CustomerOrderItemUpdateOneRequiredWithoutEvidenceNestedInput;
};
export type CustomerOrderEvidenceUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceCreateManyInput = {
    id?: number;
    itemId: number;
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
};
export type CustomerOrderEvidenceUpdateManyMutationInput = {
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceListRelationFilter = {
    every?: Prisma.CustomerOrderEvidenceWhereInput;
    some?: Prisma.CustomerOrderEvidenceWhereInput;
    none?: Prisma.CustomerOrderEvidenceWhereInput;
};
export type CustomerOrderEvidenceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    observedOn?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    observedOn?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    observedOn?: Prisma.SortOrder;
    recordedBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
};
export type CustomerOrderEvidenceCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput> | Prisma.CustomerOrderEvidenceCreateWithoutItemInput[] | Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput | Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.CustomerOrderEvidenceCreateManyItemInputEnvelope;
    connect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
};
export type CustomerOrderEvidenceUncheckedCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput> | Prisma.CustomerOrderEvidenceCreateWithoutItemInput[] | Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput | Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.CustomerOrderEvidenceCreateManyItemInputEnvelope;
    connect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
};
export type CustomerOrderEvidenceUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput> | Prisma.CustomerOrderEvidenceCreateWithoutItemInput[] | Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput | Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.CustomerOrderEvidenceUpsertWithWhereUniqueWithoutItemInput | Prisma.CustomerOrderEvidenceUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.CustomerOrderEvidenceCreateManyItemInputEnvelope;
    set?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    disconnect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    delete?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    connect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    update?: Prisma.CustomerOrderEvidenceUpdateWithWhereUniqueWithoutItemInput | Prisma.CustomerOrderEvidenceUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.CustomerOrderEvidenceUpdateManyWithWhereWithoutItemInput | Prisma.CustomerOrderEvidenceUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.CustomerOrderEvidenceScalarWhereInput | Prisma.CustomerOrderEvidenceScalarWhereInput[];
};
export type CustomerOrderEvidenceUncheckedUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput> | Prisma.CustomerOrderEvidenceCreateWithoutItemInput[] | Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput | Prisma.CustomerOrderEvidenceCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.CustomerOrderEvidenceUpsertWithWhereUniqueWithoutItemInput | Prisma.CustomerOrderEvidenceUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.CustomerOrderEvidenceCreateManyItemInputEnvelope;
    set?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    disconnect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    delete?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    connect?: Prisma.CustomerOrderEvidenceWhereUniqueInput | Prisma.CustomerOrderEvidenceWhereUniqueInput[];
    update?: Prisma.CustomerOrderEvidenceUpdateWithWhereUniqueWithoutItemInput | Prisma.CustomerOrderEvidenceUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.CustomerOrderEvidenceUpdateManyWithWhereWithoutItemInput | Prisma.CustomerOrderEvidenceUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.CustomerOrderEvidenceScalarWhereInput | Prisma.CustomerOrderEvidenceScalarWhereInput[];
};
export type EnumEvidenceKindFieldUpdateOperationsInput = {
    set?: $Enums.EvidenceKind;
};
export type CustomerOrderEvidenceCreateWithoutItemInput = {
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
};
export type CustomerOrderEvidenceUncheckedCreateWithoutItemInput = {
    id?: number;
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
};
export type CustomerOrderEvidenceCreateOrConnectWithoutItemInput = {
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput>;
};
export type CustomerOrderEvidenceCreateManyItemInputEnvelope = {
    data: Prisma.CustomerOrderEvidenceCreateManyItemInput | Prisma.CustomerOrderEvidenceCreateManyItemInput[];
    skipDuplicates?: boolean;
};
export type CustomerOrderEvidenceUpsertWithWhereUniqueWithoutItemInput = {
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    update: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedUpdateWithoutItemInput>;
    create: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedCreateWithoutItemInput>;
};
export type CustomerOrderEvidenceUpdateWithWhereUniqueWithoutItemInput = {
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateWithoutItemInput, Prisma.CustomerOrderEvidenceUncheckedUpdateWithoutItemInput>;
};
export type CustomerOrderEvidenceUpdateManyWithWhereWithoutItemInput = {
    where: Prisma.CustomerOrderEvidenceScalarWhereInput;
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateManyMutationInput, Prisma.CustomerOrderEvidenceUncheckedUpdateManyWithoutItemInput>;
};
export type CustomerOrderEvidenceScalarWhereInput = {
    AND?: Prisma.CustomerOrderEvidenceScalarWhereInput | Prisma.CustomerOrderEvidenceScalarWhereInput[];
    OR?: Prisma.CustomerOrderEvidenceScalarWhereInput[];
    NOT?: Prisma.CustomerOrderEvidenceScalarWhereInput | Prisma.CustomerOrderEvidenceScalarWhereInput[];
    id?: Prisma.IntFilter<"CustomerOrderEvidence"> | number;
    itemId?: Prisma.IntFilter<"CustomerOrderEvidence"> | number;
    kind?: Prisma.EnumEvidenceKindFilter<"CustomerOrderEvidence"> | $Enums.EvidenceKind;
    reference?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    note?: Prisma.StringNullableFilter<"CustomerOrderEvidence"> | string | null;
    observedOn?: Prisma.DateTimeNullableFilter<"CustomerOrderEvidence"> | Date | string | null;
    recordedBy?: Prisma.StringFilter<"CustomerOrderEvidence"> | string;
    createdAt?: Prisma.DateTimeFilter<"CustomerOrderEvidence"> | Date | string;
};
export type CustomerOrderEvidenceCreateManyItemInput = {
    id?: number;
    kind: $Enums.EvidenceKind;
    reference?: string | null;
    note?: string | null;
    observedOn?: Date | string | null;
    recordedBy: string;
    createdAt?: Date | string;
};
export type CustomerOrderEvidenceUpdateWithoutItemInput = {
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceUncheckedUpdateWithoutItemInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceUncheckedUpdateManyWithoutItemInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumEvidenceKindFieldUpdateOperationsInput | $Enums.EvidenceKind;
    reference?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    observedOn?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    recordedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CustomerOrderEvidenceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    reference?: boolean;
    note?: boolean;
    observedOn?: boolean;
    recordedBy?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerOrderEvidence"]>;
export type CustomerOrderEvidenceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    reference?: boolean;
    note?: boolean;
    observedOn?: boolean;
    recordedBy?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerOrderEvidence"]>;
export type CustomerOrderEvidenceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    reference?: boolean;
    note?: boolean;
    observedOn?: boolean;
    recordedBy?: boolean;
    createdAt?: boolean;
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["customerOrderEvidence"]>;
export type CustomerOrderEvidenceSelectScalar = {
    id?: boolean;
    itemId?: boolean;
    kind?: boolean;
    reference?: boolean;
    note?: boolean;
    observedOn?: boolean;
    recordedBy?: boolean;
    createdAt?: boolean;
};
export type CustomerOrderEvidenceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "itemId" | "kind" | "reference" | "note" | "observedOn" | "recordedBy" | "createdAt", ExtArgs["result"]["customerOrderEvidence"]>;
export type CustomerOrderEvidenceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
};
export type CustomerOrderEvidenceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
};
export type CustomerOrderEvidenceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    item?: boolean | Prisma.CustomerOrderItemDefaultArgs<ExtArgs>;
};
export type $CustomerOrderEvidencePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CustomerOrderEvidence";
    objects: {
        item: Prisma.$CustomerOrderItemPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        itemId: number;
        kind: $Enums.EvidenceKind;
        reference: string | null;
        note: string | null;
        observedOn: Date | null;
        recordedBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["customerOrderEvidence"]>;
    composites: {};
};
export type CustomerOrderEvidenceGetPayload<S extends boolean | null | undefined | CustomerOrderEvidenceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload, S>;
export type CustomerOrderEvidenceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CustomerOrderEvidenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CustomerOrderEvidenceCountAggregateInputType | true;
};
export interface CustomerOrderEvidenceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CustomerOrderEvidence'];
        meta: {
            name: 'CustomerOrderEvidence';
        };
    };
    findUnique<T extends CustomerOrderEvidenceFindUniqueArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CustomerOrderEvidenceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CustomerOrderEvidenceFindFirstArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceFindFirstArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CustomerOrderEvidenceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CustomerOrderEvidenceFindManyArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CustomerOrderEvidenceCreateArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceCreateArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CustomerOrderEvidenceCreateManyArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CustomerOrderEvidenceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CustomerOrderEvidenceDeleteArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceDeleteArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CustomerOrderEvidenceUpdateArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceUpdateArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CustomerOrderEvidenceDeleteManyArgs>(args?: Prisma.SelectSubset<T, CustomerOrderEvidenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CustomerOrderEvidenceUpdateManyArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CustomerOrderEvidenceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CustomerOrderEvidenceUpsertArgs>(args: Prisma.SelectSubset<T, CustomerOrderEvidenceUpsertArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderEvidenceClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderEvidencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CustomerOrderEvidenceCountArgs>(args?: Prisma.Subset<T, CustomerOrderEvidenceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CustomerOrderEvidenceCountAggregateOutputType> : number>;
    aggregate<T extends CustomerOrderEvidenceAggregateArgs>(args: Prisma.Subset<T, CustomerOrderEvidenceAggregateArgs>): Prisma.PrismaPromise<GetCustomerOrderEvidenceAggregateType<T>>;
    groupBy<T extends CustomerOrderEvidenceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CustomerOrderEvidenceGroupByArgs['orderBy'];
    } : {
        orderBy?: CustomerOrderEvidenceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CustomerOrderEvidenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCustomerOrderEvidenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CustomerOrderEvidenceFieldRefs;
}
export interface Prisma__CustomerOrderEvidenceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    item<T extends Prisma.CustomerOrderItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CustomerOrderItemDefaultArgs<ExtArgs>>): Prisma.Prisma__CustomerOrderItemClient<runtime.Types.Result.GetResult<Prisma.$CustomerOrderItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CustomerOrderEvidenceFieldRefs {
    readonly id: Prisma.FieldRef<"CustomerOrderEvidence", 'Int'>;
    readonly itemId: Prisma.FieldRef<"CustomerOrderEvidence", 'Int'>;
    readonly kind: Prisma.FieldRef<"CustomerOrderEvidence", 'EvidenceKind'>;
    readonly reference: Prisma.FieldRef<"CustomerOrderEvidence", 'String'>;
    readonly note: Prisma.FieldRef<"CustomerOrderEvidence", 'String'>;
    readonly observedOn: Prisma.FieldRef<"CustomerOrderEvidence", 'DateTime'>;
    readonly recordedBy: Prisma.FieldRef<"CustomerOrderEvidence", 'String'>;
    readonly createdAt: Prisma.FieldRef<"CustomerOrderEvidence", 'DateTime'>;
}
export type CustomerOrderEvidenceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
};
export type CustomerOrderEvidenceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
};
export type CustomerOrderEvidenceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    orderBy?: Prisma.CustomerOrderEvidenceOrderByWithRelationInput | Prisma.CustomerOrderEvidenceOrderByWithRelationInput[];
    cursor?: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerOrderEvidenceScalarFieldEnum | Prisma.CustomerOrderEvidenceScalarFieldEnum[];
};
export type CustomerOrderEvidenceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    orderBy?: Prisma.CustomerOrderEvidenceOrderByWithRelationInput | Prisma.CustomerOrderEvidenceOrderByWithRelationInput[];
    cursor?: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerOrderEvidenceScalarFieldEnum | Prisma.CustomerOrderEvidenceScalarFieldEnum[];
};
export type CustomerOrderEvidenceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    orderBy?: Prisma.CustomerOrderEvidenceOrderByWithRelationInput | Prisma.CustomerOrderEvidenceOrderByWithRelationInput[];
    cursor?: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CustomerOrderEvidenceScalarFieldEnum | Prisma.CustomerOrderEvidenceScalarFieldEnum[];
};
export type CustomerOrderEvidenceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateInput, Prisma.CustomerOrderEvidenceUncheckedCreateInput>;
};
export type CustomerOrderEvidenceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CustomerOrderEvidenceCreateManyInput | Prisma.CustomerOrderEvidenceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CustomerOrderEvidenceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    data: Prisma.CustomerOrderEvidenceCreateManyInput | Prisma.CustomerOrderEvidenceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CustomerOrderEvidenceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CustomerOrderEvidenceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateInput, Prisma.CustomerOrderEvidenceUncheckedUpdateInput>;
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
};
export type CustomerOrderEvidenceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateManyMutationInput, Prisma.CustomerOrderEvidenceUncheckedUpdateManyInput>;
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    limit?: number;
};
export type CustomerOrderEvidenceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateManyMutationInput, Prisma.CustomerOrderEvidenceUncheckedUpdateManyInput>;
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    limit?: number;
    include?: Prisma.CustomerOrderEvidenceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CustomerOrderEvidenceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
    create: Prisma.XOR<Prisma.CustomerOrderEvidenceCreateInput, Prisma.CustomerOrderEvidenceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CustomerOrderEvidenceUpdateInput, Prisma.CustomerOrderEvidenceUncheckedUpdateInput>;
};
export type CustomerOrderEvidenceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
    where: Prisma.CustomerOrderEvidenceWhereUniqueInput;
};
export type CustomerOrderEvidenceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CustomerOrderEvidenceWhereInput;
    limit?: number;
};
export type CustomerOrderEvidenceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CustomerOrderEvidenceSelect<ExtArgs> | null;
    omit?: Prisma.CustomerOrderEvidenceOmit<ExtArgs> | null;
    include?: Prisma.CustomerOrderEvidenceInclude<ExtArgs> | null;
};
//# sourceMappingURL=CustomerOrderEvidence.d.ts.map