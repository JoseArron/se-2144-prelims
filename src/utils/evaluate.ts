import { Operator } from "../enums"
import { Expression } from "../types"

const evaluate = (expression: Expression): number | string => {

    var answer : number

    const expressionCopy = [...expression]

    console.log(expressionCopy)

    const divideIndex = expressionCopy.indexOf(Operator.DIVIDE)
    const multiplyIndex = expressionCopy.indexOf(Operator.MULTIPLY)
    const addIndex = expressionCopy.indexOf(Operator.ADD)
    const subtractIndex = expressionCopy.indexOf(Operator.SUBTRACT)

    if (expressionCopy.length === 1) {
        return expressionCopy[0]
    }

    if (divideIndex !== -1) {
        answer = calculate(<number>expressionCopy[divideIndex - 1], Operator.DIVIDE, <number>expressionCopy[divideIndex + 1])
        expressionCopy[divideIndex-1] = answer
        expressionCopy.splice(divideIndex, 2)
        if (expressionCopy.length > 1) {
            return evaluate(expressionCopy)
        }
    }
    else if (multiplyIndex !== -1) {
        answer = calculate(<number>expressionCopy[multiplyIndex - 1], Operator.MULTIPLY, <number>expressionCopy[multiplyIndex + 1])
        expressionCopy[multiplyIndex-1] = answer
        expressionCopy.splice(multiplyIndex, 2)
        if (expressionCopy.length > 1) {
            return evaluate(expressionCopy)
        }
    }
    else if (addIndex !== -1) {
        answer = calculate(<number>expressionCopy[addIndex - 1], Operator.ADD, <number>expressionCopy[addIndex + 1])
        expressionCopy[addIndex-1] = answer
        expressionCopy.splice(addIndex, 2)
        if (expressionCopy.length > 1) {
            return evaluate(expressionCopy)
        }
    }
    else if (subtractIndex !== -1) {
        answer = calculate(<number>expressionCopy[subtractIndex - 1], Operator.SUBTRACT, <number>expressionCopy[subtractIndex + 1])
        expressionCopy[subtractIndex-1] = answer
        expressionCopy.splice(subtractIndex, 2)
        if (expressionCopy.length > 1) {
            return evaluate(expressionCopy)
        }
    }
    else {
        return 'Error'
    }

    return expressionCopy[0]
}

const calculate = (leftOperand: number, operator: Operator, rightOperand: number) => {
    switch(operator) {
        case Operator.ADD:
            return leftOperand + rightOperand
        case Operator.SUBTRACT:
            return leftOperand - rightOperand
        case Operator.MULTIPLY:
            return leftOperand * rightOperand
        case Operator.DIVIDE:
            return leftOperand / rightOperand
    }
}

export default evaluate
