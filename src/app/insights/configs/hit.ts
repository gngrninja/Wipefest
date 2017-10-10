import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";

export class Hit extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (!insightTemplate) this.insightTemplate = "Hit by {abilities} {totalHits} time{plural}.";
        if (!detailsTemplate) this.detailsTemplate = "{playersAndHits}";
    }

    getProperties(events: FightEvent[]): any {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }

        let abilities = this.getAbilitiesIfTheyExist(damageEvents, this.abilityIds);
        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length });
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
        
        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            playersAndHits: MarkupHelper.PlayersAndFrequency(playersAndHits)
        }
    }

}
