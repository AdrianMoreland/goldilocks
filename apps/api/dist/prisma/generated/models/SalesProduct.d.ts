import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type SalesProductModel = runtime.Types.Result.DefaultSelection<Prisma.$SalesProductPayload>;
export type AggregateSalesProduct = {
    _count: SalesProductCountAggregateOutputType | null;
    _avg: SalesProductAvgAggregateOutputType | null;
    _sum: SalesProductSumAggregateOutputType | null;
    _min: SalesProductMinAggregateOutputType | null;
    _max: SalesProductMaxAggregateOutputType | null;
};
export type SalesProductAvgAggregateOutputType = {
    id: number | null;
    pricingProductId: number | null;
};
export type SalesProductSumAggregateOutputType = {
    id: number | null;
    pricingProductId: number | null;
};
export type SalesProductMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    metal: $Enums.StockMetal | null;
    genericNorm: string | null;
    weightLabel: string | null;
    refinery: string | null;
    pricingProductId: number | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SalesProductMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    metal: $Enums.StockMetal | null;
    genericNorm: string | null;
    weightLabel: string | null;
    refinery: string | null;
    pricingProductId: number | null;
    active: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type SalesProductCountAggregateOutputType = {
    id: number;
    name: number;
    metal: number;
    genericNorm: number;
    weightLabel: number;
    refinery: number;
    pricingProductId: number;
    active: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type SalesProductAvgAggregateInputType = {
    id?: true;
    pricingProductId?: true;
};
export type SalesProductSumAggregateInputType = {
    id?: true;
    pricingProductId?: true;
};
export type SalesProductMinAggregateInputType = {
    id?: true;
    name?: true;
    metal?: true;
    genericNorm?: true;
    weightLabel?: true;
    refinery?: true;
    pricingProductId?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SalesProductMaxAggregateInputType = {
    id?: true;
    name?: true;
    metal?: true;
    genericNorm?: true;
    weightLabel?: true;
    refinery?: true;
    pricingProductId?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type SalesProductCountAggregateInputType = {
    id?: true;
    name?: true;
    metal?: true;
    genericNorm?: true;
    weightLabel?: true;
    refinery?: true;
    pricingProductId?: true;
    active?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type SalesProductAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesProductWhereInput;
    orderBy?: Prisma.SalesProductOrderByWithRelationInput | Prisma.SalesProductOrderByWithRelationInput[];
    cursor?: Prisma.SalesProductWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SalesProductCountAggregateInputType;
    _avg?: SalesProductAvgAggregateInputType;
    _sum?: SalesProductSumAggregateInputType;
    _min?: SalesProductMinAggregateInputType;
    _max?: SalesProductMaxAggregateInputType;
};
export type GetSalesProductAggregateType<T extends SalesProductAggregateArgs> = {
    [P in keyof T & keyof AggregateSalesProduct]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSalesProduct[P]> : Prisma.GetScalarType<T[P], AggregateSalesProduct[P]>;
};
export type SalesProductGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesProductWhereInput;
    orderBy?: Prisma.SalesProductOrderByWithAggregationInput | Prisma.SalesProductOrderByWithAggregationInput[];
    by: Prisma.SalesProductScalarFieldEnum[] | Prisma.SalesProductScalarFieldEnum;
    having?: Prisma.SalesProductScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SalesProductCountAggregateInputType | true;
    _avg?: SalesProductAvgAggregateInputType;
    _sum?: SalesProductSumAggregateInputType;
    _min?: SalesProductMinAggregateInputType;
    _max?: SalesProductMaxAggregateInputType;
};
export type SalesProductGroupByOutputType = {
    id: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel: string | null;
    refinery: string | null;
    pricingProductId: number | null;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: SalesProductCountAggregateOutputType | null;
    _avg: SalesProductAvgAggregateOutputType | null;
    _sum: SalesProductSumAggregateOutputType | null;
    _min: SalesProductMinAggregateOutputType | null;
    _max: SalesProductMaxAggregateOutputType | null;
};
export type GetSalesProductGroupByPayload<T extends SalesProductGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SalesProductGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SalesProductGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SalesProductGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SalesProductGroupByOutputType[P]>;
}>>;
export type SalesProductWhereInput = {
    AND?: Prisma.SalesProductWhereInput | Prisma.SalesProductWhereInput[];
    OR?: Prisma.SalesProductWhereInput[];
    NOT?: Prisma.SalesProductWhereInput | Prisma.SalesProductWhereInput[];
    id?: Prisma.IntFilter<"SalesProduct"> | number;
    name?: Prisma.StringFilter<"SalesProduct"> | string;
    metal?: Prisma.EnumStockMetalFilter<"SalesProduct"> | $Enums.StockMetal;
    genericNorm?: Prisma.StringFilter<"SalesProduct"> | string;
    weightLabel?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    refinery?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    pricingProductId?: Prisma.IntNullableFilter<"SalesProduct"> | number | null;
    active?: Prisma.BoolFilter<"SalesProduct"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
    pricingProduct?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    bcItems?: Prisma.BcItemListRelationFilter;
    aliases?: Prisma.ProductAliasListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
    invoiceLines?: Prisma.ZohoInvoiceLineListRelationFilter;
    quotes?: Prisma.QuoteListRelationFilter;
    suggestedAliases?: Prisma.ProductAliasListRelationFilter;
    zohoProducts?: Prisma.ZohoProductListRelationFilter;
};
export type SalesProductOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    genericNorm?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrderInput | Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    pricingProduct?: Prisma.ProductOrderByWithRelationInput;
    bcItems?: Prisma.BcItemOrderByRelationAggregateInput;
    aliases?: Prisma.ProductAliasOrderByRelationAggregateInput;
    trades?: Prisma.TradeOrderByRelationAggregateInput;
    lots?: Prisma.PurchaseLotOrderByRelationAggregateInput;
    invoiceLines?: Prisma.ZohoInvoiceLineOrderByRelationAggregateInput;
    quotes?: Prisma.QuoteOrderByRelationAggregateInput;
    suggestedAliases?: Prisma.ProductAliasOrderByRelationAggregateInput;
    zohoProducts?: Prisma.ZohoProductOrderByRelationAggregateInput;
};
export type SalesProductWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.SalesProductWhereInput | Prisma.SalesProductWhereInput[];
    OR?: Prisma.SalesProductWhereInput[];
    NOT?: Prisma.SalesProductWhereInput | Prisma.SalesProductWhereInput[];
    metal?: Prisma.EnumStockMetalFilter<"SalesProduct"> | $Enums.StockMetal;
    genericNorm?: Prisma.StringFilter<"SalesProduct"> | string;
    weightLabel?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    refinery?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    pricingProductId?: Prisma.IntNullableFilter<"SalesProduct"> | number | null;
    active?: Prisma.BoolFilter<"SalesProduct"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
    pricingProduct?: Prisma.XOR<Prisma.ProductNullableScalarRelationFilter, Prisma.ProductWhereInput> | null;
    bcItems?: Prisma.BcItemListRelationFilter;
    aliases?: Prisma.ProductAliasListRelationFilter;
    trades?: Prisma.TradeListRelationFilter;
    lots?: Prisma.PurchaseLotListRelationFilter;
    invoiceLines?: Prisma.ZohoInvoiceLineListRelationFilter;
    quotes?: Prisma.QuoteListRelationFilter;
    suggestedAliases?: Prisma.ProductAliasListRelationFilter;
    zohoProducts?: Prisma.ZohoProductListRelationFilter;
}, "id" | "name">;
export type SalesProductOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    genericNorm?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrderInput | Prisma.SortOrder;
    refinery?: Prisma.SortOrderInput | Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.SalesProductCountOrderByAggregateInput;
    _avg?: Prisma.SalesProductAvgOrderByAggregateInput;
    _max?: Prisma.SalesProductMaxOrderByAggregateInput;
    _min?: Prisma.SalesProductMinOrderByAggregateInput;
    _sum?: Prisma.SalesProductSumOrderByAggregateInput;
};
export type SalesProductScalarWhereWithAggregatesInput = {
    AND?: Prisma.SalesProductScalarWhereWithAggregatesInput | Prisma.SalesProductScalarWhereWithAggregatesInput[];
    OR?: Prisma.SalesProductScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SalesProductScalarWhereWithAggregatesInput | Prisma.SalesProductScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"SalesProduct"> | number;
    name?: Prisma.StringWithAggregatesFilter<"SalesProduct"> | string;
    metal?: Prisma.EnumStockMetalWithAggregatesFilter<"SalesProduct"> | $Enums.StockMetal;
    genericNorm?: Prisma.StringWithAggregatesFilter<"SalesProduct"> | string;
    weightLabel?: Prisma.StringNullableWithAggregatesFilter<"SalesProduct"> | string | null;
    refinery?: Prisma.StringNullableWithAggregatesFilter<"SalesProduct"> | string | null;
    pricingProductId?: Prisma.IntNullableWithAggregatesFilter<"SalesProduct"> | number | null;
    active?: Prisma.BoolWithAggregatesFilter<"SalesProduct"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SalesProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"SalesProduct"> | Date | string;
};
export type SalesProductCreateInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateManyInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SalesProductUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesProductUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesProductListRelationFilter = {
    every?: Prisma.SalesProductWhereInput;
    some?: Prisma.SalesProductWhereInput;
    none?: Prisma.SalesProductWhereInput;
};
export type SalesProductOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SalesProductNullableScalarRelationFilter = {
    is?: Prisma.SalesProductWhereInput | null;
    isNot?: Prisma.SalesProductWhereInput | null;
};
export type SalesProductCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    genericNorm?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SalesProductAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrder;
};
export type SalesProductMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    genericNorm?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SalesProductMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    metal?: Prisma.SortOrder;
    genericNorm?: Prisma.SortOrder;
    weightLabel?: Prisma.SortOrder;
    refinery?: Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type SalesProductSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    pricingProductId?: Prisma.SortOrder;
};
export type SalesProductCreateNestedManyWithoutPricingProductInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput> | Prisma.SalesProductCreateWithoutPricingProductInput[] | Prisma.SalesProductUncheckedCreateWithoutPricingProductInput[];
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutPricingProductInput | Prisma.SalesProductCreateOrConnectWithoutPricingProductInput[];
    createMany?: Prisma.SalesProductCreateManyPricingProductInputEnvelope;
    connect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
};
export type SalesProductUncheckedCreateNestedManyWithoutPricingProductInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput> | Prisma.SalesProductCreateWithoutPricingProductInput[] | Prisma.SalesProductUncheckedCreateWithoutPricingProductInput[];
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutPricingProductInput | Prisma.SalesProductCreateOrConnectWithoutPricingProductInput[];
    createMany?: Prisma.SalesProductCreateManyPricingProductInputEnvelope;
    connect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
};
export type SalesProductUpdateManyWithoutPricingProductNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput> | Prisma.SalesProductCreateWithoutPricingProductInput[] | Prisma.SalesProductUncheckedCreateWithoutPricingProductInput[];
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutPricingProductInput | Prisma.SalesProductCreateOrConnectWithoutPricingProductInput[];
    upsert?: Prisma.SalesProductUpsertWithWhereUniqueWithoutPricingProductInput | Prisma.SalesProductUpsertWithWhereUniqueWithoutPricingProductInput[];
    createMany?: Prisma.SalesProductCreateManyPricingProductInputEnvelope;
    set?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    disconnect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    delete?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    connect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    update?: Prisma.SalesProductUpdateWithWhereUniqueWithoutPricingProductInput | Prisma.SalesProductUpdateWithWhereUniqueWithoutPricingProductInput[];
    updateMany?: Prisma.SalesProductUpdateManyWithWhereWithoutPricingProductInput | Prisma.SalesProductUpdateManyWithWhereWithoutPricingProductInput[];
    deleteMany?: Prisma.SalesProductScalarWhereInput | Prisma.SalesProductScalarWhereInput[];
};
export type SalesProductUncheckedUpdateManyWithoutPricingProductNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput> | Prisma.SalesProductCreateWithoutPricingProductInput[] | Prisma.SalesProductUncheckedCreateWithoutPricingProductInput[];
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutPricingProductInput | Prisma.SalesProductCreateOrConnectWithoutPricingProductInput[];
    upsert?: Prisma.SalesProductUpsertWithWhereUniqueWithoutPricingProductInput | Prisma.SalesProductUpsertWithWhereUniqueWithoutPricingProductInput[];
    createMany?: Prisma.SalesProductCreateManyPricingProductInputEnvelope;
    set?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    disconnect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    delete?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    connect?: Prisma.SalesProductWhereUniqueInput | Prisma.SalesProductWhereUniqueInput[];
    update?: Prisma.SalesProductUpdateWithWhereUniqueWithoutPricingProductInput | Prisma.SalesProductUpdateWithWhereUniqueWithoutPricingProductInput[];
    updateMany?: Prisma.SalesProductUpdateManyWithWhereWithoutPricingProductInput | Prisma.SalesProductUpdateManyWithWhereWithoutPricingProductInput[];
    deleteMany?: Prisma.SalesProductScalarWhereInput | Prisma.SalesProductScalarWhereInput[];
};
export type SalesProductCreateNestedOneWithoutBcItemsInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutBcItemsInput, Prisma.SalesProductUncheckedCreateWithoutBcItemsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutBcItemsInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutBcItemsNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutBcItemsInput, Prisma.SalesProductUncheckedCreateWithoutBcItemsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutBcItemsInput;
    upsert?: Prisma.SalesProductUpsertWithoutBcItemsInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutBcItemsInput, Prisma.SalesProductUpdateWithoutBcItemsInput>, Prisma.SalesProductUncheckedUpdateWithoutBcItemsInput>;
};
export type SalesProductCreateNestedOneWithoutTradesInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutTradesInput, Prisma.SalesProductUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutTradesInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutTradesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutTradesInput, Prisma.SalesProductUncheckedCreateWithoutTradesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutTradesInput;
    upsert?: Prisma.SalesProductUpsertWithoutTradesInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutTradesInput, Prisma.SalesProductUpdateWithoutTradesInput>, Prisma.SalesProductUncheckedUpdateWithoutTradesInput>;
};
export type SalesProductCreateNestedOneWithoutLotsInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutLotsInput, Prisma.SalesProductUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutLotsInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutLotsNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutLotsInput, Prisma.SalesProductUncheckedCreateWithoutLotsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutLotsInput;
    upsert?: Prisma.SalesProductUpsertWithoutLotsInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutLotsInput, Prisma.SalesProductUpdateWithoutLotsInput>, Prisma.SalesProductUncheckedUpdateWithoutLotsInput>;
};
export type SalesProductCreateNestedOneWithoutAliasesInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutAliasesInput, Prisma.SalesProductUncheckedCreateWithoutAliasesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutAliasesInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductCreateNestedOneWithoutSuggestedAliasesInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedCreateWithoutSuggestedAliasesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutSuggestedAliasesInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutAliasesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutAliasesInput, Prisma.SalesProductUncheckedCreateWithoutAliasesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutAliasesInput;
    upsert?: Prisma.SalesProductUpsertWithoutAliasesInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutAliasesInput, Prisma.SalesProductUpdateWithoutAliasesInput>, Prisma.SalesProductUncheckedUpdateWithoutAliasesInput>;
};
export type SalesProductUpdateOneWithoutSuggestedAliasesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedCreateWithoutSuggestedAliasesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutSuggestedAliasesInput;
    upsert?: Prisma.SalesProductUpsertWithoutSuggestedAliasesInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutSuggestedAliasesInput, Prisma.SalesProductUpdateWithoutSuggestedAliasesInput>, Prisma.SalesProductUncheckedUpdateWithoutSuggestedAliasesInput>;
};
export type SalesProductCreateNestedOneWithoutZohoProductsInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutZohoProductsInput, Prisma.SalesProductUncheckedCreateWithoutZohoProductsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutZohoProductsInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutZohoProductsNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutZohoProductsInput, Prisma.SalesProductUncheckedCreateWithoutZohoProductsInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutZohoProductsInput;
    upsert?: Prisma.SalesProductUpsertWithoutZohoProductsInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutZohoProductsInput, Prisma.SalesProductUpdateWithoutZohoProductsInput>, Prisma.SalesProductUncheckedUpdateWithoutZohoProductsInput>;
};
export type SalesProductCreateNestedOneWithoutQuotesInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutQuotesInput, Prisma.SalesProductUncheckedCreateWithoutQuotesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutQuotesInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutQuotesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutQuotesInput, Prisma.SalesProductUncheckedCreateWithoutQuotesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutQuotesInput;
    upsert?: Prisma.SalesProductUpsertWithoutQuotesInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutQuotesInput, Prisma.SalesProductUpdateWithoutQuotesInput>, Prisma.SalesProductUncheckedUpdateWithoutQuotesInput>;
};
export type SalesProductCreateNestedOneWithoutInvoiceLinesInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedCreateWithoutInvoiceLinesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutInvoiceLinesInput;
    connect?: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateOneWithoutInvoiceLinesNestedInput = {
    create?: Prisma.XOR<Prisma.SalesProductCreateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedCreateWithoutInvoiceLinesInput>;
    connectOrCreate?: Prisma.SalesProductCreateOrConnectWithoutInvoiceLinesInput;
    upsert?: Prisma.SalesProductUpsertWithoutInvoiceLinesInput;
    disconnect?: Prisma.SalesProductWhereInput | boolean;
    delete?: Prisma.SalesProductWhereInput | boolean;
    connect?: Prisma.SalesProductWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.SalesProductUpdateToOneWithWhereWithoutInvoiceLinesInput, Prisma.SalesProductUpdateWithoutInvoiceLinesInput>, Prisma.SalesProductUncheckedUpdateWithoutInvoiceLinesInput>;
};
export type SalesProductCreateWithoutPricingProductInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutPricingProductInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutPricingProductInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput>;
};
export type SalesProductCreateManyPricingProductInputEnvelope = {
    data: Prisma.SalesProductCreateManyPricingProductInput | Prisma.SalesProductCreateManyPricingProductInput[];
    skipDuplicates?: boolean;
};
export type SalesProductUpsertWithWhereUniqueWithoutPricingProductInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutPricingProductInput, Prisma.SalesProductUncheckedUpdateWithoutPricingProductInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutPricingProductInput, Prisma.SalesProductUncheckedCreateWithoutPricingProductInput>;
};
export type SalesProductUpdateWithWhereUniqueWithoutPricingProductInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutPricingProductInput, Prisma.SalesProductUncheckedUpdateWithoutPricingProductInput>;
};
export type SalesProductUpdateManyWithWhereWithoutPricingProductInput = {
    where: Prisma.SalesProductScalarWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateManyMutationInput, Prisma.SalesProductUncheckedUpdateManyWithoutPricingProductInput>;
};
export type SalesProductScalarWhereInput = {
    AND?: Prisma.SalesProductScalarWhereInput | Prisma.SalesProductScalarWhereInput[];
    OR?: Prisma.SalesProductScalarWhereInput[];
    NOT?: Prisma.SalesProductScalarWhereInput | Prisma.SalesProductScalarWhereInput[];
    id?: Prisma.IntFilter<"SalesProduct"> | number;
    name?: Prisma.StringFilter<"SalesProduct"> | string;
    metal?: Prisma.EnumStockMetalFilter<"SalesProduct"> | $Enums.StockMetal;
    genericNorm?: Prisma.StringFilter<"SalesProduct"> | string;
    weightLabel?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    refinery?: Prisma.StringNullableFilter<"SalesProduct"> | string | null;
    pricingProductId?: Prisma.IntNullableFilter<"SalesProduct"> | number | null;
    active?: Prisma.BoolFilter<"SalesProduct"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"SalesProduct"> | Date | string;
};
export type SalesProductCreateWithoutBcItemsInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutBcItemsInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutBcItemsInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutBcItemsInput, Prisma.SalesProductUncheckedCreateWithoutBcItemsInput>;
};
export type SalesProductUpsertWithoutBcItemsInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutBcItemsInput, Prisma.SalesProductUncheckedUpdateWithoutBcItemsInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutBcItemsInput, Prisma.SalesProductUncheckedCreateWithoutBcItemsInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutBcItemsInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutBcItemsInput, Prisma.SalesProductUncheckedUpdateWithoutBcItemsInput>;
};
export type SalesProductUpdateWithoutBcItemsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutBcItemsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateWithoutTradesInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutTradesInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutTradesInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutTradesInput, Prisma.SalesProductUncheckedCreateWithoutTradesInput>;
};
export type SalesProductUpsertWithoutTradesInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutTradesInput, Prisma.SalesProductUncheckedUpdateWithoutTradesInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutTradesInput, Prisma.SalesProductUncheckedCreateWithoutTradesInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutTradesInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutTradesInput, Prisma.SalesProductUncheckedUpdateWithoutTradesInput>;
};
export type SalesProductUpdateWithoutTradesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutTradesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateWithoutLotsInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutLotsInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutLotsInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutLotsInput, Prisma.SalesProductUncheckedCreateWithoutLotsInput>;
};
export type SalesProductUpsertWithoutLotsInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutLotsInput, Prisma.SalesProductUncheckedUpdateWithoutLotsInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutLotsInput, Prisma.SalesProductUncheckedCreateWithoutLotsInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutLotsInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutLotsInput, Prisma.SalesProductUncheckedUpdateWithoutLotsInput>;
};
export type SalesProductUpdateWithoutLotsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutLotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateWithoutAliasesInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutAliasesInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutAliasesInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutAliasesInput, Prisma.SalesProductUncheckedCreateWithoutAliasesInput>;
};
export type SalesProductCreateWithoutSuggestedAliasesInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutSuggestedAliasesInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutSuggestedAliasesInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedCreateWithoutSuggestedAliasesInput>;
};
export type SalesProductUpsertWithoutAliasesInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutAliasesInput, Prisma.SalesProductUncheckedUpdateWithoutAliasesInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutAliasesInput, Prisma.SalesProductUncheckedCreateWithoutAliasesInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutAliasesInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutAliasesInput, Prisma.SalesProductUncheckedUpdateWithoutAliasesInput>;
};
export type SalesProductUpdateWithoutAliasesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutAliasesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUpsertWithoutSuggestedAliasesInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedUpdateWithoutSuggestedAliasesInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedCreateWithoutSuggestedAliasesInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutSuggestedAliasesInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutSuggestedAliasesInput, Prisma.SalesProductUncheckedUpdateWithoutSuggestedAliasesInput>;
};
export type SalesProductUpdateWithoutSuggestedAliasesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutSuggestedAliasesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateWithoutZohoProductsInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutZohoProductsInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutZohoProductsInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutZohoProductsInput, Prisma.SalesProductUncheckedCreateWithoutZohoProductsInput>;
};
export type SalesProductUpsertWithoutZohoProductsInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutZohoProductsInput, Prisma.SalesProductUncheckedUpdateWithoutZohoProductsInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutZohoProductsInput, Prisma.SalesProductUncheckedCreateWithoutZohoProductsInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutZohoProductsInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutZohoProductsInput, Prisma.SalesProductUncheckedUpdateWithoutZohoProductsInput>;
};
export type SalesProductUpdateWithoutZohoProductsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutZohoProductsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
};
export type SalesProductCreateWithoutQuotesInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutQuotesInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutQuotesInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutQuotesInput, Prisma.SalesProductUncheckedCreateWithoutQuotesInput>;
};
export type SalesProductUpsertWithoutQuotesInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutQuotesInput, Prisma.SalesProductUncheckedUpdateWithoutQuotesInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutQuotesInput, Prisma.SalesProductUncheckedCreateWithoutQuotesInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutQuotesInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutQuotesInput, Prisma.SalesProductUncheckedUpdateWithoutQuotesInput>;
};
export type SalesProductUpdateWithoutQuotesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutQuotesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateWithoutInvoiceLinesInput = {
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    pricingProduct?: Prisma.ProductCreateNestedOneWithoutSalesProductsInput;
    bcItems?: Prisma.BcItemCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductUncheckedCreateWithoutInvoiceLinesInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    pricingProductId?: number | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    bcItems?: Prisma.BcItemUncheckedCreateNestedManyWithoutSalesProductInput;
    aliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSalesProductInput;
    trades?: Prisma.TradeUncheckedCreateNestedManyWithoutSalesProductInput;
    lots?: Prisma.PurchaseLotUncheckedCreateNestedManyWithoutSalesProductInput;
    quotes?: Prisma.QuoteUncheckedCreateNestedManyWithoutSalesProductInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedCreateNestedManyWithoutSuggestedSalesProductInput;
    zohoProducts?: Prisma.ZohoProductUncheckedCreateNestedManyWithoutSalesProductInput;
};
export type SalesProductCreateOrConnectWithoutInvoiceLinesInput = {
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedCreateWithoutInvoiceLinesInput>;
};
export type SalesProductUpsertWithoutInvoiceLinesInput = {
    update: Prisma.XOR<Prisma.SalesProductUpdateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedUpdateWithoutInvoiceLinesInput>;
    create: Prisma.XOR<Prisma.SalesProductCreateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedCreateWithoutInvoiceLinesInput>;
    where?: Prisma.SalesProductWhereInput;
};
export type SalesProductUpdateToOneWithWhereWithoutInvoiceLinesInput = {
    where?: Prisma.SalesProductWhereInput;
    data: Prisma.XOR<Prisma.SalesProductUpdateWithoutInvoiceLinesInput, Prisma.SalesProductUncheckedUpdateWithoutInvoiceLinesInput>;
};
export type SalesProductUpdateWithoutInvoiceLinesInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    pricingProduct?: Prisma.ProductUpdateOneWithoutSalesProductsNestedInput;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutInvoiceLinesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    pricingProductId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductCreateManyPricingProductInput = {
    id?: number;
    name: string;
    metal: $Enums.StockMetal;
    genericNorm: string;
    weightLabel?: string | null;
    refinery?: string | null;
    active?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type SalesProductUpdateWithoutPricingProductInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateWithoutPricingProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    bcItems?: Prisma.BcItemUncheckedUpdateManyWithoutSalesProductNestedInput;
    aliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSalesProductNestedInput;
    trades?: Prisma.TradeUncheckedUpdateManyWithoutSalesProductNestedInput;
    lots?: Prisma.PurchaseLotUncheckedUpdateManyWithoutSalesProductNestedInput;
    invoiceLines?: Prisma.ZohoInvoiceLineUncheckedUpdateManyWithoutSalesProductNestedInput;
    quotes?: Prisma.QuoteUncheckedUpdateManyWithoutSalesProductNestedInput;
    suggestedAliases?: Prisma.ProductAliasUncheckedUpdateManyWithoutSuggestedSalesProductNestedInput;
    zohoProducts?: Prisma.ZohoProductUncheckedUpdateManyWithoutSalesProductNestedInput;
};
export type SalesProductUncheckedUpdateManyWithoutPricingProductInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    metal?: Prisma.EnumStockMetalFieldUpdateOperationsInput | $Enums.StockMetal;
    genericNorm?: Prisma.StringFieldUpdateOperationsInput | string;
    weightLabel?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    refinery?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SalesProductCountOutputType = {
    bcItems: number;
    aliases: number;
    trades: number;
    lots: number;
    invoiceLines: number;
    quotes: number;
    suggestedAliases: number;
    zohoProducts: number;
};
export type SalesProductCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    bcItems?: boolean | SalesProductCountOutputTypeCountBcItemsArgs;
    aliases?: boolean | SalesProductCountOutputTypeCountAliasesArgs;
    trades?: boolean | SalesProductCountOutputTypeCountTradesArgs;
    lots?: boolean | SalesProductCountOutputTypeCountLotsArgs;
    invoiceLines?: boolean | SalesProductCountOutputTypeCountInvoiceLinesArgs;
    quotes?: boolean | SalesProductCountOutputTypeCountQuotesArgs;
    suggestedAliases?: boolean | SalesProductCountOutputTypeCountSuggestedAliasesArgs;
    zohoProducts?: boolean | SalesProductCountOutputTypeCountZohoProductsArgs;
};
export type SalesProductCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductCountOutputTypeSelect<ExtArgs> | null;
};
export type SalesProductCountOutputTypeCountBcItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BcItemWhereInput;
};
export type SalesProductCountOutputTypeCountAliasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductAliasWhereInput;
};
export type SalesProductCountOutputTypeCountTradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TradeWhereInput;
};
export type SalesProductCountOutputTypeCountLotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PurchaseLotWhereInput;
};
export type SalesProductCountOutputTypeCountInvoiceLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoInvoiceLineWhereInput;
};
export type SalesProductCountOutputTypeCountQuotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.QuoteWhereInput;
};
export type SalesProductCountOutputTypeCountSuggestedAliasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductAliasWhereInput;
};
export type SalesProductCountOutputTypeCountZohoProductsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ZohoProductWhereInput;
};
export type SalesProductSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    metal?: boolean;
    genericNorm?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    pricingProductId?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
    bcItems?: boolean | Prisma.SalesProduct$bcItemsArgs<ExtArgs>;
    aliases?: boolean | Prisma.SalesProduct$aliasesArgs<ExtArgs>;
    trades?: boolean | Prisma.SalesProduct$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.SalesProduct$lotsArgs<ExtArgs>;
    invoiceLines?: boolean | Prisma.SalesProduct$invoiceLinesArgs<ExtArgs>;
    quotes?: boolean | Prisma.SalesProduct$quotesArgs<ExtArgs>;
    suggestedAliases?: boolean | Prisma.SalesProduct$suggestedAliasesArgs<ExtArgs>;
    zohoProducts?: boolean | Prisma.SalesProduct$zohoProductsArgs<ExtArgs>;
    _count?: boolean | Prisma.SalesProductCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["salesProduct"]>;
