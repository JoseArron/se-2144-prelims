import { Operator } from "../enums"

const isOperator = (value: string): boolean => {
    return Object.values(Operator).includes(<Operator>value)
}

export default isOperator