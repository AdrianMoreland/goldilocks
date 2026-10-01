import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type KbDocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$KbDocumentPayload>;
export type AggregateKbDocument = {
    _count: KbDocumentCountAggregateOutputType | null;
    _avg: KbDocumentAvgAggregateOutputType | null;
    _sum: KbDocumentSumAggregateOutputType | null;
    _min: KbDocumentMinAggregateOutputType | null;
    _max: KbDocumentMaxAggregateOutputType | null;
};
export type KbDocumentAvgAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type KbDocumentSumAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type KbDocumentMinAggregateOutputType = {
    id: number | null;
    slug: string | null;
    title: string | null;
    category: $Enums.KbCategory | null;
    jurisdiction: $Enums.KbJurisdiction | null;
    owner: string | null;
    status: $Enums.KbStatus | null;
    version: number | null;
    contentUpdatedOn: Date | null;
    markdown: string | null;
    contentHash: string | null;
    editedInApp: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type KbDocumentMaxAggregateOutputType = {
    id: number | null;
    slug: string | null;
    title: string | null;
    category: $Enums.KbCategory | null;
    jurisdiction: $Enums.KbJurisdiction | null;
    owner: string | null;
    status: $Enums.KbStatus | null;
    version: number | null;
    contentUpdatedOn: Date | null;
    markdown: string | null;
    contentHash: string | null;
    editedInApp: boolean | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type KbDocumentCountAggregateOutputType = {
    id: number;
    slug: number;
    title: number;
    category: number;
    jurisdiction: number;
    owner: number;
    status: number;
    version: number;
    contentUpdatedOn: number;
    markdown: number;
    contentHash: number;
    editedInApp: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type KbDocumentAvgAggregateInputType = {
    id?: true;
    version?: true;
};
export type KbDocumentSumAggregateInputType = {
    id?: true;
    version?: true;
};
export type KbDocumentMinAggregateInputType = {
    id?: true;
    slug?: true;
    title?: true;
    category?: true;
    jurisdiction?: true;
    owner?: true;
    status?: true;
    version?: true;
    contentUpdatedOn?: true;
    markdown?: true;
    contentHash?: true;
    editedInApp?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type KbDocumentMaxAggregateInputType = {
    id?: true;
    slug?: true;
    title?: true;
    category?: true;
    jurisdiction?: true;
    owner?: true;
    status?: true;
    version?: true;
    contentUpdatedOn?: true;
    markdown?: true;
    contentHash?: true;
    editedInApp?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type KbDocumentCountAggregateInputType = {
    id?: true;
    slug?: true;
    title?: true;
    category?: true;
    jurisdiction?: true;
    owner?: true;
    status?: true;
    version?: true;
    contentUpdatedOn?: true;
    markdown?: true;
    contentHash?: true;
    editedInApp?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type KbDocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KbDocumentWhereInput;
    orderBy?: Prisma.KbDocumentOrderByWithRelationInput | Prisma.KbDocumentOrderByWithRelationInput[];
    cursor?: Prisma.KbDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | KbDocumentCountAggregateInputType;
    _avg?: KbDocumentAvgAggregateInputType;
    _sum?: KbDocumentSumAggregateInputType;
    _min?: KbDocumentMinAggregateInputType;
    _max?: KbDocumentMaxAggregateInputType;
};
export type GetKbDocumentAggregateType<T extends KbDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateKbDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateKbDocument[P]> : Prisma.GetScalarType<T[P], AggregateKbDocument[P]>;
};
export type KbDocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KbDocumentWhereInput;
    orderBy?: Prisma.KbDocumentOrderByWithAggregationInput | Prisma.KbDocumentOrderByWithAggregationInput[];
    by: Prisma.KbDocumentScalarFieldEnum[] | Prisma.KbDocumentScalarFieldEnum;
    having?: Prisma.KbDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: KbDocumentCountAggregateInputType | true;
    _avg?: KbDocumentAvgAggregateInputType;
    _sum?: KbDocumentSumAggregateInputType;
    _min?: KbDocumentMinAggregateInputType;
    _max?: KbDocumentMaxAggregateInputType;
};
export type KbDocumentGroupByOutputType = {
    id: number;
    slug: string;
    title: string;
    category: $Enums.KbCategory;
    jurisdiction: $Enums.KbJurisdiction;
    owner: string;
    status: $Enums.KbStatus;
    version: number;
    contentUpdatedOn: Date;
    markdown: string;
    contentHash: string;
    editedInApp: boolean;
    createdAt: Date;
    updatedAt: Date;
    _count: KbDocumentCountAggregateOutputType | null;
    _avg: KbDocumentAvgAggregateOutputType | null;
    _sum: KbDocumentSumAggregateOutputType | null;
    _min: KbDocumentMinAggregateOutputType | null;
    _max: KbDocumentMaxAggregateOutputType | null;
};
export type GetKbDocumentGroupByPayload<T extends KbDocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<KbDocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof KbDocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], KbDocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], KbDocumentGroupByOutputType[P]>;
}>>;
export type KbDocumentWhereInput = {
    AND?: Prisma.KbDocumentWhereInput | Prisma.KbDocumentWhereInput[];
    OR?: Prisma.KbDocumentWhereInput[];
    NOT?: Prisma.KbDocumentWhereInput | Prisma.KbDocumentWhereInput[];
    id?: Prisma.IntFilter<"KbDocument"> | number;
    slug?: Prisma.StringFilter<"KbDocument"> | string;
    title?: Prisma.StringFilter<"KbDocument"> | string;
    category?: Prisma.EnumKbCategoryFilter<"KbDocument"> | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFilter<"KbDocument"> | $Enums.KbJurisdiction;
    owner?: Prisma.StringFilter<"KbDocument"> | string;
    status?: Prisma.EnumKbStatusFilter<"KbDocument"> | $Enums.KbStatus;
    version?: Prisma.IntFilter<"KbDocument"> | number;
    contentUpdatedOn?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
    markdown?: Prisma.StringFilter<"KbDocument"> | string;
    contentHash?: Prisma.StringFilter<"KbDocument"> | string;
    editedInApp?: Prisma.BoolFilter<"KbDocument"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
};
export type KbDocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    jurisdiction?: Prisma.SortOrder;
    owner?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    contentUpdatedOn?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    contentHash?: Prisma.SortOrder;
    editedInApp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KbDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    slug?: string;
    AND?: Prisma.KbDocumentWhereInput | Prisma.KbDocumentWhereInput[];
    OR?: Prisma.KbDocumentWhereInput[];
    NOT?: Prisma.KbDocumentWhereInput | Prisma.KbDocumentWhereInput[];
    title?: Prisma.StringFilter<"KbDocument"> | string;
    category?: Prisma.EnumKbCategoryFilter<"KbDocument"> | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFilter<"KbDocument"> | $Enums.KbJurisdiction;
    owner?: Prisma.StringFilter<"KbDocument"> | string;
    status?: Prisma.EnumKbStatusFilter<"KbDocument"> | $Enums.KbStatus;
    version?: Prisma.IntFilter<"KbDocument"> | number;
    contentUpdatedOn?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
    markdown?: Prisma.StringFilter<"KbDocument"> | string;
    contentHash?: Prisma.StringFilter<"KbDocument"> | string;
    editedInApp?: Prisma.BoolFilter<"KbDocument"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"KbDocument"> | Date | string;
}, "id" | "slug">;
export type KbDocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    jurisdiction?: Prisma.SortOrder;
    owner?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    contentUpdatedOn?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    contentHash?: Prisma.SortOrder;
    editedInApp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.KbDocumentCountOrderByAggregateInput;
    _avg?: Prisma.KbDocumentAvgOrderByAggregateInput;
    _max?: Prisma.KbDocumentMaxOrderByAggregateInput;
    _min?: Prisma.KbDocumentMinOrderByAggregateInput;
    _sum?: Prisma.KbDocumentSumOrderByAggregateInput;
};
export type KbDocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.KbDocumentScalarWhereWithAggregatesInput | Prisma.KbDocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.KbDocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.KbDocumentScalarWhereWithAggregatesInput | Prisma.KbDocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"KbDocument"> | number;
    slug?: Prisma.StringWithAggregatesFilter<"KbDocument"> | string;
    title?: Prisma.StringWithAggregatesFilter<"KbDocument"> | string;
    category?: Prisma.EnumKbCategoryWithAggregatesFilter<"KbDocument"> | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionWithAggregatesFilter<"KbDocument"> | $Enums.KbJurisdiction;
    owner?: Prisma.StringWithAggregatesFilter<"KbDocument"> | string;
    status?: Prisma.EnumKbStatusWithAggregatesFilter<"KbDocument"> | $Enums.KbStatus;
    version?: Prisma.IntWithAggregatesFilter<"KbDocument"> | number;
    contentUpdatedOn?: Prisma.DateTimeWithAggregatesFilter<"KbDocument"> | Date | string;
    markdown?: Prisma.StringWithAggregatesFilter<"KbDocument"> | string;
    contentHash?: Prisma.StringWithAggregatesFilter<"KbDocument"> | string;
    editedInApp?: Prisma.BoolWithAggregatesFilter<"KbDocument"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"KbDocument"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"KbDocument"> | Date | string;
};
export type KbDocumentCreateInput = {
    slug: string;
    title: string;
    category: $Enums.KbCategory;
    jurisdiction: $Enums.KbJurisdiction;
    owner: string;
    status?: $Enums.KbStatus;
    version?: number;
    contentUpdatedOn: Date | string;
    markdown: string;
    contentHash: string;
    editedInApp?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KbDocumentUncheckedCreateInput = {
    id?: number;
    slug: string;
    title: string;
    category: $Enums.KbCategory;
    jurisdiction: $Enums.KbJurisdiction;
    owner: string;
    status?: $Enums.KbStatus;
    version?: number;
    contentUpdatedOn: Date | string;
    markdown: string;
    contentHash: string;
    editedInApp?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KbDocumentUpdateInput = {
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumKbCategoryFieldUpdateOperationsInput | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFieldUpdateOperationsInput | $Enums.KbJurisdiction;
    owner?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumKbStatusFieldUpdateOperationsInput | $Enums.KbStatus;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    contentUpdatedOn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    contentHash?: Prisma.StringFieldUpdateOperationsInput | string;
    editedInApp?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KbDocumentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumKbCategoryFieldUpdateOperationsInput | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFieldUpdateOperationsInput | $Enums.KbJurisdiction;
    owner?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumKbStatusFieldUpdateOperationsInput | $Enums.KbStatus;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    contentUpdatedOn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    contentHash?: Prisma.StringFieldUpdateOperationsInput | string;
    editedInApp?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KbDocumentCreateManyInput = {
    id?: number;
    slug: string;
    title: string;
    category: $Enums.KbCategory;
    jurisdiction: $Enums.KbJurisdiction;
    owner: string;
    status?: $Enums.KbStatus;
    version?: number;
    contentUpdatedOn: Date | string;
    markdown: string;
    contentHash: string;
    editedInApp?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type KbDocumentUpdateManyMutationInput = {
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumKbCategoryFieldUpdateOperationsInput | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFieldUpdateOperationsInput | $Enums.KbJurisdiction;
    owner?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumKbStatusFieldUpdateOperationsInput | $Enums.KbStatus;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    contentUpdatedOn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    contentHash?: Prisma.StringFieldUpdateOperationsInput | string;
    editedInApp?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KbDocumentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    slug?: Prisma.StringFieldUpdateOperationsInput | string;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    category?: Prisma.EnumKbCategoryFieldUpdateOperationsInput | $Enums.KbCategory;
    jurisdiction?: Prisma.EnumKbJurisdictionFieldUpdateOperationsInput | $Enums.KbJurisdiction;
    owner?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.EnumKbStatusFieldUpdateOperationsInput | $Enums.KbStatus;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    contentUpdatedOn?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    markdown?: Prisma.StringFieldUpdateOperationsInput | string;
    contentHash?: Prisma.StringFieldUpdateOperationsInput | string;
    editedInApp?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type KbDocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    jurisdiction?: Prisma.SortOrder;
    owner?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    contentUpdatedOn?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    contentHash?: Prisma.SortOrder;
    editedInApp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KbDocumentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type KbDocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    jurisdiction?: Prisma.SortOrder;
    owner?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    contentUpdatedOn?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    contentHash?: Prisma.SortOrder;
    editedInApp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KbDocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    slug?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    category?: Prisma.SortOrder;
    jurisdiction?: Prisma.SortOrder;
    owner?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    contentUpdatedOn?: Prisma.SortOrder;
    markdown?: Prisma.SortOrder;
    contentHash?: Prisma.SortOrder;
    editedInApp?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type KbDocumentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type EnumKbCategoryFieldUpdateOperationsInput = {
    set?: $Enums.KbCategory;
};
export type EnumKbJurisdictionFieldUpdateOperationsInput = {
    set?: $Enums.KbJurisdiction;
};
export type EnumKbStatusFieldUpdateOperationsInput = {
    set?: $Enums.KbStatus;
};
export type KbDocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    title?: boolean;
    category?: boolean;
    jurisdiction?: boolean;
    owner?: boolean;
    status?: boolean;
    version?: boolean;
    contentUpdatedOn?: boolean;
    markdown?: boolean;
    contentHash?: boolean;
    editedInApp?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["kbDocument"]>;
export type KbDocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    title?: boolean;
    category?: boolean;
    jurisdiction?: boolean;
    owner?: boolean;
    status?: boolean;
    version?: boolean;
    contentUpdatedOn?: boolean;
    markdown?: boolean;
    contentHash?: boolean;
    editedInApp?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["kbDocument"]>;
export type KbDocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    slug?: boolean;
    title?: boolean;
    category?: boolean;
    jurisdiction?: boolean;
    owner?: boolean;
    status?: boolean;
    version?: boolean;
    contentUpdatedOn?: boolean;
    markdown?: boolean;
    contentHash?: boolean;
    editedInApp?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["kbDocument"]>;
export type KbDocumentSelectScalar = {
    id?: boolean;
    slug?: boolean;
    title?: boolean;
    category?: boolean;
    jurisdiction?: boolean;
    owner?: boolean;
    status?: boolean;
    version?: boolean;
    contentUpdatedOn?: boolean;
    markdown?: boolean;
    contentHash?: boolean;
    editedInApp?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type KbDocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "slug" | "title" | "category" | "jurisdiction" | "owner" | "status" | "version" | "contentUpdatedOn" | "markdown" | "contentHash" | "editedInApp" | "createdAt" | "updatedAt", ExtArgs["result"]["kbDocument"]>;
export type $KbDocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "KbDocument";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        slug: string;
        title: string;
        category: $Enums.KbCategory;
        jurisdiction: $Enums.KbJurisdiction;
        owner: string;
        status: $Enums.KbStatus;
        version: number;
        contentUpdatedOn: Date;
        markdown: string;
        contentHash: string;
        editedInApp: boolean;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["kbDocument"]>;
    composites: {};
};
export type KbDocumentGetPayload<S extends boolean | null | undefined | KbDocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload, S>;
export type KbDocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<KbDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: KbDocumentCountAggregateInputType | true;
};
export interface KbDocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['KbDocument'];
        meta: {
            name: 'KbDocument';
        };
    };
    findUnique<T extends KbDocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, KbDocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends KbDocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, KbDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends KbDocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, KbDocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends KbDocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, KbDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends KbDocumentFindManyArgs>(args?: Prisma.SelectSubset<T, KbDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends KbDocumentCreateArgs>(args: Prisma.SelectSubset<T, KbDocumentCreateArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends KbDocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, KbDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends KbDocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, KbDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends KbDocumentDeleteArgs>(args: Prisma.SelectSubset<T, KbDocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends KbDocumentUpdateArgs>(args: Prisma.SelectSubset<T, KbDocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends KbDocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, KbDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends KbDocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, KbDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends KbDocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, KbDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends KbDocumentUpsertArgs>(args: Prisma.SelectSubset<T, KbDocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__KbDocumentClient<runtime.Types.Result.GetResult<Prisma.$KbDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends KbDocumentCountArgs>(args?: Prisma.Subset<T, KbDocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], KbDocumentCountAggregateOutputType> : number>;
    aggregate<T extends KbDocumentAggregateArgs>(args: Prisma.Subset<T, KbDocumentAggregateArgs>): Prisma.PrismaPromise<GetKbDocumentAggregateType<T>>;
    groupBy<T extends KbDocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: KbDocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: KbDocumentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, KbDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetKbDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: KbDocumentFieldRefs;
}
export interface Prisma__KbDocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface KbDocumentFieldRefs {
    readonly id: Prisma.FieldRef<"KbDocument", 'Int'>;
    readonly slug: Prisma.FieldRef<"KbDocument", 'String'>;
    readonly title: Prisma.FieldRef<"KbDocument", 'String'>;
    readonly category: Prisma.FieldRef<"KbDocument", 'KbCategory'>;
    readonly jurisdiction: Prisma.FieldRef<"KbDocument", 'KbJurisdiction'>;
    readonly owner: Prisma.FieldRef<"KbDocument", 'String'>;
    readonly status: Prisma.FieldRef<"KbDocument", 'KbStatus'>;
    readonly version: Prisma.FieldRef<"KbDocument", 'Int'>;
    readonly contentUpdatedOn: Prisma.FieldRef<"KbDocument", 'DateTime'>;
    readonly markdown: Prisma.FieldRef<"KbDocument", 'String'>;
    readonly contentHash: Prisma.FieldRef<"KbDocument", 'String'>;
    readonly editedInApp: Prisma.FieldRef<"KbDocument", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"KbDocument", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"KbDocument", 'DateTime'>;
}
export type KbDocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where: Prisma.KbDocumentWhereUniqueInput;
};
export type KbDocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where: Prisma.KbDocumentWhereUniqueInput;
};
export type KbDocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where?: Prisma.KbDocumentWhereInput;
    orderBy?: Prisma.KbDocumentOrderByWithRelationInput | Prisma.KbDocumentOrderByWithRelationInput[];
    cursor?: Prisma.KbDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KbDocumentScalarFieldEnum | Prisma.KbDocumentScalarFieldEnum[];
};
export type KbDocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where?: Prisma.KbDocumentWhereInput;
    orderBy?: Prisma.KbDocumentOrderByWithRelationInput | Prisma.KbDocumentOrderByWithRelationInput[];
    cursor?: Prisma.KbDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KbDocumentScalarFieldEnum | Prisma.KbDocumentScalarFieldEnum[];
};
export type KbDocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where?: Prisma.KbDocumentWhereInput;
    orderBy?: Prisma.KbDocumentOrderByWithRelationInput | Prisma.KbDocumentOrderByWithRelationInput[];
    cursor?: Prisma.KbDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.KbDocumentScalarFieldEnum | Prisma.KbDocumentScalarFieldEnum[];
};
export type KbDocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KbDocumentCreateInput, Prisma.KbDocumentUncheckedCreateInput>;
};
export type KbDocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.KbDocumentCreateManyInput | Prisma.KbDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KbDocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    data: Prisma.KbDocumentCreateManyInput | Prisma.KbDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type KbDocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KbDocumentUpdateInput, Prisma.KbDocumentUncheckedUpdateInput>;
    where: Prisma.KbDocumentWhereUniqueInput;
};
export type KbDocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.KbDocumentUpdateManyMutationInput, Prisma.KbDocumentUncheckedUpdateManyInput>;
    where?: Prisma.KbDocumentWhereInput;
    limit?: number;
};
export type KbDocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.KbDocumentUpdateManyMutationInput, Prisma.KbDocumentUncheckedUpdateManyInput>;
    where?: Prisma.KbDocumentWhereInput;
    limit?: number;
};
export type KbDocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where: Prisma.KbDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.KbDocumentCreateInput, Prisma.KbDocumentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.KbDocumentUpdateInput, Prisma.KbDocumentUncheckedUpdateInput>;
};
export type KbDocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
    where: Prisma.KbDocumentWhereUniqueInput;
};
export type KbDocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.KbDocumentWhereInput;
    limit?: number;
};
export type KbDocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.KbDocumentSelect<ExtArgs> | null;
    omit?: Prisma.KbDocumentOmit<ExtArgs> | null;
};
//# sourceMappingURL=KbDocument.d.ts.map