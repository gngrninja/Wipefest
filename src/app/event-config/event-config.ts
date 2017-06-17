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

}

export class EventConfigCombinedFilter {

    type: string;
    abilities: EventConfigFilterAbility[];

    constructor(type: string, abilities: EventConfigFilterAbility[]) {
        this.type = type;
        this.abilities = abilities;
    }

    parse(): string {
        return `type = '${this.type}' and ability.id in (${this.abilities.map(x => [].concat.apply([], x.ids ? x.ids : [x.id])).join(", ")})`;
    }

}

export class EventConfigFilterAbility {
    
    id: number;
    ids: number[];

}