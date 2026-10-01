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
export type EnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
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
export type NestedEnumCurrencyFilter<$PrismaModel = never> = {
    equals?: $Enums.Currency | Prisma.EnumCurrencyFieldRefInput<$PrismaModel>;
    in?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    notIn?: $Enums.Currency[] | Prisma.ListEnumCurrencyFieldRefInput<$PrismaModel>;
    not?: Prisma.NestedEnumCurrencyFilter<$PrismaModel> | $Enums.Currency;
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
//# sourceMappingURL=commonInputTypes.d.ts.map