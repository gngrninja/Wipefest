import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";

export class UnstableSoulFullExpirationExplosion extends InsightConfig {

    constructor() {
        super(2052,
            "{unstableSoul} exploded by fully expiring {totalFrequency} time{plural}.",
            "{playersAndFrequencies}",
            `{unstableSoulTooltip} explodes when it fully expires, dealing massive raid damage.
Targeted players need to jump into the hole to gain {ability:241593:Aegwynn's Ward:physical},
which protects the raid from the explosion.
The player will then be knocked out of the hole to safety.
{ability:241593:Aegwynn's Ward:physical} is not applied straight away,
so players need to jump into the hole 1-2 seconds before their debuff expires.
If players jump too early, then they risk falling too far to be knocked out of the hole when they explode.`);
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
                    debuff.target == damage.source &&
                    debuff.timestamp < damage.timestamp - 7750 &&
                    debuff.timestamp > damage.timestamp - 8250));

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
