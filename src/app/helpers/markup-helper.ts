import { Actor } from "app/warcraft-logs/report";
import { Ability } from "app/fight-events/models/ability-event";
import { PlayerAndFrequency } from "app/insights/models/player-and-frequency";
import { PlayerAndDuration } from "app/insights/models/player-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";

export module MarkupHelper {

    export function Style(style: string, text): string {
        return `{[style="${style}"] ${text}}`;
    }

    export function AbilityIcon(id: number, iconUrl: string, name: string = null): string {
        return `{[image="${iconUrl}" url="http://wowhead.com/spell=${id}" style="icon"] ${name ? name : id}}`;
    }

    export function Success(text): string {
        return Style("success", text);
    }

    export function Danger(text): string {
        return Style("danger", text);
    }

    export function Warning(text): string {
        return Style("warning", text);
    }

    export function Info(text): string {
        return Style("info", text);
    }

    export function Primary(text): string {
        return Style("primary", text);
    }

    export function Actor(source: Actor): string {
        return Style(getStyleForActorType(source.type), source.name);
    }

    export function Class(className: string, text): string {
        return Style(getStyleForActorType(className.replace(" ", "")), text);
    }

    export function Ability(ability: Ability) {
        return `${Style(getSchoolForAbilityType(ability.type), ability.name)}`;
    }

    export function AbilityWithIcon(ability: Ability) {
        return `${AbilityIcon(ability.guid, ability.iconUrl, ability.name)} ${Ability(ability)}`;
    }

    export function PlayersAndFrequency(playersAndFrequency: PlayerAndFrequency[]) {
        return `${playersAndFrequency.map(x => `${Actor(x.player)} (${x.frequency})`).join(", ")}.`;
    }

    export function PlayersAndDurations(playersAndDurations: PlayerAndDuration[]) {
        return `${playersAndDurations.map(x => `${Actor(x.player)} (${Timestamp.ToSeconds(x.duration)})`).join(", ")}.`;
    }

    export function AbilitiesAndTimestamps(abilitiesAndTimestamps: AbilityAndTimestamp[]) {
        return `${abilitiesAndTimestamps.map(x => `${AbilityIcon(x.ability.guid, x.ability.iconUrl, x.ability.name)} (${Timestamp.ToMinutesAndSeconds(x.timestamp)})`).join(", ")}.`;
    }

    function getStyleForActorType(actorType: string): string {
        switch (actorType) {
            case "DeathKnight": return "death-knight";
            case "DemonHunter": return "demon-hunter";
            default: return actorType.toLowerCase();
        }
    }

    function getSchoolForAbilityType(abilityType: number): string {
        switch (abilityType) {
            case 1: return "physical";
            case 2: return "holy";
            case 4: return "fire";
            case 6: return "radiant";
            case 8: return "nature";
            case 16: return "frost";
            case 32: return "shadow";
            case 64: return "arcane";
            case 96: return "spellshadow";
            case 124: case 125: case 126: case 127: return "chaos";
            default: return abilityType.toString();
        }
    }

}
