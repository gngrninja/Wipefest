import { InsightConfig } from "app/insights/configs/insight-config";
import { GarothiWorldbreakerInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/garothi-worldbreaker/all";
import { FelhoundsOfSargerasInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/felhounds-of-sargeras/all";
import { AntoranHighCommandInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/antoran-high-command/all";
import { PortalKeeperHasabelInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/portal-keeper-hasabel/all";
import { TheDefenseOfEonarInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/the-defense-of-eonar/all";
import { ImonarTheSoulHunterInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/imonar-the-soulhunter/all";
import { KingarothInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/kingaroth/all";
import { VarimathrasInsightConfigs } from "app/insights/configs/antorus-the-burning-throne/varimathras/all";

export module AntorusTheBurningThroneInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            ...GarothiWorldbreakerInsightConfigs.All(),
            ...FelhoundsOfSargerasInsightConfigs.All(),
            ...AntoranHighCommandInsightConfigs.All(),
            ...PortalKeeperHasabelInsightConfigs.All(),
            ...TheDefenseOfEonarInsightConfigs.All(),
            ...ImonarTheSoulHunterInsightConfigs.All(),
            ...KingarothInsightConfigs.All(),
            ...VarimathrasInsightConfigs.All()
        ];
    }

}
