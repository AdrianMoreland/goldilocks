import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SheetTaskModel = runtime.Types.Result.DefaultSelection<Prisma.$SheetTaskPayload>;
export type AggregateSheetTask = {
    _count: SheetTaskCountAggregateOutputType | null;
    _avg: SheetTaskAvgAggregateOutputType | null;
    _sum: SheetTaskSumAggregateOutputType | null;
    _min: SheetTaskMinAggregateOutputType | null;
    _max: SheetTaskMaxAggregateOutputType | null;
};
export type SheetTaskAvgAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
};
export type SheetTaskSumAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
};
export type SheetTaskMinAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
    reference: string | null;
    client: string | null;
    sheet: string | null;
    what: string | null;
    value: string | null;
    check: $Enums.TaskCheck | null;
    status: $Enums.SheetTaskStatus | null;
    createdAt: Date | null;
    createdBy: string | null;
    closedAt: Date | null;
    closedBy: string | null;
    closedVia: $Enums.TaskClosedVia | null;
};
export type SheetTaskMaxAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
    reference: string | null;
    client: string | null;
    sheet: string | null;
    what: string | null;
    value: string | null;
    check: $Enums.TaskCheck | null;
    status: $Enums.SheetTaskStatus | null;
    createdAt: Date | null;
    createdBy: string | null;
    closedAt: Date | null;
    closedBy: string | null;
    closedVia: $Enums.TaskClosedVia | null;
};
export type SheetTaskCountAggregateOutputType = {
    id: number;
    tradeId: number;
    reference: number;
    client: number;
    sheet: number;
    what: number;
    value: number;
    check: number;
    status: number;
    createdAt: number;
    createdBy: number;
    closedAt: number;
    closedBy: number;
    closedVia: number;
    _all: number;
};
export type SheetTaskAvgAggregateInputType = {
    id?: true;
    tradeId?: true;
};
export type SheetTaskSumAggregateInputType = {
    id?: true;
    tradeId?: true;
};
export type SheetTaskMinAggregateInputType = {
    id?: true;
    tradeId?: true;
    reference?: true;
    client?: true;
    sheet?: true;
    what?: true;
    value?: true;
    check?: true;
    status?: true;
    createdAt?: true;
    createdBy?: true;
    closedAt?: true;
    closedBy?: true;
    closedVia?: true;
};
export type SheetTaskMaxAggregateInputType = {
    id?: true;
    tradeId?: true;
    reference?: true;
    client?: true;
    sheet?: true;
    what?: true;
    value?: true;
    check?: true;
    status?: true;
    createdAt?: true;
    createdBy?: true;
    closedAt?: true;
    closedBy?: true;
    closedVia?: true;
};
export type SheetTaskCountAggregateInputType = {
    id?: true;
    tradeId?: true;
    reference?: true;
    client?: true;
    sheet?: true;
    what?: true;
    value?: true;
    check?: true;
    status?: true;
    createdAt?: true;
    createdBy?: true;
    closedAt?: true;
    closedBy?: true;
    closedVia?: true;
    _all?: true;
};
export type SheetTaskAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetTaskWhereInput;
    orderBy?: Prisma.SheetTaskOrderByWithRelationInput | Prisma.SheetTaskOrderByWithRelationInput[];
    cursor?: Prisma.SheetTaskWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SheetTaskCountAggregateInputType;
    _avg?: SheetTaskAvgAggregateInputType;
    _sum?: SheetTaskSumAggregateInputType;
    _min?: SheetTaskMinAggregateInputType;
    _max?: SheetTaskMaxAggregateInputType;
};
export type GetSheetTaskAggregateType<T extends SheetTaskAggregateArgs> = {
    [P in keyof T & keyof AggregateSheetTask]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSheetTask[P]> : Prisma.GetScalarType<T[P], AggregateSheetTask[P]>;
};
export type SheetTaskGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetTaskWhereInput;
    orderBy?: Prisma.SheetTaskOrderByWithAggregationInput | Prisma.SheetTaskOrderByWithAggregationInput[];
    by: Prisma.SheetTaskScalarFieldEnum[] | Prisma.SheetTaskScalarFieldEnum;
    having?: Prisma.SheetTaskScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SheetTaskCountAggregateInputType | true;
    _avg?: SheetTaskAvgAggregateInputType;
    _sum?: SheetTaskSumAggregateInputType;
    _min?: SheetTaskMinAggregateInputType;
    _max?: SheetTaskMaxAggregateInputType;
};
export type SheetTaskGroupByOutputType = {
    id: number;
    tradeId: number | null;
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status: $Enums.SheetTaskStatus;
    createdAt: Date;
    createdBy: string;
    closedAt: Date | null;
    closedBy: string | null;
    closedVia: $Enums.TaskClosedVia | null;
    _count: SheetTaskCountAggregateOutputType | null;
    _avg: SheetTaskAvgAggregateOutputType | null;
    _sum: SheetTaskSumAggregateOutputType | null;
    _min: SheetTaskMinAggregateOutputType | null;
    _max: SheetTaskMaxAggregateOutputType | null;
};
export type GetSheetTaskGroupByPayload<T extends SheetTaskGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SheetTaskGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SheetTaskGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SheetTaskGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SheetTaskGroupByOutputType[P]>;
}>>;
export type SheetTaskWhereInput = {
    AND?: Prisma.SheetTaskWhereInput | Prisma.SheetTaskWhereInput[];
    OR?: Prisma.SheetTaskWhereInput[];
    NOT?: Prisma.SheetTaskWhereInput | Prisma.SheetTaskWhereInput[];
    id?: Prisma.IntFilter<"SheetTask"> | number;
    tradeId?: Prisma.IntNullableFilter<"SheetTask"> | number | null;
    reference?: Prisma.StringFilter<"SheetTask"> | string;
    client?: Prisma.StringFilter<"SheetTask"> | string;
    sheet?: Prisma.StringFilter<"SheetTask"> | string;
    what?: Prisma.StringFilter<"SheetTask"> | string;
    value?: Prisma.StringFilter<"SheetTask"> | string;
    check?: Prisma.EnumTaskCheckFilter<"SheetTask"> | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFilter<"SheetTask"> | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFilter<"SheetTask"> | Date | string;
    createdBy?: Prisma.StringFilter<"SheetTask"> | string;
    closedAt?: Prisma.DateTimeNullableFilter<"SheetTask"> | Date | string | null;
    closedBy?: Prisma.StringNullableFilter<"SheetTask"> | string | null;
    closedVia?: Prisma.EnumTaskClosedViaNullableFilter<"SheetTask"> | $Enums.TaskClosedVia | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
};
export type SheetTaskOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    client?: Prisma.SortOrder;
    sheet?: Prisma.SortOrder;
    what?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    check?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    closedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    closedVia?: Prisma.SortOrderInput | Prisma.SortOrder;
    trade?: Prisma.TradeOrderByWithRelationInput;
};
export type SheetTaskWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.SheetTaskWhereInput | Prisma.SheetTaskWhereInput[];
    OR?: Prisma.SheetTaskWhereInput[];
    NOT?: Prisma.SheetTaskWhereInput | Prisma.SheetTaskWhereInput[];
    tradeId?: Prisma.IntNullableFilter<"SheetTask"> | number | null;
    reference?: Prisma.StringFilter<"SheetTask"> | string;
    client?: Prisma.StringFilter<"SheetTask"> | string;
    sheet?: Prisma.StringFilter<"SheetTask"> | string;
    what?: Prisma.StringFilter<"SheetTask"> | string;
    value?: Prisma.StringFilter<"SheetTask"> | string;
    check?: Prisma.EnumTaskCheckFilter<"SheetTask"> | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFilter<"SheetTask"> | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFilter<"SheetTask"> | Date | string;
    createdBy?: Prisma.StringFilter<"SheetTask"> | string;
    closedAt?: Prisma.DateTimeNullableFilter<"SheetTask"> | Date | string | null;
    closedBy?: Prisma.StringNullableFilter<"SheetTask"> | string | null;
    closedVia?: Prisma.EnumTaskClosedViaNullableFilter<"SheetTask"> | $Enums.TaskClosedVia | null;
    trade?: Prisma.XOR<Prisma.TradeNullableScalarRelationFilter, Prisma.TradeWhereInput> | null;
}, "id">;
export type SheetTaskOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    client?: Prisma.SortOrder;
    sheet?: Prisma.SortOrder;
    what?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    check?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    closedBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    closedVia?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.SheetTaskCountOrderByAggregateInput;
    _avg?: Prisma.SheetTaskAvgOrderByAggregateInput;
    _max?: Prisma.SheetTaskMaxOrderByAggregateInput;
    _min?: Prisma.SheetTaskMinOrderByAggregateInput;
    _sum?: Prisma.SheetTaskSumOrderByAggregateInput;
};
export type SheetTaskScalarWhereWithAggregatesInput = {
    AND?: Prisma.SheetTaskScalarWhereWithAggregatesInput | Prisma.SheetTaskScalarWhereWithAggregatesInput[];
    OR?: Prisma.SheetTaskScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SheetTaskScalarWhereWithAggregatesInput | Prisma.SheetTaskScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SheetTask"> | number;
    tradeId?: Prisma.IntNullableWithAggregatesFilter<"SheetTask"> | number | null;
    reference?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    client?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    sheet?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    what?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    value?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    check?: Prisma.EnumTaskCheckWithAggregatesFilter<"SheetTask"> | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusWithAggregatesFilter<"SheetTask"> | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SheetTask"> | Date | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"SheetTask"> | string;
    closedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"SheetTask"> | Date | string | null;
    closedBy?: Prisma.StringNullableWithAggregatesFilter<"SheetTask"> | string | null;
    closedVia?: Prisma.EnumTaskClosedViaNullableWithAggregatesFilter<"SheetTask"> | $Enums.TaskClosedVia | null;
};
export type SheetTaskCreateInput = {
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
    trade?: Prisma.TradeCreateNestedOneWithoutTasksInput;
};
export type SheetTaskUncheckedCreateInput = {
    id?: number;
    tradeId?: number | null;
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
};
export type SheetTaskUpdateInput = {
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
    trade?: Prisma.TradeUpdateOneWithoutTasksNestedInput;
};
export type SheetTaskUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskCreateManyInput = {
    id?: number;
    tradeId?: number | null;
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
};
export type SheetTaskUpdateManyMutationInput = {
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskListRelationFilter = {
    every?: Prisma.SheetTaskWhereInput;
    some?: Prisma.SheetTaskWhereInput;
    none?: Prisma.SheetTaskWhereInput;
};
export type SheetTaskOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SheetTaskCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    client?: Prisma.SortOrder;
    sheet?: Prisma.SortOrder;
    what?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    check?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    closedVia?: Prisma.SortOrder;
};
export type SheetTaskAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type SheetTaskMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    client?: Prisma.SortOrder;
    sheet?: Prisma.SortOrder;
    what?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    check?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    closedVia?: Prisma.SortOrder;
};
export type SheetTaskMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    reference?: Prisma.SortOrder;
    client?: Prisma.SortOrder;
    sheet?: Prisma.SortOrder;
    what?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    check?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    closedAt?: Prisma.SortOrder;
    closedBy?: Prisma.SortOrder;
    closedVia?: Prisma.SortOrder;
};
export type SheetTaskSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type SheetTaskCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput> | Prisma.SheetTaskCreateWithoutTradeInput[] | Prisma.SheetTaskUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.SheetTaskCreateOrConnectWithoutTradeInput | Prisma.SheetTaskCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.SheetTaskCreateManyTradeInputEnvelope;
    connect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
};
export type SheetTaskUncheckedCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput> | Prisma.SheetTaskCreateWithoutTradeInput[] | Prisma.SheetTaskUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.SheetTaskCreateOrConnectWithoutTradeInput | Prisma.SheetTaskCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.SheetTaskCreateManyTradeInputEnvelope;
    connect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
};
export type SheetTaskUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput> | Prisma.SheetTaskCreateWithoutTradeInput[] | Prisma.SheetTaskUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.SheetTaskCreateOrConnectWithoutTradeInput | Prisma.SheetTaskCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.SheetTaskUpsertWithWhereUniqueWithoutTradeInput | Prisma.SheetTaskUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.SheetTaskCreateManyTradeInputEnvelope;
    set?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    disconnect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    delete?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    connect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    update?: Prisma.SheetTaskUpdateWithWhereUniqueWithoutTradeInput | Prisma.SheetTaskUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.SheetTaskUpdateManyWithWhereWithoutTradeInput | Prisma.SheetTaskUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.SheetTaskScalarWhereInput | Prisma.SheetTaskScalarWhereInput[];
};
export type SheetTaskUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput> | Prisma.SheetTaskCreateWithoutTradeInput[] | Prisma.SheetTaskUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.SheetTaskCreateOrConnectWithoutTradeInput | Prisma.SheetTaskCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.SheetTaskUpsertWithWhereUniqueWithoutTradeInput | Prisma.SheetTaskUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.SheetTaskCreateManyTradeInputEnvelope;
    set?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    disconnect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    delete?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    connect?: Prisma.SheetTaskWhereUniqueInput | Prisma.SheetTaskWhereUniqueInput[];
    update?: Prisma.SheetTaskUpdateWithWhereUniqueWithoutTradeInput | Prisma.SheetTaskUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.SheetTaskUpdateManyWithWhereWithoutTradeInput | Prisma.SheetTaskUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.SheetTaskScalarWhereInput | Prisma.SheetTaskScalarWhereInput[];
};
export type EnumTaskCheckFieldUpdateOperationsInput = {
    set?: $Enums.TaskCheck;
};
export type EnumSheetTaskStatusFieldUpdateOperationsInput = {
    set?: $Enums.SheetTaskStatus;
};
export type NullableEnumTaskClosedViaFieldUpdateOperationsInput = {
    set?: $Enums.TaskClosedVia | null;
};
export type SheetTaskCreateWithoutTradeInput = {
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
};
export type SheetTaskUncheckedCreateWithoutTradeInput = {
    id?: number;
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
};
export type SheetTaskCreateOrConnectWithoutTradeInput = {
    where: Prisma.SheetTaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput>;
};
export type SheetTaskCreateManyTradeInputEnvelope = {
    data: Prisma.SheetTaskCreateManyTradeInput | Prisma.SheetTaskCreateManyTradeInput[];
    skipDuplicates?: boolean;
};
export type SheetTaskUpsertWithWhereUniqueWithoutTradeInput = {
    where: Prisma.SheetTaskWhereUniqueInput;
    update: Prisma.XOR<Prisma.SheetTaskUpdateWithoutTradeInput, Prisma.SheetTaskUncheckedUpdateWithoutTradeInput>;
    create: Prisma.XOR<Prisma.SheetTaskCreateWithoutTradeInput, Prisma.SheetTaskUncheckedCreateWithoutTradeInput>;
};
export type SheetTaskUpdateWithWhereUniqueWithoutTradeInput = {
    where: Prisma.SheetTaskWhereUniqueInput;
    data: Prisma.XOR<Prisma.SheetTaskUpdateWithoutTradeInput, Prisma.SheetTaskUncheckedUpdateWithoutTradeInput>;
};
export type SheetTaskUpdateManyWithWhereWithoutTradeInput = {
    where: Prisma.SheetTaskScalarWhereInput;
    data: Prisma.XOR<Prisma.SheetTaskUpdateManyMutationInput, Prisma.SheetTaskUncheckedUpdateManyWithoutTradeInput>;
};
export type SheetTaskScalarWhereInput = {
    AND?: Prisma.SheetTaskScalarWhereInput | Prisma.SheetTaskScalarWhereInput[];
    OR?: Prisma.SheetTaskScalarWhereInput[];
    NOT?: Prisma.SheetTaskScalarWhereInput | Prisma.SheetTaskScalarWhereInput[];
    id?: Prisma.IntFilter<"SheetTask"> | number;
    tradeId?: Prisma.IntNullableFilter<"SheetTask"> | number | null;
    reference?: Prisma.StringFilter<"SheetTask"> | string;
    client?: Prisma.StringFilter<"SheetTask"> | string;
    sheet?: Prisma.StringFilter<"SheetTask"> | string;
    what?: Prisma.StringFilter<"SheetTask"> | string;
    value?: Prisma.StringFilter<"SheetTask"> | string;
    check?: Prisma.EnumTaskCheckFilter<"SheetTask"> | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFilter<"SheetTask"> | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFilter<"SheetTask"> | Date | string;
    createdBy?: Prisma.StringFilter<"SheetTask"> | string;
    closedAt?: Prisma.DateTimeNullableFilter<"SheetTask"> | Date | string | null;
    closedBy?: Prisma.StringNullableFilter<"SheetTask"> | string | null;
    closedVia?: Prisma.EnumTaskClosedViaNullableFilter<"SheetTask"> | $Enums.TaskClosedVia | null;
};
export type SheetTaskCreateManyTradeInput = {
    id?: number;
    reference: string;
    client: string;
    sheet: string;
    what: string;
    value: string;
    check: $Enums.TaskCheck;
    status?: $Enums.SheetTaskStatus;
    createdAt?: Date | string;
    createdBy: string;
    closedAt?: Date | string | null;
    closedBy?: string | null;
    closedVia?: $Enums.TaskClosedVia | null;
};
export type SheetTaskUpdateWithoutTradeInput = {
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskUncheckedUpdateWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskUncheckedUpdateManyWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    reference?: Prisma.StringFieldUpdateOperationsInput | string;
    client?: Prisma.StringFieldUpdateOperationsInput | string;
    sheet?: Prisma.StringFieldUpdateOperationsInput | string;
    what?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.StringFieldUpdateOperationsInput | string;
    check?: Prisma.EnumTaskCheckFieldUpdateOperationsInput | $Enums.TaskCheck;
    status?: Prisma.EnumSheetTaskStatusFieldUpdateOperationsInput | $Enums.SheetTaskStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    closedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    closedBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    closedVia?: Prisma.NullableEnumTaskClosedViaFieldUpdateOperationsInput | $Enums.TaskClosedVia | null;
};
export type SheetTaskSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    reference?: boolean;
    client?: boolean;
    sheet?: boolean;
    what?: boolean;
    value?: boolean;
    check?: boolean;
    status?: boolean;
    createdAt?: boolean;
    createdBy?: boolean;
    closedAt?: boolean;
    closedBy?: boolean;
    closedVia?: boolean;
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["sheetTask"]>;
export type SheetTaskSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    reference?: boolean;
    client?: boolean;
    sheet?: boolean;
    what?: boolean;
    value?: boolean;
    check?: boolean;
    status?: boolean;
    createdAt?: boolean;
    createdBy?: boolean;
    closedAt?: boolean;
    closedBy?: boolean;
    closedVia?: boolean;
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["sheetTask"]>;
export type SheetTaskSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    reference?: boolean;
    client?: boolean;
    sheet?: boolean;
    what?: boolean;
    value?: boolean;
    check?: boolean;
    status?: boolean;
    createdAt?: boolean;
    createdBy?: boolean;
    closedAt?: boolean;
    closedBy?: boolean;
    closedVia?: boolean;
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
}, ExtArgs["result"]["sheetTask"]>;
export type SheetTaskSelectScalar = {
    id?: boolean;
    tradeId?: boolean;
    reference?: boolean;
    client?: boolean;
    sheet?: boolean;
    what?: boolean;
    value?: boolean;
    check?: boolean;
    status?: boolean;
    createdAt?: boolean;
    createdBy?: boolean;
    closedAt?: boolean;
    closedBy?: boolean;
    closedVia?: boolean;
};
export type SheetTaskOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tradeId" | "reference" | "client" | "sheet" | "what" | "value" | "check" | "status" | "createdAt" | "createdBy" | "closedAt" | "closedBy" | "closedVia", ExtArgs["result"]["sheetTask"]>;
export type SheetTaskInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
};
export type SheetTaskIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
};
export type SheetTaskIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.SheetTask$tradeArgs<ExtArgs>;
};
export type $SheetTaskPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SheetTask";
    objects: {
        trade: Prisma.$TradePayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        tradeId: number | null;
        reference: string;
        client: string;
        sheet: string;
        what: string;
        value: string;
        check: $Enums.TaskCheck;
        status: $Enums.SheetTaskStatus;
        createdAt: Date;
        createdBy: string;
        closedAt: Date | null;
        closedBy: string | null;
        closedVia: $Enums.TaskClosedVia | null;
    }, ExtArgs["result"]["sheetTask"]>;
    composites: {};
};
export type SheetTaskGetPayload<S extends boolean | null | undefined | SheetTaskDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload, S>;
export type SheetTaskCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SheetTaskFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SheetTaskCountAggregateInputType | true;
};
export interface SheetTaskDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SheetTask'];
        meta: {
            name: 'SheetTask';
        };
    };
    findUnique<T extends SheetTaskFindUniqueArgs>(args: Prisma.SelectSubset<T, SheetTaskFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SheetTaskFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SheetTaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SheetTaskFindFirstArgs>(args?: Prisma.SelectSubset<T, SheetTaskFindFirstArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SheetTaskFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SheetTaskFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SheetTaskFindManyArgs>(args?: Prisma.SelectSubset<T, SheetTaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SheetTaskCreateArgs>(args: Prisma.SelectSubset<T, SheetTaskCreateArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SheetTaskCreateManyArgs>(args?: Prisma.SelectSubset<T, SheetTaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SheetTaskCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SheetTaskCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SheetTaskDeleteArgs>(args: Prisma.SelectSubset<T, SheetTaskDeleteArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SheetTaskUpdateArgs>(args: Prisma.SelectSubset<T, SheetTaskUpdateArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SheetTaskDeleteManyArgs>(args?: Prisma.SelectSubset<T, SheetTaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SheetTaskUpdateManyArgs>(args: Prisma.SelectSubset<T, SheetTaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SheetTaskUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SheetTaskUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SheetTaskUpsertArgs>(args: Prisma.SelectSubset<T, SheetTaskUpsertArgs<ExtArgs>>): Prisma.Prisma__SheetTaskClient<runtime.Types.Result.GetResult<Prisma.$SheetTaskPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SheetTaskCountArgs>(args?: Prisma.Subset<T, SheetTaskCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SheetTaskCountAggregateOutputType> : number>;
    aggregate<T extends SheetTaskAggregateArgs>(args: Prisma.Subset<T, SheetTaskAggregateArgs>): Prisma.PrismaPromise<GetSheetTaskAggregateType<T>>;
    groupBy<T extends SheetTaskGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SheetTaskGroupByArgs['orderBy'];
    } : {
        orderBy?: SheetTaskGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SheetTaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSheetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SheetTaskFieldRefs;
}
export interface Prisma__SheetTaskClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trade<T extends Prisma.SheetTask$tradeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SheetTask$tradeArgs<ExtArgs>>): Prisma.Prisma__TradeClient<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SheetTaskFieldRefs {
    readonly id: Prisma.FieldRef<"SheetTask", 'Int'>;
    readonly tradeId: Prisma.FieldRef<"SheetTask", 'Int'>;
    readonly reference: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly client: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly sheet: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly what: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly value: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly check: Prisma.FieldRef<"SheetTask", 'TaskCheck'>;
    readonly status: Prisma.FieldRef<"SheetTask", 'SheetTaskStatus'>;
    readonly createdAt: Prisma.FieldRef<"SheetTask", 'DateTime'>;
    readonly createdBy: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly closedAt: Prisma.FieldRef<"SheetTask", 'DateTime'>;
    readonly closedBy: Prisma.FieldRef<"SheetTask", 'String'>;
    readonly closedVia: Prisma.FieldRef<"SheetTask", 'TaskClosedVia'>;
}
export type SheetTaskFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where: Prisma.SheetTaskWhereUniqueInput;
};
export type SheetTaskFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where: Prisma.SheetTaskWhereUniqueInput;
};
export type SheetTaskFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where?: Prisma.SheetTaskWhereInput;
    orderBy?: Prisma.SheetTaskOrderByWithRelationInput | Prisma.SheetTaskOrderByWithRelationInput[];
    cursor?: Prisma.SheetTaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetTaskScalarFieldEnum | Prisma.SheetTaskScalarFieldEnum[];
};
export type SheetTaskFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where?: Prisma.SheetTaskWhereInput;
    orderBy?: Prisma.SheetTaskOrderByWithRelationInput | Prisma.SheetTaskOrderByWithRelationInput[];
    cursor?: Prisma.SheetTaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetTaskScalarFieldEnum | Prisma.SheetTaskScalarFieldEnum[];
};
export type SheetTaskFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where?: Prisma.SheetTaskWhereInput;
    orderBy?: Prisma.SheetTaskOrderByWithRelationInput | Prisma.SheetTaskOrderByWithRelationInput[];
    cursor?: Prisma.SheetTaskWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SheetTaskScalarFieldEnum | Prisma.SheetTaskScalarFieldEnum[];
};
export type SheetTaskCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetTaskCreateInput, Prisma.SheetTaskUncheckedCreateInput>;
};
export type SheetTaskCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SheetTaskCreateManyInput | Prisma.SheetTaskCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SheetTaskCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    data: Prisma.SheetTaskCreateManyInput | Prisma.SheetTaskCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SheetTaskIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SheetTaskUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetTaskUpdateInput, Prisma.SheetTaskUncheckedUpdateInput>;
    where: Prisma.SheetTaskWhereUniqueInput;
};
export type SheetTaskUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SheetTaskUpdateManyMutationInput, Prisma.SheetTaskUncheckedUpdateManyInput>;
    where?: Prisma.SheetTaskWhereInput;
    limit?: number;
};
export type SheetTaskUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SheetTaskUpdateManyMutationInput, Prisma.SheetTaskUncheckedUpdateManyInput>;
    where?: Prisma.SheetTaskWhereInput;
    limit?: number;
    include?: Prisma.SheetTaskIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SheetTaskUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where: Prisma.SheetTaskWhereUniqueInput;
    create: Prisma.XOR<Prisma.SheetTaskCreateInput, Prisma.SheetTaskUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SheetTaskUpdateInput, Prisma.SheetTaskUncheckedUpdateInput>;
};
export type SheetTaskDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
    where: Prisma.SheetTaskWhereUniqueInput;
};
export type SheetTaskDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SheetTaskWhereInput;
    limit?: number;
};
export type SheetTask$tradeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
};
export type SheetTaskDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SheetTaskSelect<ExtArgs> | null;
    omit?: Prisma.SheetTaskOmit<ExtArgs> | null;
    include?: Prisma.SheetTaskInclude<ExtArgs> | null;
};
//# sourceMappingURL=SheetTask.d.ts.map