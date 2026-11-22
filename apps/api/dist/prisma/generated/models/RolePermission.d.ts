import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type RolePermissionModel = runtime.Types.Result.DefaultSelection<Prisma.$RolePermissionPayload>;
export type AggregateRolePermission = {
    _count: RolePermissionCountAggregateOutputType | null;
    _min: RolePermissionMinAggregateOutputType | null;
    _max: RolePermissionMaxAggregateOutputType | null;
};
export type RolePermissionMinAggregateOutputType = {
    role: $Enums.UserRole | null;
    key: string | null;
    updatedAt: Date | null;
};
export type RolePermissionMaxAggregateOutputType = {
    role: $Enums.UserRole | null;
    key: string | null;
    updatedAt: Date | null;
};
export type RolePermissionCountAggregateOutputType = {
    role: number;
    key: number;
    updatedAt: number;
    _all: number;
};
export type RolePermissionMinAggregateInputType = {
    role?: true;
    key?: true;
    updatedAt?: true;
};
export type RolePermissionMaxAggregateInputType = {
    role?: true;
    key?: true;
    updatedAt?: true;
};
export type RolePermissionCountAggregateInputType = {
    role?: true;
    key?: true;
    updatedAt?: true;
    _all?: true;
};
export type RolePermissionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithRelationInput | Prisma.RolePermissionOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RolePermissionCountAggregateInputType;
    _min?: RolePermissionMinAggregateInputType;
    _max?: RolePermissionMaxAggregateInputType;
};
export type GetRolePermissionAggregateType<T extends RolePermissionAggregateArgs> = {
    [P in keyof T & keyof AggregateRolePermission]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRolePermission[P]> : Prisma.GetScalarType<T[P], AggregateRolePermission[P]>;
};
export type RolePermissionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithAggregationInput | Prisma.RolePermissionOrderByWithAggregationInput[];
    by: Prisma.RolePermissionScalarFieldEnum[] | Prisma.RolePermissionScalarFieldEnum;
    having?: Prisma.RolePermissionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RolePermissionCountAggregateInputType | true;
    _min?: RolePermissionMinAggregateInputType;
    _max?: RolePermissionMaxAggregateInputType;
};
export type RolePermissionGroupByOutputType = {
    role: $Enums.UserRole;
    key: string;
    updatedAt: Date;
    _count: RolePermissionCountAggregateOutputType | null;
    _min: RolePermissionMinAggregateOutputType | null;
    _max: RolePermissionMaxAggregateOutputType | null;
};
export type GetRolePermissionGroupByPayload<T extends RolePermissionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RolePermissionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RolePermissionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RolePermissionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RolePermissionGroupByOutputType[P]>;
}>>;
export type RolePermissionWhereInput = {
    AND?: Prisma.RolePermissionWhereInput | Prisma.RolePermissionWhereInput[];
    OR?: Prisma.RolePermissionWhereInput[];
    NOT?: Prisma.RolePermissionWhereInput | Prisma.RolePermissionWhereInput[];
    role?: Prisma.EnumUserRoleFilter<"RolePermission"> | $Enums.UserRole;
    key?: Prisma.StringFilter<"RolePermission"> | string;
    updatedAt?: Prisma.DateTimeFilter<"RolePermission"> | Date | string;
};
export type RolePermissionOrderByWithRelationInput = {
    role?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionWhereUniqueInput = Prisma.AtLeast<{
    role_key?: Prisma.RolePermissionRoleKeyCompoundUniqueInput;
    AND?: Prisma.RolePermissionWhereInput | Prisma.RolePermissionWhereInput[];
    OR?: Prisma.RolePermissionWhereInput[];
    NOT?: Prisma.RolePermissionWhereInput | Prisma.RolePermissionWhereInput[];
    role?: Prisma.EnumUserRoleFilter<"RolePermission"> | $Enums.UserRole;
    key?: Prisma.StringFilter<"RolePermission"> | string;
    updatedAt?: Prisma.DateTimeFilter<"RolePermission"> | Date | string;
}, "role_key">;
export type RolePermissionOrderByWithAggregationInput = {
    role?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.RolePermissionCountOrderByAggregateInput;
    _max?: Prisma.RolePermissionMaxOrderByAggregateInput;
    _min?: Prisma.RolePermissionMinOrderByAggregateInput;
};
export type RolePermissionScalarWhereWithAggregatesInput = {
    AND?: Prisma.RolePermissionScalarWhereWithAggregatesInput | Prisma.RolePermissionScalarWhereWithAggregatesInput[];
    OR?: Prisma.RolePermissionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RolePermissionScalarWhereWithAggregatesInput | Prisma.RolePermissionScalarWhereWithAggregatesInput[];
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"RolePermission"> | $Enums.UserRole;
    key?: Prisma.StringWithAggregatesFilter<"RolePermission"> | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"RolePermission"> | Date | string;
};
export type RolePermissionCreateInput = {
    role: $Enums.UserRole;
    key: string;
    updatedAt?: Date | string;
};
export type RolePermissionUncheckedCreateInput = {
    role: $Enums.UserRole;
    key: string;
    updatedAt?: Date | string;
};
export type RolePermissionUpdateInput = {
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionUncheckedUpdateInput = {
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionCreateManyInput = {
    role: $Enums.UserRole;
    key: string;
    updatedAt?: Date | string;
};
export type RolePermissionUpdateManyMutationInput = {
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionUncheckedUpdateManyInput = {
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type RolePermissionRoleKeyCompoundUniqueInput = {
    role: $Enums.UserRole;
    key: string;
};
export type RolePermissionCountOrderByAggregateInput = {
    role?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionMaxOrderByAggregateInput = {
    role?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionMinOrderByAggregateInput = {
    role?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type RolePermissionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    role?: boolean;
    key?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermission"]>;
export type RolePermissionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    role?: boolean;
    key?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermission"]>;
export type RolePermissionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    role?: boolean;
    key?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["rolePermission"]>;
export type RolePermissionSelectScalar = {
    role?: boolean;
    key?: boolean;
    updatedAt?: boolean;
};
export type RolePermissionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"role" | "key" | "updatedAt", ExtArgs["result"]["rolePermission"]>;
export type $RolePermissionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RolePermission";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        role: $Enums.UserRole;
        key: string;
        updatedAt: Date;
    }, ExtArgs["result"]["rolePermission"]>;
    composites: {};
};
export type RolePermissionGetPayload<S extends boolean | null | undefined | RolePermissionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload, S>;
export type RolePermissionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RolePermissionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RolePermissionCountAggregateInputType | true;
};
export interface RolePermissionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RolePermission'];
        meta: {
            name: 'RolePermission';
        };
    };
    findUnique<T extends RolePermissionFindUniqueArgs>(args: Prisma.SelectSubset<T, RolePermissionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RolePermissionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RolePermissionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RolePermissionFindFirstArgs>(args?: Prisma.SelectSubset<T, RolePermissionFindFirstArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RolePermissionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RolePermissionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RolePermissionFindManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RolePermissionCreateArgs>(args: Prisma.SelectSubset<T, RolePermissionCreateArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RolePermissionCreateManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RolePermissionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RolePermissionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RolePermissionDeleteArgs>(args: Prisma.SelectSubset<T, RolePermissionDeleteArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RolePermissionUpdateArgs>(args: Prisma.SelectSubset<T, RolePermissionUpdateArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RolePermissionDeleteManyArgs>(args?: Prisma.SelectSubset<T, RolePermissionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RolePermissionUpdateManyArgs>(args: Prisma.SelectSubset<T, RolePermissionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RolePermissionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RolePermissionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RolePermissionUpsertArgs>(args: Prisma.SelectSubset<T, RolePermissionUpsertArgs<ExtArgs>>): Prisma.Prisma__RolePermissionClient<runtime.Types.Result.GetResult<Prisma.$RolePermissionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RolePermissionCountArgs>(args?: Prisma.Subset<T, RolePermissionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RolePermissionCountAggregateOutputType> : number>;
    aggregate<T extends RolePermissionAggregateArgs>(args: Prisma.Subset<T, RolePermissionAggregateArgs>): Prisma.PrismaPromise<GetRolePermissionAggregateType<T>>;
    groupBy<T extends RolePermissionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RolePermissionGroupByArgs['orderBy'];
    } : {
        orderBy?: RolePermissionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RolePermissionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRolePermissionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RolePermissionFieldRefs;
}
export interface Prisma__RolePermissionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RolePermissionFieldRefs {
    readonly role: Prisma.FieldRef<"RolePermission", 'UserRole'>;
    readonly key: Prisma.FieldRef<"RolePermission", 'String'>;
    readonly updatedAt: Prisma.FieldRef<"RolePermission", 'DateTime'>;
}
export type RolePermissionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where: Prisma.RolePermissionWhereUniqueInput;
};
export type RolePermissionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where: Prisma.RolePermissionWhereUniqueInput;
};
export type RolePermissionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithRelationInput | Prisma.RolePermissionOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionScalarFieldEnum | Prisma.RolePermissionScalarFieldEnum[];
};
export type RolePermissionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithRelationInput | Prisma.RolePermissionOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionScalarFieldEnum | Prisma.RolePermissionScalarFieldEnum[];
};
export type RolePermissionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where?: Prisma.RolePermissionWhereInput;
    orderBy?: Prisma.RolePermissionOrderByWithRelationInput | Prisma.RolePermissionOrderByWithRelationInput[];
    cursor?: Prisma.RolePermissionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RolePermissionScalarFieldEnum | Prisma.RolePermissionScalarFieldEnum[];
};
export type RolePermissionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionCreateInput, Prisma.RolePermissionUncheckedCreateInput>;
};
export type RolePermissionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RolePermissionCreateManyInput | Prisma.RolePermissionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RolePermissionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    data: Prisma.RolePermissionCreateManyInput | Prisma.RolePermissionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RolePermissionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionUpdateInput, Prisma.RolePermissionUncheckedUpdateInput>;
    where: Prisma.RolePermissionWhereUniqueInput;
};
export type RolePermissionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RolePermissionUpdateManyMutationInput, Prisma.RolePermissionUncheckedUpdateManyInput>;
    where?: Prisma.RolePermissionWhereInput;
    limit?: number;
};
export type RolePermissionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RolePermissionUpdateManyMutationInput, Prisma.RolePermissionUncheckedUpdateManyInput>;
    where?: Prisma.RolePermissionWhereInput;
    limit?: number;
};
export type RolePermissionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where: Prisma.RolePermissionWhereUniqueInput;
    create: Prisma.XOR<Prisma.RolePermissionCreateInput, Prisma.RolePermissionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RolePermissionUpdateInput, Prisma.RolePermissionUncheckedUpdateInput>;
};
export type RolePermissionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
    where: Prisma.RolePermissionWhereUniqueInput;
};
export type RolePermissionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RolePermissionWhereInput;
    limit?: number;
};
export type RolePermissionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RolePermissionSelect<ExtArgs> | null;
    omit?: Prisma.RolePermissionOmit<ExtArgs> | null;
};
//# sourceMappingURL=RolePermission.d.ts.map