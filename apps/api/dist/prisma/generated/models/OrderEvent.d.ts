import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type OrderEventModel = runtime.Types.Result.DefaultSelection<Prisma.$OrderEventPayload>;
export type AggregateOrderEvent = {
    _count: OrderEventCountAggregateOutputType | null;
    _avg: OrderEventAvgAggregateOutputType | null;
    _sum: OrderEventSumAggregateOutputType | null;
    _min: OrderEventMinAggregateOutputType | null;
    _max: OrderEventMaxAggregateOutputType | null;
};
export type OrderEventAvgAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
};
export type OrderEventSumAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
};
export type OrderEventMinAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
    step: $Enums.OrderStep | null;
    by: string | null;
    at: Date | null;
    note: string | null;
};
export type OrderEventMaxAggregateOutputType = {
    id: number | null;
    tradeId: number | null;
    step: $Enums.OrderStep | null;
    by: string | null;
    at: Date | null;
    note: string | null;
};
export type OrderEventCountAggregateOutputType = {
    id: number;
    tradeId: number;
    step: number;
    by: number;
    at: number;
    note: number;
    _all: number;
};
export type OrderEventAvgAggregateInputType = {
    id?: true;
    tradeId?: true;
};
export type OrderEventSumAggregateInputType = {
    id?: true;
    tradeId?: true;
};
export type OrderEventMinAggregateInputType = {
    id?: true;
    tradeId?: true;
    step?: true;
    by?: true;
    at?: true;
    note?: true;
};
export type OrderEventMaxAggregateInputType = {
    id?: true;
    tradeId?: true;
    step?: true;
    by?: true;
    at?: true;
    note?: true;
};
export type OrderEventCountAggregateInputType = {
    id?: true;
    tradeId?: true;
    step?: true;
    by?: true;
    at?: true;
    note?: true;
    _all?: true;
};
export type OrderEventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderEventWhereInput;
    orderBy?: Prisma.OrderEventOrderByWithRelationInput | Prisma.OrderEventOrderByWithRelationInput[];
    cursor?: Prisma.OrderEventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OrderEventCountAggregateInputType;
    _avg?: OrderEventAvgAggregateInputType;
    _sum?: OrderEventSumAggregateInputType;
    _min?: OrderEventMinAggregateInputType;
    _max?: OrderEventMaxAggregateInputType;
};
export type GetOrderEventAggregateType<T extends OrderEventAggregateArgs> = {
    [P in keyof T & keyof AggregateOrderEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOrderEvent[P]> : Prisma.GetScalarType<T[P], AggregateOrderEvent[P]>;
};
export type OrderEventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderEventWhereInput;
    orderBy?: Prisma.OrderEventOrderByWithAggregationInput | Prisma.OrderEventOrderByWithAggregationInput[];
    by: Prisma.OrderEventScalarFieldEnum[] | Prisma.OrderEventScalarFieldEnum;
    having?: Prisma.OrderEventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OrderEventCountAggregateInputType | true;
    _avg?: OrderEventAvgAggregateInputType;
    _sum?: OrderEventSumAggregateInputType;
    _min?: OrderEventMinAggregateInputType;
    _max?: OrderEventMaxAggregateInputType;
};
export type OrderEventGroupByOutputType = {
    id: number;
    tradeId: number;
    step: $Enums.OrderStep;
    by: string;
    at: Date;
    note: string | null;
    _count: OrderEventCountAggregateOutputType | null;
    _avg: OrderEventAvgAggregateOutputType | null;
    _sum: OrderEventSumAggregateOutputType | null;
    _min: OrderEventMinAggregateOutputType | null;
    _max: OrderEventMaxAggregateOutputType | null;
};
export type GetOrderEventGroupByPayload<T extends OrderEventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OrderEventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OrderEventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OrderEventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OrderEventGroupByOutputType[P]>;
}>>;
export type OrderEventWhereInput = {
    AND?: Prisma.OrderEventWhereInput | Prisma.OrderEventWhereInput[];
    OR?: Prisma.OrderEventWhereInput[];
    NOT?: Prisma.OrderEventWhereInput | Prisma.OrderEventWhereInput[];
    id?: Prisma.IntFilter<"OrderEvent"> | number;
    tradeId?: Prisma.IntFilter<"OrderEvent"> | number;
    step?: Prisma.EnumOrderStepFilter<"OrderEvent"> | $Enums.OrderStep;
    by?: Prisma.StringFilter<"OrderEvent"> | string;
    at?: Prisma.DateTimeFilter<"OrderEvent"> | Date | string;
    note?: Prisma.StringNullableFilter<"OrderEvent"> | string | null;
    trade?: Prisma.XOR<Prisma.TradeScalarRelationFilter, Prisma.TradeWhereInput>;
};
export type OrderEventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    step?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    trade?: Prisma.TradeOrderByWithRelationInput;
};
export type OrderEventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.OrderEventWhereInput | Prisma.OrderEventWhereInput[];
    OR?: Prisma.OrderEventWhereInput[];
    NOT?: Prisma.OrderEventWhereInput | Prisma.OrderEventWhereInput[];
    tradeId?: Prisma.IntFilter<"OrderEvent"> | number;
    step?: Prisma.EnumOrderStepFilter<"OrderEvent"> | $Enums.OrderStep;
    by?: Prisma.StringFilter<"OrderEvent"> | string;
    at?: Prisma.DateTimeFilter<"OrderEvent"> | Date | string;
    note?: Prisma.StringNullableFilter<"OrderEvent"> | string | null;
    trade?: Prisma.XOR<Prisma.TradeScalarRelationFilter, Prisma.TradeWhereInput>;
}, "id">;
export type OrderEventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    step?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.OrderEventCountOrderByAggregateInput;
    _avg?: Prisma.OrderEventAvgOrderByAggregateInput;
    _max?: Prisma.OrderEventMaxOrderByAggregateInput;
    _min?: Prisma.OrderEventMinOrderByAggregateInput;
    _sum?: Prisma.OrderEventSumOrderByAggregateInput;
};
export type OrderEventScalarWhereWithAggregatesInput = {
    AND?: Prisma.OrderEventScalarWhereWithAggregatesInput | Prisma.OrderEventScalarWhereWithAggregatesInput[];
    OR?: Prisma.OrderEventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OrderEventScalarWhereWithAggregatesInput | Prisma.OrderEventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"OrderEvent"> | number;
    tradeId?: Prisma.IntWithAggregatesFilter<"OrderEvent"> | number;
    step?: Prisma.EnumOrderStepWithAggregatesFilter<"OrderEvent"> | $Enums.OrderStep;
    by?: Prisma.StringWithAggregatesFilter<"OrderEvent"> | string;
    at?: Prisma.DateTimeWithAggregatesFilter<"OrderEvent"> | Date | string;
    note?: Prisma.StringNullableWithAggregatesFilter<"OrderEvent"> | string | null;
};
export type OrderEventCreateInput = {
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
    trade: Prisma.TradeCreateNestedOneWithoutEventsInput;
};
export type OrderEventUncheckedCreateInput = {
    id?: number;
    tradeId: number;
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
};
export type OrderEventUpdateInput = {
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    trade?: Prisma.TradeUpdateOneRequiredWithoutEventsNestedInput;
};
export type OrderEventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.IntFieldUpdateOperationsInput | number;
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventCreateManyInput = {
    id?: number;
    tradeId: number;
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
};
export type OrderEventUpdateManyMutationInput = {
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    tradeId?: Prisma.IntFieldUpdateOperationsInput | number;
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventListRelationFilter = {
    every?: Prisma.OrderEventWhereInput;
    some?: Prisma.OrderEventWhereInput;
    none?: Prisma.OrderEventWhereInput;
};
export type OrderEventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OrderEventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    step?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type OrderEventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type OrderEventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    step?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type OrderEventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
    step?: Prisma.SortOrder;
    by?: Prisma.SortOrder;
    at?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
};
export type OrderEventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    tradeId?: Prisma.SortOrder;
};
export type OrderEventCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput> | Prisma.OrderEventCreateWithoutTradeInput[] | Prisma.OrderEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.OrderEventCreateOrConnectWithoutTradeInput | Prisma.OrderEventCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.OrderEventCreateManyTradeInputEnvelope;
    connect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
};
export type OrderEventUncheckedCreateNestedManyWithoutTradeInput = {
    create?: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput> | Prisma.OrderEventCreateWithoutTradeInput[] | Prisma.OrderEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.OrderEventCreateOrConnectWithoutTradeInput | Prisma.OrderEventCreateOrConnectWithoutTradeInput[];
    createMany?: Prisma.OrderEventCreateManyTradeInputEnvelope;
    connect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
};
export type OrderEventUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput> | Prisma.OrderEventCreateWithoutTradeInput[] | Prisma.OrderEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.OrderEventCreateOrConnectWithoutTradeInput | Prisma.OrderEventCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.OrderEventUpsertWithWhereUniqueWithoutTradeInput | Prisma.OrderEventUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.OrderEventCreateManyTradeInputEnvelope;
    set?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    disconnect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    delete?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    connect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    update?: Prisma.OrderEventUpdateWithWhereUniqueWithoutTradeInput | Prisma.OrderEventUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.OrderEventUpdateManyWithWhereWithoutTradeInput | Prisma.OrderEventUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.OrderEventScalarWhereInput | Prisma.OrderEventScalarWhereInput[];
};
export type OrderEventUncheckedUpdateManyWithoutTradeNestedInput = {
    create?: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput> | Prisma.OrderEventCreateWithoutTradeInput[] | Prisma.OrderEventUncheckedCreateWithoutTradeInput[];
    connectOrCreate?: Prisma.OrderEventCreateOrConnectWithoutTradeInput | Prisma.OrderEventCreateOrConnectWithoutTradeInput[];
    upsert?: Prisma.OrderEventUpsertWithWhereUniqueWithoutTradeInput | Prisma.OrderEventUpsertWithWhereUniqueWithoutTradeInput[];
    createMany?: Prisma.OrderEventCreateManyTradeInputEnvelope;
    set?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    disconnect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    delete?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    connect?: Prisma.OrderEventWhereUniqueInput | Prisma.OrderEventWhereUniqueInput[];
    update?: Prisma.OrderEventUpdateWithWhereUniqueWithoutTradeInput | Prisma.OrderEventUpdateWithWhereUniqueWithoutTradeInput[];
    updateMany?: Prisma.OrderEventUpdateManyWithWhereWithoutTradeInput | Prisma.OrderEventUpdateManyWithWhereWithoutTradeInput[];
    deleteMany?: Prisma.OrderEventScalarWhereInput | Prisma.OrderEventScalarWhereInput[];
};
export type EnumOrderStepFieldUpdateOperationsInput = {
    set?: $Enums.OrderStep;
};
export type OrderEventCreateWithoutTradeInput = {
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
};
export type OrderEventUncheckedCreateWithoutTradeInput = {
    id?: number;
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
};
export type OrderEventCreateOrConnectWithoutTradeInput = {
    where: Prisma.OrderEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput>;
};
export type OrderEventCreateManyTradeInputEnvelope = {
    data: Prisma.OrderEventCreateManyTradeInput | Prisma.OrderEventCreateManyTradeInput[];
    skipDuplicates?: boolean;
};
export type OrderEventUpsertWithWhereUniqueWithoutTradeInput = {
    where: Prisma.OrderEventWhereUniqueInput;
    update: Prisma.XOR<Prisma.OrderEventUpdateWithoutTradeInput, Prisma.OrderEventUncheckedUpdateWithoutTradeInput>;
    create: Prisma.XOR<Prisma.OrderEventCreateWithoutTradeInput, Prisma.OrderEventUncheckedCreateWithoutTradeInput>;
};
export type OrderEventUpdateWithWhereUniqueWithoutTradeInput = {
    where: Prisma.OrderEventWhereUniqueInput;
    data: Prisma.XOR<Prisma.OrderEventUpdateWithoutTradeInput, Prisma.OrderEventUncheckedUpdateWithoutTradeInput>;
};
export type OrderEventUpdateManyWithWhereWithoutTradeInput = {
    where: Prisma.OrderEventScalarWhereInput;
    data: Prisma.XOR<Prisma.OrderEventUpdateManyMutationInput, Prisma.OrderEventUncheckedUpdateManyWithoutTradeInput>;
};
export type OrderEventScalarWhereInput = {
    AND?: Prisma.OrderEventScalarWhereInput | Prisma.OrderEventScalarWhereInput[];
    OR?: Prisma.OrderEventScalarWhereInput[];
    NOT?: Prisma.OrderEventScalarWhereInput | Prisma.OrderEventScalarWhereInput[];
    id?: Prisma.IntFilter<"OrderEvent"> | number;
    tradeId?: Prisma.IntFilter<"OrderEvent"> | number;
    step?: Prisma.EnumOrderStepFilter<"OrderEvent"> | $Enums.OrderStep;
    by?: Prisma.StringFilter<"OrderEvent"> | string;
    at?: Prisma.DateTimeFilter<"OrderEvent"> | Date | string;
    note?: Prisma.StringNullableFilter<"OrderEvent"> | string | null;
};
export type OrderEventCreateManyTradeInput = {
    id?: number;
    step: $Enums.OrderStep;
    by: string;
    at?: Date | string;
    note?: string | null;
};
export type OrderEventUpdateWithoutTradeInput = {
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventUncheckedUpdateWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventUncheckedUpdateManyWithoutTradeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    step?: Prisma.EnumOrderStepFieldUpdateOperationsInput | $Enums.OrderStep;
    by?: Prisma.StringFieldUpdateOperationsInput | string;
    at?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type OrderEventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    step?: boolean;
    by?: boolean;
    at?: boolean;
    note?: boolean;
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderEvent"]>;
export type OrderEventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    step?: boolean;
    by?: boolean;
    at?: boolean;
    note?: boolean;
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderEvent"]>;
export type OrderEventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    tradeId?: boolean;
    step?: boolean;
    by?: boolean;
    at?: boolean;
    note?: boolean;
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["orderEvent"]>;
export type OrderEventSelectScalar = {
    id?: boolean;
    tradeId?: boolean;
    step?: boolean;
    by?: boolean;
    at?: boolean;
    note?: boolean;
};
export type OrderEventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "tradeId" | "step" | "by" | "at" | "note", ExtArgs["result"]["orderEvent"]>;
export type OrderEventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
};
export type OrderEventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
};
export type OrderEventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    trade?: boolean | Prisma.TradeDefaultArgs<ExtArgs>;
};
export type $OrderEventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "OrderEvent";
    objects: {
        trade: Prisma.$TradePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        tradeId: number;
        step: $Enums.OrderStep;
        by: string;
        at: Date;
        note: string | null;
    }, ExtArgs["result"]["orderEvent"]>;
    composites: {};
};
export type OrderEventGetPayload<S extends boolean | null | undefined | OrderEventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OrderEventPayload, S>;
export type OrderEventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OrderEventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OrderEventCountAggregateInputType | true;
};
export interface OrderEventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['OrderEvent'];
        meta: {
            name: 'OrderEvent';
        };
    };
    findUnique<T extends OrderEventFindUniqueArgs>(args: Prisma.SelectSubset<T, OrderEventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OrderEventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OrderEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OrderEventFindFirstArgs>(args?: Prisma.SelectSubset<T, OrderEventFindFirstArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OrderEventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OrderEventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OrderEventFindManyArgs>(args?: Prisma.SelectSubset<T, OrderEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OrderEventCreateArgs>(args: Prisma.SelectSubset<T, OrderEventCreateArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OrderEventCreateManyArgs>(args?: Prisma.SelectSubset<T, OrderEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OrderEventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OrderEventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OrderEventDeleteArgs>(args: Prisma.SelectSubset<T, OrderEventDeleteArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OrderEventUpdateArgs>(args: Prisma.SelectSubset<T, OrderEventUpdateArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OrderEventDeleteManyArgs>(args?: Prisma.SelectSubset<T, OrderEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OrderEventUpdateManyArgs>(args: Prisma.SelectSubset<T, OrderEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OrderEventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OrderEventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OrderEventUpsertArgs>(args: Prisma.SelectSubset<T, OrderEventUpsertArgs<ExtArgs>>): Prisma.Prisma__OrderEventClient<runtime.Types.Result.GetResult<Prisma.$OrderEventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OrderEventCountArgs>(args?: Prisma.Subset<T, OrderEventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OrderEventCountAggregateOutputType> : number>;
    aggregate<T extends OrderEventAggregateArgs>(args: Prisma.Subset<T, OrderEventAggregateArgs>): Prisma.PrismaPromise<GetOrderEventAggregateType<T>>;
    groupBy<T extends OrderEventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OrderEventGroupByArgs['orderBy'];
    } : {
        orderBy?: OrderEventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OrderEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOrderEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OrderEventFieldRefs;
}
export interface Prisma__OrderEventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    trade<T extends Prisma.TradeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TradeDefaultArgs<ExtArgs>>): Prisma.Prisma__TradeClient<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OrderEventFieldRefs {
    readonly id: Prisma.FieldRef<"OrderEvent", 'Int'>;
    readonly tradeId: Prisma.FieldRef<"OrderEvent", 'Int'>;
    readonly step: Prisma.FieldRef<"OrderEvent", 'OrderStep'>;
    readonly by: Prisma.FieldRef<"OrderEvent", 'String'>;
    readonly at: Prisma.FieldRef<"OrderEvent", 'DateTime'>;
    readonly note: Prisma.FieldRef<"OrderEvent", 'String'>;
}
export type OrderEventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where: Prisma.OrderEventWhereUniqueInput;
};
export type OrderEventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where: Prisma.OrderEventWhereUniqueInput;
};
export type OrderEventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where?: Prisma.OrderEventWhereInput;
    orderBy?: Prisma.OrderEventOrderByWithRelationInput | Prisma.OrderEventOrderByWithRelationInput[];
    cursor?: Prisma.OrderEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderEventScalarFieldEnum | Prisma.OrderEventScalarFieldEnum[];
};
export type OrderEventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where?: Prisma.OrderEventWhereInput;
    orderBy?: Prisma.OrderEventOrderByWithRelationInput | Prisma.OrderEventOrderByWithRelationInput[];
    cursor?: Prisma.OrderEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderEventScalarFieldEnum | Prisma.OrderEventScalarFieldEnum[];
};
export type OrderEventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where?: Prisma.OrderEventWhereInput;
    orderBy?: Prisma.OrderEventOrderByWithRelationInput | Prisma.OrderEventOrderByWithRelationInput[];
    cursor?: Prisma.OrderEventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OrderEventScalarFieldEnum | Prisma.OrderEventScalarFieldEnum[];
};
export type OrderEventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderEventCreateInput, Prisma.OrderEventUncheckedCreateInput>;
};
export type OrderEventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OrderEventCreateManyInput | Prisma.OrderEventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OrderEventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    data: Prisma.OrderEventCreateManyInput | Prisma.OrderEventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OrderEventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OrderEventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderEventUpdateInput, Prisma.OrderEventUncheckedUpdateInput>;
    where: Prisma.OrderEventWhereUniqueInput;
};
export type OrderEventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OrderEventUpdateManyMutationInput, Prisma.OrderEventUncheckedUpdateManyInput>;
    where?: Prisma.OrderEventWhereInput;
    limit?: number;
};
export type OrderEventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OrderEventUpdateManyMutationInput, Prisma.OrderEventUncheckedUpdateManyInput>;
    where?: Prisma.OrderEventWhereInput;
    limit?: number;
    include?: Prisma.OrderEventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OrderEventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where: Prisma.OrderEventWhereUniqueInput;
    create: Prisma.XOR<Prisma.OrderEventCreateInput, Prisma.OrderEventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OrderEventUpdateInput, Prisma.OrderEventUncheckedUpdateInput>;
};
export type OrderEventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
    where: Prisma.OrderEventWhereUniqueInput;
};
export type OrderEventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OrderEventWhereInput;
    limit?: number;
};
export type OrderEventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OrderEventSelect<ExtArgs> | null;
    omit?: Prisma.OrderEventOmit<ExtArgs> | null;
    include?: Prisma.OrderEventInclude<ExtArgs> | null;
};
//# sourceMappingURL=OrderEvent.d.ts.map