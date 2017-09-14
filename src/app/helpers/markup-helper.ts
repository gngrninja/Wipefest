import { Actor } from "app/warcraft-logs/report";

export module MarkupHelper {

    export function Actor(source: Actor): string {
        return `{[style="${getStyleForActorType(source.type)}"] ${source.name}}`
    }

    export function Class(className: string, text: string): string {
        return `{[style="${getStyleForActorType(className.replace(" ", ""))}"] ${text}}`
    }

    function getStyleForActorType(actorType: string): string {
        switch (actorType) {
            case "DeathKnight": return "death-knight";
            case "DemonHunter": return "demon-hunter";
            default: return actorType.toLowerCase();
        }
    }

}
