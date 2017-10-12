import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";

export class TwilightGlaive extends InsightConfig {

    constructor() {
        super(2050,
            "Unnecessarily intercepted {twilightGlaive} {totalHits} time{plural}.",
            "{playersAndHits}",
            `${MarkupHelper.Style("boss", "Huntress Kasparian")} debuffs a player with {twilightGlaiveTooltip},
before firing a glaive at them that travels from ${MarkupHelper.Style("boss", "Huntress Kasparian")}, to the player, and back.
The glaive will change direction if either party moves.
The targeted player can't avoid taking damage from it,
but anyone else who intercepts it will take unnecessary (and potentially fatal) damage.
The targeted player should move to a position so that the glaive is going to intercept as few people as possible
(ideally so that the glaive doesn't pass through melee at all),
but all raid members should be aware of the path
(you can watch the arrow at the feet of ${MarkupHelper.Style("boss", "Huntress Kasparian")}).
{twilightGlaiveTooltip} occurs roughly every 20 seconds,
and prefers to target ranged players.`);
    }

    getProperties(events: FightEvent[]): any {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Twilight Glaive" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        let damageEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Twilight Glaive" && x.config.eventType == "damage")
            .map(x => <DamageEvent>x)
            .filter(damage =>
                !debuffEvents.some(debuff =>
                    debuff.target == damage.target &&
                    debuff.timestamp < damage.timestamp &&
                    debuff.timestamp + 15000 > damage.timestamp));

        if (damageEvents.length == 0) {
            return null;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);
        let twilightGlaive = damageEvents[0].ability;

        return {
            twilightGlaive: MarkupHelper.AbilityWithIcon(twilightGlaive),
            twilightGlaiveTooltip: MarkupHelper.AbilityWithTooltip(twilightGlaive),
            totalHits: MarkupHelper.Info(totalHits),
            plural: this.getPlural(totalHits),
            playersAndHits: MarkupHelper.PlayersAndFrequency(playersAndHits)
        };
    }
    
}