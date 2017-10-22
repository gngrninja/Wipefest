import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";

export class WeaponKilledFirst extends InsightConfig {

    constructor() {
        super(2076,
            `Killed the {weapon} first.`,
            null, null);
    }

    getProperties(events: FightEvent[]): any {
        let phaseOnes = events.filter(x => x.config).filter(x => x.config.name == "Phase 1");
        if (phaseOnes.length < 2) {
            return null;
        }

        let weapon = events.filter(x => x.config).some(x => x.config.name == "Decimation" && x.timestamp > phaseOnes[1].timestamp)
            ? "Annihilator"
            : events.filter(x => x.config).some(x => x.config.name == "Annihilation" && x.timestamp > phaseOnes[1].timestamp)
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
