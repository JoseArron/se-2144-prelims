import { Operator } from "../enums"
import { Expression, Result } from "../types"

/**
 * Evaluate an expression
 * @param  {Expression} expression- The parsed expression to evaluate
 * @returns {Result} - The result of the expression
 */
const evaluate = (expression: Expression): Result => {
    var answer: number
    // Copy the expression to avoid mutating the original array
    const expressionCopy = [...expression]

    console.log(expressionCopy)

    // Find the index of each operator in the expression
    const divideIndex = expressionCopy.indexOf(Operator.DIVIDE)
    const multiplyIndex = expressionCopy.indexOf(Operator.MULTIPLY)
    const addIndex = expressionCopy.indexOf(Operator.ADD)
    const subtractIndex = expressionCopy.indexOf(Operator.SUBTRACT)

    // If the expression has only one element, return it
    if (expressionCopy.length === 1) {
        return expressionCopy[0]
    }

    /**
     * If the expression has more than one element, evaluate the expression
     * based on the order of operations (PEMDAS)
     * 
     * Look for the operator in the expression
     * Calculate the result of the expression with the numbers on either side of the operator
     * Replace the operator and the numbers in the expression with the result
     * Repeat until the expression has only one element
     */

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

/**
 * Calculate the result of an expression
 * @param  {number} leftOperand - The left operand
 * @param  {Operator} operator - The operator
 * @param  {number} rightOperand - The right operand
 * @returns {number} - The result of the calculation
 */
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
