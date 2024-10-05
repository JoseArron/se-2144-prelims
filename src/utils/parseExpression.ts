import { Operators } from "../enums"
import { Expression } from "../types"

export const parseExpression = (expression: Expression): number | string => {
    var answer : number

    const expressionCopy = [...expression]

    const divideIndex = expressionCopy.indexOf(Operators.DIVIDE)
    const multiplyIndex = expressionCopy.indexOf(Operators.MULTIPLY)
    const addIndex = expressionCopy.indexOf(Operators.ADD)
    const subtractIndex = expressionCopy.indexOf(Operators.SUBTRACT)

    if (divideIndex !== -1) {
        answer = calculate(<number>expressionCopy[divideIndex - 1], Operators.DIVIDE, <number>expressionCopy[divideIndex + 1])
        expressionCopy[divideIndex-1] = answer
        expressionCopy.splice(divideIndex, 2)
        if (expressionCopy.length > 1) {
            return parseExpression(expressionCopy)
        }
    }
    else if (multiplyIndex !== -1) {
        answer = calculate(<number>expressionCopy[multiplyIndex - 1], Operators.MULTIPLY, <number>expressionCopy[multiplyIndex + 1])
        expressionCopy[multiplyIndex-1] = answer
        expressionCopy.splice(multiplyIndex, 2)
        if (expressionCopy.length > 1) {
            return parseExpression(expressionCopy)
        }
    }
    else if (addIndex !== -1) {
        answer = calculate(<number>expressionCopy[addIndex - 1], Operators.ADD, <number>expressionCopy[addIndex + 1])
        expressionCopy[addIndex-1] = answer
        expressionCopy.splice(addIndex, 2)
        if (expressionCopy.length > 1) {
            return parseExpression(expressionCopy)
        }
    }
    else if (subtractIndex !== -1) {
        answer = calculate(<number>expressionCopy[subtractIndex - 1], Operators.SUBTRACT, <number>expressionCopy[subtractIndex + 1])
        expressionCopy[subtractIndex-1] = answer
        expressionCopy.splice(subtractIndex, 2)
        if (expressionCopy.length > 1) {
            return parseExpression(expressionCopy)
        }
    }
    else {
        return 'Error'
    }

    console.log(expressionCopy)

    return expressionCopy[0]
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