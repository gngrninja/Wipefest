import { InsightConfig } from "app/insights/configs/insight-config";
import { Echoes } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/echoes";
import { UnstableSoulFullExpirationExplosion } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-full-expiration-explosion";
import { UnstableSoulEarlyExpirationExplosion } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-early-expiration-explosion";
import { CreatorsGrace } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/creators-grace";
import { Orbs } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/orbs";
import { UnstableSoulGainsFromEchoes } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-gains-from-echoes";
import { UnnecessaryUnstableSoulGains } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unnecessary-unstable-soul-gains";
import { FellInHole } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/fell-in-hole";
import { TitanicBulwark } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/titanic-bulwark";

export module MaidenOfVigilanceInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new UnnecessaryUnstableSoulGains(),
            new Echoes(),
            new UnstableSoulGainsFromEchoes(),
            new UnstableSoulFullExpirationExplosion(),
            new UnstableSoulEarlyExpirationExplosion(),
            new Orbs(),
            new CreatorsGrace(),
            new FellInHole(),
            new TitanicBulwark()
        ];
    }

}
