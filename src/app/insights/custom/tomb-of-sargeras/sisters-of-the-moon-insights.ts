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
                    debuff.target == damage.target &&
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

    export function AstralVulnerability(events: FightEvent[]): Insight {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Astral Vulnerability (6)" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        if (debuffEvents.length == 0) {
            return null;
        }

        let players = debuffEvents.map(x => x.source).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequency = players.map(player => <any>{ player: player, frequency: debuffEvents.filter(x => x.source == player).length });
        let totalFrequency = playersAndFrequency.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `You gained 6 stacks of ${MarkupHelper.Ability(debuffEvents[0].ability)} ${MarkupHelper.Danger(totalFrequency)} times.`;
        let details = `The sixth stack was gained from: ${MarkupHelper.PlayersAndFrequency(playersAndFrequency)}`;
        let tip = "Every time a player crosses the line, the raid takes damage from Astral Purge, and gains a stack of Astral Vulnerability (which increases the damage taken from Astral Purge). Astral Vulnerability expires after 2 seconds. To minimise raid damage, raids often cross the line in groups of 5 or less players. Take care not to stand on the line or to strafe back and forth across it. Be wary in melee-heavy compositions, where a large proportion of the raid will necessarily be clumped up. Melee can split into two groups, and should be careful not to follow the boss across the line unnecessarily, even if the tanks move them out of range.";

        return new Insight(insight, details, tip);
    }

}
