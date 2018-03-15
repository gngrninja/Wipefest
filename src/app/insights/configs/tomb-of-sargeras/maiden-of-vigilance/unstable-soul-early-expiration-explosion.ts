import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";

export class UnstableSoulEarlyExpirationExplosion extends InsightConfig {

    constructor(id: string) {
        super(id, 2052,
            "{unstableSoul} exploded early {totalFrequency} time{plural}.",
            "{playersAndFrequencies}",
            `If a player dies while affected by {unstableSoulTooltip},
then the explosion (that would normally occur when the debuff expires) is triggered early.
{unstableSoulTooltip} deals ticking damage, so be sure to keep targeted players alive.
Also, if a debuffed player collides with a player of the opposite infusion, or takes damage from an ability of the opposite infusion, then they will explode early.`);
    }

    getProperties(context: InsightContext): any {
        let damageEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul Explosion" && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        let debuffEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .filter(debuff =>
                damageEvents.some(damage =>
                    debuff.target.id === damage.source.id &&
                    damage.timestamp - debuff.timestamp < 7750 &&
                    damage.timestamp - debuff.timestamp > 0));

        if (debuffEvents.length == 0) {
            return null;
        }

        let playersAndFrequencies = this.getPlayersAndFrequenciesFromTarget(debuffEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        return {
            unstableSoul: MarkupHelper.AbilityWithIcon(debuffEvents[0].ability),
            unstableSoulTooltip: MarkupHelper.AbilityWithTooltip(debuffEvents[0].ability),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(playersAndFrequencies),
            totalFrequency: MarkupHelper.Info(totalFrequency),
            plural: this.getPlural(totalFrequency)
        };
    }

}
