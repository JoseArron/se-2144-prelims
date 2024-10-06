import { Operator } from "./enums"

export type Expression = (Operator | number)[]
export type ExpressionInput = (Operator | string)[]
export type Result = number | string
export type Polarity = 1 | -1