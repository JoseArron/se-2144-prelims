import './style.css'

const displayElement = <HTMLDivElement> document.querySelector<HTMLDivElement>('.display')
const currentDisplay = <HTMLDivElement> document.querySelector<HTMLDivElement>('#current-display')
const previousDisplay = <HTMLDivElement> document.querySelector<HTMLDivElement>('#previous-display')
const allClear = document.querySelector<HTMLButtonElement>('.clear-key')
const equals = document.querySelector<HTMLButtonElement>('.equal-key')
const operators = document.querySelectorAll<HTMLButtonElement>('.operator-key')
const decimal = document.querySelector<HTMLButtonElement>('.decimal-key')
const numbers = document.querySelectorAll<HTMLButtonElement>('.number-key')
const hello = document.querySelector<HTMLButtonElement>('.hello-key')
const bye = document.querySelector<HTMLButtonElement>('.bye-key')
const backspace = document.querySelector<HTMLButtonElement>('.backspace-key')

var expression = '' // To store the current expression
var isOn = false
var canAddDecimal = true
var canAddOperator = true

// Clears the display and resets the state
const clear = (): void => {
  expression = ''
  if (currentDisplay) currentDisplay.textContent = ''
  if (previousDisplay) previousDisplay.textContent = ''
}

// Turns on the calculator and initializes the display
const turnOn = (): void => {
  isOn = true
  clear()
  if (currentDisplay) {
    currentDisplay.textContent = '0'
    canAddOperator = true
    canAddDecimal = true
    displayElement.classList.remove('display--off')
  }
}

// Turns off the calculator and clears the display
const turnOff = (): void => {
  isOn = false
  clear()
  if (currentDisplay) {
    currentDisplay.textContent = ''
    displayElement.classList.add('display--off')
  }
}

// Handles number input and updates the display
const handleNumberInput = (number: string): void => {
  if (!isOn) return
  if (!currentDisplay.textContent) return
  if (currentDisplay.textContent === '0') {
    currentDisplay.textContent = number
    expression += number
    canAddOperator = true
  } else if (currentDisplay.textContent.length < 12) {
    currentDisplay.textContent += number
    expression += number
    canAddOperator = true
  }
}

// Handles decimal input and updates the display
const handleDecimalInput = (): void => {
  if (!isOn) return
  if (!currentDisplay.textContent) return
  if (canAddDecimal) {
      currentDisplay.textContent += '.'
      expression += '.'
      canAddDecimal = false
    }
  }

// Computes the result of the expression using eval
const compute = (expression: string): number | string  => {
  try {
    return eval(expression)
  }
  catch (error) {
    return 'Error'
  }
}

// Handles operator input and updates the display
const handleOperatorInput = (op: string): void => {
  if (!isOn) return
  if (!currentDisplay.textContent) return
  if (canAddOperator && currentDisplay.textContent.length < 12) {
    currentDisplay.textContent += op
    canAddDecimal = true
    canAddOperator = false
    if (op === '×') {
      expression += '*'
    } else if (op === '÷') {
      expression += '/'
    } else {
      expression += op
    }
  }
}

// Handles equal input, computes the result, and updates the display
const handleEqualInput = (): void => {
  if (!isOn) return
  const result = compute(expression)
  if (previousDisplay) previousDisplay.textContent = currentDisplay.textContent
  currentDisplay.textContent = result.toString().slice(0, 8)
  if (typeof result === 'string') {
    expression = 'Error'
  }
  else {
    expression = result.toString()
  }
}

// Handles backspace input and updates the display
const handleBackspace = (): void => {
  if (!isOn) return
  if (!currentDisplay.textContent) return
  if (currentDisplay.textContent[currentDisplay.textContent.length - 1] === '.') {
    canAddDecimal = true
  }
  if (currentDisplay.textContent[currentDisplay.textContent.length - 1] === '+' ||
      currentDisplay.textContent[currentDisplay.textContent.length - 1] === '-' ||
      currentDisplay.textContent[currentDisplay.textContent.length - 1] === '×' ||
      currentDisplay.textContent[currentDisplay.textContent.length - 1] === '÷') {
    canAddOperator = true
  }
  currentDisplay.textContent = currentDisplay.textContent.slice(0, -1) || '0'
  expression = expression.slice(0, -1)
}

// Displays a random "Hello" message in different languages
const handleHello = (): void => {
  if (!isOn) return
  const words = ['Hello', 'Gutten Morgen', 'Ohayou', 'Bonjour', 'Buongiorno']
  currentDisplay.textContent = words[Math.trunc(Math.random() * words.length)]
  expression = ''
}

// Displays a random "Goodbye" message in different languages and turns off the calculator
const handleBye = (): void => {
  if (!isOn) return
  isOn = false
  const words = ['Goodbye', 'Auf Wiedersehen', 'Sayonara', 'Au revoir', 'Arrivederci']
  currentDisplay.textContent = words[Math.trunc(Math.random() * words.length)]
  expression = ''
  setTimeout(turnOff, 1000)
}

// Event listeners for the buttons
allClear?.addEventListener('click', turnOn)

numbers.forEach(button => button.addEventListener('click', (event: Event) => {
  const target = event.target as HTMLButtonElement
  handleNumberInput(target.textContent as string)
}))

decimal?.addEventListener('click', handleDecimalInput)

operators.forEach(button => button.addEventListener('click', (event: Event) => {
  const target = event.target as HTMLButtonElement
  handleOperatorInput(target.textContent as string)
}))

equals?.addEventListener('click', handleEqualInput)

hello?.addEventListener('click', handleHello)

bye?.addEventListener('click', handleBye)

backspace?.addEventListener('click', handleBackspace)