import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type UserPermissionOverrideModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPermissionOverridePayload>;
export type AggregateUserPermissionOverride = {
    _count: UserPermissionOverrideCountAggregateOutputType | null;
    _min: UserPermissionOverrideMinAggregateOutputType | null;
    _max: UserPermissionOverrideMaxAggregateOutputType | null;
};
export type UserPermissionOverrideMinAggregateOutputType = {
    userId: string | null;
    key: string | null;
    granted: boolean | null;
    expiresAt: Date | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type UserPermissionOverrideMaxAggregateOutputType = {
    userId: string | null;
    key: string | null;
    granted: boolean | null;
    expiresAt: Date | null;
    reason: string | null;
    createdBy: string | null;
    createdAt: Date | null;
};
export type UserPermissionOverrideCountAggregateOutputType = {
    userId: number;
    key: number;
    granted: number;
    expiresAt: number;
    reason: number;
    createdBy: number;
    createdAt: number;
    _all: number;
};
export type UserPermissionOverrideMinAggregateInputType = {
    userId?: true;
    key?: true;
    granted?: true;
    expiresAt?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type UserPermissionOverrideMaxAggregateInputType = {
    userId?: true;
    key?: true;
    granted?: true;
    expiresAt?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
};
export type UserPermissionOverrideCountAggregateInputType = {
    userId?: true;
    key?: true;
    granted?: true;
    expiresAt?: true;
    reason?: true;
    createdBy?: true;
    createdAt?: true;
    _all?: true;
};
export type UserPermissionOverrideAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPermissionOverrideWhereInput;
    orderBy?: Prisma.UserPermissionOverrideOrderByWithRelationInput | Prisma.UserPermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.UserPermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserPermissionOverrideCountAggregateInputType;
    _min?: UserPermissionOverrideMinAggregateInputType;
    _max?: UserPermissionOverrideMaxAggregateInputType;
};
export type GetUserPermissionOverrideAggregateType<T extends UserPermissionOverrideAggregateArgs> = {
    [P in keyof T & keyof AggregateUserPermissionOverride]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUserPermissionOverride[P]> : Prisma.GetScalarType<T[P], AggregateUserPermissionOverride[P]>;
};
export type UserPermissionOverrideGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPermissionOverrideWhereInput;
    orderBy?: Prisma.UserPermissionOverrideOrderByWithAggregationInput | Prisma.UserPermissionOverrideOrderByWithAggregationInput[];
    by: Prisma.UserPermissionOverrideScalarFieldEnum[] | Prisma.UserPermissionOverrideScalarFieldEnum;
    having?: Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserPermissionOverrideCountAggregateInputType | true;
    _min?: UserPermissionOverrideMinAggregateInputType;
    _max?: UserPermissionOverrideMaxAggregateInputType;
};
export type UserPermissionOverrideGroupByOutputType = {
    userId: string;
    key: string;
    granted: boolean;
    expiresAt: Date | null;
    reason: string;
    createdBy: string;
    createdAt: Date;
    _count: UserPermissionOverrideCountAggregateOutputType | null;
    _min: UserPermissionOverrideMinAggregateOutputType | null;
    _max: UserPermissionOverrideMaxAggregateOutputType | null;
};
export type GetUserPermissionOverrideGroupByPayload<T extends UserPermissionOverrideGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserPermissionOverrideGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserPermissionOverrideGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserPermissionOverrideGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserPermissionOverrideGroupByOutputType[P]>;
}>>;
export type UserPermissionOverrideWhereInput = {
    AND?: Prisma.UserPermissionOverrideWhereInput | Prisma.UserPermissionOverrideWhereInput[];
    OR?: Prisma.UserPermissionOverrideWhereInput[];
    NOT?: Prisma.UserPermissionOverrideWhereInput | Prisma.UserPermissionOverrideWhereInput[];
    userId?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    key?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    granted?: Prisma.BoolFilter<"UserPermissionOverride"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"UserPermissionOverride"> | Date | string | null;
    reason?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdBy?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserPermissionOverride"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type UserPermissionOverrideOrderByWithRelationInput = {
    userId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type UserPermissionOverrideWhereUniqueInput = Prisma.AtLeast<{
    userId_key?: Prisma.UserPermissionOverrideUserIdKeyCompoundUniqueInput;
    AND?: Prisma.UserPermissionOverrideWhereInput | Prisma.UserPermissionOverrideWhereInput[];
    OR?: Prisma.UserPermissionOverrideWhereInput[];
    NOT?: Prisma.UserPermissionOverrideWhereInput | Prisma.UserPermissionOverrideWhereInput[];
    userId?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    key?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    granted?: Prisma.BoolFilter<"UserPermissionOverride"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"UserPermissionOverride"> | Date | string | null;
    reason?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdBy?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserPermissionOverride"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "userId_key">;
export type UserPermissionOverrideOrderByWithAggregationInput = {
    userId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.UserPermissionOverrideCountOrderByAggregateInput;
    _max?: Prisma.UserPermissionOverrideMaxOrderByAggregateInput;
    _min?: Prisma.UserPermissionOverrideMinOrderByAggregateInput;
};
export type UserPermissionOverrideScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput | Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput | Prisma.UserPermissionOverrideScalarWhereWithAggregatesInput[];
    userId?: Prisma.StringWithAggregatesFilter<"UserPermissionOverride"> | string;
    key?: Prisma.StringWithAggregatesFilter<"UserPermissionOverride"> | string;
    granted?: Prisma.BoolWithAggregatesFilter<"UserPermissionOverride"> | boolean;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"UserPermissionOverride"> | Date | string | null;
    reason?: Prisma.StringWithAggregatesFilter<"UserPermissionOverride"> | string;
    createdBy?: Prisma.StringWithAggregatesFilter<"UserPermissionOverride"> | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"UserPermissionOverride"> | Date | string;
};
export type UserPermissionOverrideCreateInput = {
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutPermissionOverridesInput;
};
export type UserPermissionOverrideUncheckedCreateInput = {
    userId: string;
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type UserPermissionOverrideUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutPermissionOverridesNestedInput;
};
export type UserPermissionOverrideUncheckedUpdateInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideCreateManyInput = {
    userId: string;
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type UserPermissionOverrideUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideUncheckedUpdateManyInput = {
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideListRelationFilter = {
    every?: Prisma.UserPermissionOverrideWhereInput;
    some?: Prisma.UserPermissionOverrideWhereInput;
    none?: Prisma.UserPermissionOverrideWhereInput;
};
export type UserPermissionOverrideOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type UserPermissionOverrideUserIdKeyCompoundUniqueInput = {
    userId: string;
    key: string;
};
export type UserPermissionOverrideCountOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserPermissionOverrideMaxOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserPermissionOverrideMinOrderByAggregateInput = {
    userId?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    granted?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    reason?: Prisma.SortOrder;
    createdBy?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type UserPermissionOverrideCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput> | Prisma.UserPermissionOverrideCreateWithoutUserInput[] | Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput | Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserPermissionOverrideCreateManyUserInputEnvelope;
    connect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
};
export type UserPermissionOverrideUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput> | Prisma.UserPermissionOverrideCreateWithoutUserInput[] | Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput | Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.UserPermissionOverrideCreateManyUserInputEnvelope;
    connect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
};
export type UserPermissionOverrideUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput> | Prisma.UserPermissionOverrideCreateWithoutUserInput[] | Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput | Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserPermissionOverrideUpsertWithWhereUniqueWithoutUserInput | Prisma.UserPermissionOverrideUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserPermissionOverrideCreateManyUserInputEnvelope;
    set?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    update?: Prisma.UserPermissionOverrideUpdateWithWhereUniqueWithoutUserInput | Prisma.UserPermissionOverrideUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserPermissionOverrideUpdateManyWithWhereWithoutUserInput | Prisma.UserPermissionOverrideUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserPermissionOverrideScalarWhereInput | Prisma.UserPermissionOverrideScalarWhereInput[];
};
export type UserPermissionOverrideUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput> | Prisma.UserPermissionOverrideCreateWithoutUserInput[] | Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput | Prisma.UserPermissionOverrideCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.UserPermissionOverrideUpsertWithWhereUniqueWithoutUserInput | Prisma.UserPermissionOverrideUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.UserPermissionOverrideCreateManyUserInputEnvelope;
    set?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    disconnect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    delete?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    connect?: Prisma.UserPermissionOverrideWhereUniqueInput | Prisma.UserPermissionOverrideWhereUniqueInput[];
    update?: Prisma.UserPermissionOverrideUpdateWithWhereUniqueWithoutUserInput | Prisma.UserPermissionOverrideUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.UserPermissionOverrideUpdateManyWithWhereWithoutUserInput | Prisma.UserPermissionOverrideUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.UserPermissionOverrideScalarWhereInput | Prisma.UserPermissionOverrideScalarWhereInput[];
};
export type UserPermissionOverrideCreateWithoutUserInput = {
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type UserPermissionOverrideUncheckedCreateWithoutUserInput = {
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type UserPermissionOverrideCreateOrConnectWithoutUserInput = {
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput>;
};
export type UserPermissionOverrideCreateManyUserInputEnvelope = {
    data: Prisma.UserPermissionOverrideCreateManyUserInput | Prisma.UserPermissionOverrideCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type UserPermissionOverrideUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
    update: Prisma.XOR<Prisma.UserPermissionOverrideUpdateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.UserPermissionOverrideCreateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedCreateWithoutUserInput>;
};
export type UserPermissionOverrideUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
    data: Prisma.XOR<Prisma.UserPermissionOverrideUpdateWithoutUserInput, Prisma.UserPermissionOverrideUncheckedUpdateWithoutUserInput>;
};
export type UserPermissionOverrideUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.UserPermissionOverrideScalarWhereInput;
    data: Prisma.XOR<Prisma.UserPermissionOverrideUpdateManyMutationInput, Prisma.UserPermissionOverrideUncheckedUpdateManyWithoutUserInput>;
};
export type UserPermissionOverrideScalarWhereInput = {
    AND?: Prisma.UserPermissionOverrideScalarWhereInput | Prisma.UserPermissionOverrideScalarWhereInput[];
    OR?: Prisma.UserPermissionOverrideScalarWhereInput[];
    NOT?: Prisma.UserPermissionOverrideScalarWhereInput | Prisma.UserPermissionOverrideScalarWhereInput[];
    userId?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    key?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    granted?: Prisma.BoolFilter<"UserPermissionOverride"> | boolean;
    expiresAt?: Prisma.DateTimeNullableFilter<"UserPermissionOverride"> | Date | string | null;
    reason?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdBy?: Prisma.StringFilter<"UserPermissionOverride"> | string;
    createdAt?: Prisma.DateTimeFilter<"UserPermissionOverride"> | Date | string;
};
export type UserPermissionOverrideCreateManyUserInput = {
    key: string;
    granted: boolean;
    expiresAt?: Date | string | null;
    reason: string;
    createdBy: string;
    createdAt?: Date | string;
};
export type UserPermissionOverrideUpdateWithoutUserInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideUncheckedUpdateWithoutUserInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideUncheckedUpdateManyWithoutUserInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    granted?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    reason?: Prisma.StringFieldUpdateOperationsInput | string;
    createdBy?: Prisma.StringFieldUpdateOperationsInput | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserPermissionOverrideSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    key?: boolean;
    granted?: boolean;
    expiresAt?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPermissionOverride"]>;
