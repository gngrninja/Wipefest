export class InsightConfig {

    constructor(public type: string) { }

}

export class AvoidableDamageInsightConfig extends InsightConfig {

    constructor(public eventConfigName: string) {
        super("avoidableDamage");
    }

}
