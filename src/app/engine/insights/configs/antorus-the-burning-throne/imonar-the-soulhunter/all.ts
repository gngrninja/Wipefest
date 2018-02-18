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
