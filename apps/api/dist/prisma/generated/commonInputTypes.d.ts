import type * as runtime from "@prisma/client/runtime/client";
import * as $Enums from "./enums";
import type * as Prisma from "./internal/prismaNamespace";
export type StringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type EnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
};
export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type JsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type SortOrderInput = {
    sort: Prisma.SortOrder;
    nulls?: Prisma.NullsOrder;
};
export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type EnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
};
export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonNullableFilter<$PrismaModel>;
};
export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type IntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type EnumMetalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel> | $Enums.MetalType;
};
export type DecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type EnumProductCategoryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductCategory | Prisma.EnumProductCategoryFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel> | $Enums.ProductCategory | null;
};
export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type EnumMetalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel> | $Enums.MetalType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel>;
};
export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type EnumProductCategoryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductCategory | Prisma.EnumProductCategoryFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumProductCategoryNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProductCategory | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel>;
};
export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    mode?: Prisma.QueryMode;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type EnumBranchRegionFilter<$PrismaModel = never> = {
    equals?: $Enums.BranchRegion | Prisma.EnumBranchRegionFieldRefInput<$PrismaModel>;
    in?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel> | $Enums.BranchRegion;
};
export type EnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
};
export type EnumBranchRegionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BranchRegion | Prisma.EnumBranchRegionFieldRefInput<$PrismaModel>;
    in?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBranchRegionWithAggregatesFilter<$PrismaModel> | $Enums.BranchRegion;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel>;
};
export type EnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCurrencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCurrencyFilter<$PrismaModel>;
};
export type EnumFetchTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchTrigger | Prisma.EnumFetchTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel> | $Enums.FetchTrigger;
};
export type EnumFetchTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchTrigger | Prisma.EnumFetchTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFetchTriggerWithAggregatesFilter<$PrismaModel> | $Enums.FetchTrigger;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel>;
};
export type EnumKbCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.KbCategory | Prisma.EnumKbCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel> | $Enums.KbCategory;
};
export type EnumKbJurisdictionFilter<$PrismaModel = never> = {
    equals?: $Enums.KbJurisdiction | Prisma.EnumKbJurisdictionFieldRefInput<$PrismaModel>;
    in?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel> | $Enums.KbJurisdiction;
};
export type EnumKbStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KbStatus | Prisma.EnumKbStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbStatusFilter<$PrismaModel> | $Enums.KbStatus;
};
export type EnumKbVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.KbVisibility | Prisma.EnumKbVisibilityFieldRefInput<$PrismaModel>;
    in?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel> | $Enums.KbVisibility;
};
export type EnumKbCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbCategory | Prisma.EnumKbCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbCategoryWithAggregatesFilter<$PrismaModel> | $Enums.KbCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel>;
};
export type EnumKbJurisdictionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbJurisdiction | Prisma.EnumKbJurisdictionFieldRefInput<$PrismaModel>;
    in?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbJurisdictionWithAggregatesFilter<$PrismaModel> | $Enums.KbJurisdiction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel>;
};
export type EnumKbStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbStatus | Prisma.EnumKbStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbStatusWithAggregatesFilter<$PrismaModel> | $Enums.KbStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbStatusFilter<$PrismaModel>;
};
export type EnumKbVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbVisibility | Prisma.EnumKbVisibilityFieldRefInput<$PrismaModel>;
    in?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.KbVisibility;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel>;
};
export type JsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>, Required<JsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>;
export type JsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type JsonWithAggregatesFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>, Required<JsonWithAggregatesFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>;
export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedJsonFilter<$PrismaModel>;
    _max?: Prisma.NestedJsonFilter<$PrismaModel>;
};
export type EnumStocktakeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StocktakeStatus | Prisma.EnumStocktakeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel> | $Enums.StocktakeStatus;
};
export type EnumStocktakeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StocktakeStatus | Prisma.EnumStocktakeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStocktakeStatusWithAggregatesFilter<$PrismaModel> | $Enums.StocktakeStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel>;
};
export type EnumSerialsCheckedNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SerialsChecked | Prisma.EnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel> | $Enums.SerialsChecked | null;
};
export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type EnumSerialsCheckedNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SerialsChecked | Prisma.EnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSerialsCheckedNullableWithAggregatesFilter<$PrismaModel> | $Enums.SerialsChecked | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel>;
};
export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type EnumDiscrepancyIssueTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscrepancyIssueType | Prisma.EnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel> | $Enums.DiscrepancyIssueType;
};
export type EnumDiscrepancyIssueTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscrepancyIssueType | Prisma.EnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDiscrepancyIssueTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscrepancyIssueType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel>;
};
export type EnumStockMetalFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMetalFilter<$PrismaModel> | $Enums.StockMetal;
};
export type EnumBarStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BarStatus | Prisma.EnumBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBarStatusFilter<$PrismaModel> | $Enums.BarStatus;
};
export type EnumStockMetalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMetalWithAggregatesFilter<$PrismaModel> | $Enums.StockMetal;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMetalFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMetalFilter<$PrismaModel>;
};
export type EnumBarStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BarStatus | Prisma.EnumBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBarStatusWithAggregatesFilter<$PrismaModel> | $Enums.BarStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBarStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBarStatusFilter<$PrismaModel>;
};
export type EnumStockMetalNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel> | $Enums.StockMetal | null;
};
export type EnumCustomerOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerOrderStatus | Prisma.EnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel> | $Enums.CustomerOrderStatus;
};
export type EnumStockMetalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStockMetalNullableWithAggregatesFilter<$PrismaModel> | $Enums.StockMetal | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel>;
};
export type EnumCustomerOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerOrderStatus | Prisma.EnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.CustomerOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel>;
};
export type EnumEvidenceKindFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceKind | Prisma.EnumEvidenceKindFieldRefInput<$PrismaModel>;
    in?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel> | $Enums.EvidenceKind;
};
export type EnumEvidenceKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceKind | Prisma.EnumEvidenceKindFieldRefInput<$PrismaModel>;
    in?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvidenceKindWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel>;
};
export type EnumCptyKindFilter<$PrismaModel = never> = {
    equals?: $Enums.CptyKind | Prisma.EnumCptyKindFieldRefInput<$PrismaModel>;
    in?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCptyKindFilter<$PrismaModel> | $Enums.CptyKind;
};
export type EnumTradeStateFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeState | Prisma.EnumTradeStateFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTradeStateFilter<$PrismaModel> | $Enums.TradeState;
};
export type EnumCollectedSourceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedSource | Prisma.EnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel> | $Enums.CollectedSource | null;
};
export type EnumOrderSystemNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderSystem | Prisma.EnumOrderSystemFieldRefInput<$PrismaModel> | null;
    in?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel> | $Enums.OrderSystem | null;
};
export type EnumCptyKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CptyKind | Prisma.EnumCptyKindFieldRefInput<$PrismaModel>;
    in?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCptyKindWithAggregatesFilter<$PrismaModel> | $Enums.CptyKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCptyKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCptyKindFilter<$PrismaModel>;
};
export type EnumTradeStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeState | Prisma.EnumTradeStateFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTradeStateWithAggregatesFilter<$PrismaModel> | $Enums.TradeState;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTradeStateFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTradeStateFilter<$PrismaModel>;
};
export type EnumCollectedSourceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedSource | Prisma.EnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedSourceNullableWithAggregatesFilter<$PrismaModel> | $Enums.CollectedSource | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel>;
};
export type EnumOrderSystemNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderSystem | Prisma.EnumOrderSystemFieldRefInput<$PrismaModel> | null;
    in?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumOrderSystemNullableWithAggregatesFilter<$PrismaModel> | $Enums.OrderSystem | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel>;
};
export type EnumMetalTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel> | $Enums.MetalType | null;
};
export type EnumAliasDeciderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AliasDecider | Prisma.EnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    in?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel> | $Enums.AliasDecider | null;
};
export type EnumMatchConfidenceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchConfidence | Prisma.EnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel> | $Enums.MatchConfidence | null;
};
export type EnumMetalTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.MetalType | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel>;
};
export type EnumAliasDeciderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AliasDecider | Prisma.EnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    in?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumAliasDeciderNullableWithAggregatesFilter<$PrismaModel> | $Enums.AliasDecider | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel>;
};
export type EnumMatchConfidenceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchConfidence | Prisma.EnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMatchConfidenceNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchConfidence | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel>;
};
export type EnumProductRuleKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductRuleKind | Prisma.EnumProductRuleKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel> | $Enums.ProductRuleKind;
};
export type EnumProductRuleKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductRuleKind | Prisma.EnumProductRuleKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProductRuleKindWithAggregatesFilter<$PrismaModel> | $Enums.ProductRuleKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel>;
};
export type EnumOrderStepFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStep | Prisma.EnumOrderStepFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOrderStepFilter<$PrismaModel> | $Enums.OrderStep;
};
export type EnumOrderStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStep | Prisma.EnumOrderStepFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOrderStepWithAggregatesFilter<$PrismaModel> | $Enums.OrderStep;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOrderStepFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOrderStepFilter<$PrismaModel>;
};
export type EnumTaskCheckFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCheck | Prisma.EnumTaskCheckFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel> | $Enums.TaskCheck;
};
export type EnumSheetTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetTaskStatus | Prisma.EnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel> | $Enums.SheetTaskStatus;
};
export type EnumTaskClosedViaNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskClosedVia | Prisma.EnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    in?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel> | $Enums.TaskClosedVia | null;
};
export type EnumTaskCheckWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCheck | Prisma.EnumTaskCheckFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskCheckWithAggregatesFilter<$PrismaModel> | $Enums.TaskCheck;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel>;
};
export type EnumSheetTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetTaskStatus | Prisma.EnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.SheetTaskStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel>;
};
export type EnumTaskClosedViaNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskClosedVia | Prisma.EnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    in?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumTaskClosedViaNullableWithAggregatesFilter<$PrismaModel> | $Enums.TaskClosedVia | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel>;
};
export type EnumQuoteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | Prisma.EnumQuoteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel> | $Enums.QuoteStatus;
};
export type EnumQuoteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | Prisma.EnumQuoteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuoteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel>;
};
export type EnumCollectedFlagNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedFlag | Prisma.EnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel> | $Enums.CollectedFlag | null;
};
export type BoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type EnumCollectedFlagNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedFlag | Prisma.EnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedFlagNullableWithAggregatesFilter<$PrismaModel> | $Enums.CollectedFlag | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel>;
};
export type BoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type EnumLinkConfidenceFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkConfidence | Prisma.EnumLinkConfidenceFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel> | $Enums.LinkConfidence;
};
export type EnumLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkStatus | Prisma.EnumLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel> | $Enums.LinkStatus;
};
export type EnumLinkConfidenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkConfidence | Prisma.EnumLinkConfidenceFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkConfidenceWithAggregatesFilter<$PrismaModel> | $Enums.LinkConfidence;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel>;
};
export type EnumLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkStatus | Prisma.EnumLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.LinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel>;
};
export type EnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | Prisma.EnumItemStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus;
};
export type EnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | Prisma.EnumItemStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemStatusFilter<$PrismaModel>;
};
export type EnumItemEventKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventKind | Prisma.EnumItemEventKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel> | $Enums.ItemEventKind;
};
export type EnumItemEventSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventSource | Prisma.EnumItemEventSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel> | $Enums.ItemEventSource;
};
export type EnumItemEventKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventKind | Prisma.EnumItemEventKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventKindWithAggregatesFilter<$PrismaModel> | $Enums.ItemEventKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel>;
};
export type EnumItemEventSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventSource | Prisma.EnumItemEventSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventSourceWithAggregatesFilter<$PrismaModel> | $Enums.ItemEventSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel>;
};
export type EnumLiveStockKindFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveStockKind | Prisma.EnumLiveStockKindFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel> | $Enums.LiveStockKind;
};
export type EnumLiveStockKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveStockKind | Prisma.EnumLiveStockKindFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveStockKindWithAggregatesFilter<$PrismaModel> | $Enums.LiveStockKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel>;
};
export type EnumLiveBarStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveBarStatus | Prisma.EnumLiveBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel> | $Enums.LiveBarStatus;
};
export type EnumLiveBarStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveBarStatus | Prisma.EnumLiveBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveBarStatusWithAggregatesFilter<$PrismaModel> | $Enums.LiveBarStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel>;
};
export type EnumLiveMovementSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveMovementSource | Prisma.EnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel> | $Enums.LiveMovementSource;
};
export type EnumLiveMovementSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveMovementSource | Prisma.EnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveMovementSourceWithAggregatesFilter<$PrismaModel> | $Enums.LiveMovementSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel>;
};
export type EnumSheetApplicationKindFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationKind | Prisma.EnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel> | $Enums.SheetApplicationKind;
};
export type EnumSheetApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationStatus | Prisma.EnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel> | $Enums.SheetApplicationStatus;
};
export type EnumSheetApplicationKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationKind | Prisma.EnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationKindWithAggregatesFilter<$PrismaModel> | $Enums.SheetApplicationKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel>;
};
export type EnumSheetApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationStatus | Prisma.EnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.SheetApplicationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel>;
};
export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringFilter<$PrismaModel> | string;
};
export type NestedEnumUserRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleFilter<$PrismaModel> | $Enums.UserRole;
};
export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolFilter<$PrismaModel> | boolean;
};
export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeFilter<$PrismaModel> | Date | string;
};
export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null;
};
export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableFilter<$PrismaModel> | number | null;
};
export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringWithAggregatesFilter<$PrismaModel> | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedStringFilter<$PrismaModel>;
    _max?: Prisma.NestedStringFilter<$PrismaModel>;
};
export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntFilter<$PrismaModel> | number;
};
export type NestedEnumUserRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.UserRole | Prisma.EnumUserRoleFieldRefInput<$PrismaModel>;
    in?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    notIn?: $Enums.UserRole[] | Prisma.ListEnumUserRoleFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumUserRoleWithAggregatesFilter<$PrismaModel> | $Enums.UserRole;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumUserRoleFilter<$PrismaModel>;
};
export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBoolWithAggregatesFilter<$PrismaModel> | boolean;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolFilter<$PrismaModel>;
};
export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel>;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeFilter<$PrismaModel>;
};
export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel> | null;
    in?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    notIn?: Date[] | string[] | Prisma.ListDateTimeFieldRefInput<$PrismaModel> | null;
    lt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    lte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gt?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    gte?: Date | string | Prisma.DateTimeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDateTimeNullableFilter<$PrismaModel>;
};
export type NestedJsonNullableFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonNullableFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedIntNullableFilter<$PrismaModel>;
};
export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel> | null;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel> | null;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatNullableFilter<$PrismaModel> | number | null;
};
export type NestedEnumMetalTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel> | $Enums.MetalType;
};
export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type NestedEnumProductCategoryNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductCategory | Prisma.EnumProductCategoryFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel> | $Enums.ProductCategory | null;
};
export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableFilter<$PrismaModel> | string | null;
};
export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListIntFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.IntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedIntWithAggregatesFilter<$PrismaModel> | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedIntFilter<$PrismaModel>;
    _max?: Prisma.NestedIntFilter<$PrismaModel>;
};
export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    in?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    notIn?: number[] | Prisma.ListFloatFieldRefInput<$PrismaModel>;
    lt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    lte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gt?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    gte?: number | Prisma.FloatFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedFloatFilter<$PrismaModel> | number;
};
export type NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumMetalTypeWithAggregatesFilter<$PrismaModel> | $Enums.MetalType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMetalTypeFilter<$PrismaModel>;
};
export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel>;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalFilter<$PrismaModel>;
};
export type NestedEnumProductCategoryNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductCategory | Prisma.EnumProductCategoryFieldRefInput<$PrismaModel> | null;
    in?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.ProductCategory[] | Prisma.ListEnumProductCategoryFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumProductCategoryNullableWithAggregatesFilter<$PrismaModel> | $Enums.ProductCategory | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProductCategoryNullableFilter<$PrismaModel>;
};
export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    in?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    notIn?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    lt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    lte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gt?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    gte?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    startsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    endsWith?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedStringNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedStringNullableFilter<$PrismaModel>;
};
export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntFilter<$PrismaModel> | bigint | number;
};
export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    in?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    notIn?: bigint[] | number[] | Prisma.ListBigIntFieldRefInput<$PrismaModel>;
    lt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    lte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gt?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    gte?: bigint | number | Prisma.BigIntFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _avg?: Prisma.NestedFloatFilter<$PrismaModel>;
    _sum?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _min?: Prisma.NestedBigIntFilter<$PrismaModel>;
    _max?: Prisma.NestedBigIntFilter<$PrismaModel>;
};
export type NestedEnumBranchRegionFilter<$PrismaModel = never> = {
    equals?: $Enums.BranchRegion | Prisma.EnumBranchRegionFieldRefInput<$PrismaModel>;
    in?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel> | $Enums.BranchRegion;
};
export type NestedEnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
};
export type NestedEnumBranchRegionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BranchRegion | Prisma.EnumBranchRegionFieldRefInput<$PrismaModel>;
    in?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BranchRegion[] | Prisma.ListEnumBranchRegionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBranchRegionWithAggregatesFilter<$PrismaModel> | $Enums.BranchRegion;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBranchRegionFilter<$PrismaModel>;
};
export type NestedEnumCurrencyWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyWithAggregatesFilter<$PrismaModel> | $Enums.Currency;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCurrencyFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCurrencyFilter<$PrismaModel>;
};
export type NestedEnumFetchTriggerFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchTrigger | Prisma.EnumFetchTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel> | $Enums.FetchTrigger;
};
export type NestedEnumFetchTriggerWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.FetchTrigger | Prisma.EnumFetchTriggerFieldRefInput<$PrismaModel>;
    in?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    notIn?: $Enums.FetchTrigger[] | Prisma.ListEnumFetchTriggerFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumFetchTriggerWithAggregatesFilter<$PrismaModel> | $Enums.FetchTrigger;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumFetchTriggerFilter<$PrismaModel>;
};
export type NestedEnumKbCategoryFilter<$PrismaModel = never> = {
    equals?: $Enums.KbCategory | Prisma.EnumKbCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel> | $Enums.KbCategory;
};
export type NestedEnumKbJurisdictionFilter<$PrismaModel = never> = {
    equals?: $Enums.KbJurisdiction | Prisma.EnumKbJurisdictionFieldRefInput<$PrismaModel>;
    in?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel> | $Enums.KbJurisdiction;
};
export type NestedEnumKbStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.KbStatus | Prisma.EnumKbStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbStatusFilter<$PrismaModel> | $Enums.KbStatus;
};
export type NestedEnumKbVisibilityFilter<$PrismaModel = never> = {
    equals?: $Enums.KbVisibility | Prisma.EnumKbVisibilityFieldRefInput<$PrismaModel>;
    in?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel> | $Enums.KbVisibility;
};
export type NestedEnumKbCategoryWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbCategory | Prisma.EnumKbCategoryFieldRefInput<$PrismaModel>;
    in?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbCategory[] | Prisma.ListEnumKbCategoryFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbCategoryWithAggregatesFilter<$PrismaModel> | $Enums.KbCategory;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbCategoryFilter<$PrismaModel>;
};
export type NestedEnumKbJurisdictionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbJurisdiction | Prisma.EnumKbJurisdictionFieldRefInput<$PrismaModel>;
    in?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbJurisdiction[] | Prisma.ListEnumKbJurisdictionFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbJurisdictionWithAggregatesFilter<$PrismaModel> | $Enums.KbJurisdiction;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbJurisdictionFilter<$PrismaModel>;
};
export type NestedEnumKbStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbStatus | Prisma.EnumKbStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbStatus[] | Prisma.ListEnumKbStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbStatusWithAggregatesFilter<$PrismaModel> | $Enums.KbStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbStatusFilter<$PrismaModel>;
};
export type NestedEnumKbVisibilityWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.KbVisibility | Prisma.EnumKbVisibilityFieldRefInput<$PrismaModel>;
    in?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    notIn?: $Enums.KbVisibility[] | Prisma.ListEnumKbVisibilityFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumKbVisibilityWithAggregatesFilter<$PrismaModel> | $Enums.KbVisibility;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumKbVisibilityFilter<$PrismaModel>;
};
export type NestedJsonFilter<$PrismaModel = never> = Prisma.PatchUndefined<Prisma.Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>, Required<NestedJsonFilterBase<$PrismaModel>>> | Prisma.OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>;
export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
    path?: string[];
    mode?: Prisma.QueryMode | Prisma.EnumQueryModeFieldRefInput<$PrismaModel>;
    string_contains?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_starts_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    string_ends_with?: string | Prisma.StringFieldRefInput<$PrismaModel>;
    array_starts_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_ends_with?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    array_contains?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | null;
    lt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    lte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gt?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    gte?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel>;
    not?: runtime.InputJsonValue | Prisma.JsonFieldRefInput<$PrismaModel> | Prisma.JsonNullValueFilter;
};
export type NestedEnumStocktakeStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.StocktakeStatus | Prisma.EnumStocktakeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel> | $Enums.StocktakeStatus;
};
export type NestedEnumStocktakeStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StocktakeStatus | Prisma.EnumStocktakeStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StocktakeStatus[] | Prisma.ListEnumStocktakeStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStocktakeStatusWithAggregatesFilter<$PrismaModel> | $Enums.StocktakeStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStocktakeStatusFilter<$PrismaModel>;
};
export type NestedEnumSerialsCheckedNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.SerialsChecked | Prisma.EnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel> | $Enums.SerialsChecked | null;
};
export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
};
export type NestedEnumSerialsCheckedNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SerialsChecked | Prisma.EnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    in?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.SerialsChecked[] | Prisma.ListEnumSerialsCheckedFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumSerialsCheckedNullableWithAggregatesFilter<$PrismaModel> | $Enums.SerialsChecked | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSerialsCheckedNullableFilter<$PrismaModel>;
};
export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel> | null;
    in?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    notIn?: runtime.Decimal[] | runtime.DecimalJsLike[] | number[] | string[] | Prisma.ListDecimalFieldRefInput<$PrismaModel> | null;
    lt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    lte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gt?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    gte?: runtime.Decimal | runtime.DecimalJsLike | number | string | Prisma.DecimalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _avg?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _sum?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedDecimalNullableFilter<$PrismaModel>;
};
export type NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscrepancyIssueType | Prisma.EnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel> | $Enums.DiscrepancyIssueType;
};
export type NestedEnumDiscrepancyIssueTypeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.DiscrepancyIssueType | Prisma.EnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    in?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    notIn?: $Enums.DiscrepancyIssueType[] | Prisma.ListEnumDiscrepancyIssueTypeFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumDiscrepancyIssueTypeWithAggregatesFilter<$PrismaModel> | $Enums.DiscrepancyIssueType;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumDiscrepancyIssueTypeFilter<$PrismaModel>;
};
export type NestedEnumStockMetalFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMetalFilter<$PrismaModel> | $Enums.StockMetal;
};
export type NestedEnumBarStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.BarStatus | Prisma.EnumBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBarStatusFilter<$PrismaModel> | $Enums.BarStatus;
};
export type NestedEnumStockMetalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel>;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumStockMetalWithAggregatesFilter<$PrismaModel> | $Enums.StockMetal;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMetalFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMetalFilter<$PrismaModel>;
};
export type NestedEnumBarStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.BarStatus | Prisma.EnumBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.BarStatus[] | Prisma.ListEnumBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumBarStatusWithAggregatesFilter<$PrismaModel> | $Enums.BarStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumBarStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumBarStatusFilter<$PrismaModel>;
};
export type NestedEnumStockMetalNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel> | $Enums.StockMetal | null;
};
export type NestedEnumCustomerOrderStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerOrderStatus | Prisma.EnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel> | $Enums.CustomerOrderStatus;
};
export type NestedEnumStockMetalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.StockMetal | Prisma.EnumStockMetalFieldRefInput<$PrismaModel> | null;
    in?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.StockMetal[] | Prisma.ListEnumStockMetalFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumStockMetalNullableWithAggregatesFilter<$PrismaModel> | $Enums.StockMetal | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumStockMetalNullableFilter<$PrismaModel>;
};
export type NestedEnumCustomerOrderStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CustomerOrderStatus | Prisma.EnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CustomerOrderStatus[] | Prisma.ListEnumCustomerOrderStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCustomerOrderStatusWithAggregatesFilter<$PrismaModel> | $Enums.CustomerOrderStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCustomerOrderStatusFilter<$PrismaModel>;
};
export type NestedEnumEvidenceKindFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceKind | Prisma.EnumEvidenceKindFieldRefInput<$PrismaModel>;
    in?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel> | $Enums.EvidenceKind;
};
export type NestedEnumEvidenceKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EvidenceKind | Prisma.EnumEvidenceKindFieldRefInput<$PrismaModel>;
    in?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.EvidenceKind[] | Prisma.ListEnumEvidenceKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumEvidenceKindWithAggregatesFilter<$PrismaModel> | $Enums.EvidenceKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumEvidenceKindFilter<$PrismaModel>;
};
export type NestedEnumCptyKindFilter<$PrismaModel = never> = {
    equals?: $Enums.CptyKind | Prisma.EnumCptyKindFieldRefInput<$PrismaModel>;
    in?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCptyKindFilter<$PrismaModel> | $Enums.CptyKind;
};
export type NestedEnumTradeStateFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeState | Prisma.EnumTradeStateFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTradeStateFilter<$PrismaModel> | $Enums.TradeState;
};
export type NestedEnumCollectedSourceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedSource | Prisma.EnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel> | $Enums.CollectedSource | null;
};
export type NestedEnumOrderSystemNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderSystem | Prisma.EnumOrderSystemFieldRefInput<$PrismaModel> | null;
    in?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel> | $Enums.OrderSystem | null;
};
export type NestedEnumCptyKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CptyKind | Prisma.EnumCptyKindFieldRefInput<$PrismaModel>;
    in?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.CptyKind[] | Prisma.ListEnumCptyKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCptyKindWithAggregatesFilter<$PrismaModel> | $Enums.CptyKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCptyKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCptyKindFilter<$PrismaModel>;
};
export type NestedEnumTradeStateWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TradeState | Prisma.EnumTradeStateFieldRefInput<$PrismaModel>;
    in?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TradeState[] | Prisma.ListEnumTradeStateFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTradeStateWithAggregatesFilter<$PrismaModel> | $Enums.TradeState;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTradeStateFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTradeStateFilter<$PrismaModel>;
};
export type NestedEnumCollectedSourceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedSource | Prisma.EnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedSource[] | Prisma.ListEnumCollectedSourceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedSourceNullableWithAggregatesFilter<$PrismaModel> | $Enums.CollectedSource | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCollectedSourceNullableFilter<$PrismaModel>;
};
export type NestedEnumOrderSystemNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderSystem | Prisma.EnumOrderSystemFieldRefInput<$PrismaModel> | null;
    in?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.OrderSystem[] | Prisma.ListEnumOrderSystemFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumOrderSystemNullableWithAggregatesFilter<$PrismaModel> | $Enums.OrderSystem | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOrderSystemNullableFilter<$PrismaModel>;
};
export type NestedEnumMetalTypeNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel> | $Enums.MetalType | null;
};
export type NestedEnumAliasDeciderNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.AliasDecider | Prisma.EnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    in?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel> | $Enums.AliasDecider | null;
};
export type NestedEnumMatchConfidenceNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchConfidence | Prisma.EnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel> | $Enums.MatchConfidence | null;
};
export type NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetalType | Prisma.EnumMetalTypeFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MetalType[] | Prisma.ListEnumMetalTypeFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMetalTypeNullableWithAggregatesFilter<$PrismaModel> | $Enums.MetalType | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMetalTypeNullableFilter<$PrismaModel>;
};
export type NestedEnumAliasDeciderNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.AliasDecider | Prisma.EnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    in?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.AliasDecider[] | Prisma.ListEnumAliasDeciderFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumAliasDeciderNullableWithAggregatesFilter<$PrismaModel> | $Enums.AliasDecider | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumAliasDeciderNullableFilter<$PrismaModel>;
};
export type NestedEnumMatchConfidenceNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MatchConfidence | Prisma.EnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    in?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.MatchConfidence[] | Prisma.ListEnumMatchConfidenceFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumMatchConfidenceNullableWithAggregatesFilter<$PrismaModel> | $Enums.MatchConfidence | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumMatchConfidenceNullableFilter<$PrismaModel>;
};
export type NestedEnumProductRuleKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductRuleKind | Prisma.EnumProductRuleKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel> | $Enums.ProductRuleKind;
};
export type NestedEnumProductRuleKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ProductRuleKind | Prisma.EnumProductRuleKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ProductRuleKind[] | Prisma.ListEnumProductRuleKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumProductRuleKindWithAggregatesFilter<$PrismaModel> | $Enums.ProductRuleKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumProductRuleKindFilter<$PrismaModel>;
};
export type NestedEnumOrderStepFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStep | Prisma.EnumOrderStepFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOrderStepFilter<$PrismaModel> | $Enums.OrderStep;
};
export type NestedEnumOrderStepWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.OrderStep | Prisma.EnumOrderStepFieldRefInput<$PrismaModel>;
    in?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    notIn?: $Enums.OrderStep[] | Prisma.ListEnumOrderStepFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumOrderStepWithAggregatesFilter<$PrismaModel> | $Enums.OrderStep;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumOrderStepFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumOrderStepFilter<$PrismaModel>;
};
export type NestedEnumTaskCheckFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCheck | Prisma.EnumTaskCheckFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel> | $Enums.TaskCheck;
};
export type NestedEnumSheetTaskStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetTaskStatus | Prisma.EnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel> | $Enums.SheetTaskStatus;
};
export type NestedEnumTaskClosedViaNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskClosedVia | Prisma.EnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    in?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel> | $Enums.TaskClosedVia | null;
};
export type NestedEnumTaskCheckWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskCheck | Prisma.EnumTaskCheckFieldRefInput<$PrismaModel>;
    in?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    notIn?: $Enums.TaskCheck[] | Prisma.ListEnumTaskCheckFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumTaskCheckWithAggregatesFilter<$PrismaModel> | $Enums.TaskCheck;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskCheckFilter<$PrismaModel>;
};
export type NestedEnumSheetTaskStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetTaskStatus | Prisma.EnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetTaskStatus[] | Prisma.ListEnumSheetTaskStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetTaskStatusWithAggregatesFilter<$PrismaModel> | $Enums.SheetTaskStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetTaskStatusFilter<$PrismaModel>;
};
export type NestedEnumTaskClosedViaNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TaskClosedVia | Prisma.EnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    in?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.TaskClosedVia[] | Prisma.ListEnumTaskClosedViaFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumTaskClosedViaNullableWithAggregatesFilter<$PrismaModel> | $Enums.TaskClosedVia | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumTaskClosedViaNullableFilter<$PrismaModel>;
};
export type NestedEnumQuoteStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | Prisma.EnumQuoteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel> | $Enums.QuoteStatus;
};
export type NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.QuoteStatus | Prisma.EnumQuoteStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.QuoteStatus[] | Prisma.ListEnumQuoteStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumQuoteStatusWithAggregatesFilter<$PrismaModel> | $Enums.QuoteStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumQuoteStatusFilter<$PrismaModel>;
};
export type NestedEnumCollectedFlagNullableFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedFlag | Prisma.EnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel> | $Enums.CollectedFlag | null;
};
export type NestedBoolNullableFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableFilter<$PrismaModel> | boolean | null;
};
export type NestedEnumCollectedFlagNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.CollectedFlag | Prisma.EnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    in?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    notIn?: $Enums.CollectedFlag[] | Prisma.ListEnumCollectedFlagFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedEnumCollectedFlagNullableWithAggregatesFilter<$PrismaModel> | $Enums.CollectedFlag | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumCollectedFlagNullableFilter<$PrismaModel>;
};
export type NestedBoolNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | Prisma.BooleanFieldRefInput<$PrismaModel> | null;
    not?: Prisma.NestedBoolNullableWithAggregatesFilter<$PrismaModel> | boolean | null;
    _count?: Prisma.NestedIntNullableFilter<$PrismaModel>;
    _min?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
    _max?: Prisma.NestedBoolNullableFilter<$PrismaModel>;
};
export type NestedEnumLinkConfidenceFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkConfidence | Prisma.EnumLinkConfidenceFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel> | $Enums.LinkConfidence;
};
export type NestedEnumLinkStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkStatus | Prisma.EnumLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel> | $Enums.LinkStatus;
};
export type NestedEnumLinkConfidenceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkConfidence | Prisma.EnumLinkConfidenceFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkConfidence[] | Prisma.ListEnumLinkConfidenceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkConfidenceWithAggregatesFilter<$PrismaModel> | $Enums.LinkConfidence;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLinkConfidenceFilter<$PrismaModel>;
};
export type NestedEnumLinkStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LinkStatus | Prisma.EnumLinkStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LinkStatus[] | Prisma.ListEnumLinkStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLinkStatusWithAggregatesFilter<$PrismaModel> | $Enums.LinkStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLinkStatusFilter<$PrismaModel>;
};
export type NestedEnumItemStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | Prisma.EnumItemStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemStatusFilter<$PrismaModel> | $Enums.ItemStatus;
};
export type NestedEnumItemStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemStatus | Prisma.EnumItemStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemStatus[] | Prisma.ListEnumItemStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemStatusWithAggregatesFilter<$PrismaModel> | $Enums.ItemStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemStatusFilter<$PrismaModel>;
};
export type NestedEnumItemEventKindFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventKind | Prisma.EnumItemEventKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel> | $Enums.ItemEventKind;
};
export type NestedEnumItemEventSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventSource | Prisma.EnumItemEventSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel> | $Enums.ItemEventSource;
};
export type NestedEnumItemEventKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventKind | Prisma.EnumItemEventKindFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventKind[] | Prisma.ListEnumItemEventKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventKindWithAggregatesFilter<$PrismaModel> | $Enums.ItemEventKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemEventKindFilter<$PrismaModel>;
};
export type NestedEnumItemEventSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.ItemEventSource | Prisma.EnumItemEventSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.ItemEventSource[] | Prisma.ListEnumItemEventSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumItemEventSourceWithAggregatesFilter<$PrismaModel> | $Enums.ItemEventSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumItemEventSourceFilter<$PrismaModel>;
};
export type NestedEnumLiveStockKindFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveStockKind | Prisma.EnumLiveStockKindFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel> | $Enums.LiveStockKind;
};
export type NestedEnumLiveStockKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveStockKind | Prisma.EnumLiveStockKindFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveStockKind[] | Prisma.ListEnumLiveStockKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveStockKindWithAggregatesFilter<$PrismaModel> | $Enums.LiveStockKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveStockKindFilter<$PrismaModel>;
};
export type NestedEnumLiveBarStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveBarStatus | Prisma.EnumLiveBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel> | $Enums.LiveBarStatus;
};
export type NestedEnumLiveBarStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveBarStatus | Prisma.EnumLiveBarStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveBarStatus[] | Prisma.ListEnumLiveBarStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveBarStatusWithAggregatesFilter<$PrismaModel> | $Enums.LiveBarStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveBarStatusFilter<$PrismaModel>;
};
export type NestedEnumLiveMovementSourceFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveMovementSource | Prisma.EnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel> | $Enums.LiveMovementSource;
};
export type NestedEnumLiveMovementSourceWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LiveMovementSource | Prisma.EnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    in?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    notIn?: $Enums.LiveMovementSource[] | Prisma.ListEnumLiveMovementSourceFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumLiveMovementSourceWithAggregatesFilter<$PrismaModel> | $Enums.LiveMovementSource;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumLiveMovementSourceFilter<$PrismaModel>;
};
export type NestedEnumSheetApplicationKindFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationKind | Prisma.EnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel> | $Enums.SheetApplicationKind;
};
export type NestedEnumSheetApplicationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationStatus | Prisma.EnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel> | $Enums.SheetApplicationStatus;
};
export type NestedEnumSheetApplicationKindWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationKind | Prisma.EnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationKind[] | Prisma.ListEnumSheetApplicationKindFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationKindWithAggregatesFilter<$PrismaModel> | $Enums.SheetApplicationKind;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetApplicationKindFilter<$PrismaModel>;
};
export type NestedEnumSheetApplicationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SheetApplicationStatus | Prisma.EnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    in?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    notIn?: $Enums.SheetApplicationStatus[] | Prisma.ListEnumSheetApplicationStatusFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumSheetApplicationStatusWithAggregatesFilter<$PrismaModel> | $Enums.SheetApplicationStatus;
    _count?: Prisma.NestedIntFilter<$PrismaModel>;
    _min?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel>;
    _max?: Prisma.NestedEnumSheetApplicationStatusFilter<$PrismaModel>;
};
//# sourceMappingURL=commonInputTypes.d.ts.map