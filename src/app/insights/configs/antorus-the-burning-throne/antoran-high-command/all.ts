import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Hit } from "app/insights/configs/hit";
import { HitBySomeoneElse } from "app/insights/configs/hit-by-someone-else";
import { Debuff } from "app/insights/configs/debuff";
import { HitWithoutDebuff } from "app/insights/configs/hit-without-debuff";
import { DebuffUnlessRole } from "app/insights/configs/debuff-unless-role";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Death } from "app/insights/configs/death";
import { HitUnlessRole } from "app/insights/configs/hit-unless-role";
import { Interrupt } from "app/insights/configs/interrupt";

export module AntoranHighCommandInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            // Average duration inside pod (remember to count death as leaving pod)
            // >= 6 Felshield Emitters before first General Exodus phase
            // Raid not gaining Felshield before Fusillade

            new Death(2070, [244172]),
            new HitUnlessRole(2070, ["Exploit Weakness"], [244892], "Tank"),
            new Hit(2070, ["Entropic Mines"], [245121]),
            new Interrupt(2070, ["Pyroblast"], [246505])
        ];
    }

}
