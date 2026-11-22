import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type BranchModel = runtime.Types.Result.DefaultSelection<Prisma.$BranchPayload>;
export type AggregateBranch = {
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type BranchAvgAggregateOutputType = {
    id: number | null;
};
export type BranchSumAggregateOutputType = {
    id: number | null;
};
export type BranchMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    address: string | null;
    region: $Enums.BranchRegion | null;
    currency: $Enums.Currency | null;
    createdAt: Date | null;
};
export type BranchMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    address: string | null;
    region: $Enums.BranchRegion | null;
    currency: $Enums.Currency | null;
    createdAt: Date | null;
};
export type BranchCountAggregateOutputType = {
    id: number;
    name: number;
    address: number;
    region: number;
    currency: number;
    createdAt: number;
    _all: number;
};
export type BranchAvgAggregateInputType = {
    id?: true;
};
export type BranchSumAggregateInputType = {
    id?: true;
};
export type BranchMinAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    region?: true;
    currency?: true;
    createdAt?: true;
};
export type BranchMaxAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    region?: true;
    currency?: true;
    createdAt?: true;
};
export type BranchCountAggregateInputType = {
    id?: true;
    name?: true;
    address?: true;
    region?: true;
    currency?: true;
    createdAt?: true;
    _all?: true;
};
export type BranchAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BranchCountAggregateInputType;
    _avg?: BranchAvgAggregateInputType;
    _sum?: BranchSumAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type GetBranchAggregateType<T extends BranchAggregateArgs> = {
    [P in keyof T & keyof AggregateBranch]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBranch[P]> : Prisma.GetScalarType<T[P], AggregateBranch[P]>;
};
export type BranchGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithAggregationInput | Prisma.BranchOrderByWithAggregationInput[];
    by: Prisma.BranchScalarFieldEnum[] | Prisma.BranchScalarFieldEnum;
    having?: Prisma.BranchScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BranchCountAggregateInputType | true;
    _avg?: BranchAvgAggregateInputType;
    _sum?: BranchSumAggregateInputType;
    _min?: BranchMinAggregateInputType;
    _max?: BranchMaxAggregateInputType;
};
export type BranchGroupByOutputType = {
    id: number;
    name: string;
    address: string | null;
    region: $Enums.BranchRegion;
    currency: $Enums.Currency;
    createdAt: Date;
    _count: BranchCountAggregateOutputType | null;
    _avg: BranchAvgAggregateOutputType | null;
    _sum: BranchSumAggregateOutputType | null;
    _min: BranchMinAggregateOutputType | null;
    _max: BranchMaxAggregateOutputType | null;
};
export type GetBranchGroupByPayload<T extends BranchGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BranchGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BranchGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BranchGroupByOutputType[P]>;
}>>;
export type BranchWhereInput = {
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    id?: Prisma.IntFilter<"Branch"> | number;
    name?: Prisma.StringFilter<"Branch"> | string;
    address?: Prisma.StringNullableFilter<"Branch"> | string | null;
    region?: Prisma.EnumBranchRegionFilter<"Branch"> | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFilter<"Branch"> | $Enums.Currency;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
};
export type BranchOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    region?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    users?: Prisma.UserOrderByRelationAggregateInput;
    trades?: Prisma.TradeOrderByRelationAggregateInput;
    lots?: Prisma.PurchaseLotOrderByRelationAggregateInput;
};
export type BranchWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    OR?: Prisma.BranchWhereInput[];
    NOT?: Prisma.BranchWhereInput | Prisma.BranchWhereInput[];
    name?: Prisma.StringFilter<"Branch"> | string;
    address?: Prisma.StringNullableFilter<"Branch"> | string | null;
    region?: Prisma.EnumBranchRegionFilter<"Branch"> | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFilter<"Branch"> | $Enums.Currency;
    createdAt?: Prisma.DateTimeFilter<"Branch"> | Date | string;
    users?: Prisma.UserListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
}, "id">;
export type BranchOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    address?: Prisma.SortOrderInput | Prisma.SortOrder;
    region?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.BranchCountOrderByAggregateInput;
    _avg?: Prisma.BranchAvgOrderByAggregateInput;
    _max?: Prisma.BranchMaxOrderByAggregateInput;
    _min?: Prisma.BranchMinOrderByAggregateInput;
    _sum?: Prisma.BranchSumOrderByAggregateInput;
};
export type BranchScalarWhereWithAggregatesInput = {
    AND?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    OR?: Prisma.BranchScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BranchScalarWhereWithAggregatesInput | Prisma.BranchScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Branch"> | number;
    name?: Prisma.StringWithAggregatesFilter<"Branch"> | string;
    address?: Prisma.StringNullableWithAggregatesFilter<"Branch"> | string | null;
    region?: Prisma.EnumBranchRegionWithAggregatesFilter<"Branch"> | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyWithAggregatesFilter<"Branch"> | $Enums.Currency;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Branch"> | Date | string;
};
export type BranchCreateInput = {
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    trades?: Prisma.TradeCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateInput = {
    id?: number;
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateManyInput = {
    id?: number;
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
};
export type BranchUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BranchNullableScalarRelationFilter = {
    is?: Prisma.BranchWhereInput | null;
    isNot?: Prisma.BranchWhereInput | null;
};
export type BranchCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BranchAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type BranchMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BranchMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    address?: Prisma.SortOrder;
    region?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type BranchSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type BranchCreateNestedOneWithoutUsersInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutUsersNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutUsersInput;
    upsert?: Prisma.BranchUpsertWithoutUsersInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutUsersInput, Prisma.BranchUpdateWithoutUsersInput>, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type EnumBranchRegionFieldUpdateOperationsInput = {
    set?: $Enums.BranchRegion;
};
export type EnumCurrencyFieldUpdateOperationsInput = {
    set?: $Enums.Currency;
};
export type BranchCreateNestedOneWithoutTradesInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutTradesInput, Prisma.BranchUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutTradesInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutTradesNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutTradesInput, Prisma.BranchUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutTradesInput;
    upsert?: Prisma.BranchUpsertWithoutTradesInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutTradesInput, Prisma.BranchUpdateWithoutTradesInput>, Prisma.BranchUncheckedUpdateWithoutTradesInput>;
};
export type BranchCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutLotsInput, Prisma.BranchUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutLotsInput;
    connect?: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateOneWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.BranchCreateWithoutLotsInput, Prisma.BranchUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.BranchCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.BranchUpsertWithoutLotsInput;
    disconnect?: Prisma.BranchWhereInput | boolean;
    delete?: Prisma.BranchWhereInput | boolean;
    connect?: Prisma.BranchWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BranchUpdateToOneWithWhereWithoutLotsInput, Prisma.BranchUpdateWithoutLotsInput>, Prisma.BranchUncheckedUpdateWithoutLotsInput>;
};
export type BranchCreateWithoutUsersInput = {
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    trades?: Prisma.TradeCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutUsersInput = {
    id?: number;
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutUsersInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
};
export type BranchUpsertWithoutUsersInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutUsersInput, Prisma.BranchUncheckedCreateWithoutUsersInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutUsersInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutUsersInput, Prisma.BranchUncheckedUpdateWithoutUsersInput>;
};
export type BranchUpdateWithoutUsersInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutUsersInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutTradesInput = {
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutTradesInput = {
    id?: number;
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutTradesInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutTradesInput, Prisma.BranchUncheckedCreateWithoutTradesInput>;
};
export type BranchUpsertWithoutTradesInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutTradesInput, Prisma.BranchUncheckedUpdateWithoutTradesInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutTradesInput, Prisma.BranchUncheckedCreateWithoutTradesInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutTradesInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutTradesInput, Prisma.BranchUncheckedUpdateWithoutTradesInput>;
};
export type BranchUpdateWithoutTradesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCreateWithoutLotsInput = {
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserCreateNestedManyWithoutBranchInput;
    trades?: Prisma.TradeCreateNestedManyWithoutBranchInput;
};
export type BranchUncheckedCreateWithoutLotsInput = {
    id?: number;
    name: string;
    address?: string | null;
    region?: $Enums.BranchRegion;
    currency?: $Enums.Currency;
    createdAt?: Date | string;
    users?: Prisma.UserUncheckedCreateNestedManyWithoutBranchInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutBranchInput;
};
export type BranchCreateOrConnectWithoutLotsInput = {
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateWithoutLotsInput, Prisma.BranchUncheckedCreateWithoutLotsInput>;
};
export type BranchUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.BranchUpdateWithoutLotsInput, Prisma.BranchUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.BranchCreateWithoutLotsInput, Prisma.BranchUncheckedCreateWithoutLotsInput>;
    where?: Prisma.BranchWhereInput;
};
export type BranchUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.BranchWhereInput;
    data: Prisma.XOR<Prisma.BranchUpdateWithoutLotsInput, Prisma.BranchUncheckedUpdateWithoutLotsInput>;
};
export type BranchUpdateWithoutLotsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUpdateManyWithoutBranchNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutBranchNestedInput;
};
export type BranchUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    address?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    region?: Prisma.EnumBranchRegionFieldUpdateOperationsInput | $Enums.BranchRegion;
    currency?: Prisma.EnumCurrencyFieldUpdateOperationsInput | $Enums.Currency;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    users?: Prisma.UserUncheckedUpdateManyWithoutBranchNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutBranchNestedInput;
};
export type BranchCountOutputType = {
    users: number;
    trades: number;
    lots: number;
};
export type BranchCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | BranchCountOutputTypeCountUsersArgs;
    trades?: boolean | BranchCountOutputTypeCountTradesArgs;
    lots?: boolean | BranchCountOutputTypeCountLotsArgs;
};
export type BranchCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchCountOutputTypeSelect<ExtArgs> | null;
};
export type BranchCountOutputTypeCountUsersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
};
export type BranchCountOutputTypeCountTradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TradeWhereInput;
};
export type BranchCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseLotWhereInput;
};
export type BranchSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    address?: boolean;
    region?: boolean;
    currency?: boolean;
    createdAt?: boolean;
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    trades?: boolean | Prisma.Branch$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.Branch$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    address?: boolean;
    region?: boolean;
    currency?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    address?: boolean;
    region?: boolean;
    currency?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["branch"]>;
