import { Operators } from "./enums"
import Calculator from "./models/calculator"

export const handleHello = (calculator: Calculator) => {
    if (calculator.isOn) calculator.displayHello()
  }

export const handleBye = (calculator: Calculator) => {
    if (calculator.isOn) calculator.displayBye()
  }

export const handleAC = (calculator: Calculator) => {
    if (calculator.isOn) calculator.clear()
    else calculator.turnOn()
  }

export const handleEqualInput = (calculator: Calculator) => {
    if (calculator.isOn) calculator.displayResult()
  }

export const handleBackspace = (calculator: Calculator) => {
    if (calculator.isOn) calculator.backspace()
  }
  
export const handleNumberInput = (number: string, calculator: Calculator): void => {
    if (!calculator.isOn) return
    calculator.appendNumber(number)
  }

export const handleOperatorInput = (operator: string, calculator: Calculator): void => {
    if (!calculator.isOn) return
    if (!calculator.canAddOperator && operator == Operators.SUBTRACT) {
        calculator.appendNegative()
    }
    calculator.appendOperator(operator)
  }

export const handleDecimalInput = (calculator: Calculator): void => {
    if (!calculator.isOn || !calculator.canAddDecimal) return
    calculator.appendDecimal()
  }


  
  
  