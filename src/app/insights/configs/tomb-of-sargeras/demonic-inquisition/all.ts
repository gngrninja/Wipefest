import { InsightConfig } from "app/insights/configs/insight-config";
import { Death } from "app/insights/configs/death";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Debuff } from "app/insights/configs/debuff";
import { StackThreshold } from "app/insights/configs/stack-threshold";
import { Hit } from "app/insights/configs/hit";
import { Spawn } from "app/insights/configs/spawn";

export module DemonicInquisitionInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DebuffDuration(2048, "Echoing Anguish", "Echoing Anguish (Removed)", 4500),
            new Debuff(2048, ["Unbearable Torment"], [233430]),
            new DebuffDuration(2048, "Soul Corruption", "Soul Corruption (Removed)", 20000,
                "Stayed inside for an average duration of {averageDuration}, with {totalFrequencyOverThreshold} times lasting longer than {threshold}."),
            new Spawn(2048, "Tormented Fragment"),
            new Hit(2048, ["Explosive Anguish"], [241524])
        ];
    }

}
