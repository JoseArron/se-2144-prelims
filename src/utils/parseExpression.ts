import { Operator } from "../enums"
import { Expression, ExpressionInput } from "../types"

const parseExpression = (expressionInput: ExpressionInput): Expression => {
    var expression: Expression = []
    expression = expressionInput.map((input: string) => {
        if (Object.values(Operator).includes(<Operator>input)) {
            return <Operator>input
        }
        return Number(input)
    })
    
    return expression
}

export default parseExpression
