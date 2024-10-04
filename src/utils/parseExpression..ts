import { Operators } from "../enums"
import { Expression } from "../types"

export const parseExpression = (expression: Expression): number | string => {
    var answer : number

    const divideIndex = expression.indexOf(Operators.DIVIDE)
    const multiplyIndex = expression.indexOf(Operators.MULTIPLY)
    const addIndex = expression.indexOf(Operators.ADD)
    const subtractIndex = expression.indexOf(Operators.SUBTRACT)

    if (divideIndex !== -1) {
        answer = calculate(<number>expression[divideIndex - 1], Operators.DIVIDE, <number>expression[divideIndex + 1])
        expression[divideIndex-1] = answer
        expression.splice(divideIndex, 2)
        if (expression.length > 1) {
            return parseExpression(expression)
        }
    }
    else if (multiplyIndex !== -1) {
        answer = calculate(<number>expression[multiplyIndex - 1], Operators.MULTIPLY, <number>expression[multiplyIndex + 1])
        expression[multiplyIndex-1] = answer
        expression.splice(multiplyIndex, 2)
        if (expression.length > 1) {
            return parseExpression(expression)
        }
    }
    else if (addIndex !== -1) {
        answer = calculate(<number>expression[addIndex - 1], Operators.ADD, <number>expression[addIndex + 1])
        expression[addIndex-1] = answer
        expression.splice(addIndex, 2)
        if (expression.length > 1) {
            return parseExpression(expression)
        }
    }
    else if (subtractIndex !== -1) {
        answer = calculate(<number>expression[subtractIndex - 1], Operators.SUBTRACT, <number>expression[subtractIndex + 1])
        expression[subtractIndex-1] = answer
        expression.splice(subtractIndex, 2)
        if (expression.length > 1) {
            return parseExpression(expression)
        }
    }
    else {
        return 'Error'
    }

    console.log(expression)

    return expression[0]
}

const calculate = (leftOperand: number, operator: Operators, rightOperand: number) => {
    switch(operator) {
        case Operators.ADD:
            return leftOperand + rightOperand
        case Operators.SUBTRACT:
            return leftOperand - rightOperand
        case Operators.MULTIPLY:
            return leftOperand * rightOperand
        case Operators.DIVIDE:
            return leftOperand / rightOperand
    }
}