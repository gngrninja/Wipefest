import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "app/insights/models/insight-context";

export class WeaponDestroyedFirst extends InsightConfig {

    constructor() {
        super(2076,
            `Destroyed the {weapon} first.`,
            null,`
${MarkupHelper.Info("Phase 2")} ends when players kill either the ${MarkupHelper.Style("npc", "Annihilator")} or ${MarkupHelper.Style("npc", "Decimator")}.
When one weapon is destroyed, the other weapon is empowered.`);
    }

    getProperties(context: InsightContext): any {
        let phaseOnes = context.events.filter(x => x.config).filter(x => x.config.name == "Phase 1");
        if (phaseOnes.length < 2) {
            return null;
        }

        let weapon = context.events.filter(x => x.config).some(x => x.config.name == "Decimation" && x.timestamp > phaseOnes[1].timestamp)
            ? "Annihilator"
            : context.events.filter(x => x.config).some(x => x.config.name == "Annihilation" && x.timestamp > phaseOnes[1].timestamp)
                ? "Decimator"
                : null;

        if (weapon == null) {
            return null;
        }

        return {
            weapon: MarkupHelper.Style("npc", weapon)
        };
    }

}