import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { AbilityEvent } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";

export class Cast extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{abilities} was cast {totalFrequency} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{timestamps}";
    }

    getProperties(context: InsightContext): any {
        let abilityEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "ability")
            .map(x => <AbilityEvent>x);

        if (abilityEvents.length == 0) {
            return null;
        }

        let timestamps = abilityEvents.map(x => x.timestamp);
        let abilities = this.getAbilitiesIfTheyExist(abilityEvents, this.abilityIds);
        let totalFrequency = abilityEvents.length;
        
        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalFrequency: MarkupHelper.Info(totalFrequency),
            plural: this.getPlural(totalFrequency),
            timestamps: MarkupHelper.Timestamps(timestamps)
        }
    }

}