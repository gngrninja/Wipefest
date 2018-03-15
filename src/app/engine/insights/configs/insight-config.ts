import { Insight } from "../models/insight";
import { Ability } from "app/fight-events/models/ability-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { PlayerAndFrequency } from "../models/player-and-frequency";
import { InsightContext } from "app/engine/insights/models/insight-context";
import { FightEvent } from "app/fight-events/models/fight-event";
import { Actor } from "app/engine/reports/report";
import { Raid } from "app/engine/raid/raid";

export abstract class InsightConfig {

    constructor(
        public id: string,
        public boss: number,
        protected insightTemplate,
        protected detailsTemplate,
        protected tipTemplate) { }

    getInsight(context: InsightContext): Insight {
        let properties = this.getProperties(context);
        if (properties == null) {
            return null;
        }

        return this.generateInsight(this.id, this.boss, this.insightTemplate, this.detailsTemplate, this.tipTemplate, properties, context.events);
    }

    abstract getProperties(context: InsightContext): any;

    protected renderTemplate(template: string, properties: any, events: FightEvent[]) {
        if (template == null) return null;

        let abilityMatches = this.getMatches(/{ability:(.+?):(.+?):(.+?)}/g, template);
        for (var i = 0; i < abilityMatches.length; i++) {
          let abilityMatch = abilityMatches[i];
          template = template.split(abilityMatch[0]).join(this.getAbilityMarkup(events, +abilityMatch[1], abilityMatch[2], abilityMatch[3]));
        }

        let npcMatches = this.getMatches(/{npc:(.+?)}/g, template);
        for (var i = 0; i < npcMatches.length; i++) {
          let npcMatch = npcMatches[i];
          template = template.split(npcMatch[0]).join(MarkupHelper.Style("npc", npcMatch[1]));
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

    protected generateInsight(id: string, boss: number, insightTemplate: string, detailsTemplate: string, tipTemplate: string, properties: any, events: FightEvent[]): Insight {
        let insight = this.renderTemplate(insightTemplate, properties, events);
        let details = this.renderTemplate(detailsTemplate, properties, events);
        let tip = this.renderTemplate(tipTemplate, properties, events);

        return new Insight(id, boss, insight, details, tip);
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
        let players = events.map(x => x.target).filter((x, index, array) => array.findIndex(y => y.id === x.id) === index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.target.id === player.id).length }).sort((x, y) => y.frequency - x.frequency);

        return playersAndFrequencies;
    }

    protected getPlayersAndFrequenciesFromSource(events: any[]): PlayerAndFrequency[] {
        let players = events.map(x => x.source).filter((x, index, array) => array.findIndex(y => y.id === x.id) === index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: events.filter(x => x.source.id == player.id).length }).sort((x, y) => y.frequency - x.frequency);

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
