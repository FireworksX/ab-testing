export interface ITestField {
    /**
     * @default 0.5
     * @type number
     */
    weight?: number
    /**
     * @default index of Field
     * @description
     */
    name?: string
}

export interface ITestFieldAdapter extends ITestField{
    weight: number
}

export interface ITestManager {
    getTestByName(name: string): ITest | undefined
    createTest(name: string, fields: ITestField[]): ITest
}

export interface ITest {
    readonly id: number
    readonly name: string
    test(...)
}

import {Test} from "../src/index";

export default Test;