export type SalesProductSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    metal?: boolean;
    genericNorm?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    pricingProductId?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
}, ExtArgs["result"]["salesProduct"]>;
export type SalesProductSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    metal?: boolean;
    genericNorm?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    pricingProductId?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
}, ExtArgs["result"]["salesProduct"]>;
export type SalesProductSelectScalar = {
    id?: boolean;
    name?: boolean;
    metal?: boolean;
    genericNorm?: boolean;
    weightLabel?: boolean;
    refinery?: boolean;
    pricingProductId?: boolean;
    active?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type SalesProductOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "metal" | "genericNorm" | "weightLabel" | "refinery" | "pricingProductId" | "active" | "createdAt" | "updatedAt", ExtArgs["result"]["salesProduct"]>;
export type SalesProductInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
    bcItems?: boolean | Prisma.SalesProduct$bcItemsArgs<ExtArgs>;
    aliases?: boolean | Prisma.SalesProduct$aliasesArgs<ExtArgs>;
    trades?: boolean | Prisma.SalesProduct$tradesArgs<ExtArgs>;
    lots?: boolean | Prisma.SalesProduct$lotsArgs<ExtArgs>;
    invoiceLines?: boolean | Prisma.SalesProduct$invoiceLinesArgs<ExtArgs>;
    quotes?: boolean | Prisma.SalesProduct$quotesArgs<ExtArgs>;
    suggestedAliases?: boolean | Prisma.SalesProduct$suggestedAliasesArgs<ExtArgs>;
    zohoProducts?: boolean | Prisma.SalesProduct$zohoProductsArgs<ExtArgs>;
    _count?: boolean | Prisma.SalesProductCountOutputTypeDefaultArgs<ExtArgs>;
};
export type SalesProductIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
};
export type SalesProductIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    pricingProduct?: boolean | Prisma.SalesProduct$pricingProductArgs<ExtArgs>;
};
export type $SalesProductPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SalesProduct";
    objects: {
        pricingProduct: Prisma.$ProductPayload<ExtArgs> | null;
        bcItems: Prisma.$BcItemPayload<ExtArgs>[];
        aliases: Prisma.$ProductAliasPayload<ExtArgs>[];
        trades: Prisma.$TradePayload<ExtArgs>[];
        lots: Prisma.$PurchaseLotPayload<ExtArgs>[];
        invoiceLines: Prisma.$ZohoInvoiceLinePayload<ExtArgs>[];
        quotes: Prisma.$QuotePayload<ExtArgs>[];
        suggestedAliases: Prisma.$ProductAliasPayload<ExtArgs>[];
        zohoProducts: Prisma.$ZohoProductPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        metal: $Enums.StockMetal;
        genericNorm: string;
        weightLabel: string | null;
        refinery: string | null;
        pricingProductId: number | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["salesProduct"]>;
    composites: {};
};
export type SalesProductGetPayload<S extends boolean | null | undefined | SalesProductDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SalesProductPayload, S>;
export type SalesProductCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SalesProductFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SalesProductCountAggregateInputType | true;
};
export interface SalesProductDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SalesProduct'];
        meta: {
            name: 'SalesProduct';
        };
    };
    findUnique<T extends SalesProductFindUniqueArgs>(args: Prisma.SelectSubset<T, SalesProductFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SalesProductFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SalesProductFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SalesProductFindFirstArgs>(args?: Prisma.SelectSubset<T, SalesProductFindFirstArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SalesProductFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SalesProductFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SalesProductFindManyArgs>(args?: Prisma.SelectSubset<T, SalesProductFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SalesProductCreateArgs>(args: Prisma.SelectSubset<T, SalesProductCreateArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SalesProductCreateManyArgs>(args?: Prisma.SelectSubset<T, SalesProductCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SalesProductCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SalesProductCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SalesProductDeleteArgs>(args: Prisma.SelectSubset<T, SalesProductDeleteArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SalesProductUpdateArgs>(args: Prisma.SelectSubset<T, SalesProductUpdateArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SalesProductDeleteManyArgs>(args?: Prisma.SelectSubset<T, SalesProductDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SalesProductUpdateManyArgs>(args: Prisma.SelectSubset<T, SalesProductUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SalesProductUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SalesProductUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SalesProductUpsertArgs>(args: Prisma.SelectSubset<T, SalesProductUpsertArgs<ExtArgs>>): Prisma.Prisma__SalesProductClient<runtime.Types.Result.GetResult<Prisma.$SalesProductPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SalesProductCountArgs>(args?: Prisma.Subset<T, SalesProductCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SalesProductCountAggregateOutputType> : number>;
    aggregate<T extends SalesProductAggregateArgs>(args: Prisma.Subset<T, SalesProductAggregateArgs>): Prisma.PrismaPromise<GetSalesProductAggregateType<T>>;
    groupBy<T extends SalesProductGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SalesProductGroupByArgs['orderBy'];
    } : {
        orderBy?: SalesProductGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SalesProductGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSalesProductGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SalesProductFieldRefs;
}
export interface Prisma__SalesProductClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    pricingProduct<T extends Prisma.SalesProduct$pricingProductArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$pricingProductArgs<ExtArgs>>): Prisma.Prisma__ProductClient<runtime.Types.Result.GetResult<Prisma.$ProductPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    bcItems<T extends Prisma.SalesProduct$bcItemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$bcItemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BcItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    aliases<T extends Prisma.SalesProduct$aliasesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$aliasesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    trades<T extends Prisma.SalesProduct$tradesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$tradesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TradePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    lots<T extends Prisma.SalesProduct$lotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$lotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PurchaseLotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    invoiceLines<T extends Prisma.SalesProduct$invoiceLinesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$invoiceLinesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoInvoiceLinePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    quotes<T extends Prisma.SalesProduct$quotesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$quotesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$QuotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    suggestedAliases<T extends Prisma.SalesProduct$suggestedAliasesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$suggestedAliasesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductAliasPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    zohoProducts<T extends Prisma.SalesProduct$zohoProductsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SalesProduct$zohoProductsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ZohoProductPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SalesProductFieldRefs {
    readonly id: Prisma.FieldRef<"SalesProduct", 'Int'>;
    readonly name: Prisma.FieldRef<"SalesProduct", 'String'>;
    readonly metal: Prisma.FieldRef<"SalesProduct", 'StockMetal'>;
    readonly genericNorm: Prisma.FieldRef<"SalesProduct", 'String'>;
    readonly weightLabel: Prisma.FieldRef<"SalesProduct", 'String'>;
    readonly refinery: Prisma.FieldRef<"SalesProduct", 'String'>;
    readonly pricingProductId: Prisma.FieldRef<"SalesProduct", 'Int'>;
    readonly active: Prisma.FieldRef<"SalesProduct", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"SalesProduct", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"SalesProduct", 'DateTime'>;
}
export type SalesProductFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where?: Prisma.SalesProductWhereInput;
    orderBy?: Prisma.SalesProductOrderByWithRelationInput | Prisma.SalesProductOrderByWithRelationInput[];
    cursor?: Prisma.SalesProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SalesProductScalarFieldEnum | Prisma.SalesProductScalarFieldEnum[];
};
export type SalesProductFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where?: Prisma.SalesProductWhereInput;
    orderBy?: Prisma.SalesProductOrderByWithRelationInput | Prisma.SalesProductOrderByWithRelationInput[];
    cursor?: Prisma.SalesProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SalesProductScalarFieldEnum | Prisma.SalesProductScalarFieldEnum[];
};
export type SalesProductFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where?: Prisma.SalesProductWhereInput;
    orderBy?: Prisma.SalesProductOrderByWithRelationInput | Prisma.SalesProductOrderByWithRelationInput[];
    cursor?: Prisma.SalesProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SalesProductScalarFieldEnum | Prisma.SalesProductScalarFieldEnum[];
};
export type SalesProductCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesProductCreateInput, Prisma.SalesProductUncheckedCreateInput>;
};
export type SalesProductCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SalesProductCreateManyInput | Prisma.SalesProductCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SalesProductCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    data: Prisma.SalesProductCreateManyInput | Prisma.SalesProductCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SalesProductIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SalesProductUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesProductUpdateInput, Prisma.SalesProductUncheckedUpdateInput>;
    where: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SalesProductUpdateManyMutationInput, Prisma.SalesProductUncheckedUpdateManyInput>;
    where?: Prisma.SalesProductWhereInput;
    limit?: number;
};
export type SalesProductUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SalesProductUpdateManyMutationInput, Prisma.SalesProductUncheckedUpdateManyInput>;
    where?: Prisma.SalesProductWhereInput;
    limit?: number;
    include?: Prisma.SalesProductIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SalesProductUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where: Prisma.SalesProductWhereUniqueInput;
    create: Prisma.XOR<Prisma.SalesProductCreateInput, Prisma.SalesProductUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SalesProductUpdateInput, Prisma.SalesProductUncheckedUpdateInput>;
};
export type SalesProductDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
    where: Prisma.SalesProductWhereUniqueInput;
};
export type SalesProductDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SalesProductWhereInput;
    limit?: number;
};
export type SalesProduct$pricingProductArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductSelect<ExtArgs> | null;
    omit?: Prisma.ProductOmit<ExtArgs> | null;
    include?: Prisma.ProductInclude<ExtArgs> | null;
    where?: Prisma.ProductWhereInput;
};
export type SalesProduct$bcItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BcItemSelect<ExtArgs> | null;
    omit?: Prisma.BcItemOmit<ExtArgs> | null;
    include?: Prisma.BcItemInclude<ExtArgs> | null;
    where?: Prisma.BcItemWhereInput;
    orderBy?: Prisma.BcItemOrderByWithRelationInput | Prisma.BcItemOrderByWithRelationInput[];
    cursor?: Prisma.BcItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BcItemScalarFieldEnum | Prisma.BcItemScalarFieldEnum[];
};
export type SalesProduct$aliasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductAliasSelect<ExtArgs> | null;
    omit?: Prisma.ProductAliasOmit<ExtArgs> | null;
    include?: Prisma.ProductAliasInclude<ExtArgs> | null;
    where?: Prisma.ProductAliasWhereInput;
    orderBy?: Prisma.ProductAliasOrderByWithRelationInput | Prisma.ProductAliasOrderByWithRelationInput[];
    cursor?: Prisma.ProductAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductAliasScalarFieldEnum | Prisma.ProductAliasScalarFieldEnum[];
};
export type SalesProduct$tradesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesProduct$lotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type SalesProduct$invoiceLinesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoInvoiceLineSelect<ExtArgs> | null;
    omit?: Prisma.ZohoInvoiceLineOmit<ExtArgs> | null;
    include?: Prisma.ZohoInvoiceLineInclude<ExtArgs> | null;
    where?: Prisma.ZohoInvoiceLineWhereInput;
    orderBy?: Prisma.ZohoInvoiceLineOrderByWithRelationInput | Prisma.ZohoInvoiceLineOrderByWithRelationInput[];
    cursor?: Prisma.ZohoInvoiceLineWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoInvoiceLineScalarFieldEnum | Prisma.ZohoInvoiceLineScalarFieldEnum[];
};
export type SalesProduct$quotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.QuoteSelect<ExtArgs> | null;
    omit?: Prisma.QuoteOmit<ExtArgs> | null;
    include?: Prisma.QuoteInclude<ExtArgs> | null;
    where?: Prisma.QuoteWhereInput;
    orderBy?: Prisma.QuoteOrderByWithRelationInput | Prisma.QuoteOrderByWithRelationInput[];
    cursor?: Prisma.QuoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.QuoteScalarFieldEnum | Prisma.QuoteScalarFieldEnum[];
};
export type SalesProduct$suggestedAliasesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductAliasSelect<ExtArgs> | null;
    omit?: Prisma.ProductAliasOmit<ExtArgs> | null;
    include?: Prisma.ProductAliasInclude<ExtArgs> | null;
    where?: Prisma.ProductAliasWhereInput;
    orderBy?: Prisma.ProductAliasOrderByWithRelationInput | Prisma.ProductAliasOrderByWithRelationInput[];
    cursor?: Prisma.ProductAliasWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductAliasScalarFieldEnum | Prisma.ProductAliasScalarFieldEnum[];
};
export type SalesProduct$zohoProductsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ZohoProductSelect<ExtArgs> | null;
    omit?: Prisma.ZohoProductOmit<ExtArgs> | null;
    include?: Prisma.ZohoProductInclude<ExtArgs> | null;
    where?: Prisma.ZohoProductWhereInput;
    orderBy?: Prisma.ZohoProductOrderByWithRelationInput | Prisma.ZohoProductOrderByWithRelationInput[];
    cursor?: Prisma.ZohoProductWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ZohoProductScalarFieldEnum | Prisma.ZohoProductScalarFieldEnum[];
};
export type SalesProductDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SalesProductSelect<ExtArgs> | null;
    omit?: Prisma.SalesProductOmit<ExtArgs> | null;
    include?: Prisma.SalesProductInclude<ExtArgs> | null;
};
//# sourceMappingURL=SalesProduct.d.ts.map