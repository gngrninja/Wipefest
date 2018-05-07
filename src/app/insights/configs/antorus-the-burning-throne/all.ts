import { AggramarInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/aggramar/all';
import { AntoranHighCommandInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/antoran-high-command/all';
import { ArgusTheUnmakerInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/argus-the-unmaker/all';
import { FelhoundsOfSargerasInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/felhounds-of-sargeras/all';
import { GarothiWorldbreakerInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/garothi-worldbreaker/all';
import { ImonarTheSoulHunterInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/imonar-the-soulhunter/all';
import { KingarothInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/kingaroth/all';
import { PortalKeeperHasabelInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/portal-keeper-hasabel/all';
import { TheCovenOfShivarraInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/the-coven-of-shivarra/all';
import { TheDefenseOfEonarInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/the-defense-of-eonar/all';
import { VarimathrasInsightConfigs } from 'app/insights/configs/antorus-the-burning-throne/varimathras/all';
import { InsightConfig } from 'app/insights/configs/insight-config';

export namespace AntorusTheBurningThroneInsightConfigs {
  export function All(): InsightConfig[] {
    return [
      ...GarothiWorldbreakerInsightConfigs.All(),
      ...FelhoundsOfSargerasInsightConfigs.All(),
      ...AntoranHighCommandInsightConfigs.All(),
      ...PortalKeeperHasabelInsightConfigs.All(),
      ...TheDefenseOfEonarInsightConfigs.All(),
      ...ImonarTheSoulHunterInsightConfigs.All(),
      ...KingarothInsightConfigs.All(),
      ...VarimathrasInsightConfigs.All(),
      ...TheCovenOfShivarraInsightConfigs.All(),
      ...AggramarInsightConfigs.All(),
      ...ArgusTheUnmakerInsightConfigs.All()
    ];
  }
}
