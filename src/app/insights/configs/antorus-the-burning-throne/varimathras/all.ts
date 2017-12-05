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
import { MarkedPrey } from "app/insights/configs/antorus-the-burning-throne/varimathras/marked-prey";

export module VarimathrasInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      // Necrotic Embrace spreads

      new HitUnlessRole(2069, ["Shadow Strike"], [243960], "Tank"),
      new MarkedPrey(),
      new Hit(2069, ["Dark Fissure"], [244005]),
      new HitWithoutDebuff(2069, ["Alone in the Darkness"], [243963], ["Necrotic Embrace"], [244094], 10000)
    ];
  }

}
