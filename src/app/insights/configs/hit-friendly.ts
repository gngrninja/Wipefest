import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";

export class HitFriendly extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Hit friendlies with {abilities} {totalHits} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "<h6>Sources</h6><p>{sourcesAndHits}</p><h6>Targets</h6>{targetsAndHits}";
    }

    getProperties(context: InsightContext): any {
        let damageEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }

        let timestamps = damageEvents.map(x => x.timestamp);
        let abilities = this.getAbilitiesIfTheyExist(damageEvents, this.abilityIds);

        let targets = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let targetsAndHits = targets.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);

        let sources = damageEvents.map(x => x.source).filter((x, index, array) => array.indexOf(x) == index);
        let sourcesAndHits = sources.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.source == player).length }).sort((x, y) => y.frequency - x.frequency);

        let totalHits = targetsAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
        
        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            targetsAndHits: MarkupHelper.PlayersAndFrequencies(targetsAndHits),
            sourcesAndHits: MarkupHelper.PlayersAndFrequencies(sourcesAndHits),
            timestamps: MarkupHelper.Timestamps(timestamps)
        }
    }

}
