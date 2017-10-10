import { InsightConfig } from "app/insights/configs/insight-config";
import { Echoes } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/echoes";
import { UnstableSoulFullExpirationExplosion } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-full-expiration-explosion";
import { UnstableSoulEarlyExpirationExplosion } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/unstable-soul-early-expiration-explosion";
import { CreatorsGrace } from "app/insights/configs/tomb-of-sargeras/maiden-of-vigilance/creators-grace";

export module MaidenOfVigilanceInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new Echoes(),
            new UnstableSoulFullExpirationExplosion(),
            new UnstableSoulEarlyExpirationExplosion(),
            new CreatorsGrace()
        ];
    }

}
