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
import { ParaxisTeams } from "./paraxis-teams";

export module TheDefenseOfEonarInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      new ParaxisTeams(),
      new HitWithoutDebuff(2075, ["Rain of Fel"], [248329], ["Rain of Fel"], [248332], 6000, null, null, `
{npc:The Paraxis} will target several people with {ability:248332:Rain of Fel:physical},
which fires missiles that land on those players 5 seconds later,
dealing damage to that player and all players within 8 yards.
Targeted players should move away to avoid allies being hit by unnecessary damage.`),
      new Hit(2075, ["Fel Wake"], [248795], `
Stood in {abilities} {totalHits} time{plural}.`, null, `
{npc:The Paraxis} will fire fel beams at the platforms, that burn a trail of green {ability:248795:Fel Wakes:fire}.
Players stood in these {ability:248795:Fel Wakes:fire} will take damage, so they should be avoided.`),
      new HitUnlessRole(2075, ["Fel Swipe"], [250703], "Tank", null, null, `
{npc:Fel-Powered Purifiers} will cast {ability:250703:Fel Swipe:fire},
which deals large damage to all players in front of them.
There is a 2 second cast time to {ability:250703:Fel Swipe:fire},
and non-tanks should ensure that they are not in front of the {npc:Fel-Powered Purifier}
when it swipes.`),
      new Interrupt(2075, ["Artillery Strike"], [246305], null, null, `
{npc:Fel-Infused Destructors} will cast {ability:246305:Artillery Strike:fire},
which deals damage to {npc:Eonar} (about 2% of her health on Heroic, and about 5% on Mythic).
These casts are interruptible, so should be interrupted to prevent {npc:Eonar} from dying.`)
    ];
  }

}
