import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { Timestamp } from "app/helpers/timestamp-helper";
import { AbilityEvent } from "app/fight-events/models/ability-event";

export class FusilladeBeforeFelshield extends InsightConfig {

    constructor() {
        super(2070,
            `Failed to activate {felshield} before {fusillade} {total} time{plural}.`,
            `{timestamps}`, `
When {ability:244625:Fusillade:fire} is being cast,
the raid can mitigate half of the incoming damage by clicking on a ${MarkupHelper.Style("npc", "Felshield Emitter")}
spawned by a pod player.
This creates a {ability:244910:Felshield:fire} that the raid should stand in to survive the damage.`);
    }

    getProperties(context: InsightContext): any {
        let felshieldEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Felshield" && x.config.eventType == "debuff")
            .map(x => <DebuffEvent>x);

        let fusilladeEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Fusillade" && x.config.eventType == "ability")
            .map(x => <AbilityEvent>x);

        if (fusilladeEvents.length == 0) {
            return null;
        }

        let fusilladesWithoutFelshields = fusilladeEvents
            .filter(fusillade => !felshieldEvents.some(felshield => felshield.timestamp > fusillade.timestamp - 8000 && felshield.timestamp < fusillade.timestamp + 2000));

        if (fusilladesWithoutFelshields.length == 0) {
            return null;
        }

        let timestamps = fusilladesWithoutFelshields
            .map(x => x.timestamp);
        let total = fusilladesWithoutFelshields.length;
        let fusillade = fusilladeEvents[0].ability;

        return {
            timestamps: MarkupHelper.Timestamps(timestamps),
            total: MarkupHelper.Info(total),
            plural: this.getPlural(total),
            fusillade: MarkupHelper.AbilityWithIcon(fusillade),
            felshield: felshieldEvents.length > 0 ? MarkupHelper.AbilityWithIcon(felshieldEvents[0].ability) : MarkupHelper.AbilityWithTooltip2(244910, "Felshield", "fire")
        }
    }

}
