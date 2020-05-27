import Test from "../core/Test";
import {ICacheTest, ITestField, ITestFieldAdapter} from "../../types";
import {checkLocalStorage, checkWindowSupport} from "../helpers/checkSupports";

export default class CacheTest extends Test implements ICacheTest {

    private readonly storage: Storage | undefined

    constructor(name: string, fields: ITestField[]) {
        if (!checkLocalStorage) {
            console.error('Local storage is not supported')
            return
        }

        super(name, fields)
        if (checkWindowSupport()) {
            this.storage = window.localStorage
        }
    }

    check(): ITestFieldAdapter {
        const cacheField = this.getCacheActiveField()
        if (cacheField) {
            this.setActiveField(cacheField)
            const newActiveField = this.getActiveField()
            if (newActiveField !== undefined) {
                return newActiveField
            }
        } else {
            const field = super.check()
            this.setItem(`ab_active_field_${ this.name }`, field.name)
        }

        const findEl = this.getActiveField()
        if (findEl) {
            return findEl
        }
        // TODO Fix IT
        return {
            weight: 1,
            name: '0'
        }
    }

    protected getSerializeName(testName: string, fieldName: string) {
        return `${ testName }_${ fieldName }`
    }

    protected getCacheActiveField() {
        return this.getItem(`ab_active_field_${ this.name }`)
    }

    protected setItem(key: string, value: any) {
        if (this.storage !== undefined) {
            this.storage.setItem(key, value.toString())
        }
    }

    protected getItem(key: string): string | undefined {
        if (this.storage !== undefined) {
            const getValue = this.storage.getItem(key)
            return getValue === null ? undefined : getValue
        }
    }

}
