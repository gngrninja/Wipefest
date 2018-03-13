import { InsightConfig } from "../configs/insight-config";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DeathEvent } from "app/fight-events/models/death-event";
import { PlayerAndTimestamp } from "../models/player-and-timestamp";
import { InsightContext } from "../models/insight-context";

export class Death extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{totalFrequency} player{plural} died to {abilities}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndTimestamps}";
    }

    getProperties(context: InsightContext): any {
        let deathEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Deaths")
            .map(x => <DeathEvent>x)
            .filter(x => x.killingBlow)
            .filter(x => this.abilityIds.indexOf(x.killingBlow.guid) != -1);

        if (deathEvents.length == 0) {
            return null;
        }

        let playersAndTimestamps = deathEvents.map(x => new PlayerAndTimestamp(x.source, x.timestamp));
        let playersAndFrequencies = this.getPlayersAndFrequenciesFromSource(deathEvents);
        let totalFrequency = deathEvents.length;
        let abilities = deathEvents.map(x => x.killingBlow).filter((x, index, array) => array.map(y => y.guid).indexOf(x.guid) == index);

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalFrequency: MarkupHelper.Info(totalFrequency),
            plural: this.getPlural(totalFrequency),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(playersAndFrequencies),
            playersAndTimestamps: MarkupHelper.PlayersAndTimestamps(playersAndTimestamps)
        };
    }

}
