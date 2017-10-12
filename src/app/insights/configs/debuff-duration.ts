import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";
import { RemoveDebuffEvent } from "app/fight-events/models/remove-debuff-event";
import { PlayerAndDuration } from "app/insights/models/player-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";

export class DebuffDuration extends InsightConfig {

    constructor(
        boss: number,
        private appliedEventConfigName: string,
        private removedEventConfigName: string,
        private threshold: number = 0,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) {
            if (this.threshold > 0) {
                this.insightTemplate = "Had an average {ability} duration of {averageDuration}, with {totalFrequencyOverThreshold} lasting longer than {threshold}.";
            } else {
                this.insightTemplate = "Had an average {ability} duration of {averageDuration}.";
            }
        }
        if (detailsTemplate == null) this.detailsTemplate = "{playersAndDurationsOverThreshold}";
    }

    getProperties(events: FightEvent[]): any {
        let debuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == this.appliedEventConfigName && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        let removeDebuffEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == this.removedEventConfigName && x.config.eventType == "removedebuff")
            .map(x => <RemoveDebuffEvent>x)
            .sort((x, y) => x.timestamp - y.timestamp);

        let playersAndDurations = debuffEvents
            .map(gained => {
                let removeDebuffEvent = removeDebuffEvents.find(lost => gained.target == lost.target && gained.ability.guid == lost.ability.guid && lost.timestamp > gained.timestamp);
                if (!removeDebuffEvent) {
                    return null;
                }

                let duration = removeDebuffEvent.timestamp - gained.timestamp

                return new PlayerAndDuration(removeDebuffEvent.target, duration);
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
            playersAndDurationsOverThreshold: MarkupHelper.PlayersAndDurations(playersAndDurationsOverThreshold),
            threshold: MarkupHelper.Info(Timestamp.ToSeconds(this.threshold))
        }
    }

}