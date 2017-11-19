import { FightEvent } from "app/fight-events/models/fight-event";
import { Insight } from "app/insights/models/insight";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { PlayerAndFrequency } from "app/insights/models/player-and-frequency";
import { InsightContext } from "app/insights/models/insight-context";
import { Actor } from "app/warcraft-logs/report";
import { Raid } from "app/raid/raid";

export abstract class InsightConfig {

    constructor(
        public boss: number,
        protected insightTemplate,
        protected detailsTemplate,
        protected tipTemplate) { }

    getInsight(context: InsightContext): Insight {
        let properties = this.getProperties(context);
        if (properties == null) {
            return null;
        }

        return this.generateInsight(this.insightTemplate, this.detailsTemplate, this.tipTemplate, properties, context.events);
    }

    abstract getProperties(context: InsightContext): any;

    protected renderTemplate(template: string, properties: any, events: FightEvent[]) {
        if (template == null) return null;

        let abilityMatches = this.getMatches(/{ability:(.+?):(.+?):(.+?)}/g, template);
        for (var i = 0; i < abilityMatches.length; i++) {
            let abilityMatch = abilityMatches[i];
            template = template.split(abilityMatch[0]).join(this.getAbilityMarkup(events, +abilityMatch[1], abilityMatch[2], abilityMatch[3]));
        }

        for (var i = 0; i < 2; i++) { // Let properties have properties embedded in them by iterating twice
            for (var property in properties) {
                if (properties.hasOwnProperty(property)) {
                    template = template.split(`{${property}}`).join(properties[property]);
                }
            }
        }

        return template;
    }

    protected generateInsight(insightTemplate: string, detailsTemplate: string, tipTemplate: string, properties: any, events: FightEvent[]): Insight {
        let insight = this.renderTemplate(insightTemplate, properties, events);
        let details = this.renderTemplate(detailsTemplate, properties, events);
        let tip = this.renderTemplate(tipTemplate, properties, events);

        return new Insight(insight, details, tip);
    }

    protected getAbilitiesIfTheyExist(events: any[], abilityIds: number[]): Ability[] {
        let abilities: Ability[] = [];

        abilityIds.forEach(id => {
            let event = events.find(x => x.ability && x.ability.guid == id);
            if (event) abilities.push(event.ability);
        });

        return abilities;
    }

    protected getPlayersAndFrequenciesFromTarget(events: any[]): PlayerAndFrequency[] {
        let players = events.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.target == player).length }).sort((x, y) => y.frequency - x.frequency);

        return playersAndFrequencies;
    }

    protected getPlayersAndFrequenciesFromSource(events: any[]): PlayerAndFrequency[] {
        let players = events.map(x => x.source).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.source == player).length }).sort((x, y) => y.frequency - x.frequency);

        return playersAndFrequencies;
    }

    protected getAbilityMarkup(events: any[], abilityId: number, name: string, style: string): string {
        return MarkupHelper.AbilityWithTooltip2(abilityId, name, style);
    }

    protected getPlural(number: number): string {
        if (number == 1) return "";

        return "s";
    }

    protected getPlayerFromActor(actor: Actor, raid: Raid) {
        return raid.players.find(x => x.name == actor.name);
    }

    private getMatches(regex: RegExp, input: string) {
        let matches: string[][] = [];

        let m;
        while ((m = regex.exec(input)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            // The result can be accessed through the `m`-variable.
            matches.push(m.map(x => x));
        }

        return matches;
    }
}
