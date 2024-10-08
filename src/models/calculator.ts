import { Operator } from "../enums"
import { Expression, ExpressionInput, Polarity, Result } from "../types"
import evaluate from "../utils/evaluate"
import isOperator from "../utils/isOperator"
import parseExpression from "../utils/parseExpression"


const MAX_CHARACTERS = 12                                                        /** @constant MAX_CHARACTERS - The max characters to display in the expression and result */
const HELLO_WORDS = ['Hello','Kumusta','Hola','Ohayou', 'Bonjour', 'Buongiorno'] /** @constant HELLO_WORDS - An array of hello in different languages */
const GOODBYE_DELAY = 2000                                                       /** @constant GOODBYE_DELAY - The delay in ms before turning off the calculator after pressing the goodbye key */

/**
 * @interface CalculatorProps
 */
export interface CalculatorProps {
    displayElement: HTMLDivElement    /** @property {HTMLDivElement} displayElement - The parent calculator display element */
    resultDisplay: HTMLDivElement     /** @property {HTMLDivElement} resultDisplay - The calculator result display element (child of displayElement) */
    expressionDisplay: HTMLDivElement /** @property {HTMLDivElement} expressionDisplay - The calculator expression display element (child of displayElement)*/
}

/**
 * @class
 * @classdesc A calculator model that manages input, display, and calculation
 */
class Calculator {
    private _isOn: boolean                      /** @property {boolean} _isOn - A flag to check if the calculator is on */
    private _isInputDisabled: boolean           /** @property {boolean} _isInputDisabled - A flag to check if the calculator's input is disabled */
    private _result: Result                     /** @property {Result} _result - The calculator's result */
    private _expressionInput: ExpressionInput   /** @property {ExpressionInput} _expressionInput - The calculator's inputs as an array of strings e.g ['1', '+', '23']*/
    private _canAddDecimal: boolean             /** @property {boolean} _canAddDecimal - A flag to check if a decimal can be added to the current input */
    private _canAddOperator: boolean            /** @property {boolean} _canAddOperator - A flag to check if an operator can be added to the current input */
    private _polarity: Polarity                 /** @property {number} _polarity - The calculator's current polarity, either 1 or -1 */

    private _activeDisplay: HTMLDivElement      /** @property {HTMLDivElement} _activeDisplay - The calculator's active display element */
    displayElement: HTMLDivElement             
    resultDisplay: HTMLDivElement             
    expressionDisplay: HTMLDivElement          

    /**
     * @constructor
     * @param {CalculatorProps} calculatorProps - The calculator display elements
     */
    constructor(calculatorProps: CalculatorProps) {
        this._isOn = true
        this._isInputDisabled = false
        this._result = ''
        this._expressionInput = []
        this._canAddDecimal = true
        this._canAddOperator = true
        this._polarity = 1
        
        this.displayElement = calculatorProps.displayElement
        this.resultDisplay = calculatorProps.resultDisplay
        this.expressionDisplay = calculatorProps.expressionDisplay
        this._activeDisplay = this.expressionDisplay
        this.turnOn()
    }

    get isOn(): boolean {
        return this._isOn
    }
    
    get isInputDisabled(): boolean {
        return this._isInputDisabled
    }

    private get result(): Result {
        return this._result
    }

    private get expressionInput(): ExpressionInput {
        return this._expressionInput
    }

    get canAddDecimal(): boolean {
        return this._canAddDecimal
    }

    get canAddOperator(): boolean {
        return this._canAddOperator
    }

    private get activeDisplay(): HTMLDivElement {
        return this._activeDisplay
    }

    private get polarity(): number {
        return this._polarity
    }

    private set isOn(input: boolean) {
        this._isOn = input
    }

    private set isInputDisabled(input: boolean) {
        this._isInputDisabled = input
    }

    private set result(input: Result) {
        this._result = input
    }

    private set expressionInput(input: ExpressionInput) {
        this._expressionInput = input
    }

    private set canAddDecimal(input: boolean) {
        this._canAddDecimal = input
    }

    private set canAddOperator(input: boolean) {
        this._canAddOperator = input
    }
    
