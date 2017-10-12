import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";

export class Debuff extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (!insightTemplate) this.insightTemplate = "Gained {abilities} {totalHits} time{plural}.";
        if (!detailsTemplate) this.detailsTemplate = "{abilitiesAndTimestamps}";
    }

    getProperties(events: FightEvent[]): any {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        if (debuffEvents.length == 0) {
            return null;
        }

        let abilities = this.getAbilitiesIfTheyExist(debuffEvents, this.abilityIds);
        let abilitiesAndTimestamps = debuffEvents.map(x => new AbilityAndTimestamp(x.ability, x.timestamp));
        let totalHits = debuffEvents.length;

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            abilitiesAndTimestamps: MarkupHelper.AbilitiesAndTimestamps(abilitiesAndTimestamps)
        };
    }

}
