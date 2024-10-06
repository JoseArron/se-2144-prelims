import { Operator } from "./enums"
import Calculator from "./models/calculator"

/**
 * The functions below are event handlers for the calculator's key presses
 * 
 * Each function takes a Calculator instance as a parameter
 * @param calculator - The Calculator instance storing the calculator's input and state
 */

export const handleHello = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  calculator.displayHello()
}

export const handleBye = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  calculator.displayBye()
}

/**
 * Handle the 'AC' key press to clear the calculator or turn it on
 * Clear the calculator if it’s on
 * Turn the calculator on if it's off
 */
export const handleAC = (calculator: Calculator) => {
  if (calculator.isInputDisabled) return
  if (calculator.isOn) {
    calculator.clear()
  } else {
    calculator.turnOn()
  }
}

export const handleEqualInput = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled || !calculator.canAddOperator) return
  calculator.displayResult(true)
}

export const handleBackspace = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  calculator.backspace()
}

/**
 * @param number - The number input as a string
 */
export const handleNumberInput = (number: string, calculator: Calculator): void => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  calculator.appendNumber(number)
}

/**
 * @param operator - The operator input as a string
 */
export const handleOperatorInput = (operator: string, calculator: Calculator): void => {
  if (!calculator.isOn || calculator.isInputDisabled) return

/** 
 * If the calculator can't add an operator - i.e. the last input was an operator,
 * and the input is a subtraction operator, append a negative(-) sign instead
 */
  if (!calculator.canAddOperator && operator === Operator.SUBTRACT) {
    calculator.appendNegative()
    return
  }

  if (!calculator.canAddOperator) return
  calculator.appendOperator(operator)
}

export const handleDecimalInput = (calculator: Calculator): void => {
  if (!calculator.isOn || !calculator.canAddDecimal) return
  calculator.appendDecimal()
}
