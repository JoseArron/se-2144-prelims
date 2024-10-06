import { 
  handleAC, 
  handleBackspace, 
  handleBye, 
  handleDecimalInput, 
  handleEqualInput, 
  handleHello, 
  handleNumberInput, 
  handleOperatorInput 
} from './eventHandlers'
import Calculator, {CalculatorProps} from './models/calculator'
import './style.css'

// Display elements
const displayElement = <HTMLDivElement> document.querySelector<HTMLDivElement>('.display')
const resultDisplay = <HTMLDivElement> document.getElementById('result-display')
const expressionDisplay = <HTMLDivElement> document.getElementById('expression-display')

// Calculator keys
const hello = <HTMLButtonElement> document.getElementById('hello-key')  // SPECIAL KEY
const bye = <HTMLButtonElement> document.getElementById('bye-key')      // SPECIAL KEY
const allClear = <HTMLButtonElement> document.getElementById('clear-key')
const equals = <HTMLButtonElement> document.getElementById('equal-key')
const backspace = <HTMLButtonElement> document.getElementById('backspace-key')
const decimal = <HTMLButtonElement> document.getElementById('decimal-key')
const numbers = document.querySelectorAll<HTMLButtonElement>('.number-key')
const operators = document.querySelectorAll<HTMLButtonElement>('.operator-key')

/**
 * Initialize the calculator and add event listeners for handling inputs.
 */
const initialize = (): void => {
  // Initialize calculator with references to the display elements
  const props: CalculatorProps = { displayElement, resultDisplay, expressionDisplay }
  const calculator = new Calculator(props)
  
  // Add event listeners to each button for handling inputs
  hello.addEventListener('click', () => handleHello(calculator))
  bye.addEventListener('click', () => handleBye(calculator))
  allClear.addEventListener('click', () => handleAC(calculator))
  equals.addEventListener('click', () => handleEqualInput(calculator))
  backspace.addEventListener('click', () => handleBackspace(calculator))

  numbers.forEach(button => button.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLButtonElement
    handleNumberInput(<string>target.textContent, calculator)
  }))

  decimal.addEventListener('click', () => handleDecimalInput(calculator))

  operators.forEach(button => button.addEventListener('click', (event: Event) => {
    const target = event.target as HTMLButtonElement
    handleOperatorInput(<string>target.textContent, calculator)
  }))
}

window.addEventListener('DOMContentLoaded', initialize)
