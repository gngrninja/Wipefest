import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";

export class StackThreshold extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        private stacks: number,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Gained {stacks} stacks of {abilities} {totalFrequency} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndFrequencies}";
    }

    getProperties(events: FightEvent[]): any {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        if (debuffEvents.length == 0) {
            return null;
        }

        let abilities = this.getAbilitiesIfTheyExist(debuffEvents, this.abilityIds);
        let players = debuffEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: debuffEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalFrequency: MarkupHelper.Info(totalFrequency),
            plural: this.getPlural(totalFrequency),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(playersAndFrequencies),
            stacks: this.stacks
        }
    }

}
