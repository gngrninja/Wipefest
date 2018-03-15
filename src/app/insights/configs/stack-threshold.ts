import { InsightConfig } from "app/insights/configs/insight-config";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { InsightContext } from "app/insights/models/insight-context";

export class StackThreshold extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        private stacks: number,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Gained {stacks} stacks of {abilities} {totalFrequency} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndFrequencies}";
    }

    getProperties(context: InsightContext): any {
        let debuffEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        if (debuffEvents.length == 0) {
            return null;
        }

        let abilities = this.getAbilitiesIfTheyExist(debuffEvents, this.abilityIds);
        let players = debuffEvents.map(x => x.target).filter((x, index, array) => array.findIndex(y => y.id === x.id) === index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: debuffEvents.filter(x => x.target.id === player.id).length }).sort((x, y) => y.frequency - x.frequency);
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
