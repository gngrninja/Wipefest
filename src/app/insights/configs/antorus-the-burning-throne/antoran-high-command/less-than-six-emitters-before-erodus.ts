import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";
import { AbilityEvent } from "app/fight-events/models/ability-event";
import { PhaseChangeEvent } from "app/fight-events/models/phase-change-event";

export class LessThanSixEmittersBeforeErodus extends InsightConfig {

    constructor(id: string) {
        super(id, 2070,
            `Failed to cast {felshieldEmitter} at least 6 times before the first General Erodus phase.`,
            null, `
When ${MarkupHelper.Style("boss", "Chief Engineer Ishkar")} is active,
a player can enter his pod to gain {ability:244902:Felshield Emitter:physical}.
At least 6 of these must be cast during this phase,
because there will be 6 {ability:244625:Fusillade:fire}s that the raid needs {ability:244910:Felshield:fire}
for before the pod (and ability) is available again.`);
    }

    getProperties(context: InsightContext): any {
        let generalErodusEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "General Erodus")
            .map(x => <PhaseChangeEvent>x);

        if (generalErodusEvents.length == 0) {
            return null;
        }

        let felshieldEmitterEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Felshield Emitter" && x.config.eventType == "ability")
            .map(x => <AbilityEvent>x)
            .filter(x => x.timestamp < generalErodusEvents[0].timestamp);

        if (felshieldEmitterEvents.length >= 6) {
            return null;
        }

        return {
            felshieldEmitter: felshieldEmitterEvents.length > 0 ? MarkupHelper.AbilityWithIcon(felshieldEmitterEvents[0].ability) : MarkupHelper.AbilityWithTooltip2(244902, "Felshield Emitter", "physical")
        }
    }

}
