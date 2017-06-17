export class EventConfig {

    name: string;
    eventType: string;
    timestamp: number;
    filter: EventConfigFilter;

}

export class EventConfigFilter {

    type: string;
    ability: EventConfigFilterAbility;

    parse(): string {
        return `type = '${this.type}' and ability.id = ${this.ability.id}`;
    }

}

export class EventConfigCombinedFilter {

    type: string;
    abilities: EventConfigFilterAbility[];

    constructor(type: string, abilities: EventConfigFilterAbility[]) {
        this.type = type;
        this.abilities = abilities;
    }

    parse(): string {
        return `type = '${this.type}' and ability.id in (${this.abilities.map(x => x.id).join(", ")})`;
    }

}

export class EventConfigFilterAbility {
    
    id: number;

}