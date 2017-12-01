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

export module AggramarInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      // Taeshalach's Reach 245990 stacks too high
      // Flame Rend 244033 non-tank ability target
      new DebuffUnlessRole(2063, ["Taeshalach's Reach"], [245990], "Tank"),
      new DebuffUnlessRole(2063, ["Foe Breaker"], [244291], "Tank"),
      new Debuff(2063, ["Burning Rage"], [244713], `${MarkupHelper.Style("boss", "Aggramar")} gained {abilities} {totalHits} time{plural}.`, "{abilitiesAndTimestamps}"),
      new Debuff(2063, ["Wake of Flame"], [244736]),
      
      new Hit(2063, ["Flare"], [245391]),
      new Hit(2063, ["Empowered Flare"], [245392]),
      new Hit(2063, ["Meteor Swarm"], [244686]),
      
      new PhaseDuration(2063, "Intermission 1", "Had an {phase} duration of {averageDuration}.", ""),
      new PhaseDuration(2063, "Intermission 2", "Had an {phase} duration of {averageDuration}.", ""),
      new Hit(2063, ["Corrupt Aegis"], [254022]),
      new DebuffDuration(2063, "Catalyzing Presence", "Catalyzing Presence (Removed)", null, "Had a total {ability} duration of {totalDuration}."),
      new Debuff(2063, ["Molten Remnants"], [245916])
    ];
  }

}
