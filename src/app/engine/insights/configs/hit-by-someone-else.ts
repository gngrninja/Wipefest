import { InsightConfig } from "../configs/insight-config";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "../models/insight-context";

export class HitBySomeoneElse extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Hit by someone else's {abilities} {totalHits} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndHits}";
    }

    getProperties(context: InsightContext): any {
        let damageEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "damage")
            .map(x => <DamageEvent>x)
            .filter(x => x.target.id != x.source.id);

        if (damageEvents.length == 0) {
            return null;
        }

        let timestamps = damageEvents.map(x => x.timestamp);
        let abilities = this.getAbilitiesIfTheyExist(damageEvents, this.abilityIds);
        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
        
        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits),
            timestamps: MarkupHelper.Timestamps(timestamps)
        }
    }

}
