import {ITest, ITestField, ITestFieldAdapter} from "../../types";

export default class Test implements ITest {
    private static id_: number = 0

    readonly id: number;
    readonly name: string;

    private readonly fields: ITestFieldAdapter[]
    private activeField: ITestFieldAdapter

    constructor(name: string, fields: ITestField[]) {
        Test.id_++

        this.name = name
        this.id = Test.id_

        this.fields = fields.map((field: ITestField) => this.parseField(field))

        this.activeField = this.findActiveField(this.fields)

        console.log(this)
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

    protected parseField(field: ITestField): ITestFieldAdapter {
        return {
            ...field,
            weight: field.weight !== undefined ? field.weight : .5
        }
    }

}
