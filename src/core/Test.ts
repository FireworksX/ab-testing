import {Callback, ITest, ITestField, ITestFieldAdapter} from "../../types";

export default class Test implements ITest {
    private static id_: number = 0

    readonly id: number;
    readonly name: string;

    private readonly fields: ITestFieldAdapter[]
    private activeField: ITestFieldAdapter | undefined

    constructor(name: string, fields: ITestField[]) {
        Test.id_++

        this.name = name
        this.id = Test.id_

        this.fields = fields.map((field: ITestField, index: number) => this.parseField(field, index))
    }

    getActiveField(): ITestFieldAdapter | undefined {
        return this.activeField
    }

    check(): ITestFieldAdapter {
        this.activeField = this.findActiveField(this.fields)
        return this.activeField
    }

    setActiveField(fieldName: string): void {
        this.activeField = this.fields.find((field: ITestFieldAdapter) => field.name === fieldName)
    }

    test(...cb: Callback<undefined, void>[]): void {
        if (this.activeField !== undefined) {
            const indexActiveField = this.fields
                .findIndex(
                    (field: ITestFieldAdapter) => {
                        if (this.activeField !== undefined) {
                            return field.name === this.activeField.name
                        }
                        return -1
                    }
                )

            if (indexActiveField !== -1 && cb[indexActiveField] !== undefined) {
                cb[indexActiveField]()
            }
        } else {
            console.error(`Can not find active field`)
        }
    }

    protected findActiveField(fields: ITestFieldAdapter[]): ITestFieldAdapter {
        const randomNumber = Math.random()
        const totalWeight: number = fields
            .map((field: ITestFieldAdapter): number => field.weight)
            .reduce((weight: number, acc: any): number => acc + weight)

        if (totalWeight > 1) {
            console.error(`Total weight can not be more that 1`)
            return fields[0]
        }

        let prevValue: number = 0
        const diapason = fields.map((field: ITestFieldAdapter) => {
            const newField = {
                ...field,
                start: prevValue,
                end: prevValue + field.weight
            }
            prevValue = newField.end
            return newField
        })

        for (const field of diapason) {
            if (randomNumber > field.start && randomNumber < field.end) {
                delete field.start
                delete field.end
                return field
            }
        }

        return fields[0]
    }

    protected parseField(field: ITestField, index?: number): ITestFieldAdapter {

        let name = field.name
        if (name === undefined) {
            if (index !== undefined) {
                name = index.toString()
            } else {
                name = '0'
            }
        }


        return {
            ...field,
            weight: field.weight !== undefined ? field.weight : .5,
            name
        }
    }

}
