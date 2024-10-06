import { Operator } from "./enums"
import Calculator from "./models/calculator"

export const handleHello = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  
  calculator.displayHello()
  }

export const handleBye = (calculator: Calculator) => {
  if (!calculator.isOn || calculator.isInputDisabled) return
  
  calculator.displayBye()
  }

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

export const handleNumberInput = (number: string, calculator: Calculator): void => {
  if (!calculator.isOn || calculator.isInputDisabled) return

  calculator.appendNumber(number)
  }

export const handleOperatorInput = (operator: string, calculator: Calculator): void => {
  if (!calculator.isOn || calculator.isInputDisabled) return

  else if (!calculator.canAddOperator && operator == Operator.SUBTRACT ) {
      calculator.appendNegative()
      return
    }

  else if (!calculator.canAddOperator) return
  
  calculator.appendOperator(operator)
  }

export const handleDecimalInput = (calculator: Calculator): void => {
  if (!calculator.isOn || !calculator.canAddDecimal) return
  
  calculator.appendDecimal()
  }


  
  
  