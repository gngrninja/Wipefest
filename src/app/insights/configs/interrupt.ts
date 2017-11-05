import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";
import { InterruptEvent } from "app/fight-events/models/interrupt-event";
import { AbilityEvent } from "app/fight-events/models/ability-event";
import { PlayerAndTimestamp } from "app/insights/models/player-and-timestamp";

export class Interrupt extends InsightConfig {

    constructor(
        boss: number,
        private eventConfigNames: string[],
        private abilityIds: number[],
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "Interrupted {abilities} {totalInterrupts}/{totalCastAttempts} time{plural}.";
        if (detailsTemplate == null) this.detailsTemplate = "<h6>Players</h6><p>{playersAndFrequencies}</p><h6>Interrupts</h6><p>{playersAndTimestamps}</p><h6>Casts</h6>{castTimestamps}";
    }

    getProperties(context: InsightContext): any {
        let interruptEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "interrupt")
            .map(x => <InterruptEvent>x);

        let abilityEvents = context.events
            .filter(x => x.config)
            .filter(x => this.eventConfigNames.indexOf(x.config.name) != -1 && x.config.eventType == "ability")
            .map(x => <AbilityEvent>x);

        let totalCastAttempts = interruptEvents.length + abilityEvents.length;

        if (totalCastAttempts == 0) {
            return null;
        }

        let playersAndTimestamps = interruptEvents.map(x => new PlayerAndTimestamp(x.source, x.timestamp));
        let abilities = this.getAbilitiesIfTheyExist(interruptEvents, this.abilityIds);
        let players = interruptEvents.map(x => x.source).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndFrequencies = players.map(player => <any>{ player: player, frequency: interruptEvents.filter(x => x.source == player).length }).sort((x, y) => y.frequency - x.frequency);
        let totalInterrupts = playersAndFrequencies.map(x => x.frequency).reduce((x, y) => x + y, 0);
        let castTimestamps = abilityEvents.map(x => x.timestamp);

        return {
            abilities: MarkupHelper.AbilitiesWithIcons(abilities),
            abilityTooltips: MarkupHelper.AbilitiesWithTooltips(abilities),
            totalInterrupts: MarkupHelper.Info(totalInterrupts),
            plural: this.getPlural(totalInterrupts),
            playersAndFrequencies: MarkupHelper.PlayersAndFrequencies(playersAndFrequencies),
            playersAndTimestamps: MarkupHelper.PlayersAndTimestamps(playersAndTimestamps),
            totalCastAttempts: MarkupHelper.Info(totalCastAttempts),
            castTimestamps: MarkupHelper.Timestamps(castTimestamps)
        }
    }

}
