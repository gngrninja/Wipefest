import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { PhaseChangeEvent } from "app/fight-events/models/phase-change-event";
import { PhaseAndDuration } from "app/insights/models/phase-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";

export class PhaseDuration extends InsightConfig {

    constructor(
        boss: number,
        private phase: string,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(boss, insightTemplate, detailsTemplate, tipTemplate);

        if (!insightTemplate) this.insightTemplate = "Had an average {phase} duration of {averageDuration}.";
        if (!detailsTemplate) this.detailsTemplate = "{phasesAndDurations}";
    }

    getProperties(events: FightEvent[]): any {
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
            .filter(x => x.phase == this.phase);

        if (phasesAndDurations.length == 0) {
            return null;
        }

        let averageDuration = phasesAndDurations.map(x => x.duration).reduce((x, y) => x + y) / phasesAndDurations.length;

        return {
            phase: MarkupHelper.Info(this.phase),
            averageDuration: MarkupHelper.Info(Timestamp.ToMinutesAndSeconds(averageDuration)),
            phasesAndDurations: MarkupHelper.PhasesAndDurations(phasesAndDurations)
        }
    }

}