export type BranchSelectScalar = {
    id?: boolean;
    name?: boolean;
    address?: boolean;
    region?: boolean;
    currency?: boolean;
    createdAt?: boolean;
};
export type BranchOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "address" | "region" | "currency" | "createdAt", ExtArgs["result"]["branch"]>;
export type BranchInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    users?: boolean | Prisma.Branch$usersArgs<ExtArgs>;
    trades?: boolean | Prisma.Branch$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.Branch$lotsArgs<ExtArgs>;
    _count?: boolean | Prisma.BranchCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BranchIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type BranchIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $BranchPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Branch";
    objects: {
        users: Prisma.$UserPayload<ExtArgs>[];
        trades: Prisma.$TradePayload<ExtArgs>[];
        lots: Prisma.$PurchaseLotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        address: string | null;
        region: $Enums.BranchRegion;
        currency: $Enums.Currency;
        createdAt: Date;
    }, ExtArgs["result"]["branch"]>;
    composites: {};
};
export type BranchGetPayload<S extends boolean | null | undefined | BranchDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BranchPayload, S>;
export type BranchCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BranchFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BranchCountAggregateInputType | true;
};
export interface BranchDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Branch'];
        meta: {
            name: 'Branch';
        };
    };
    findUnique<T extends BranchFindUniqueArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BranchFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BranchFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BranchFindFirstArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BranchFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BranchFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BranchFindManyArgs>(args?: Prisma.SelectSubset<T, BranchFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BranchCreateArgs>(args: Prisma.SelectSubset<T, BranchCreateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BranchCreateManyArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BranchCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BranchCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BranchDeleteArgs>(args: Prisma.SelectSubset<T, BranchDeleteArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BranchUpdateArgs>(args: Prisma.SelectSubset<T, BranchUpdateArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BranchDeleteManyArgs>(args?: Prisma.SelectSubset<T, BranchDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BranchUpdateManyArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BranchUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BranchUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BranchUpsertArgs>(args: Prisma.SelectSubset<T, BranchUpsertArgs<ExtArgs>>): Prisma.Prisma__BranchClient<runtime.Types.Result.GetResult<Prisma.$BranchPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BranchCountArgs>(args?: Prisma.Subset<T, BranchCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BranchCountAggregateOutputType> : number>;
    aggregate<T extends BranchAggregateArgs>(args: Prisma.Subset<T, BranchAggregateArgs>): Prisma.PrismaPromise<GetBranchAggregateType<T>>;
    groupBy<T extends BranchGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BranchGroupByArgs['orderBy'];
    } : {
        orderBy?: BranchGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BranchGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBranchGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BranchFieldRefs;
}
export interface Prisma__BranchClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    users<T extends Prisma.Branch$usersArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$usersArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trades<T extends Prisma.Branch$tradesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.Branch$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Branch$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BranchFieldRefs {
    readonly id: Prisma.FieldRef<"Branch", 'Int'>;
    readonly name: Prisma.FieldRef<"Branch", 'String'>;
    readonly address: Prisma.FieldRef<"Branch", 'String'>;
    readonly region: Prisma.FieldRef<"Branch", 'BranchRegion'>;
    readonly currency: Prisma.FieldRef<"Branch", 'Currency'>;
    readonly createdAt: Prisma.FieldRef<"Branch", 'DateTime'>;
}
export type BranchFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where?: Prisma.BranchWhereInput;
    orderBy?: Prisma.BranchOrderByWithRelationInput | Prisma.BranchOrderByWithRelationInput[];
    cursor?: Prisma.BranchWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BranchScalarFieldEnum | Prisma.BranchScalarFieldEnum[];
};
export type BranchCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
};
export type BranchCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.BranchCreateManyInput | Prisma.BranchCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BranchUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type BranchUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BranchUpdateManyMutationInput, Prisma.BranchUncheckedUpdateManyInput>;
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type BranchUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
    create: Prisma.XOR<Prisma.BranchCreateInput, Prisma.BranchUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BranchUpdateInput, Prisma.BranchUncheckedUpdateInput>;
};
export type BranchDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
    where: Prisma.BranchWhereUniqueInput;
};
export type BranchDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BranchWhereInput;
    limit?: number;
};
export type Branch$usersArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type Branch$tradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TradeSelect<ExtArgs> | null;
    omit?: Prisma.TradeOmit<ExtArgs> | null;
    include?: Prisma.TradeInclude<ExtArgs> | null;
    where?: Prisma.TradeWhereInput;
    orderBy?: Prisma.TradeOrderByWithRelationInput | Prisma.TradeOrderByWithRelationInput[];
    cursor?: Prisma.TradeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TradeScalarFieldEnum | Prisma.TradeScalarFieldEnum[];
};
export type Branch$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PurchaseLotSelect<ExtArgs> | null;
    omit?: Prisma.PurchaseLotOmit<ExtArgs> | null;
    include?: Prisma.PurchaseLotInclude<ExtArgs> | null;
    where?: Prisma.PurchaseLotWhereInput;
    orderBy?: Prisma.PurchaseLotOrderByWithRelationInput | Prisma.PurchaseLotOrderByWithRelationInput[];
    cursor?: Prisma.PurchaseLotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PurchaseLotScalarFieldEnum | Prisma.PurchaseLotScalarFieldEnum[];
};
export type BranchDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BranchSelect<ExtArgs> | null;
    omit?: Prisma.BranchOmit<ExtArgs> | null;
    include?: Prisma.BranchInclude<ExtArgs> | null;
};
//# sourceMappingURL=Branch.d.ts.map