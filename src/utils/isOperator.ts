import { Operator } from "../enums"

/**
 * Check if a value is an operator
 * @param value - The value to check
 * @returns 
 */
const isOperator = (value: string): boolean => {
    return Object.values(Operator).includes(<Operator>value)
}

export default isOperator