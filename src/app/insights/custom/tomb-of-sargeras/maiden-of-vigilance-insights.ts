import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "app/insights/models/insight";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Ability, AbilityEvent } from "app/fight-events/models/ability-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { PlayerAndFrequency } from "app/insights/models/player-and-frequency";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";
import { Actor } from "app/warcraft-logs/report";
import { DeathEvent } from "app/fight-events/models/death-event";

export module MaidenOfVigilanceInsights {

    //Unstable Soul gains
    //    - From Echoes
    //    - Not from boss (show infusion of affected players?)

    //Unstable Soul explosions
    //    - Expired(didn't jump in hole)
    //    - Expired early (died)

    //Unsoaked orbs

    //Died to falling damage

    //Avoidable Echoes damage

    //P2 Damage Buff


    //Unnecessarily gained X Unstable Soul.
    //Allowed X unprotected Unstable Soul explosions.
    //X players fell in the hole.
    //Hit by Light Echoes / Fel Echoes X times.

    function GetAbilitiesIfTheyExist(events: any[], abilityIds: number[]): Ability[] {
        let abilities: Ability[] = [];

        abilityIds.forEach(id => {
            let event = events.find(x => x.ability.guid == id);
            if (event) abilities.push(event.ability);
        });

        return abilities;
    }

    function GetPlayersAndFrequenciesFromSource(events: any[]): PlayerAndFrequency[] {
        let players = events.map(x => x.source).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.source == player).length }).sort((x, y) => y.frequency - x.frequency);

        return playersAndFrequencies;
    }

    function GetPlayersAndFrequenciesFromTarget(events: any[]): PlayerAndFrequency[] {
        let players = events.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);

        return playersAndFrequencies;
    }

    function GetPlural(number: number): string {
        if (number == 1) return "";

        return "s";
    }

    function GetPlayerInfusion(events: FightEvent[], player: Actor, timestamp: number): DebuffEvent {
        let infusions = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Infusion" || x.config.name == "Fel Infusion") && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => y.timestamp - x.timestamp);

        return infusions.find(x => x.target.id == player.id && x.timestamp < timestamp);
    }

    export function UnstableSoulFullExpirationExplosion(events: FightEvent[]): Insight {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul Explosion" && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        let debuffEvents = events
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

        let playersAndFrequencies = GetPlayersAndFrequenciesFromTarget(debuffEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `${MarkupHelper.AbilityWithIcon(debuffEvents[0].ability)} exploded by fully expiring ${MarkupHelper.Info(totalFrequency)} time${GetPlural(totalFrequency)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function UnstableSoulEarlyExpirationExplosion(events: FightEvent[]): Insight {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul Explosion" && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .filter(debuff =>
                damageEvents.some(damage =>
                    debuff.target == damage.source &&
                    damage.timestamp - debuff.timestamp < 7750 &&
                    damage.timestamp - debuff.timestamp > 0));

        if (debuffEvents.length == 0) {
            return null;
        }

        let playersAndFrequencies = GetPlayersAndFrequenciesFromTarget(debuffEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `${MarkupHelper.AbilityWithIcon(debuffEvents[0].ability)} exploded early due to player death ${MarkupHelper.Info(totalFrequency)} time${GetPlural(totalFrequency)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function CreatorsGrace(events: FightEvent[]): Insight {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Creator's Grace (7)" || x.config.name == "Demon's Vigor (7)") && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        if (debuffEvents.length == 0) {
            return null;
        }

        let players = debuffEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: debuffEvents.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        let abilities = GetAbilitiesIfTheyExist(debuffEvents, [235534, 235538]);

        let insight = `Gained ${MarkupHelper.Info(7)} stacks of ${abilities.map(x => MarkupHelper.AbilityWithIcon(x)).join(" / ")} ${MarkupHelper.Info(totalFrequency)} time${GetPlural(totalFrequency)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function Echoes(events: FightEvent[]): Insight {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Echoes" || x.config.name == "Fel Echoes") && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length })
            .sort((x, y) => y.frequency - x.frequency);

        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);

        let abilities = GetAbilitiesIfTheyExist(damageEvents, [238037, 238420]);

        let insight = `Hit by ${abilities.map(x => MarkupHelper.AbilityWithIcon(x)).join(" / ")} ${MarkupHelper.Info(totalHits)} time${GetPlural(totalHits)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndHits);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function Orbs(events: FightEvent[]): Insight {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Orbs" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        if (debuffEvents.length == 0) {
            return null;
        }

        let abilitiesAndTimestamps = debuffEvents.map(x => new AbilityAndTimestamp(x.ability, x.timestamp));

        let insight = `Failed to soak ${debuffEvents.length} orb${GetPlural(debuffEvents.length)}.`;
        let details = MarkupHelper.AbilitiesAndTimestamps(abilitiesAndTimestamps);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function UnstableSoulGainsFromEchoes(events: FightEvent[]): Insight {
        let damageEvents = events
            .filter(x => x.config)
            .filter(x => (x.config.name == "Light Echoes" || x.config.name == "Fel Echoes") && x.config.eventType == "damage")
            .map(x => <DamageEvent>x)
            .filter(x => {
                let infusion = GetPlayerInfusion(events, x.target, x.timestamp);

                let infusionDoesNotMatchEchoes =
                    (infusion.ability.guid == 235213 && x.ability.guid == 238420) ||
                    (infusion.ability.guid == 235240 && x.ability.guid == 238037)

                return infusionDoesNotMatchEchoes;
            });

        if (damageEvents.length == 0) {
            return;
        }

        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, frequency: damageEvents.filter(x => x.target == player).length })
            .sort((x, y) => y.frequency - x.frequency);
        let totalHits = playersAndHits.map(x => x.frequency).reduce((x, y) => x + y);

        let abilities = GetAbilitiesIfTheyExist(damageEvents, [238037, 238420]);

        let insight = `${MarkupHelper.Info(totalHits)} hit${GetPlural(totalHits)} of ${abilities.map(x => MarkupHelper.AbilityWithIcon(x)).join(" / ")} resulted in Unstable Soul.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndHits);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function UnstableSoulGains(events: FightEvent[]): Insight {
        let castEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Mass Instability" && x.config.eventType == "ability")
            .map(x => <AbilityEvent>x);

        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Unstable Soul" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .filter(debuff =>
                castEvents.every(cast =>
                    debuff.timestamp - cast.timestamp < 1750 ||
                    debuff.timestamp - cast.timestamp > 2250));

        if (debuffEvents.length == 0) {
            return null;
        }

        let playersAndFrequencies = GetPlayersAndFrequenciesFromTarget(debuffEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `Unnecessarily gained ${MarkupHelper.AbilityWithIcon(debuffEvents[0].ability)} ${MarkupHelper.Info(totalFrequency)} time${GetPlural(totalFrequency)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = null;

        return new Insight(insight, details, tip);
    }

    export function DiedFromFalling(events: FightEvent[]): Insight {
        let deathEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == "Deaths")
            .map(x => <DeathEvent>x)
            .filter(x => x.killingBlow)
            .filter(x => x.killingBlow.guid == 3);

        if (deathEvents.length == 0) {
            return null;
        }

        let playersAndFrequencies = GetPlayersAndFrequenciesFromSource(deathEvents);
        let totalFrequency = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y);

        let insight = `${MarkupHelper.Info(totalFrequency)} player${GetPlural(totalFrequency)} fell to their death.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = null;

        return new Insight(insight, details, tip);
    }

}
