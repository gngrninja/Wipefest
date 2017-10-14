import { InsightConfig } from "app/insights/configs/insight-config";
import { Death } from "app/insights/configs/death";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Debuff } from "app/insights/configs/debuff";

export module MistressSasszineInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DebuffDuration(2037, "Delicious Bufferfish", "Delicious Bufferfish (Removed)", 25000),
            new Death(2037, [239436]),
            new Death(2037, [232885]),
            new Death(2037, [232827]),
            new DebuffDuration(2037, "Consuming Hunger", "Consuming Hunger (Removed)", 30000),
            new DebuffDuration(2037, "Thundering Shock", "Thundering Shock (Removed)", 1500),
            new Debuff(2037, ["Slicing Tornado"], [232732])
        ];
    }

}
