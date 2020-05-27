export interface ITestField {
    /**
     * @default 0.5
     * @type number
     */
    weight?: number
    /**
     * @default index of Field
     * @description Name used in metrics
     */
    name?: string
}

export type Callback<T, U> = (value?: T) => U

export interface ITestFieldAdapter extends ITestField{
    weight: number
    name: string
}

export interface ITestManager {
    getTestByName(name: string): ITest | undefined
    createTest(name: string, fields: ITestField[]): ITest
    createCacheTest(name: string, fields: ITestField[]): ICacheTest
}

export interface ITest {
    readonly id: number
    readonly name: string
    test(...cb: Callback<undefined, void>[]): void
    setActiveField(fieldName: string): void
    check(): ITestFieldAdapter
    getActiveField(): ITestFieldAdapter | undefined
}

export interface ICacheTest extends ITest {}

export interface IMetricsYandex {
    metrikaInstance: any
}

export interface IMetricsOptions {
    yandex?: IMetricsYandex
}

export interface IMetrics {}

import {Test} from "../src/index";

export default Test;
