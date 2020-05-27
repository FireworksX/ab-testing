import {ICacheTest, IMetrics, IMetricsOptions, IMetricsYandex, ITest} from "../../types";

export class Metrics implements IMetrics {

    private readonly observerTest: ITest

    protected yandexMetrikaOptions: IMetricsYandex | undefined

    constructor(test: ITest, options: IMetricsOptions) {
        this.observerTest = test

        if (options.yandex) {
            this.yandexMetrikaOptions = options.yandex
        }
    }



}