    /** @param {HTMLDivElement} inputDisplay - The display element to set as active */
    private set activeDisplay(inputDisplay: HTMLDivElement) {
        // Remove the current active display and set the new active display
        // Remove the active class from the current display and adds it to the new display to animate grow effect
        this._activeDisplay.classList.remove('display__section--active')
        this._activeDisplay = inputDisplay
        this._activeDisplay.classList.add('display__section--active')
    }

    private set polarity(input: Polarity) {
        this._polarity = input
    }

    // Turn the calculator on
    turnOn(): void {
        this.isOn = true
        this.clear()
        this.displayElement.classList.remove('display--off') // Remove the off class to show the display
    }

    // Reset the calculator's state
    clear(): void {
        this.result = ''
        this.expressionInput = ['0'] // Keep 0 as a default value
        this.canAddDecimal = true
        this.canAddOperator = true
        this.polarity = 1
        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }

    // Turn the calculator off
    turnOff(): void {
        this.isOn = false
        this.isInputDisabled = false
        this.clear()
        this.displayElement.classList.add('display--off')
    }

    /**
     * Update the display with the calculator's curerent state
     * @param activeDisplay - The display element to set as active
     */
    updateDisplay(activeDisplay: HTMLDivElement): void {
        if (this.isOn) {
            this.activeDisplay = activeDisplay
            this.resultDisplay.textContent = this.result.toString()
            this.expressionDisplay.textContent = this.expressionInput.join('')
        } else {
            this.resultDisplay.textContent = ''
            this.expressionDisplay.textContent = ''
        }
    }

    /**
     * Append a number to the expression input
     * @param inputNumber - The number input as a string
     */
    appendNumber(inputNumber: string): void {
        // Cancel if the display is empty or has reached the max characters
        if (!this.expressionDisplay.textContent) return
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        // If the last input is just 0, replace it with the new number e.g. ['0'] => ['1']
        if (this.expressionInput[this.expressionInput.length - 1] === '0') {
            this.expressionInput[this.expressionInput.length - 1] = inputNumber
        }
        // If the last input is just -0, replace it with the new negative number e.g. ['-0'] => ['-1']
        else if (this.expressionInput[this.expressionInput.length - 1] === '-0') {
            this.expressionInput[this.expressionInput.length - 1] = '-' + inputNumber
        }
        // If the negative sign has been added, add the number to the last input e.g. ['1', '+', '-'] => ['1', '+', '-1']
        else if (!this.canAddOperator && this.polarity === -1) {
            this.expressionInput[this.expressionInput.length - 1] += inputNumber
            this.canAddOperator = true
        } 
        // If the last input is an operator, add the number as a new input e.g. ['1', '+'] => ['1', '+', '1']
        else if (!this.canAddOperator) {
            this.expressionInput.push(inputNumber)
            this.canAddOperator = true
        } 
        // Add the number to the last input e.g. ['1'] => ['11']
        else {
            this.expressionInput[this.expressionInput.length - 1] += inputNumber
        }
        
        // If there are than one input in the expression input array, 
        if (this.expressionInput.length > 1) {
            this.displayResult(false) // Display the result without setting the active display
        }

        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }

    /**
     * Append an operator to the expression input
     * @param inputOperator - The operator input as a string
     */
    appendOperator(inputOperator: string): void {
        // Cancel if the display is empty or has reached the max characters
        if (!this.expressionDisplay.textContent) return
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return
        
        this.polarity = 1 // Reset the polarity to positive

        // If the result display is active and the result is a number,
        if (this.activeDisplay === this.resultDisplay && typeof this.result === 'number') {
            if (!isFinite(this.result)) return // Cancel if the result is not a finite number e.g. Infinity, -Infinity, NaN

            this.expressionInput = [this.result.toString()] // Set the result as the first expression input
            this.result = '' // Reset the result
        }

        this.expressionInput.push(<Operator>inputOperator) 
        this.canAddDecimal = true
        this.canAddOperator = false
        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }

    // Append a negative sign to the expression input
    appendNegative(): void {
        // Cancel if the display is empty or has reached the max characters
        if (!this.expressionDisplay.textContent) return
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        // If the last 2 inputs are operators e.g.['1', '+', '-'], cancel
        if (this.expressionInput.slice(-2, -1).every((item) => isOperator(item))) return

        this.expressionInput.push(Operator.SUBTRACT)
        this.polarity = -1 // Set the polarity to negative
        this.canAddDecimal = true
        this.canAddOperator = false
        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }

