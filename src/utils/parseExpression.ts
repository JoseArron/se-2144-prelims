import { Operator } from "../enums"
import { Expression, ExpressionInput } from "../types"
import isOperator from "./isOperator"

const parseExpression = (expressionInput: ExpressionInput): Expression => {
    var expression: Expression = []
    expression = expressionInput.map((input: string) => {
        if (isOperator(input)) {
            return <Operator>input
        }
        return Number(input)
    })
    
    return expression
}

export default parseExpression
