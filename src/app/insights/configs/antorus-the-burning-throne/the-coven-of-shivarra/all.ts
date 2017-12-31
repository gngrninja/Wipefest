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
import { StackThreshold } from "app/insights/configs/stack-threshold";
import { PhaseDuration } from "app/insights/configs/phase-duration";
import { Soak } from "app/insights/configs/soak";

export module TheCovenOfShivarraInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            // Fiery Strike 244899 stacks too high
            // Flashfreeze 245518 stacks too high
            new DebuffUnlessRole("0", 2073, ["Fiery Strike"], [244899], "Tank"),
            new DebuffUnlessRole("1", 2073, ["Flashfreeze"], [244899], "Tank"),

            new Hit("2", 2073, ["Fury of Golganneth"], [246770]),
            new Hit("3", 2073, ["Spectral Army of Norgannon"], [245921]),
            new Hit("4", 2073, ["Flames of Khaz'goroth"], [245674]),

            new Hit("5", 2073, ["Shadow Blades"], [246374]),
            new Hit("6", 2073, ["Whirling Saber"], [245634]),
            new HitWithoutDebuff("7", 2073, ["Fulminating Burst"], [253588], ["Fulminating Pulse"], [253520], 15000),
            new Debuff("8", 2073, ["Chilled Blood (Frozen)"], [256356])
        ];
    }

}
