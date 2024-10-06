import { Operator } from "../enums"
import { Expression, ExpressionInput } from "../types"
import isOperator from "./isOperator"

/**
 * Parse an expression from an array of strings and operators to an array of numbers and operators
 * @param  {ExpressionInput} expressionInput- The expression to parse
 * @returns {Expression} - The parsed expression
 */
const parseExpression = (expressionInput: ExpressionInput): Expression => {
    var expression: Expression = []
    // Convert all the string numbers to numbers
    expression = expressionInput.map((input: string) => {
        if (isOperator(input)) {
            return <Operator>input
        }
        return Number(input)
    })
    
    return expression
}

export default parseExpression
