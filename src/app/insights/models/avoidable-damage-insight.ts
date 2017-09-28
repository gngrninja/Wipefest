import { Actor } from "app/warcraft-logs/report";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Insight } from "app/insights/models/insight";

export class AvoidableDamageInsight extends Insight {

    constructor(
        private ability: Ability,
        private playersAndHits: PlayerAndFrequency[],
        private __tip: string
    ) {
        // Pass details in here rather than having separate property to avoid annoying ExpressionChangedAfterCheck errors
        super("", MarkupHelper.PlayersAndFrequency(playersAndHits), __tip);
    }

    private get totalHits(): number {
        return this.playersAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
    }

    get title(): string {
        return `You were hit by ${MarkupHelper.Ability(this.ability)} ${MarkupHelper.Danger(this.totalHits)} times, which is avoidable.`;
    }

}

export class PlayerAndFrequency {

    constructor(public player: Actor, public frequency: number) { }

}
