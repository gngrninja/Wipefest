export class EventConfigIndex {

    zone: string;
    name: string;
    id: number;
    includes: string[];

}

export class EventConfig {

    name: string;
    tags: string[];
    eventType: string;
    timestamp: number;
    friendly: boolean;
    source: string;
    filter: EventConfigFilter;

}

export class EventConfigFilter {

    type: string;
    types: string[];
    range: number;
    ability: EventConfigFilterAbility;
    actor: EventConfigFilterActor;

}

export class EventConfigCombinedFilter {


    constructor(public type: string, public filters: EventConfigFilter[]) { }

    parse(): string {
        if (this.type == "firstseen") {
            let actorNames = this.filters.map(x => x.actor.name);
            return `(source.firstSeen = timestamp and source.name in ("${actorNames.join('", "')}")) or` +
                `(target.firstSeen = timestamp and target.name in ("${actorNames.join('", "')}"))`;
        }

        if (this.type == "percent") {
            let filters = this.filters.map(x => `source.name = "${x.actor.name}" and resources.hpPercent <= ${x.actor.percent + 1} and resources.hpPercent >= ${x.actor.percent - 5}`);
            return `type in ('cast', 'applybuff', 'applydebuff') and (${filters.join(") or (")})`;
        }

        return `type = '${this.type}' and ability.id in (${this.filters.map(x => x.ability).map(x => [].concat.apply([], x.ids ? x.ids : [x.id])).join(", ")})`;
    }

}

export class EventConfigFilterAbility {
    
    id: number;
    ids: number[];

}

export class EventConfigFilterActor {

    name: string;
    percent: number;

}