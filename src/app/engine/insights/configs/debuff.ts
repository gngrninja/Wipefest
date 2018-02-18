import { InsightConfig } from "../configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { AbilityAndTimestamp } from "../models/ability-and-timestamp";
import { InsightContext } from "../models/insight-context";

export class Debuff extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Gained {abilities} {totalHits} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndFrequencies}";
    }

    getProperties(context: InsightContext): any {
        let debuffEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        if (debuffEvents.length == 0) {
            return null;
        }

        let abilities = this.getAbilitiesIfTheyExist(debuffEvents, this.abilityIds);
        let abilitiesAndTimestamps = debuffEvents.map(x => new AbilityAndTimestamp(x.ability, x.timestamp));

        let players = debuffEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: debuffEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);

        let totalHits = debuffEvents.length;

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            abilitiesAndTimestamps: MarkupHelper.AbilitiesAndTimestamps(abilitiesAndTimestamps),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(playersAndFrequencies),
        };
    }

}
