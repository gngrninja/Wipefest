import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";
import { RemoveDebuffEvent } from "app/fight-events/models/remove-debuff-event";
import { PlayerAndDuration } from "app/insights/models/player-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";
import { InsightContext } from "app/insights/models/insight-context";
import { PlayerAndTimestamp } from "app/insights/models/player-and-timestamp";

export class DebuffDuration extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private appliedEventConfigName: string,
        private removedEventConfigName: string,
        private threshold: number = 0,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) {
            if (this.threshold > 0) {
                this.insightTemplate = "Had an average {ability} duration of {averageDuration}, with {totalFrequencyOverThreshold} lasting longer than {threshold}.";
            } else {
                this.insightTemplate = "Had an average {ability} duration of {averageDuration}.";
            }
        }
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndDurationsOverThreshold}";
    }

    getProperties(context: InsightContext): any {
        let debuffEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == this.appliedEventConfigName && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        let removeDebuffEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == this.removedEventConfigName && x.config.eventType == "removedebuff")
            .map(x => <RemoveDebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        let playersAndDurations = debuffEvents
            .map(gained => {
                let removeDebuffEvent = removeDebuffEvents.find(lost => gained.target == lost.target && gained.ability.guid == lost.ability.guid && lost.timestamp > gained.timestamp);
                if (!removeDebuffEvent) {
                    return new PlayerAndDuration(gained.target, context.fight.end_time - context.fight.start_time - gained.timestamp);
                }

                let duration = removeDebuffEvent.timestamp - gained.timestamp;

                return new PlayerAndDuration(removeDebuffEvent.target, duration);
            })
            .filter(x => x != null);

        let playersWithDurationsOverThresholdAndTimestamps = debuffEvents
            .map(gained => {
                let removeDebuffEvent = removeDebuffEvents.find(lost => gained.target == lost.target && gained.ability.guid == lost.ability.guid && lost.timestamp > gained.timestamp);
                if (!removeDebuffEvent) {
                    let duration = context.fight.end_time - context.fight.start_time - gained.timestamp;
                    if (duration < this.threshold)
                        return null;

                    return new PlayerAndTimestamp(gained.target, context.fight.end_time - context.fight.start_time);
                }

                let duration = removeDebuffEvent.timestamp - gained.timestamp;
                if (duration < this.threshold)
                    return null;

                return new PlayerAndTimestamp(removeDebuffEvent.target, removeDebuffEvent.timestamp);
            })
            .filter(x => x != null);

        if (playersAndDurations.length == 0) {
            return null;
        }

        let totalDuration = playersAndDurations.map(x => x.duration).reduce((x, y) => x + y);
        let averageDuration = totalDuration / playersAndDurations.length;
        let playersAndDurationsOverThreshold = playersAndDurations.filter(x => x.duration >= this.threshold);
        let totalFrequencyOverThreshold = playersAndDurationsOverThreshold.length;
        let ability = debuffEvents[0].ability;

        return {
            ability: MarkupHelper.AbilityWithIcon(ability),
            abilityTooltip: MarkupHelper.AbilityWithTooltip(ability),
            averageDuration: MarkupHelper.Info(Timestamp.ToSeconds(averageDuration)),
            totalDuration: MarkupHelper.Info(Timestamp.ToSeconds(totalDuration)),
            totalFrequencyOverThreshold: MarkupHelper.Info(totalFrequencyOverThreshold),
            plural: this.getPlural(totalFrequencyOverThreshold),
            possesivePronoun: totalFrequencyOverThreshold == 1 ? "its" : "their",
            playersAndDurationsOverThreshold: MarkupHelper.PlayersAndDurations(playersAndDurationsOverThreshold),
            playersWithDurationsOverThresholdAndTimestamps: MarkupHelper.PlayersAndTimestamps(playersWithDurationsOverThresholdAndTimestamps),
            threshold: MarkupHelper.Info(Timestamp.ToSeconds(this.threshold))
        }
    }

}
