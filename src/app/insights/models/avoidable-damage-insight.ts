import { Actor } from "app/warcraft-logs/report";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Insight } from "app/insights/models/insight";
import { PlayerAndFrequency } from "app/insights/models/player-and-frequency";

export class AvoidableDamageInsight extends Insight {

    constructor(
        private ability: Ability,
        private playersAndHits: PlayerAndFrequency[],
        private __tip: string
    ) {
        // Pass details in here rather than having separate property to avoid annoying ExpressionChangedAfterCheck errors
        super("", MarkupHelper.PlayersAndFrequency(playersAndHits.sort((x, y) => y.frequency - x.frequency)), __tip);
    }

    private get totalHits(): number {
        return this.playersAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
    }

    get title(): string {
        return `You were hit by ${MarkupHelper.AbilityWithIcon(this.ability)} ${MarkupHelper.Info(this.totalHits)} times.`;
    }

}
