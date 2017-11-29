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

export module KingarothInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      new DebuffUnlessRole(2088, ["Forging Strike"], [254919], "Tank"),
      // Forging Strike > 1 stack
      
      new Hit(2088, ["Flame Reverberation"], [244328]),
      new Hit(2088, ["Ruiner"], [246840]),
      new Hit(2088, ["Apocalypse Blast"], [246634]),

      new Soak(2088, ["Annihilation"], [246664]),
      new Hit(2088, ["Annihilation Blast"], [246666], null, "{timestamps}"),
      new Soak(2088, ["Demolish"], [246706]),
      new HitWithoutDebuff(2088, ["Decimation > 2m"], [246690], ["Decimation"], [246687], 7000)
    ];
  }

}
