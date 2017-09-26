export class InsightConfig {

    constructor(public type: string) { }

}

export class CustomInsightConfig extends InsightConfig {

    constructor(public handler: string) {
        super("custom");
    }

}

export class AvoidableDamageInsightConfig extends InsightConfig {

    constructor(public eventConfigName: string) {
        super("avoidableDamage");
    }

}
