import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "app/insights/models/insight";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { MarkupHelper } from "app/helpers/markup-helper";

export module SistersOfTheMoonInsights {

    export function TwilightGlaive(events: FightEvent[]): Insight {
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
                    debuff.source == damage.target &&
                    debuff.timestamp < damage.timestamp &&
                    debuff.timestamp + 15000 > damage.timestamp));

        if (damageEvents.length == 0) {
            return null;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length });
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `You unnecessarily intercepted ${MarkupHelper.Ability(damageEvents[0].ability)} ${MarkupHelper.Danger(totalHits)} times, which is avoidable.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndHits);
        let tip = "Huntress Kasparian debuffs a player with Twilight Glaive, before firing a glaive at them that travels from Kasparian, to the player, and back. The glaive will change direction if either party moves. The targeted player can't avoid taking damage from it, but anyone else who intercepts it will take unnecessary (and potentially fatal) damage. The targeted player should move to a position so that the glaive is going to intercept as few people as possible (ideally so that the glaive doesn't pass through melee at all), but all raid members should be aware of the path (you can watch the arrow at the feet of Kasparian). Twilight Glaive occurs roughly every 20 seconds, and prefers to target ranged players.";

        return new Insight(insight, details, tip);
    }

}
