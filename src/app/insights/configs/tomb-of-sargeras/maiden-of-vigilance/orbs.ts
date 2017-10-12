import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { AbilityAndTimestamp } from "app/insights/models/ability-and-timestamp";
import { Debuff } from "app/insights/configs/debuff";

export class Orbs extends Debuff {

    constructor() {
        super(2052, ["Orbs"], [248801, 239069],
            "Failed to soak {totalHits} orb{plural}.",
            null,
            `Failing to soak orbs causes the raid to gain {ability:248801:Fragment Burst:fire},
which deals heavy raid damage and increases further damage from {ability:248801:Fragment Burst:fire} for 8 seconds.
Gaining this several times will often cause a wipe, so it's important to make sure that all orbs are soaked.
Because orbs of both infusions spawn on both sides of the boss,
raids usually aim to have melee/healers soaking near the boss,
with ranged damage dealers soaking the remaining orbs in assigned lanes behind the melee/healers.`);
    }

}
