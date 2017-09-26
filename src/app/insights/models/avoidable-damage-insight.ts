import { Actor } from "app/warcraft-logs/report";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Insight } from "app/insights/models/insight";

export class AvoidableDamageInsight extends Insight {

    constructor(
        private ability: Ability,
        private playersAndHits: PlayersAndFrequency[]
    ) {
        super();
    }

    private get totalHits(): number {
        return this.playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);
    }

    get title(): string {
        return `You were hit by ${MarkupHelper.Ability(this.ability)} ${MarkupHelper.Danger(this.totalHits)} times, which is avoidable: ` +
            `${this.playersAndHits.sort((x, y) => y.frequency - x.frequency).map(x => `${MarkupHelper.Actor(x.player)} (${x.frequency})`).join(", ")}.`;;
    }

}

export class PlayersAndFrequency {

    constructor(public player: Actor, public frequency: number) { }

}
