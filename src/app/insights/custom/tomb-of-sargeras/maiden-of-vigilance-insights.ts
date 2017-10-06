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
import { PhaseChangeEvent } from "app/fight-events/models/phase-change-event";
import { PhaseAndDuration } from "app/insights/models/phase-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";

export module MaidenOfVigilanceInsights {

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
        let tip = `${MarkupHelper.Ability(debuffEvents[0].ability)} explodes when it fully expires,
dealing massive raid damage.
Targeted players need to jump into the hole to gain ${MarkupHelper.Style("physical", "Aegwynn's Ward")},
which protects the raid from the explosion.
The player will then be knocked out of the hole to safety.
${MarkupHelper.Style("physical", "Aegwynn's Ward")} is not applied straight away,
so players need to jump into the hole 1-2 seconds before their debuff expires.
If players jump too early, then they risk falling too far to be knocked out of the hole when they explode.`;

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

        let insight = `${MarkupHelper.AbilityWithIcon(debuffEvents[0].ability)} exploded early ${MarkupHelper.Info(totalFrequency)} time${GetPlural(totalFrequency)}.`;
        let details = MarkupHelper.PlayersAndFrequency(playersAndFrequencies);
        let tip = `If a player dies while affected by ${MarkupHelper.Ability(debuffEvents[0].ability)},
then the explosion (that would normally occur when the debuff expires) is triggered early.
${MarkupHelper.Ability(debuffEvents[0].ability)} deals ticking damage, so be sure to keep targeted players alive.
Also, if a debuffed player collides with a player of the opposite infusion, or takes damage from an ability of the opposite infusion, then they will explode early.`;

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
        let tip = `When a player soaks an orb that matches their infusion,
they gain a stack of ${abilities.map(x => MarkupHelper.Ability(x)).join(" / ")}, which increases throughput.
Nearby players also gain a stack. The range of this is fairly small, so make sure to group tightly when collecting orbs.
Gaining stacks allows you to break ${MarkupHelper.Style("holy", "Titanic Bulwark")} sooner,
ending the phase and putting a stop to the increasing raid damage.`;

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
        let tip = `When ${MarkupHelper.Style("boss", "Maiden of Vigilance")} casts
${MarkupHelper.Style("holy", "Hammer of Creation")} or ${MarkupHelper.Style("fire", "Hammer of Obliteration")},
she leaves behind a pool of ${MarkupHelper.Style("holy", "Light Remanence")} or ${MarkupHelper.Style("fire", "Fel Remanence")}.
As this pool shrinks, ${MarkupHelper.Style("holy", "Light Echoes")} or ${MarkupHelper.Style("fire", "Fel Echoes")}
appear as swirls beneath the feet of players.
Moving out of these before they land will reduce unnecessary damage.`;

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

        let abilities = GetAbilitiesIfTheyExist(debuffEvents, [248801, 239069]);

        let abilitiesAndTimestamps = debuffEvents.map(x => new AbilityAndTimestamp(x.ability, x.timestamp));

        let insight = `Failed to soak ${debuffEvents.length} orb${GetPlural(debuffEvents.length)}.`;
        let details = MarkupHelper.AbilitiesAndTimestamps(abilitiesAndTimestamps);
        let tip = `Failing to soak orbs causes the raid to gain ${MarkupHelper.Style("fire", "Fragment Burst")},
which deals heavy raid damage and increases further damage from ${MarkupHelper.Style("fire", "Fragment Burst")} for 8 seconds.
Gaining this several times will often cause a wipe, so it's important to make sure that all orbs are soaked.
Because orbs of both infusions spawn on both sides of the boss,
raids usually aim to have melee/healers soaking near the boss,
with ranged damage dealers soaking the remaining orbs in assigned lanes behind the melee/healers.`;

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
        let tip = `Moving out of ${MarkupHelper.Style("holy", "Light Echoes")} or ${MarkupHelper.Style("fire", "Fel Echoes")}
is particularly important if the player has the opposite infusion to the ability,
as getting hit will cause an unnecessary ${MarkupHelper.Style("fire", "Unstable Soul")}.`;

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
        let tip = `Players can gain ${MarkupHelper.Ability(debuffEvents[0].ability)} in three different ways:
${MarkupHelper.Info("(1)")} Whenever the boss casts ${MarkupHelper.Style("holy", "Mass Instability")}, three people can ${MarkupHelper.Ability(debuffEvents[0].ability)};
${MarkupHelper.Info("(2)")} Whenever two players of opposite infusions collide, they gain ${MarkupHelper.Ability(debuffEvents[0].ability)};
${MarkupHelper.Info("(3)")} Whenever a player is hit by an ability that does not match their infusion, they gain ${MarkupHelper.Ability(debuffEvents[0].ability)}.
Source ${MarkupHelper.Info("(1)")} cannot be avoided, but ${MarkupHelper.Info("(2)")} and ${MarkupHelper.Info("(3)")} can and should be avoided.
To avoid ${MarkupHelper.Info("(2)")}, the raid can group all players with ${MarkupHelper.Style("holy", "Light Infusion")} on one side of the boss,
and players with ${MarkupHelper.Style("fire", "Fel Infusion")} on the other side.
To avoid ${MarkupHelper.Info("(3)")}, players must focus on dodging orbs that don't match their infusion,
as well as abilities such as ${MarkupHelper.Style("holy", "Light Infusion")} / ${MarkupHelper.Style("fire", "Fel Infusion")}.`;

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
        let tip = `Players must jump into the hole to gain ${MarkupHelper.Style("physical", "Aegwynn's Ward")},
which protects the raid from ${MarkupHelper.Style("fire", "Unstable Soul")} explosions.
However, if a player jumps too early, then the knockback from their explosion will not be enough to knock them out of the hole,
and they will fall to their death.`;

        return new Insight(insight, details, tip);
    }

    export function PhaseTwoDuration(events: FightEvent[]): Insight {
        let phaseEvents = events
            .filter(x => x.config)
            .filter(x => x.config.eventType == "phase")
            .map(x => <PhaseChangeEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        let phasesAndDurations = phaseEvents
            .map(phase => {
                let nextPhase = phaseEvents.find(x => x.timestamp > phase.timestamp);
                if (!nextPhase) {
                    return null;
                }
                return new PhaseAndDuration(phase.config.name, nextPhase.timestamp - phase.timestamp);
            })
            .filter(x => x != null)
            .filter(x => x.phase == "Phase 2");

        if (phasesAndDurations.length == 0) {
            return null;
        }

        let averageDuration = phasesAndDurations.map(x => x.duration).reduce((x, y) => x + y) / phasesAndDurations.length;

        let insight = `Had an average ${MarkupHelper.Info(phasesAndDurations[0].phase)} duration of ${MarkupHelper.Info(Timestamp.ToMinutesAndSeconds(averageDuration))}.`;
        let details = MarkupHelper.PhasesAndDurations(phasesAndDurations);
        let tip = `During ${MarkupHelper.Info("Phase 2")}, the raid takes ever-increasing damage from ${MarkupHelper.Style("holy", "Wrath of the Creators")}.
${MarkupHelper.Info("Phase 2")} ends when the raid has done enough damage to break ${MarkupHelper.Style("holy", "Titanic Bulwark")}.
It can be useful to save damage cooldowns and ${MarkupHelper.Style("nature", "Heroism")} for this phase to break the shield quicker.`;

        return new Insight(insight, details, tip);
    }

}
