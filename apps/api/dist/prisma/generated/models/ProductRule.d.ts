import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type ProductRuleModel = runtime.Types.Result.DefaultSelection<Prisma.$ProductRulePayload>;
export type AggregateProductRule = {
    _count: ProductRuleCountAggregateOutputType | null;
    _avg: ProductRuleAvgAggregateOutputType | null;
    _sum: ProductRuleSumAggregateOutputType | null;
    _min: ProductRuleMinAggregateOutputType | null;
    _max: ProductRuleMaxAggregateOutputType | null;
};
export type ProductRuleAvgAggregateOutputType = {
    id: number | null;
};
export type ProductRuleSumAggregateOutputType = {
    id: number | null;
};
export type ProductRuleMinAggregateOutputType = {
    id: number | null;
    kind: $Enums.ProductRuleKind | null;
    pattern: string | null;
    note: string | null;
    active: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProductRuleMaxAggregateOutputType = {
    id: number | null;
    kind: $Enums.ProductRuleKind | null;
    pattern: string | null;
    note: string | null;
    active: boolean | null;
    createdBy: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type ProductRuleCountAggregateOutputType = {
    id: number;
    kind: number;
    pattern: number;
    value: number;
    note: number;
    active: number;
    createdBy: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type ProductRuleAvgAggregateInputType = {
    id?: true;
};
export type ProductRuleSumAggregateInputType = {
    id?: true;
};
export type ProductRuleMinAggregateInputType = {
    id?: true;
    kind?: true;
    pattern?: true;
    note?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProductRuleMaxAggregateInputType = {
    id?: true;
    kind?: true;
    pattern?: true;
    note?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type ProductRuleCountAggregateInputType = {
    id?: true;
    kind?: true;
    pattern?: true;
    value?: true;
    note?: true;
    active?: true;
    createdBy?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type ProductRuleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductRuleWhereInput;
    orderBy?: Prisma.ProductRuleOrderByWithRelationInput | Prisma.ProductRuleOrderByWithRelationInput[];
    cursor?: Prisma.ProductRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ProductRuleCountAggregateInputType;
    _avg?: ProductRuleAvgAggregateInputType;
    _sum?: ProductRuleSumAggregateInputType;
    _min?: ProductRuleMinAggregateInputType;
    _max?: ProductRuleMaxAggregateInputType;
};
export type GetProductRuleAggregateType<T extends ProductRuleAggregateArgs> = {
    [P in keyof T & keyof AggregateProductRule]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateProductRule[P]> : Prisma.GetScalarType<T[P], AggregateProductRule[P]>;
};
export type ProductRuleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductRuleWhereInput;
    orderBy?: Prisma.ProductRuleOrderByWithAggregationInput | Prisma.ProductRuleOrderByWithAggregationInput[];
    by: Prisma.ProductRuleScalarFieldEnum[] | Prisma.ProductRuleScalarFieldEnum;
    having?: Prisma.ProductRuleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ProductRuleCountAggregateInputType | true;
    _avg?: ProductRuleAvgAggregateInputType;
    _sum?: ProductRuleSumAggregateInputType;
    _min?: ProductRuleMinAggregateInputType;
    _max?: ProductRuleMaxAggregateInputType;
};
export type ProductRuleGroupByOutputType = {
    id: number;
    kind: $Enums.ProductRuleKind;
    pattern: string;
    value: runtime.JsonValue;
    note: string | null;
    active: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    _count: ProductRuleCountAggregateOutputType | null;
    _avg: ProductRuleAvgAggregateOutputType | null;
    _sum: ProductRuleSumAggregateOutputType | null;
    _min: ProductRuleMinAggregateOutputType | null;
    _max: ProductRuleMaxAggregateOutputType | null;
};
export type GetProductRuleGroupByPayload<T extends ProductRuleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ProductRuleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ProductRuleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ProductRuleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ProductRuleGroupByOutputType[P]>;
}>>;
export type ProductRuleWhereInput = {
    AND?: Prisma.ProductRuleWhereInput | Prisma.ProductRuleWhereInput[];
    OR?: Prisma.ProductRuleWhereInput[];
    NOT?: Prisma.ProductRuleWhereInput | Prisma.ProductRuleWhereInput[];
    id?: Prisma.IntFilter<"ProductRule"> | number;
    kind?: Prisma.EnumProductRuleKindFilter<"ProductRule"> | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFilter<"ProductRule"> | string;
    value?: Prisma.JsonFilter<"ProductRule">;
    note?: Prisma.StringNullableFilter<"ProductRule"> | string | null;
    active?: Prisma.BoolFilter<"ProductRule"> | boolean;
    createdBy?: Prisma.StringFilter<"ProductRule"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProductRule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ProductRule"> | Date | string;
};
export type ProductRuleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    pattern?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProductRuleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    kind_pattern?: Prisma.ProductRuleKindPatternCompoundUniqueInput;
    AND?: Prisma.ProductRuleWhereInput | Prisma.ProductRuleWhereInput[];
    OR?: Prisma.ProductRuleWhereInput[];
    NOT?: Prisma.ProductRuleWhereInput | Prisma.ProductRuleWhereInput[];
    kind?: Prisma.EnumProductRuleKindFilter<"ProductRule"> | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFilter<"ProductRule"> | string;
    value?: Prisma.JsonFilter<"ProductRule">;
    note?: Prisma.StringNullableFilter<"ProductRule"> | string | null;
    active?: Prisma.BoolFilter<"ProductRule"> | boolean;
    createdBy?: Prisma.StringFilter<"ProductRule"> | string;
    createdAt?: Prisma.DateTimeFilter<"ProductRule"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"ProductRule"> | Date | string;
}, "id" | "kind_pattern">;
export type ProductRuleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    pattern?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.ProductRuleCountOrderByAggregateInput;
    _avg?: Prisma.ProductRuleAvgOrderByAggregateInput;
    _max?: Prisma.ProductRuleMaxOrderByAggregateInput;
    _min?: Prisma.ProductRuleMinOrderByAggregateInput;
    _sum?: Prisma.ProductRuleSumOrderByAggregateInput;
};
export type ProductRuleScalarWhereWithAggregatesInput = {
    AND?: Prisma.ProductRuleScalarWhereWithAggregatesInput | Prisma.ProductRuleScalarWhereWithAggregatesInput[];
    OR?: Prisma.ProductRuleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ProductRuleScalarWhereWithAggregatesInput | Prisma.ProductRuleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ProductRule"> | number;
    kind?: Prisma.EnumProductRuleKindWithAggregatesFilter<"ProductRule"> | $Enums.ProductRuleKind;
    pattern?: Prisma.StringWithAggregatesFilter<"ProductRule"> | string;
    value?: Prisma.JsonWithAggregatesFilter<"ProductRule">;
    note?: Prisma.StringNullableWithAggregatesFilter<"ProductRule"> | string | null;
    active?: Prisma.BoolWithAggregatesFilter<"ProductRule"> | boolean;
    createdBy?: Prisma.StringWithAggregatesFilter<"ProductRule"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ProductRule"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"ProductRule"> | Date | string;
};
export type ProductRuleCreateInput = {
    kind: $Enums.ProductRuleKind;
    pattern: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: string | null;
    active?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProductRuleUncheckedCreateInput = {
    id?: number;
    kind: $Enums.ProductRuleKind;
    pattern: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: string | null;
    active?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProductRuleUpdateInput = {
    kind?: Prisma.EnumProductRuleKindFieldUpdateOperationsInput | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductRuleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumProductRuleKindFieldUpdateOperationsInput | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductRuleCreateManyInput = {
    id?: number;
    kind: $Enums.ProductRuleKind;
    pattern: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: string | null;
    active?: boolean;
    createdBy: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type ProductRuleUpdateManyMutationInput = {
    kind?: Prisma.EnumProductRuleKindFieldUpdateOperationsInput | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductRuleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumProductRuleKindFieldUpdateOperationsInput | $Enums.ProductRuleKind;
    pattern?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ProductRuleKindPatternCompoundUniqueInput = {
    kind: $Enums.ProductRuleKind;
    pattern: string;
};
export type ProductRuleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    pattern?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProductRuleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type ProductRuleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    pattern?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProductRuleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    pattern?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type ProductRuleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type EnumProductRuleKindFieldUpdateOperationsInput = {
    set?: $Enums.ProductRuleKind;
};
export type ProductRuleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    pattern?: boolean;
    value?: boolean;
    note?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["productRule"]>;
export type ProductRuleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    pattern?: boolean;
    value?: boolean;
    note?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["productRule"]>;
export type ProductRuleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    kind?: boolean;
    pattern?: boolean;
    value?: boolean;
    note?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["productRule"]>;
export type ProductRuleSelectScalar = {
    id?: boolean;
    kind?: boolean;
    pattern?: boolean;
    value?: boolean;
    note?: boolean;
    active?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type ProductRuleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "kind" | "pattern" | "value" | "note" | "active" | "createdBy" | "createdAt" | "updatedAt", ExtArgs["result"]["productRule"]>;
export type $ProductRulePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ProductRule";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        kind: $Enums.ProductRuleKind;
        pattern: string;
        value: runtime.JsonValue;
        note: string | null;
        active: boolean;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["productRule"]>;
    composites: {};
};
export type ProductRuleGetPayload<S extends boolean | null | undefined | ProductRuleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ProductRulePayload, S>;
export type ProductRuleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ProductRuleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ProductRuleCountAggregateInputType | true;
};
export interface ProductRuleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ProductRule'];
        meta: {
            name: 'ProductRule';
        };
    };
    findUnique<T extends ProductRuleFindUniqueArgs>(args: Prisma.SelectSubset<T, ProductRuleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ProductRuleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ProductRuleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ProductRuleFindFirstArgs>(args?: Prisma.SelectSubset<T, ProductRuleFindFirstArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ProductRuleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ProductRuleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ProductRuleFindManyArgs>(args?: Prisma.SelectSubset<T, ProductRuleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ProductRuleCreateArgs>(args: Prisma.SelectSubset<T, ProductRuleCreateArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ProductRuleCreateManyArgs>(args?: Prisma.SelectSubset<T, ProductRuleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ProductRuleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ProductRuleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ProductRuleDeleteArgs>(args: Prisma.SelectSubset<T, ProductRuleDeleteArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ProductRuleUpdateArgs>(args: Prisma.SelectSubset<T, ProductRuleUpdateArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ProductRuleDeleteManyArgs>(args?: Prisma.SelectSubset<T, ProductRuleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ProductRuleUpdateManyArgs>(args: Prisma.SelectSubset<T, ProductRuleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ProductRuleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ProductRuleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ProductRuleUpsertArgs>(args: Prisma.SelectSubset<T, ProductRuleUpsertArgs<ExtArgs>>): Prisma.Prisma__ProductRuleClient<runtime.Types.Result.GetResult<Prisma.$ProductRulePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ProductRuleCountArgs>(args?: Prisma.Subset<T, ProductRuleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ProductRuleCountAggregateOutputType> : number>;
    aggregate<T extends ProductRuleAggregateArgs>(args: Prisma.Subset<T, ProductRuleAggregateArgs>): Prisma.PrismaPromise<GetProductRuleAggregateType<T>>;
    groupBy<T extends ProductRuleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ProductRuleGroupByArgs['orderBy'];
    } : {
        orderBy?: ProductRuleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ProductRuleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetProductRuleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ProductRuleFieldRefs;
}
export interface Prisma__ProductRuleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ProductRuleFieldRefs {
    readonly id: Prisma.FieldRef<"ProductRule", 'Int'>;
    readonly kind: Prisma.FieldRef<"ProductRule", 'ProductRuleKind'>;
    readonly pattern: Prisma.FieldRef<"ProductRule", 'String'>;
    readonly value: Prisma.FieldRef<"ProductRule", 'Json'>;
    readonly note: Prisma.FieldRef<"ProductRule", 'String'>;
    readonly active: Prisma.FieldRef<"ProductRule", 'Boolean'>;
    readonly createdBy: Prisma.FieldRef<"ProductRule", 'String'>;
    readonly createdAt: Prisma.FieldRef<"ProductRule", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"ProductRule", 'DateTime'>;
}
export type ProductRuleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where: Prisma.ProductRuleWhereUniqueInput;
};
export type ProductRuleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where: Prisma.ProductRuleWhereUniqueInput;
};
export type ProductRuleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where?: Prisma.ProductRuleWhereInput;
    orderBy?: Prisma.ProductRuleOrderByWithRelationInput | Prisma.ProductRuleOrderByWithRelationInput[];
    cursor?: Prisma.ProductRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductRuleScalarFieldEnum | Prisma.ProductRuleScalarFieldEnum[];
};
export type ProductRuleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where?: Prisma.ProductRuleWhereInput;
    orderBy?: Prisma.ProductRuleOrderByWithRelationInput | Prisma.ProductRuleOrderByWithRelationInput[];
    cursor?: Prisma.ProductRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductRuleScalarFieldEnum | Prisma.ProductRuleScalarFieldEnum[];
};
export type ProductRuleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where?: Prisma.ProductRuleWhereInput;
    orderBy?: Prisma.ProductRuleOrderByWithRelationInput | Prisma.ProductRuleOrderByWithRelationInput[];
    cursor?: Prisma.ProductRuleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ProductRuleScalarFieldEnum | Prisma.ProductRuleScalarFieldEnum[];
};
export type ProductRuleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductRuleCreateInput, Prisma.ProductRuleUncheckedCreateInput>;
};
export type ProductRuleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ProductRuleCreateManyInput | Prisma.ProductRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductRuleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    data: Prisma.ProductRuleCreateManyInput | Prisma.ProductRuleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ProductRuleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductRuleUpdateInput, Prisma.ProductRuleUncheckedUpdateInput>;
    where: Prisma.ProductRuleWhereUniqueInput;
};
export type ProductRuleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ProductRuleUpdateManyMutationInput, Prisma.ProductRuleUncheckedUpdateManyInput>;
    where?: Prisma.ProductRuleWhereInput;
    limit?: number;
};
export type ProductRuleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ProductRuleUpdateManyMutationInput, Prisma.ProductRuleUncheckedUpdateManyInput>;
    where?: Prisma.ProductRuleWhereInput;
    limit?: number;
};
export type ProductRuleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where: Prisma.ProductRuleWhereUniqueInput;
    create: Prisma.XOR<Prisma.ProductRuleCreateInput, Prisma.ProductRuleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ProductRuleUpdateInput, Prisma.ProductRuleUncheckedUpdateInput>;
};
export type ProductRuleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
    where: Prisma.ProductRuleWhereUniqueInput;
};
export type ProductRuleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ProductRuleWhereInput;
    limit?: number;
};
export type ProductRuleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ProductRuleSelect<ExtArgs> | null;
    omit?: Prisma.ProductRuleOmit<ExtArgs> | null;
};
//# sourceMappingURL=ProductRule.d.ts.map