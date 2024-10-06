import { Operator } from "../enums"
import { Expression, ExpressionInput, Result } from "../types"
import evaluate from "../utils/evaluate"
import isOperator from "../utils/isOperator"
import parseExpression from "../utils/parseExpression"

const MAX_CHARACTERS = 12
const GOODBYE_DELAY = 2000

export interface CalculatorProps {
    displayElement: HTMLDivElement
    resultDisplay: HTMLDivElement
    expressionDisplay: HTMLDivElement
}

class Calculator {
    private _isOn: boolean
    private _isInputDisabled: boolean
    private _result: Result
    private _expressionInput: ExpressionInput
    private _canAddDecimal: boolean
    private _canAddOperator: boolean
    private _polarity: number

    private _activeDisplay: HTMLDivElement
    displayElement: HTMLDivElement
    resultDisplay: HTMLDivElement
    expressionDisplay: HTMLDivElement

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

    private get result(): number | string {
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

    private set activeDisplay(inputDisplay: HTMLDivElement) {
        this._activeDisplay.classList.remove('display__section--active')
        this._activeDisplay = inputDisplay
        this._activeDisplay.classList.add('display__section--active')
    }

    private set polarity(input: number) {
        this._polarity = input
    }

    turnOn(): void {
        this.isOn = true
        this.clear()
        this.displayElement.classList.remove('display--off')
    }

    clear(): void {
        this.result = ''
        this.expressionInput = ['0']
        this.canAddDecimal = true
        this.canAddOperator = true
        this.polarity = 1
        this.updateDisplay(this.expressionDisplay)
    }

    turnOff(): void {
        this.isOn = false
        this.isInputDisabled = false
        this.clear()
        this.displayElement.classList.add('display--off')
    }

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

    appendNumber(inputNumber: string): void {
        if (!this.expressionDisplay.textContent) return

        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return
        
        if (this.expressionInput[this.expressionInput.length - 1].startsWith('0') && this.expressionInput[this.expressionInput.length - 1].length === 1) {
            this.expressionInput[this.expressionInput.length - 1] = inputNumber
        } else if (!this.canAddOperator && this.polarity === -1) {
            this.expressionInput[this.expressionInput.length - 1] += inputNumber
            this.canAddOperator = true
        } else if (!this.canAddOperator) {
            this.expressionInput.push(inputNumber)
            this.canAddOperator = true
        } else {
            this.expressionInput[this.expressionInput.length - 1] += inputNumber
        }
        
        if (this.expressionInput.length > 1) {
            this.displayResult(false)
        }

        this.updateDisplay(this.expressionDisplay)
    }

    appendOperator(inputOperator: string): void {
        if (!this.expressionDisplay.textContent) return
        
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return
        
        this.polarity = 1
        if (this.activeDisplay === this.resultDisplay && typeof this.result === 'number') {
            this.expressionInput = [this.result.toString()]
            if (this.result < 0) this.polarity = -1
            this.result = ''
        }

        this.expressionInput.push(<Operator>inputOperator)
        this.canAddDecimal = true
        this.canAddOperator = false
        this.updateDisplay(this.expressionDisplay)
    }

    appendNegative(): void {
        if (!this.expressionDisplay.textContent) return
        
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        if (this.expressionInput.slice(-2, -1).every((item) => isOperator(item))) return

        this.expressionInput.push(Operator.SUBTRACT)
        this.polarity = -1
        this.canAddDecimal = true
        this.canAddOperator = false
        this.updateDisplay(this.expressionDisplay)
    }

    appendDecimal(): void {
        if (!this.expressionDisplay.textContent) return

        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        if (!this.canAddOperator && this.polarity === -1) {
            this.expressionInput[this.expressionInput.length - 1] += '0.'
            this.canAddOperator = true
        } else if (!this.canAddOperator) {
            this.expressionInput.push('0.')
            this.canAddOperator = true
        } else {
            this.expressionInput[this.expressionInput.length - 1] += '.'
        }
        
        this.canAddDecimal = false
        this.updateDisplay(this.expressionDisplay)
    }

    displayResult(setActive: boolean): void {
        if (this.expressionInput.length === 0) return

        const expression: Expression = parseExpression(this.expressionInput)
        this.result = evaluate(expression)

        if (this.result.toString().length > MAX_CHARACTERS && typeof this.result === 'number') {
            this.result = Number(this.result.toFixed(MAX_CHARACTERS - this.result.toString().split('.')[0].length - 1))
        }

        if (typeof this.result === 'string') {
            this.expressionInput = []
        }

        if (setActive) {
            this.updateDisplay(this.resultDisplay)
        } else {
            this.updateDisplay(this.expressionDisplay)}
    }

    displayHello(): void {
        const words = ['Hello','Kumusta','Hola','Ohayou', 'Bonjour', 'Buongiorno']
        this.result = words[Math.trunc(Math.random() * words.length)]
        this.expressionInput = []
        this.updateDisplay(this.resultDisplay)
    }

    displayBye(): void {
        this.isInputDisabled = true
        this.result = 'Goodbye'
        this.expressionInput = []
        this.updateDisplay(this.resultDisplay)
        setTimeout(() => this.turnOff(), GOODBYE_DELAY)
    }

    backspace(): void {
        if (this.expressionInput.length === 0) return

        var lastItem = this.expressionInput[this.expressionInput.length - 1]
        var removedCharacter = lastItem.slice(-1)

        if (removedCharacter === '.') {
            this.canAddDecimal = true
        } else if (this.expressionInput.slice(-2, -1).every((item) => isOperator(item)) && removedCharacter === '-') {
            this.polarity = 1
            this.canAddOperator = false
        } else if (isOperator(removedCharacter)) {
            this.canAddOperator = true
        }

        if (this.expressionInput[this.expressionInput.length - 1].length > 1) {
            this.expressionInput[this.expressionInput.length - 1] = this.expressionInput[this.expressionInput.length - 1].slice(0, -1)
        } else {
            this.expressionInput.pop()
        }

        if (this.expressionInput.length === 0) {
            this.expressionInput = ['0']
        }

        lastItem = this.expressionInput[this.expressionInput.length - 1]
        if (lastItem.length === 1 && isOperator(lastItem)) {
            this.canAddOperator = false
        }

        this.updateDisplay(this.expressionDisplay)
    }
}

export default Calculator