export type UserPermissionOverrideSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    key?: boolean;
    granted?: boolean;
    expiresAt?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPermissionOverride"]>;
export type UserPermissionOverrideSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    userId?: boolean;
    key?: boolean;
    granted?: boolean;
    expiresAt?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["userPermissionOverride"]>;
export type UserPermissionOverrideSelectScalar = {
    userId?: boolean;
    key?: boolean;
    granted?: boolean;
    expiresAt?: boolean;
    reason?: boolean;
    createdBy?: boolean;
    createdAt?: boolean;
};
export type UserPermissionOverrideOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"userId" | "key" | "granted" | "expiresAt" | "reason" | "createdBy" | "createdAt", ExtArgs["result"]["userPermissionOverride"]>;
export type UserPermissionOverrideInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPermissionOverrideIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type UserPermissionOverrideIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $UserPermissionOverridePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "UserPermissionOverride";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        userId: string;
        key: string;
        granted: boolean;
        expiresAt: Date | null;
        reason: string;
        createdBy: string;
        createdAt: Date;
    }, ExtArgs["result"]["userPermissionOverride"]>;
    composites: {};
};
export type UserPermissionOverrideGetPayload<S extends boolean | null | undefined | UserPermissionOverrideDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload, S>;
export type UserPermissionOverrideCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserPermissionOverrideFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserPermissionOverrideCountAggregateInputType | true;
};
export interface UserPermissionOverrideDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['UserPermissionOverride'];
        meta: {
            name: 'UserPermissionOverride';
        };
    };
    findUnique<T extends UserPermissionOverrideFindUniqueArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserPermissionOverrideFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserPermissionOverrideFindFirstArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserPermissionOverrideFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserPermissionOverrideFindManyArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserPermissionOverrideCreateArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideCreateArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserPermissionOverrideCreateManyArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserPermissionOverrideCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserPermissionOverrideDeleteArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideDeleteArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserPermissionOverrideUpdateArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideUpdateArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserPermissionOverrideDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserPermissionOverrideDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserPermissionOverrideUpdateManyArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserPermissionOverrideUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserPermissionOverrideUpsertArgs>(args: Prisma.SelectSubset<T, UserPermissionOverrideUpsertArgs<ExtArgs>>): Prisma.Prisma__UserPermissionOverrideClient<runtime.Types.Result.GetResult<Prisma.$UserPermissionOverridePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserPermissionOverrideCountArgs>(args?: Prisma.Subset<T, UserPermissionOverrideCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserPermissionOverrideCountAggregateOutputType> : number>;
    aggregate<T extends UserPermissionOverrideAggregateArgs>(args: Prisma.Subset<T, UserPermissionOverrideAggregateArgs>): Prisma.PrismaPromise<GetUserPermissionOverrideAggregateType<T>>;
    groupBy<T extends UserPermissionOverrideGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserPermissionOverrideGroupByArgs['orderBy'];
    } : {
        orderBy?: UserPermissionOverrideGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserPermissionOverrideGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserPermissionOverrideGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserPermissionOverrideFieldRefs;
}
export interface Prisma__UserPermissionOverrideClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserPermissionOverrideFieldRefs {
    readonly userId: Prisma.FieldRef<"UserPermissionOverride", 'String'>;
    readonly key: Prisma.FieldRef<"UserPermissionOverride", 'String'>;
    readonly granted: Prisma.FieldRef<"UserPermissionOverride", 'Boolean'>;
    readonly expiresAt: Prisma.FieldRef<"UserPermissionOverride", 'DateTime'>;
    readonly reason: Prisma.FieldRef<"UserPermissionOverride", 'String'>;
    readonly createdBy: Prisma.FieldRef<"UserPermissionOverride", 'String'>;
    readonly createdAt: Prisma.FieldRef<"UserPermissionOverride", 'DateTime'>;
}
export type UserPermissionOverrideFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
};
export type UserPermissionOverrideFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
};
export type UserPermissionOverrideFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where?: Prisma.UserPermissionOverrideWhereInput;
    orderBy?: Prisma.UserPermissionOverrideOrderByWithRelationInput | Prisma.UserPermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.UserPermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPermissionOverrideScalarFieldEnum | Prisma.UserPermissionOverrideScalarFieldEnum[];
};
export type UserPermissionOverrideFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where?: Prisma.UserPermissionOverrideWhereInput;
    orderBy?: Prisma.UserPermissionOverrideOrderByWithRelationInput | Prisma.UserPermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.UserPermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPermissionOverrideScalarFieldEnum | Prisma.UserPermissionOverrideScalarFieldEnum[];
};
export type UserPermissionOverrideFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where?: Prisma.UserPermissionOverrideWhereInput;
    orderBy?: Prisma.UserPermissionOverrideOrderByWithRelationInput | Prisma.UserPermissionOverrideOrderByWithRelationInput[];
    cursor?: Prisma.UserPermissionOverrideWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserPermissionOverrideScalarFieldEnum | Prisma.UserPermissionOverrideScalarFieldEnum[];
};
export type UserPermissionOverrideCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPermissionOverrideCreateInput, Prisma.UserPermissionOverrideUncheckedCreateInput>;
};
export type UserPermissionOverrideCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserPermissionOverrideCreateManyInput | Prisma.UserPermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserPermissionOverrideCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.UserPermissionOverrideCreateManyInput | Prisma.UserPermissionOverrideCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.UserPermissionOverrideIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type UserPermissionOverrideUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPermissionOverrideUpdateInput, Prisma.UserPermissionOverrideUncheckedUpdateInput>;
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
};
export type UserPermissionOverrideUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserPermissionOverrideUpdateManyMutationInput, Prisma.UserPermissionOverrideUncheckedUpdateManyInput>;
    where?: Prisma.UserPermissionOverrideWhereInput;
    limit?: number;
};
export type UserPermissionOverrideUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserPermissionOverrideUpdateManyMutationInput, Prisma.UserPermissionOverrideUncheckedUpdateManyInput>;
    where?: Prisma.UserPermissionOverrideWhereInput;
    limit?: number;
    include?: Prisma.UserPermissionOverrideIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type UserPermissionOverrideUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserPermissionOverrideCreateInput, Prisma.UserPermissionOverrideUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserPermissionOverrideUpdateInput, Prisma.UserPermissionOverrideUncheckedUpdateInput>;
};
export type UserPermissionOverrideDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
    where: Prisma.UserPermissionOverrideWhereUniqueInput;
};
export type UserPermissionOverrideDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserPermissionOverrideWhereInput;
    limit?: number;
};
export type UserPermissionOverrideDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserPermissionOverrideSelect<ExtArgs> | null;
    omit?: Prisma.UserPermissionOverrideOmit<ExtArgs> | null;
    include?: Prisma.UserPermissionOverrideInclude<ExtArgs> | null;
};
//# sourceMappingURL=UserPermissionOverride.d.ts.map