import { InsightConfig } from "../../insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Hit } from "../../hit";
import { HitBySomeoneElse } from "../../hit-by-someone-else";
import { Debuff } from "../../debuff";
import { HitWithoutDebuff } from "../../hit-without-debuff";
import { DebuffUnlessRole } from "../../debuff-unless-role";
import { DebuffDuration } from "../../debuff-duration";
import { Interrupt } from "../../interrupt";
import { HitUnlessRole } from "../../hit-unless-role";
import { StackThreshold } from "../../stack-threshold";
import { PhaseDuration } from "../../phase-duration";
import { Soak } from "../../soak";

export module KingarothInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DebuffUnlessRole("0", 2088, ["Forging Strike"], [254919], "Tank"),
            // Forging Strike > 1 stack

            new Hit("1", 2088, ["Flame Reverberation"], [244328]),
            new Hit("2", 2088, ["Ruiner"], [246840]),
            new Hit("3", 2088, ["Apocalypse Blast"], [246634]),

            new Soak("4", 2088, ["Annihilation"], [246664]),
            new Hit("5", 2088, ["Annihilation Blast"], [246666], null, "{timestamps}"),
            new Soak("6", 2088, ["Demolish"], [246706]),
            new HitWithoutDebuff("7", 2088, ["Decimation > 2m"], [246690], ["Decimation"], [246687], 7000)
        ];
    }

}
