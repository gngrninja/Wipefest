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
import { PodDuration } from "app/insights/configs/antorus-the-burning-throne/antoran-high-command/pod-duration";
import { FusilladeBeforeFelshield } from "app/insights/configs/antorus-the-burning-throne/antoran-high-command/fusillade-before-felshield";
import { LessThanSixEmittersBeforeErodus } from "app/insights/configs/antorus-the-burning-throne/antoran-high-command/less-than-six-emitters-before-erodus";

export module AntoranHighCommandInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new HitUnlessRole(2070, ["Exploit Weakness"], [244892], "Tank", null, null, `
Whichever boss is active will periodically cast {ability:244892:Exploit Weakness:physical},
which deals a high amount of physical damage and increases physical damage taken for 20 seconds.
Only tanks should get hit by this, and they should swap on the debuff.`),

            new Hit(2070, ["Entropic Mines"], [245121], null, null, `
While ${MarkupHelper.Style("boss", "Chief Engineer Ishkar")} is in his pod,
he will cast {ability:245161:Entropic Mine:physical}, spawning mines near players.
The raid should avoid these mines, moving around the room to safe areas if necessary.`),

            new Interrupt(2070, ["Pyroblast"], [246505], null, null, `
While ${MarkupHelper.Style("boss", "General Erodus")} is in his pod,
he will cast {ability:245546:Summon Reinforcements:physical}, spawning
${MarkupHelper.Style("npc", "Felblade Shocktrooper")}s and ${MarkupHelper.Style("npc", "Fanatical Pyromancer")}s.
${MarkupHelper.Style("npc", "Fanatical Pyromancer")}s cast {ability:246505:Pyroblast:fire},
which deals large single-target damage to a player if not interrupted.`),

            new PodDuration(),

            new Death(2070, [244172], null, null, `
When a player enters a pod, they gain {ability:244172:Psychic Assault:shadow},
which deals increasing ticking damage while they are inside.
Healers should do their best to keep pod players alive,
and pod players should watch their health, being sure to exit the pod before they die.`),

            new LessThanSixEmittersBeforeErodus(),

            new FusilladeBeforeFelshield()
        ];
    }

}
