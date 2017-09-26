import { Actor } from "app/warcraft-logs/report";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Insight } from "app/insights/models/insight";

export class AvoidableDamageInsight extends Insight {

    constructor(
        private ability: Ability,
        private playersAndHits: PlayerAndFrequency[]
    ) {
        super();
    }

    private get totalHits(): number {
        return this.playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);
    }

    get title(): string {
        return `You were hit by ${MarkupHelper.Ability(this.ability)} ${MarkupHelper.Danger(this.totalHits)} times, which is avoidable: ${MarkupHelper.PlayersAndFrequency(this.playersAndHits)}`;
    }

}

export class PlayerAndFrequency {

    constructor(public player: Actor, public frequency: number) { }

}
