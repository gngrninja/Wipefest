import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Hit } from "app/insights/configs/hit";
import { HitBySomeoneElse } from "app/insights/configs/hit-by-someone-else";
import { Debuff } from "app/insights/configs/debuff";
import { HitWithoutDebuff } from "app/insights/configs/hit-without-debuff";
import { DebuffUnlessRole } from "app/insights/configs/debuff-unless-role";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Interrupt } from "app/insights/configs/interrupt";
import { HitUnlessRole } from "app/insights/configs/hit-unless-role";

export module TheDefenseOfEonarInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new Hit(2075, ["Rain of Fel"], [248329], null, null, "This insight also lists the targets of {ability:248329:Rain of Fel:fire}, who cannot avoid being hit."),
            new Hit(2075, ["Fel Wake"], [248795]),
            new HitUnlessRole(2075, ["Fel Swipe"], [250703], "Tank"),
            new Interrupt(2075, ["Artillery Strike"], [246305])
        ];
    }

}
