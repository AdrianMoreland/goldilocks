import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type CompanySettingModel = runtime.Types.Result.DefaultSelection<Prisma.$CompanySettingPayload>;
export type AggregateCompanySetting = {
    _count: CompanySettingCountAggregateOutputType | null;
    _min: CompanySettingMinAggregateOutputType | null;
    _max: CompanySettingMaxAggregateOutputType | null;
};
export type CompanySettingMinAggregateOutputType = {
    key: string | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type CompanySettingMaxAggregateOutputType = {
    key: string | null;
    updatedBy: string | null;
    updatedAt: Date | null;
};
export type CompanySettingCountAggregateOutputType = {
    key: number;
    value: number;
    updatedBy: number;
    updatedAt: number;
    _all: number;
};
export type CompanySettingMinAggregateInputType = {
    key?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type CompanySettingMaxAggregateInputType = {
    key?: true;
    updatedBy?: true;
    updatedAt?: true;
};
export type CompanySettingCountAggregateInputType = {
    key?: true;
    value?: true;
    updatedBy?: true;
    updatedAt?: true;
    _all?: true;
};
export type CompanySettingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanySettingWhereInput;
    orderBy?: Prisma.CompanySettingOrderByWithRelationInput | Prisma.CompanySettingOrderByWithRelationInput[];
    cursor?: Prisma.CompanySettingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CompanySettingCountAggregateInputType;
    _min?: CompanySettingMinAggregateInputType;
    _max?: CompanySettingMaxAggregateInputType;
};
export type GetCompanySettingAggregateType<T extends CompanySettingAggregateArgs> = {
    [P in keyof T & keyof AggregateCompanySetting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCompanySetting[P]> : Prisma.GetScalarType<T[P], AggregateCompanySetting[P]>;
};
export type CompanySettingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanySettingWhereInput;
    orderBy?: Prisma.CompanySettingOrderByWithAggregationInput | Prisma.CompanySettingOrderByWithAggregationInput[];
    by: Prisma.CompanySettingScalarFieldEnum[] | Prisma.CompanySettingScalarFieldEnum;
    having?: Prisma.CompanySettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CompanySettingCountAggregateInputType | true;
    _min?: CompanySettingMinAggregateInputType;
    _max?: CompanySettingMaxAggregateInputType;
};
export type CompanySettingGroupByOutputType = {
    key: string;
    value: runtime.JsonValue;
    updatedBy: string;
    updatedAt: Date;
    _count: CompanySettingCountAggregateOutputType | null;
    _min: CompanySettingMinAggregateOutputType | null;
    _max: CompanySettingMaxAggregateOutputType | null;
};
export type GetCompanySettingGroupByPayload<T extends CompanySettingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CompanySettingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CompanySettingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CompanySettingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CompanySettingGroupByOutputType[P]>;
}>>;
export type CompanySettingWhereInput = {
    AND?: Prisma.CompanySettingWhereInput | Prisma.CompanySettingWhereInput[];
    OR?: Prisma.CompanySettingWhereInput[];
    NOT?: Prisma.CompanySettingWhereInput | Prisma.CompanySettingWhereInput[];
    key?: Prisma.StringFilter<"CompanySetting"> | string;
    value?: Prisma.JsonFilter<"CompanySetting">;
    updatedBy?: Prisma.StringFilter<"CompanySetting"> | string;
    updatedAt?: Prisma.DateTimeFilter<"CompanySetting"> | Date | string;
};
export type CompanySettingOrderByWithRelationInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CompanySettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string;
    AND?: Prisma.CompanySettingWhereInput | Prisma.CompanySettingWhereInput[];
    OR?: Prisma.CompanySettingWhereInput[];
    NOT?: Prisma.CompanySettingWhereInput | Prisma.CompanySettingWhereInput[];
    value?: Prisma.JsonFilter<"CompanySetting">;
    updatedBy?: Prisma.StringFilter<"CompanySetting"> | string;
    updatedAt?: Prisma.DateTimeFilter<"CompanySetting"> | Date | string;
}, "key">;
export type CompanySettingOrderByWithAggregationInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.CompanySettingCountOrderByAggregateInput;
    _max?: Prisma.CompanySettingMaxOrderByAggregateInput;
    _min?: Prisma.CompanySettingMinOrderByAggregateInput;
};
export type CompanySettingScalarWhereWithAggregatesInput = {
    AND?: Prisma.CompanySettingScalarWhereWithAggregatesInput | Prisma.CompanySettingScalarWhereWithAggregatesInput[];
    OR?: Prisma.CompanySettingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CompanySettingScalarWhereWithAggregatesInput | Prisma.CompanySettingScalarWhereWithAggregatesInput[];
    key?: Prisma.StringWithAggregatesFilter<"CompanySetting"> | string;
    value?: Prisma.JsonWithAggregatesFilter<"CompanySetting">;
    updatedBy?: Prisma.StringWithAggregatesFilter<"CompanySetting"> | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"CompanySetting"> | Date | string;
};
export type CompanySettingCreateInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy: string;
    updatedAt?: Date | string;
};
export type CompanySettingUncheckedCreateInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy: string;
    updatedAt?: Date | string;
};
export type CompanySettingUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CompanySettingUncheckedUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CompanySettingCreateManyInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy: string;
    updatedAt?: Date | string;
};
export type CompanySettingUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CompanySettingUncheckedUpdateManyInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedBy?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CompanySettingCountOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CompanySettingMaxOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CompanySettingMinOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    updatedBy?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type CompanySettingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["companySetting"]>;
export type CompanySettingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["companySetting"]>;
export type CompanySettingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["companySetting"]>;
export type CompanySettingSelectScalar = {
    key?: boolean;
    value?: boolean;
    updatedBy?: boolean;
    updatedAt?: boolean;
};
export type CompanySettingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"key" | "value" | "updatedBy" | "updatedAt", ExtArgs["result"]["companySetting"]>;
export type $CompanySettingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CompanySetting";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        key: string;
        value: runtime.JsonValue;
        updatedBy: string;
        updatedAt: Date;
    }, ExtArgs["result"]["companySetting"]>;
    composites: {};
};
export type CompanySettingGetPayload<S extends boolean | null | undefined | CompanySettingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload, S>;
export type CompanySettingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CompanySettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CompanySettingCountAggregateInputType | true;
};
export interface CompanySettingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CompanySetting'];
        meta: {
            name: 'CompanySetting';
        };
    };
    findUnique<T extends CompanySettingFindUniqueArgs>(args: Prisma.SelectSubset<T, CompanySettingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CompanySettingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CompanySettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CompanySettingFindFirstArgs>(args?: Prisma.SelectSubset<T, CompanySettingFindFirstArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CompanySettingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CompanySettingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CompanySettingFindManyArgs>(args?: Prisma.SelectSubset<T, CompanySettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CompanySettingCreateArgs>(args: Prisma.SelectSubset<T, CompanySettingCreateArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CompanySettingCreateManyArgs>(args?: Prisma.SelectSubset<T, CompanySettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CompanySettingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CompanySettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CompanySettingDeleteArgs>(args: Prisma.SelectSubset<T, CompanySettingDeleteArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CompanySettingUpdateArgs>(args: Prisma.SelectSubset<T, CompanySettingUpdateArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CompanySettingDeleteManyArgs>(args?: Prisma.SelectSubset<T, CompanySettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CompanySettingUpdateManyArgs>(args: Prisma.SelectSubset<T, CompanySettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CompanySettingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CompanySettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CompanySettingUpsertArgs>(args: Prisma.SelectSubset<T, CompanySettingUpsertArgs<ExtArgs>>): Prisma.Prisma__CompanySettingClient<runtime.Types.Result.GetResult<Prisma.$CompanySettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CompanySettingCountArgs>(args?: Prisma.Subset<T, CompanySettingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CompanySettingCountAggregateOutputType> : number>;
    aggregate<T extends CompanySettingAggregateArgs>(args: Prisma.Subset<T, CompanySettingAggregateArgs>): Prisma.PrismaPromise<GetCompanySettingAggregateType<T>>;
    groupBy<T extends CompanySettingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CompanySettingGroupByArgs['orderBy'];
    } : {
        orderBy?: CompanySettingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CompanySettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCompanySettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CompanySettingFieldRefs;
}
export interface Prisma__CompanySettingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CompanySettingFieldRefs {
    readonly key: Prisma.FieldRef<"CompanySetting", 'String'>;
    readonly value: Prisma.FieldRef<"CompanySetting", 'Json'>;
    readonly updatedBy: Prisma.FieldRef<"CompanySetting", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"CompanySetting", 'DateTime'>;
}
export type CompanySettingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where: Prisma.CompanySettingWhereUniqueInput;
};
export type CompanySettingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where: Prisma.CompanySettingWhereUniqueInput;
};
export type CompanySettingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where?: Prisma.CompanySettingWhereInput;
    orderBy?: Prisma.CompanySettingOrderByWithRelationInput | Prisma.CompanySettingOrderByWithRelationInput[];
    cursor?: Prisma.CompanySettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanySettingScalarFieldEnum | Prisma.CompanySettingScalarFieldEnum[];
};
export type CompanySettingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where?: Prisma.CompanySettingWhereInput;
    orderBy?: Prisma.CompanySettingOrderByWithRelationInput | Prisma.CompanySettingOrderByWithRelationInput[];
    cursor?: Prisma.CompanySettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanySettingScalarFieldEnum | Prisma.CompanySettingScalarFieldEnum[];
};
export type CompanySettingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where?: Prisma.CompanySettingWhereInput;
    orderBy?: Prisma.CompanySettingOrderByWithRelationInput | Prisma.CompanySettingOrderByWithRelationInput[];
    cursor?: Prisma.CompanySettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CompanySettingScalarFieldEnum | Prisma.CompanySettingScalarFieldEnum[];
};
export type CompanySettingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanySettingCreateInput, Prisma.CompanySettingUncheckedCreateInput>;
};
export type CompanySettingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CompanySettingCreateManyInput | Prisma.CompanySettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CompanySettingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    data: Prisma.CompanySettingCreateManyInput | Prisma.CompanySettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CompanySettingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanySettingUpdateInput, Prisma.CompanySettingUncheckedUpdateInput>;
    where: Prisma.CompanySettingWhereUniqueInput;
};
export type CompanySettingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CompanySettingUpdateManyMutationInput, Prisma.CompanySettingUncheckedUpdateManyInput>;
    where?: Prisma.CompanySettingWhereInput;
    limit?: number;
};
export type CompanySettingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CompanySettingUpdateManyMutationInput, Prisma.CompanySettingUncheckedUpdateManyInput>;
    where?: Prisma.CompanySettingWhereInput;
    limit?: number;
};
export type CompanySettingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where: Prisma.CompanySettingWhereUniqueInput;
    create: Prisma.XOR<Prisma.CompanySettingCreateInput, Prisma.CompanySettingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CompanySettingUpdateInput, Prisma.CompanySettingUncheckedUpdateInput>;
};
export type CompanySettingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
    where: Prisma.CompanySettingWhereUniqueInput;
};
export type CompanySettingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CompanySettingWhereInput;
    limit?: number;
};
export type CompanySettingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CompanySettingSelect<ExtArgs> | null;
    omit?: Prisma.CompanySettingOmit<ExtArgs> | null;
};
//# sourceMappingURL=CompanySetting.d.ts.map