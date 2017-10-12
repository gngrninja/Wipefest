import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DeathEvent } from "app/fight-events/models/death-event";

export class DiedFromFalling extends InsightConfig {

    constructor(
        boss: number,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{totalFrequency} player{plural} fell to their death{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndFrequencies}";
    }

    getProperties(events: FightEvent[]): any {
        let deathEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Deaths")
            .map(x => <DeathEvent>x)
            .filter(x => x.killingBlow)
            .filter(x => x.killingBlow.guid == 3);

        if (deathEvents.length == 0) {
            return null;
        }

        let playersAndFrequencies = this.getPlayersAndFrequenciesFromSource(deathEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        return {
            totalFrequency: MarkupHelper.Info(totalFrequency),
            plural: this.getPlural(totalFrequency),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequency(playersAndFrequencies)
        };
    }

}
