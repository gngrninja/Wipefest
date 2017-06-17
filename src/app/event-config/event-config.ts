export class EventConfig {

    name: string;
    eventType: string;
    timestamp: number;
    friendly: boolean;
    filter: EventConfigFilter;

}

export class EventConfigFilter {

    type: string;
    ability: EventConfigFilterAbility;
    actor: EventConfigFilterActor;

}

export class EventConfigCombinedFilter {


    constructor(public type: string, public filters: EventConfigFilter[]) {
        this.type = type;
        this.filters = filters;
    }

    parse(): string {
        if (this.type == "firstseen") {
            let actorNames = this.filters.map(x => x.actor.name);
            return `(source.firstSeen = timestamp and source.name in ('${actorNames.join("', '")}')) or` +
                `(target.firstSeen = timestamp and target.name in ('${actorNames.join("', '")}'))`;
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

}