import {ICacheTest, ITest, ITestField, ITestManager} from "../../types";
import Test from "./Test";
import CacheTest from "../modules/CacheTest";

export default class TestManager implements ITestManager {

    private static inst: TestManager;

    private readonly testStore: { [name: string]: ITest } = {}

    constructor() {
        if (TestManager.inst !== undefined) {
            return TestManager.inst
        } else {
            TestManager.inst = this
            return this
        }
    }


    createTest(name: string, fields: ITestField[]): ITest {
        const newTest = new Test(name, fields)
        this.testStore[name] = newTest

        return newTest
    }

    createCacheTest(name: string, fields: ITestField[]): ICacheTest {
        const newTest = new CacheTest(name, fields)
        this.testStore[name] = newTest

        return newTest
    }

    getTestByName(name: string): ITest | undefined {
        if (this.testStore !== undefined && this.testStore.hasOwnProperty(name)) {
            return this.testStore[name]
        }
        return undefined;
    }
}
