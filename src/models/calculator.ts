import { Operators } from "../enums"
import { Expression, Result } from "../types"
import { parseExpression } from "../utils/parseExpression."

const MAX_CHARACTERS = 12

export interface CalculatorProps {
    displayElement: HTMLDivElement
    resultDisplay: HTMLDivElement
    expressionDisplay: HTMLDivElement
}

class Calculator {
    private _isOn: boolean
    private _result: Result
    private _expression: Expression
    private _canAddDecimal: boolean
    private _canAddOperator: boolean

    private _activeDisplay: HTMLDivElement
    displayElement: HTMLDivElement
    resultDisplay: HTMLDivElement
    expressionDisplay: HTMLDivElement

    constructor(calculatorProps: CalculatorProps) {
        this._isOn = true
        this._result = ''
        this._expression = [0]
        this._canAddDecimal = true
        this._canAddOperator = true
        
        this.displayElement = calculatorProps.displayElement
        this.resultDisplay = calculatorProps.resultDisplay
        this.expressionDisplay = calculatorProps.expressionDisplay
        this._activeDisplay = this.resultDisplay
        this.updateDisplay()
    }

    get isOn(): boolean {
        return this._isOn
    }

    private get result(): number | string {
        return this._result
    }

    private get expression(): Expression {
        return this._expression
    }

    get canAddDecimal(): boolean {
        return this._canAddDecimal
    }

    get canAddOperator(): boolean {
        return this._canAddOperator
    }

    private set isOn(input: boolean) {
        this._isOn = input
    }

    private set result(input: Result) {
        this._result = input
    }

    private set expression(input: Expression) {
        this._expression = input
    }

    private set canAddDecimal(input: boolean) {
        this._canAddDecimal = input
    }

    private set canAddOperator(input: boolean) {
        this._canAddOperator = input
    }

    private set activeDisplay(inputDisplay: HTMLDivElement) {
        this._activeDisplay = inputDisplay
        this._activeDisplay.classList.add(inputDisplay.classList[0] + '--active')
    }

    turnOn(): void {
        this.isOn = true
        this.clear()
        this.displayElement.classList.remove('display--off')
    }

    clear(): void {
        this.result = ''
        this.expression = [0]
        this.canAddDecimal = true
        this.canAddOperator = true
        this.updateDisplay()
    }

    turnOff(): void {
        console.log('Turning off...')
        this.isOn = false
        this.clear()
        this.displayElement.classList.add('display--off')
    }

    updateDisplay(): void {
        if (!this.isOn) {
            this.resultDisplay.textContent = ''
            this.expressionDisplay.textContent = ''
            return
        }

        this.resultDisplay.textContent = this.result.toString()
        this.expressionDisplay.textContent = this.expression.join('')
    }

    appendNumber(input_number: string): void {
        if (!this.expressionDisplay.textContent) return

        if (this.expressionDisplay.textContent === '0') {
            this.expression.pop()
            this.expression.push(Number(input_number))
        } 

        else if (this.expressionDisplay.textContent.length < MAX_CHARACTERS && this.canAddOperator == false) {
            this.expression.push(Number(input_number))
            this.canAddOperator = true
            this.result = parseExpression(this.expression)
            if (this.result.toString().length > MAX_CHARACTERS) {
                if (typeof this.result !== 'number') return
                this.result = parseFloat(this.result.toPrecision(MAX_CHARACTERS))
            }
        }

        else if (this.expressionDisplay.textContent.length < MAX_CHARACTERS) {
            var lastNumber = this.expression[this.expression.length - 1]
            this.expression[this.expression.length - 1] = Number(lastNumber.toString() + input_number)
        }

        console.log(this.expression)

        this.updateDisplay()
    }

    appendOperator(input_operator: string): void {
        if (!this.expressionDisplay.textContent) return
        if (!this.canAddOperator) return
        if (this.expressionDisplay.textContent.length >= MAX_CHARACTERS) return

        this.expression.push(input_operator as Operators)
        this.canAddDecimal = true
        this.canAddOperator = false
        this.updateDisplay()
    }

    appendDecimal(): void {
        if (!this.resultDisplay.textContent) return
        if (this.resultDisplay.textContent.includes('.')) return
        this.resultDisplay.textContent += '.'
        this._expression[this._expression.length - 1] = Number(this.resultDisplay.textContent)
    }

    displayHello(): void {
        const words = ['Hello','Kumusta','Hola','Ohayou', 'Bonjour', 'Buongiorno']
        this._result = words[Math.trunc(Math.random() * words.length)]
        this._expression = []
        this.updateDisplay()
    }

    displayBye(): void {
        this.result = 'Goodbye'
        this.expression = []
        this.updateDisplay()
        setTimeout(() => this.turnOff(), 1000)
    }

    displayResult(): void {
        if (!this.resultDisplay.textContent) return
        this.activeDisplay = this.resultDisplay
    }

    backspace(): void {
        if (!this.resultDisplay.textContent) return
        if (this.resultDisplay.textContent === '0') return
        if (this.resultDisplay.textContent.length === 1) {
            this.resultDisplay.textContent = '0'
            this._expression.pop()
        } else {
            this.resultDisplay.textContent = this.resultDisplay.textContent.slice(0, -1)
            this._expression[this._expression.length - 1] = Number(this.resultDisplay.textContent)
        }
        this.updateDisplay()
    }
}

export default Calculator