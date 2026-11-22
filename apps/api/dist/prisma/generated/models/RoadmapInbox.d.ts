import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type RoadmapInboxModel = runtime.Types.Result.DefaultSelection<Prisma.$RoadmapInboxPayload>;
export type AggregateRoadmapInbox = {
    _count: RoadmapInboxCountAggregateOutputType | null;
    _avg: RoadmapInboxAvgAggregateOutputType | null;
    _sum: RoadmapInboxSumAggregateOutputType | null;
    _min: RoadmapInboxMinAggregateOutputType | null;
    _max: RoadmapInboxMaxAggregateOutputType | null;
};
export type RoadmapInboxAvgAggregateOutputType = {
    id: number | null;
    issueNumber: number | null;
};
export type RoadmapInboxSumAggregateOutputType = {
    id: number | null;
    issueNumber: number | null;
};
export type RoadmapInboxMinAggregateOutputType = {
    id: number | null;
    issueNumber: number | null;
    title: string | null;
    body: string | null;
    kind: string | null;
    url: string | null;
    status: string | null;
    issueCreatedAt: Date | null;
    fetchedAt: Date | null;
    handledAt: Date | null;
    handledBy: string | null;
    source: string | null;
};
export type RoadmapInboxMaxAggregateOutputType = {
    id: number | null;
    issueNumber: number | null;
    title: string | null;
    body: string | null;
    kind: string | null;
    url: string | null;
    status: string | null;
    issueCreatedAt: Date | null;
    fetchedAt: Date | null;
    handledAt: Date | null;
    handledBy: string | null;
    source: string | null;
};
export type RoadmapInboxCountAggregateOutputType = {
    id: number;
    issueNumber: number;
    title: number;
    body: number;
    kind: number;
    url: number;
    status: number;
    issueCreatedAt: number;
    fetchedAt: number;
    handledAt: number;
    handledBy: number;
    source: number;
    _all: number;
};
export type RoadmapInboxAvgAggregateInputType = {
    id?: true;
    issueNumber?: true;
};
export type RoadmapInboxSumAggregateInputType = {
    id?: true;
    issueNumber?: true;
};
export type RoadmapInboxMinAggregateInputType = {
    id?: true;
    issueNumber?: true;
    title?: true;
    body?: true;
    kind?: true;
    url?: true;
    status?: true;
    issueCreatedAt?: true;
    fetchedAt?: true;
    handledAt?: true;
    handledBy?: true;
    source?: true;
};
export type RoadmapInboxMaxAggregateInputType = {
    id?: true;
    issueNumber?: true;
    title?: true;
    body?: true;
    kind?: true;
    url?: true;
    status?: true;
    issueCreatedAt?: true;
    fetchedAt?: true;
    handledAt?: true;
    handledBy?: true;
    source?: true;
};
export type RoadmapInboxCountAggregateInputType = {
    id?: true;
    issueNumber?: true;
    title?: true;
    body?: true;
    kind?: true;
    url?: true;
    status?: true;
    issueCreatedAt?: true;
    fetchedAt?: true;
    handledAt?: true;
    handledBy?: true;
    source?: true;
    _all?: true;
};
export type RoadmapInboxAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapInboxWhereInput;
    orderBy?: Prisma.RoadmapInboxOrderByWithRelationInput | Prisma.RoadmapInboxOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapInboxWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RoadmapInboxCountAggregateInputType;
    _avg?: RoadmapInboxAvgAggregateInputType;
    _sum?: RoadmapInboxSumAggregateInputType;
    _min?: RoadmapInboxMinAggregateInputType;
    _max?: RoadmapInboxMaxAggregateInputType;
};
export type GetRoadmapInboxAggregateType<T extends RoadmapInboxAggregateArgs> = {
    [P in keyof T & keyof AggregateRoadmapInbox]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRoadmapInbox[P]> : Prisma.GetScalarType<T[P], AggregateRoadmapInbox[P]>;
};
export type RoadmapInboxGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapInboxWhereInput;
    orderBy?: Prisma.RoadmapInboxOrderByWithAggregationInput | Prisma.RoadmapInboxOrderByWithAggregationInput[];
    by: Prisma.RoadmapInboxScalarFieldEnum[] | Prisma.RoadmapInboxScalarFieldEnum;
    having?: Prisma.RoadmapInboxScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RoadmapInboxCountAggregateInputType | true;
    _avg?: RoadmapInboxAvgAggregateInputType;
    _sum?: RoadmapInboxSumAggregateInputType;
    _min?: RoadmapInboxMinAggregateInputType;
    _max?: RoadmapInboxMaxAggregateInputType;
};
export type RoadmapInboxGroupByOutputType = {
    id: number;
    issueNumber: number | null;
    title: string;
    body: string;
    kind: string | null;
    url: string;
    status: string;
    issueCreatedAt: Date;
    fetchedAt: Date;
    handledAt: Date | null;
    handledBy: string | null;
    source: string;
    _count: RoadmapInboxCountAggregateOutputType | null;
    _avg: RoadmapInboxAvgAggregateOutputType | null;
    _sum: RoadmapInboxSumAggregateOutputType | null;
    _min: RoadmapInboxMinAggregateOutputType | null;
    _max: RoadmapInboxMaxAggregateOutputType | null;
};
export type GetRoadmapInboxGroupByPayload<T extends RoadmapInboxGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RoadmapInboxGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RoadmapInboxGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RoadmapInboxGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RoadmapInboxGroupByOutputType[P]>;
}>>;
export type RoadmapInboxWhereInput = {
    AND?: Prisma.RoadmapInboxWhereInput | Prisma.RoadmapInboxWhereInput[];
    OR?: Prisma.RoadmapInboxWhereInput[];
    NOT?: Prisma.RoadmapInboxWhereInput | Prisma.RoadmapInboxWhereInput[];
    id?: Prisma.IntFilter<"RoadmapInbox"> | number;
    issueNumber?: Prisma.IntNullableFilter<"RoadmapInbox"> | number | null;
    title?: Prisma.StringFilter<"RoadmapInbox"> | string;
    body?: Prisma.StringFilter<"RoadmapInbox"> | string;
    kind?: Prisma.StringNullableFilter<"RoadmapInbox"> | string | null;
    url?: Prisma.StringFilter<"RoadmapInbox"> | string;
    status?: Prisma.StringFilter<"RoadmapInbox"> | string;
    issueCreatedAt?: Prisma.DateTimeFilter<"RoadmapInbox"> | Date | string;
    fetchedAt?: Prisma.DateTimeFilter<"RoadmapInbox"> | Date | string;
    handledAt?: Prisma.DateTimeNullableFilter<"RoadmapInbox"> | Date | string | null;
    handledBy?: Prisma.StringNullableFilter<"RoadmapInbox"> | string | null;
    source?: Prisma.StringFilter<"RoadmapInbox"> | string;
};
export type RoadmapInboxOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    kind?: Prisma.SortOrderInput | Prisma.SortOrder;
    url?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    issueCreatedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    handledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    handledBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
};
export type RoadmapInboxWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    issueNumber?: number;
    AND?: Prisma.RoadmapInboxWhereInput | Prisma.RoadmapInboxWhereInput[];
    OR?: Prisma.RoadmapInboxWhereInput[];
    NOT?: Prisma.RoadmapInboxWhereInput | Prisma.RoadmapInboxWhereInput[];
    title?: Prisma.StringFilter<"RoadmapInbox"> | string;
    body?: Prisma.StringFilter<"RoadmapInbox"> | string;
    kind?: Prisma.StringNullableFilter<"RoadmapInbox"> | string | null;
    url?: Prisma.StringFilter<"RoadmapInbox"> | string;
    status?: Prisma.StringFilter<"RoadmapInbox"> | string;
    issueCreatedAt?: Prisma.DateTimeFilter<"RoadmapInbox"> | Date | string;
    fetchedAt?: Prisma.DateTimeFilter<"RoadmapInbox"> | Date | string;
    handledAt?: Prisma.DateTimeNullableFilter<"RoadmapInbox"> | Date | string | null;
    handledBy?: Prisma.StringNullableFilter<"RoadmapInbox"> | string | null;
    source?: Prisma.StringFilter<"RoadmapInbox"> | string;
}, "id" | "issueNumber">;
export type RoadmapInboxOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrderInput | Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    kind?: Prisma.SortOrderInput | Prisma.SortOrder;
    url?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    issueCreatedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    handledAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    handledBy?: Prisma.SortOrderInput | Prisma.SortOrder;
    source?: Prisma.SortOrder;
    _count?: Prisma.RoadmapInboxCountOrderByAggregateInput;
    _avg?: Prisma.RoadmapInboxAvgOrderByAggregateInput;
    _max?: Prisma.RoadmapInboxMaxOrderByAggregateInput;
    _min?: Prisma.RoadmapInboxMinOrderByAggregateInput;
    _sum?: Prisma.RoadmapInboxSumOrderByAggregateInput;
};
export type RoadmapInboxScalarWhereWithAggregatesInput = {
    AND?: Prisma.RoadmapInboxScalarWhereWithAggregatesInput | Prisma.RoadmapInboxScalarWhereWithAggregatesInput[];
    OR?: Prisma.RoadmapInboxScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RoadmapInboxScalarWhereWithAggregatesInput | Prisma.RoadmapInboxScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RoadmapInbox"> | number;
    issueNumber?: Prisma.IntNullableWithAggregatesFilter<"RoadmapInbox"> | number | null;
    title?: Prisma.StringWithAggregatesFilter<"RoadmapInbox"> | string;
    body?: Prisma.StringWithAggregatesFilter<"RoadmapInbox"> | string;
    kind?: Prisma.StringNullableWithAggregatesFilter<"RoadmapInbox"> | string | null;
    url?: Prisma.StringWithAggregatesFilter<"RoadmapInbox"> | string;
    status?: Prisma.StringWithAggregatesFilter<"RoadmapInbox"> | string;
    issueCreatedAt?: Prisma.DateTimeWithAggregatesFilter<"RoadmapInbox"> | Date | string;
    fetchedAt?: Prisma.DateTimeWithAggregatesFilter<"RoadmapInbox"> | Date | string;
    handledAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RoadmapInbox"> | Date | string | null;
    handledBy?: Prisma.StringNullableWithAggregatesFilter<"RoadmapInbox"> | string | null;
    source?: Prisma.StringWithAggregatesFilter<"RoadmapInbox"> | string;
};
export type RoadmapInboxCreateInput = {
    issueNumber?: number | null;
    title: string;
    body?: string;
    kind?: string | null;
    url: string;
    status?: string;
    issueCreatedAt: Date | string;
    fetchedAt?: Date | string;
    handledAt?: Date | string | null;
    handledBy?: string | null;
    source?: string;
};
export type RoadmapInboxUncheckedCreateInput = {
    id?: number;
    issueNumber?: number | null;
    title: string;
    body?: string;
    kind?: string | null;
    url: string;
    status?: string;
    issueCreatedAt: Date | string;
    fetchedAt?: Date | string;
    handledAt?: Date | string | null;
    handledBy?: string | null;
    source?: string;
};
export type RoadmapInboxUpdateInput = {
    issueNumber?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    issueCreatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    handledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    handledBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapInboxUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    issueNumber?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    issueCreatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    handledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    handledBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapInboxCreateManyInput = {
    id?: number;
    issueNumber?: number | null;
    title: string;
    body?: string;
    kind?: string | null;
    url: string;
    status?: string;
    issueCreatedAt: Date | string;
    fetchedAt?: Date | string;
    handledAt?: Date | string | null;
    handledBy?: string | null;
    source?: string;
};
export type RoadmapInboxUpdateManyMutationInput = {
    issueNumber?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    issueCreatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    handledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    handledBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapInboxUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    issueNumber?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    body?: Prisma.StringFieldUpdateOperationsInput | string;
    kind?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    url?: Prisma.StringFieldUpdateOperationsInput | string;
    status?: Prisma.StringFieldUpdateOperationsInput | string;
    issueCreatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    fetchedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    handledAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    handledBy?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    source?: Prisma.StringFieldUpdateOperationsInput | string;
};
export type RoadmapInboxCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    issueCreatedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    handledAt?: Prisma.SortOrder;
    handledBy?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
};
export type RoadmapInboxAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrder;
};
export type RoadmapInboxMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    issueCreatedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    handledAt?: Prisma.SortOrder;
    handledBy?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
};
export type RoadmapInboxMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    body?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    url?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    issueCreatedAt?: Prisma.SortOrder;
    fetchedAt?: Prisma.SortOrder;
    handledAt?: Prisma.SortOrder;
    handledBy?: Prisma.SortOrder;
    source?: Prisma.SortOrder;
};
export type RoadmapInboxSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    issueNumber?: Prisma.SortOrder;
};
export type RoadmapInboxSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    issueNumber?: boolean;
    title?: boolean;
    body?: boolean;
    kind?: boolean;
    url?: boolean;
    status?: boolean;
    issueCreatedAt?: boolean;
    fetchedAt?: boolean;
    handledAt?: boolean;
    handledBy?: boolean;
    source?: boolean;
}, ExtArgs["result"]["roadmapInbox"]>;
export type RoadmapInboxSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    issueNumber?: boolean;
    title?: boolean;
    body?: boolean;
    kind?: boolean;
    url?: boolean;
    status?: boolean;
    issueCreatedAt?: boolean;
    fetchedAt?: boolean;
    handledAt?: boolean;
    handledBy?: boolean;
    source?: boolean;
}, ExtArgs["result"]["roadmapInbox"]>;
export type RoadmapInboxSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    issueNumber?: boolean;
    title?: boolean;
    body?: boolean;
    kind?: boolean;
    url?: boolean;
    status?: boolean;
    issueCreatedAt?: boolean;
    fetchedAt?: boolean;
    handledAt?: boolean;
    handledBy?: boolean;
    source?: boolean;
}, ExtArgs["result"]["roadmapInbox"]>;
export type RoadmapInboxSelectScalar = {
    id?: boolean;
    issueNumber?: boolean;
    title?: boolean;
    body?: boolean;
    kind?: boolean;
    url?: boolean;
    status?: boolean;
    issueCreatedAt?: boolean;
    fetchedAt?: boolean;
    handledAt?: boolean;
    handledBy?: boolean;
    source?: boolean;
};
export type RoadmapInboxOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "issueNumber" | "title" | "body" | "kind" | "url" | "status" | "issueCreatedAt" | "fetchedAt" | "handledAt" | "handledBy" | "source", ExtArgs["result"]["roadmapInbox"]>;
export type $RoadmapInboxPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RoadmapInbox";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        issueNumber: number | null;
        title: string;
        body: string;
        kind: string | null;
        url: string;
        status: string;
        issueCreatedAt: Date;
        fetchedAt: Date;
        handledAt: Date | null;
        handledBy: string | null;
        source: string;
    }, ExtArgs["result"]["roadmapInbox"]>;
    composites: {};
};
export type RoadmapInboxGetPayload<S extends boolean | null | undefined | RoadmapInboxDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload, S>;
export type RoadmapInboxCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RoadmapInboxFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RoadmapInboxCountAggregateInputType | true;
};
export interface RoadmapInboxDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RoadmapInbox'];
        meta: {
            name: 'RoadmapInbox';
        };
    };
    findUnique<T extends RoadmapInboxFindUniqueArgs>(args: Prisma.SelectSubset<T, RoadmapInboxFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RoadmapInboxFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RoadmapInboxFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RoadmapInboxFindFirstArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxFindFirstArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RoadmapInboxFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RoadmapInboxFindManyArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RoadmapInboxCreateArgs>(args: Prisma.SelectSubset<T, RoadmapInboxCreateArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RoadmapInboxCreateManyArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RoadmapInboxCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RoadmapInboxDeleteArgs>(args: Prisma.SelectSubset<T, RoadmapInboxDeleteArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RoadmapInboxUpdateArgs>(args: Prisma.SelectSubset<T, RoadmapInboxUpdateArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RoadmapInboxDeleteManyArgs>(args?: Prisma.SelectSubset<T, RoadmapInboxDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RoadmapInboxUpdateManyArgs>(args: Prisma.SelectSubset<T, RoadmapInboxUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RoadmapInboxUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RoadmapInboxUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RoadmapInboxUpsertArgs>(args: Prisma.SelectSubset<T, RoadmapInboxUpsertArgs<ExtArgs>>): Prisma.Prisma__RoadmapInboxClient<runtime.Types.Result.GetResult<Prisma.$RoadmapInboxPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RoadmapInboxCountArgs>(args?: Prisma.Subset<T, RoadmapInboxCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RoadmapInboxCountAggregateOutputType> : number>;
    aggregate<T extends RoadmapInboxAggregateArgs>(args: Prisma.Subset<T, RoadmapInboxAggregateArgs>): Prisma.PrismaPromise<GetRoadmapInboxAggregateType<T>>;
    groupBy<T extends RoadmapInboxGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RoadmapInboxGroupByArgs['orderBy'];
    } : {
        orderBy?: RoadmapInboxGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RoadmapInboxGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRoadmapInboxGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RoadmapInboxFieldRefs;
}
export interface Prisma__RoadmapInboxClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RoadmapInboxFieldRefs {
    readonly id: Prisma.FieldRef<"RoadmapInbox", 'Int'>;
    readonly issueNumber: Prisma.FieldRef<"RoadmapInbox", 'Int'>;
    readonly title: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly body: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly kind: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly url: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly status: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly issueCreatedAt: Prisma.FieldRef<"RoadmapInbox", 'DateTime'>;
    readonly fetchedAt: Prisma.FieldRef<"RoadmapInbox", 'DateTime'>;
    readonly handledAt: Prisma.FieldRef<"RoadmapInbox", 'DateTime'>;
    readonly handledBy: Prisma.FieldRef<"RoadmapInbox", 'String'>;
    readonly source: Prisma.FieldRef<"RoadmapInbox", 'String'>;
}
export type RoadmapInboxFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where: Prisma.RoadmapInboxWhereUniqueInput;
};
export type RoadmapInboxFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where: Prisma.RoadmapInboxWhereUniqueInput;
};
export type RoadmapInboxFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where?: Prisma.RoadmapInboxWhereInput;
    orderBy?: Prisma.RoadmapInboxOrderByWithRelationInput | Prisma.RoadmapInboxOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapInboxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapInboxScalarFieldEnum | Prisma.RoadmapInboxScalarFieldEnum[];
};
export type RoadmapInboxFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where?: Prisma.RoadmapInboxWhereInput;
    orderBy?: Prisma.RoadmapInboxOrderByWithRelationInput | Prisma.RoadmapInboxOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapInboxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapInboxScalarFieldEnum | Prisma.RoadmapInboxScalarFieldEnum[];
};
export type RoadmapInboxFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where?: Prisma.RoadmapInboxWhereInput;
    orderBy?: Prisma.RoadmapInboxOrderByWithRelationInput | Prisma.RoadmapInboxOrderByWithRelationInput[];
    cursor?: Prisma.RoadmapInboxWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RoadmapInboxScalarFieldEnum | Prisma.RoadmapInboxScalarFieldEnum[];
};
export type RoadmapInboxCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapInboxCreateInput, Prisma.RoadmapInboxUncheckedCreateInput>;
};
export type RoadmapInboxCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RoadmapInboxCreateManyInput | Prisma.RoadmapInboxCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapInboxCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    data: Prisma.RoadmapInboxCreateManyInput | Prisma.RoadmapInboxCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RoadmapInboxUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapInboxUpdateInput, Prisma.RoadmapInboxUncheckedUpdateInput>;
    where: Prisma.RoadmapInboxWhereUniqueInput;
};
export type RoadmapInboxUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RoadmapInboxUpdateManyMutationInput, Prisma.RoadmapInboxUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapInboxWhereInput;
    limit?: number;
};
export type RoadmapInboxUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RoadmapInboxUpdateManyMutationInput, Prisma.RoadmapInboxUncheckedUpdateManyInput>;
    where?: Prisma.RoadmapInboxWhereInput;
    limit?: number;
};
export type RoadmapInboxUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where: Prisma.RoadmapInboxWhereUniqueInput;
    create: Prisma.XOR<Prisma.RoadmapInboxCreateInput, Prisma.RoadmapInboxUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RoadmapInboxUpdateInput, Prisma.RoadmapInboxUncheckedUpdateInput>;
};
export type RoadmapInboxDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
    where: Prisma.RoadmapInboxWhereUniqueInput;
};
export type RoadmapInboxDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RoadmapInboxWhereInput;
    limit?: number;
};
export type RoadmapInboxDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RoadmapInboxSelect<ExtArgs> | null;
    omit?: Prisma.RoadmapInboxOmit<ExtArgs> | null;
};
//# sourceMappingURL=RoadmapInbox.d.ts.map