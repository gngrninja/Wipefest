export class EventConfigIndex {

    zone: string;
    name: string;
    id: number;
    includes: string[];

}

export class EventConfig {

    name: string;
    icon: string;
    style: string;
    target: string;
    showTarget: boolean;
    tags: string[];
    show: boolean;
    eventType: string;
    timestamp: number;
    friendly: boolean;
    source: string;
    showSource: boolean;
    title: string;
    difficulties: number[];
    filter: EventConfigFilter;

    public constructor(init?: Partial<EventConfig>) {
        Object.assign(this, init);
    }

}

export class EventConfigFilter {

    type: string;
    types: string[];
    first: boolean;
    firstPerInstance: boolean;
    stack: number;
    range: number;
    rangePerActor: number;
    minimum: number;
    ability: EventConfigFilterAbility;
    actor: EventConfigFilterActor;
    query: string;

}

export class EventConfigCombinedFilter {

    constructor(public type: string, public stack: number, public filters: EventConfigFilter[], public query: string = null) { }

    parse(): string {
        if (this.query) {
            return this.query;
        }

        if (this.type == "firstseen") {
            let actorGuids = this.filters.map(x => x.actor.id);
            return `(source.firstSeen = timestamp and source.id in (${actorGuids.join(', ')})) or ` +
                `(target.firstSeen = timestamp and target.id in (${actorGuids.join(', ')}))`;
        }

        if (this.type == "percent") {
            let filters = this.filters.map(x => `source.id = ${x.actor.id} and resources.hpPercent <= ${x.actor.percent + 1} and resources.hpPercent >= ${x.actor.percent - 5}`);
            return `type in ('cast', 'applybuff', 'applydebuff') and (${filters.join(") or (")})`;
        }

        if (this.type == "interrupt") {
            return `type = 'interrupt'`;
        }

        let query = `type = '${this.type}' and ability.id in (${this.filters.map(x => x.ability).map(x => [].concat.apply([], x.ids ? x.ids : [x.id])).join(", ")})`;

        if (this.stack > 0) {
            query += ` and stack = ${this.stack}`;
        }

        return query;
    }

}

export class EventConfigFilterAbility {
    
    id: number;
    ids: number[];

}

export class EventConfigFilterActor {

    id: number;
    name: string;
    percent: number;

}
