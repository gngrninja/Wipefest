import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "app/insights/models/insight";
import { DamageEvent } from "app/fight-events/models/damage-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Ability } from "app/fight-events/models/ability-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { PlayerAndFrequency } from "app/insights/models/player-and-frequency";

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

}
