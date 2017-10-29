import { InsightConfig } from "app/insights/configs/insight-config";
import { GarothiWorldbreakerInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/garothi-worldbreaker/all";
import { FelhoundsOfSargerasInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/felhounds-of-sargeras/all";

export module AntorusTheBurningThroneInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            ...GarothiWorldbreakerInsightConfigs.All(),
            ...FelhoundsOfSargerasInsightConfigs.All()
        ];
    }

}
