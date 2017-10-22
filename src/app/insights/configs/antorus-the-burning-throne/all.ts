import { InsightConfig } from "app/insights/configs/insight-config";
import { GarothiWorldbreakerInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/garothi-worldbreaker/all";

export module AntorusTheBurningThroneInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            ...GarothiWorldbreakerInsightConfigs.All()
        ];
    }

}
