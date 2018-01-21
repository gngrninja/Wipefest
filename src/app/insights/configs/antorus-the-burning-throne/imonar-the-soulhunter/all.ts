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

export module ImonarTheSoulHunterInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new Hit("0", 2082, ["Infernal Rockets"], [248252]),

            // Shock Lance stacks too high
            new DebuffDuration("1", 2082, "Sleep Canister", "Sleep Canister (Removed)"),
            new Debuff("2", 2082, ["Slumber Gas"], [247565]),
            new Hit("3", 2082, ["Pulse Grenade"], [247388, 247681]),

            // Sever stacks too high
            new Debuff("4", 2082, ["Charged Blasts"], [247716], null, null, "This includes people targeted, who cannot avoid getting hit."),
            new Debuff("5", 2082, ["Shrapnel Blast"], [247932]),

            //new HitWithoutDebuff("6", 2082, ["Empowered Pulse Grenade"], [250007], ["Empowered Pulse Grenade"], [250006], 600000),
            new Debuff("7", 2082, ["Empowered Shrapnel Blast"], [248094]),

            new PhaseDuration("8", 2082, "Transition 1", "Had a {phase} duration of {averageDuration}.", ""),
            new PhaseDuration("9", 2082, "Transition 2", "Had a {phase} duration of {averageDuration}.", ""),
            new PhaseDuration("A", 2082, "Transition 3", "Had a {phase} duration of {averageDuration}.", ""),
            new PhaseDuration("B", 2082, "Transition 4", "Had a {phase} duration of {averageDuration}.", ""),
            new Hit("C", 2082, ["Seared Skin"], [254181]),
            new Debuff("D", 2082, ["Stasis Trap"], [247641]),
            new Hit("E", 2082, ["Blastwire"], [247962], null, "{timestamps}", null)
        ];
    }

}
