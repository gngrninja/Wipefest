import { InsightConfig } from "app/insights/configs/insight-config";
import { DeliciousBufferfish } from "app/insights/configs/tomb-of-sargeras/mistress-sasszine/delicious-bufferfish";
import { ConsumingHunger } from "app/insights/configs/tomb-of-sargeras/mistress-sasszine/consuming-hunger";
import { SlicingTornado } from "app/insights/configs/tomb-of-sargeras/mistress-sasszine/slicing-tornado";

export module MistressSasszineInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DeliciousBufferfish(),
            new ConsumingHunger(),
            new SlicingTornado()
        ];
    }

}