    // Append a decimal to the expression input
    appendDecimal(): void {
        // Cancel if the display is empty or has reached the max characters
        if (!this.expressionDisplay.textContent) return
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        // If the last input is a negative sign, add '0.' to the last input e.g. ['1', '+', '-'] => ['1', '+', '-0.']
        if (!this.canAddOperator && this.polarity === -1) {
            this.expressionInput[this.expressionInput.length - 1] += '0.'
            this.canAddOperator = true
        } 
        // If the last input is an operator, add '0.' as a new input e.g. ['1', '+'] => ['1', '+', '0.']
        else if (!this.canAddOperator) {
            this.expressionInput.push('0.')
            this.canAddOperator = true
        } 
        // Add a decimal to the last input e.g. ['1'] => ['1.']
        else {
            this.expressionInput[this.expressionInput.length - 1] += '.'
        }
        
        this.canAddDecimal = false
        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }

    /**
     * Display the result of the expression input
     * @param setActive - A flag to set the result display as the active display
     */
    displayResult(setActive: boolean): void {
        // Cancel if the expression input is empty
        if (this.expressionInput.length === 0) return

        // Parse the expression input and evaluate the expression
        const expression: Expression = parseExpression(this.expressionInput)
        this.result = evaluate(expression)

        // If the result is a number and has more than the max characters, round it to the max characters
        if (this.result.toString().length > MAX_CHARACTERS && typeof this.result === 'number') {
            this.result = Number(this.result.toFixed(MAX_CHARACTERS - this.result.toString().split('.')[0].length - 1))
        }
        // If the result is a string, clear the expression input
        if (typeof this.result === 'string') {
            this.expressionInput = []
        }

        // Update the display and the active display based on the setActive flag
        if (setActive) {
            this.updateDisplay(this.resultDisplay) // Update the display, setting the result display as active
        } else {
            this.updateDisplay(this.expressionDisplay)} // Update the display, setting the expression display as active
    }

    // Display a random hello message
    displayHello(): void {
        this.result = HELLO_WORDS[Math.trunc(Math.random() * HELLO_WORDS.length)]
        this.expressionInput = []
        this.updateDisplay(this.resultDisplay) // Set the result display as active
    }

    // Display a goodbye message and turn off the calculator
    displayBye(): void {
        this.isInputDisabled = true
        this.result = 'Goodbye'
        this.expressionInput = []
        this.updateDisplay(this.resultDisplay) // Set the result display as active
        setTimeout(() => this.turnOff(), GOODBYE_DELAY)
    }

    // Remove the last character from the expression input
    backspace(): void {
        // Cancel if the expression input is empty
        if (this.expressionInput.length === 0) return

        var lastItem = this.expressionInput[this.expressionInput.length - 1]
        var removedCharacter = lastItem.slice(-1)

        // Reset the flags based on the removed character
        // If the removed character is a decimal, set the canAddDecimal flag to true
        if (removedCharacter === '.') {
            this.canAddDecimal = true
        } 
        // If the removed character is a negative sign, set the polarity to positive
        else if (this.expressionInput.slice(-2, -1).every((item) => isOperator(item)) && removedCharacter === '-') {
            this.polarity = 1
            this.canAddOperator = false
        } 
        // If the removed character is an operator, set the canAddOperator flag to true
        else if (isOperator(removedCharacter)) {
            this.canAddOperator = true
        }
        // Remove a number from the last input
        if (lastItem.length > 1) {
            this.expressionInput[this.expressionInput.length - 1] = lastItem.slice(0, -1) 
        } 
        // Remove the last input
        else {
            this.expressionInput.pop()
        }

        // If the expression input is empty, reset the calculator's state
        if (this.expressionInput.length === 0) {
            this.clear()
        }

        lastItem = this.expressionInput[this.expressionInput.length - 1]
        // If the current trailing input is an operator, reset the result
        if (lastItem.length === 1 && isOperator(lastItem)) {
            this.canAddOperator = false
            this.result = ''
        } 
        // If the current trailing input is a number, display the result
        else if (!isNaN(Number(lastItem)) && this.expressionInput.length > 1) {
            this.displayResult(false)
        }
        
        this.updateDisplay(this.expressionDisplay) // Update the display, setting the expression display as active
    }
}

export default Calculator