import { Operators } from "./enums"

export type Expression = (Operators | number)[]
export type Result = number | string