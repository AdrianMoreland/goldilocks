import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserPreferenceModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPreferencePayload>;
export type AggregateUserPreference = {
    _count: UserPreferenceCountAggregateOutputType | null;
    _min: UserPreferenceMinAggregateOutputType | null;
    _max: UserPreferenceMaxAggregateOutputType | null;
};
export type UserPreferenceMinAggregateOutputType = {
    userId: string | null;
    updatedAt: Date | null;
};
export type UserPreferenceMaxAggregateOutputType = {
    userId: string | null;
    updatedAt: Date | null;
};
export type UserPreferenceCountAggregateOutputType = {
    userId: number;
    data: number;
    updatedAt: number;
    _all: number;
};
export type UserPreferenceMinAggregateInputType = {
    userId?: true;
    updatedAt?: true;
};
export type UserPreferenceMaxAggregateInputType = {
    userId?: true;
    updatedAt?: true;
};
export type UserPreferenceCountAggregateInputType = {
    userId?: true;
    data?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserPreferenceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPreferenceWhereInput;
    orderBy?: Prisma.UserPreferenceOrderByWithRelationInput | Prisma.UserPreferenceOrderByWithRelationInput[];
    cursor?: Prisma.UserPreferenceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserPreferenceCountAggregateInputType;
    _min?: UserPreferenceMinAggregateInputType;
    _max?: UserPreferenceMaxAggregateInputType;
};
export type GetUserPreferenceAggregateType<T extends UserPreferenceAggregateArgs> = {
    [P in keyof T & keyof AggregateUserPreference]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserPreference[P]> : Prisma.GetScalarType<T[P], AggregateUserPreference[P]>;
};
export type UserPreferenceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPreferenceWhereInput;
    orderBy?: Prisma.UserPreferenceOrderByWithAggregationInput | Prisma.UserPreferenceOrderByWithAggregationInput[];
    by: Prisma.UserPreferenceScalarFieldEnum[] | Prisma.UserPreferenceScalarFieldEnum;
    having?: Prisma.UserPreferenceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserPreferenceCountAggregateInputType | true;
    _min?: UserPreferenceMinAggregateInputType;
    _max?: UserPreferenceMaxAggregateInputType;
};
export type UserPreferenceGroupByOutputType = {
    userId: string;
    data: runtime.JsonValue;
    updatedAt: Date;
    _count: UserPreferenceCountAggregateOutputType | null;
    _min: UserPreferenceMinAggregateOutputType | null;
    _max: UserPreferenceMaxAggregateOutputType | null;
};
export type GetUserPreferenceGroupByPayload<T extends UserPreferenceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserPreferenceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserPreferenceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserPreferenceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserPreferenceGroupByOutputType[P]>;
}>>;
export type UserPreferenceWhereInput = {
    AND?: Prisma.UserPreferenceWhereInput | Prisma.UserPreferenceWhereInput[];
    OR?: Prisma.UserPreferenceWhereInput[];
    NOT?: Prisma.UserPreferenceWhereInput | Prisma.UserPreferenceWhereInput[];
    userId?: Prisma.StringFilter<"UserPreference"> | string;
    data?: Prisma.JsonFilter<"UserPreference">;
    updatedAt?: Prisma.DateTimeFilter<"UserPreference"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserPreferenceOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserPreferenceWhereUniqueInput = Prisma.AtLeast<{
    userId?: string;
    AND?: Prisma.UserPreferenceWhereInput | Prisma.UserPreferenceWhereInput[];
    OR?: Prisma.UserPreferenceWhereInput[];
    NOT?: Prisma.UserPreferenceWhereInput | Prisma.UserPreferenceWhereInput[];
    data?: Prisma.JsonFilter<"UserPreference">;
    updatedAt?: Prisma.DateTimeFilter<"UserPreference"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "userId">;
export type UserPreferenceOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserPreferenceCountOrderByAggregateInput;
    _max?: Prisma.UserPreferenceMaxOrderByAggregateInput;
    _min?: Prisma.UserPreferenceMinOrderByAggregateInput;
};
export type UserPreferenceScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserPreferenceScalarWhereWithAggregatesInput | Prisma.UserPreferenceScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserPreferenceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserPreferenceScalarWhereWithAggregatesInput | Prisma.UserPreferenceScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"UserPreference"> | string;
    data?: Prisma.JsonWithAggregatesFilter<"UserPreference">;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"UserPreference"> | Date | string;
};
export type UserPreferenceCreateInput = {
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPreferenceInput;
};
export type UserPreferenceUncheckedCreateInput = {
    userId: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type UserPreferenceUpdateInput = {
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPreferenceNestedInput;
};
export type UserPreferenceUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPreferenceCreateManyInput = {
    userId: string;
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type UserPreferenceUpdateManyMutationInput = {
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPreferenceUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPreferenceNullableScalarRelationFilter = {
    is?: Prisma.UserPreferenceWhereInput | null;
    isNot?: Prisma.UserPreferenceWhereInput | null;
};
export type UserPreferenceCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    data?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserPreferenceMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserPreferenceMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserPreferenceCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.UserPreferenceCreateOrConnectWithoutUserInput;
    connect?: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceUncheckedCreateNestedOneWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.UserPreferenceCreateOrConnectWithoutUserInput;
    connect?: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.UserPreferenceCreateOrConnectWithoutUserInput;
    upsert?: Prisma.UserPreferenceUpsertWithoutUserInput;
    disconnect?: Prisma.UserPreferenceWhereInput | boolean;
    delete?: Prisma.UserPreferenceWhereInput | boolean;
    connect?: Prisma.UserPreferenceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserPreferenceUpdateToOneWithWhereWithoutUserInput, Prisma.UserPreferenceUpdateWithoutUserInput>, Prisma.UserPreferenceUncheckedUpdateWithoutUserInput>;
};
export type UserPreferenceUncheckedUpdateOneWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
    connectOrCreate?: Prisma.UserPreferenceCreateOrConnectWithoutUserInput;
    upsert?: Prisma.UserPreferenceUpsertWithoutUserInput;
    disconnect?: Prisma.UserPreferenceWhereInput | boolean;
    delete?: Prisma.UserPreferenceWhereInput | boolean;
    connect?: Prisma.UserPreferenceWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserPreferenceUpdateToOneWithWhereWithoutUserInput, Prisma.UserPreferenceUpdateWithoutUserInput>, Prisma.UserPreferenceUncheckedUpdateWithoutUserInput>;
};
export type UserPreferenceCreateWithoutUserInput = {
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type UserPreferenceUncheckedCreateWithoutUserInput = {
    data: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Date | string;
};
export type UserPreferenceCreateOrConnectWithoutUserInput = {
    where: Prisma.UserPreferenceWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
};
export type UserPreferenceUpsertWithoutUserInput = {
    update: Prisma.XOR<Prisma.UserPreferenceUpdateWithoutUserInput, Prisma.UserPreferenceUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserPreferenceCreateWithoutUserInput, Prisma.UserPreferenceUncheckedCreateWithoutUserInput>;
    where?: Prisma.UserPreferenceWhereInput;
};
export type UserPreferenceUpdateToOneWithWhereWithoutUserInput = {
    where?: Prisma.UserPreferenceWhereInput;
    data: Prisma.XOR<Prisma.UserPreferenceUpdateWithoutUserInput, Prisma.UserPreferenceUncheckedUpdateWithoutUserInput>;
};
export type UserPreferenceUpdateWithoutUserInput = {
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPreferenceUncheckedUpdateWithoutUserInput = {
    data?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPreferenceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    data?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPreference"]>;
export type UserPreferenceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    data?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPreference"]>;
export type UserPreferenceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    data?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPreference"]>;
export type UserPreferenceSelectScalar = {
    userId?: boolean;
    data?: boolean;
    updatedAt?: boolean;
};
export type UserPreferenceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "data" | "updatedAt", ExtArgs["result"]["userPreference"]>;
export type UserPreferenceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPreferenceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPreferenceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserPreferencePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserPreference";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        data: runtime.JsonValue;
        updatedAt: Date;
    }, ExtArgs["result"]["userPreference"]>;
    composites: {};
};
export type UserPreferenceGetPayload<S extends boolean | null | undefined | UserPreferenceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload, S>;
export type UserPreferenceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserPreferenceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserPreferenceCountAggregateInputType | true;
};
export interface UserPreferenceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserPreference'];
        meta: {
            name: 'UserPreference';
        };
    };
    findUnique<T extends UserPreferenceFindUniqueArgs>(args: Prisma.SelectSubset<T, UserPreferenceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserPreferenceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserPreferenceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserPreferenceFindFirstArgs>(args?: Prisma.SelectSubset<T, UserPreferenceFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserPreferenceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserPreferenceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserPreferenceFindManyArgs>(args?: Prisma.SelectSubset<T, UserPreferenceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserPreferenceCreateArgs>(args: Prisma.SelectSubset<T, UserPreferenceCreateArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserPreferenceCreateManyArgs>(args?: Prisma.SelectSubset<T, UserPreferenceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserPreferenceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserPreferenceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserPreferenceDeleteArgs>(args: Prisma.SelectSubset<T, UserPreferenceDeleteArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserPreferenceUpdateArgs>(args: Prisma.SelectSubset<T, UserPreferenceUpdateArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserPreferenceDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserPreferenceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserPreferenceUpdateManyArgs>(args: Prisma.SelectSubset<T, UserPreferenceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserPreferenceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserPreferenceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserPreferenceUpsertArgs>(args: Prisma.SelectSubset<T, UserPreferenceUpsertArgs<ExtArgs>>): Prisma.Prisma__UserPreferenceClient<runtime.Types.Result.GetResult<Prisma.$UserPreferencePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserPreferenceCountArgs>(args?: Prisma.Subset<T, UserPreferenceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserPreferenceCountAggregateOutputType> : number>;
    aggregate<T extends UserPreferenceAggregateArgs>(args: Prisma.Subset<T, UserPreferenceAggregateArgs>): Prisma.PrismaPromise<GetUserPreferenceAggregateType<T>>;
    groupBy<T extends UserPreferenceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserPreferenceGroupByArgs['orderBy'];
    } : {
        orderBy?: UserPreferenceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserPreferenceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPreferenceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserPreferenceFieldRefs;
}
export interface Prisma__UserPreferenceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserPreferenceFieldRefs {
    readonly userId: Prisma.FieldRef<"UserPreference", 'String'>;
    readonly data: Prisma.FieldRef<"UserPreference", 'Json'>;
    readonly updatedAt: Prisma.FieldRef<"UserPreference", 'DateTime'>;
}
export type UserPreferenceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where?: Prisma.UserPreferenceWhereInput;
    orderBy?: Prisma.UserPreferenceOrderByWithRelationInput | Prisma.UserPreferenceOrderByWithRelationInput[];
    cursor?: Prisma.UserPreferenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPreferenceScalarFieldEnum | Prisma.UserPreferenceScalarFieldEnum[];
};
export type UserPreferenceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where?: Prisma.UserPreferenceWhereInput;
    orderBy?: Prisma.UserPreferenceOrderByWithRelationInput | Prisma.UserPreferenceOrderByWithRelationInput[];
    cursor?: Prisma.UserPreferenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPreferenceScalarFieldEnum | Prisma.UserPreferenceScalarFieldEnum[];
};
export type UserPreferenceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where?: Prisma.UserPreferenceWhereInput;
    orderBy?: Prisma.UserPreferenceOrderByWithRelationInput | Prisma.UserPreferenceOrderByWithRelationInput[];
    cursor?: Prisma.UserPreferenceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPreferenceScalarFieldEnum | Prisma.UserPreferenceScalarFieldEnum[];
};
export type UserPreferenceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPreferenceCreateInput, Prisma.UserPreferenceUncheckedCreateInput>;
};
export type UserPreferenceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserPreferenceCreateManyInput | Prisma.UserPreferenceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserPreferenceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    data: Prisma.UserPreferenceCreateManyInput | Prisma.UserPreferenceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserPreferenceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserPreferenceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPreferenceUpdateInput, Prisma.UserPreferenceUncheckedUpdateInput>;
    where: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserPreferenceUpdateManyMutationInput, Prisma.UserPreferenceUncheckedUpdateManyInput>;
    where?: Prisma.UserPreferenceWhereInput;
    limit?: number;
};
export type UserPreferenceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPreferenceUpdateManyMutationInput, Prisma.UserPreferenceUncheckedUpdateManyInput>;
    where?: Prisma.UserPreferenceWhereInput;
    limit?: number;
    include?: Prisma.UserPreferenceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserPreferenceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where: Prisma.UserPreferenceWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserPreferenceCreateInput, Prisma.UserPreferenceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserPreferenceUpdateInput, Prisma.UserPreferenceUncheckedUpdateInput>;
};
export type UserPreferenceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
    where: Prisma.UserPreferenceWhereUniqueInput;
};
export type UserPreferenceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPreferenceWhereInput;
    limit?: number;
};
export type UserPreferenceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPreferenceSelect<ExtArgs> | null;
    omit?: Prisma.UserPreferenceOmit<ExtArgs> | null;
    include?: Prisma.UserPreferenceInclude<ExtArgs> | null;
};
//# sourceMappingURL=UserPreference.d.ts.map