import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";

export class HitHard extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        private threshold: number,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{totalHits} hit{plural} of {abilities} did more than {threshold} non-absorbed damage.";
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndDamages}";
    }

    getProperties(events: FightEvent[]): any {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => x.config.eventType == "damage" && this.eventConfigNames.indexOf(x.config.name) != -1)
            .map(x => <DamageEvent>x)
            .filter(x => (x.damage + (x.overkill ? x.overkill : 0)) > this.threshold);

        if (damageEvents.length == 0) {
            return null;
        }

        let timestamps = damageEvents.map(x => x.timestamp);
        let abilities = this.getAbilitiesIfTheyExist(damageEvents, this.abilityIds);
        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
        let playersAndDamages = damageEvents.map(event => <any>{ player: event.target, damage: event.damage, absorbed: event.absorbed, overkill: event.overkill });
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y, 0);
        
        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            playersAndHits: MarkupHelper.PlayersAndFrequencies(playersAndHits),
            playersAndDamages: MarkupHelper.PlayersAndDamages(playersAndDamages),
            timestamps: MarkupHelper.Timestamps(timestamps),
            threshold: MarkupHelper.Danger(this.threshold)
        }
    }

}
