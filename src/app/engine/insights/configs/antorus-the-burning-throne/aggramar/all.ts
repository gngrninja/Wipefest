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

export module AggramarInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      // Taeshalach's Reach 245990 stacks too high
      // Flame Rend 244033 non-tank ability target
      new DebuffUnlessRole("0", 2063, ["Taeshalach's Reach"], [245990], "Tank"),
      new DebuffUnlessRole("1", 2063, ["Foe Breaker"], [244291], "Tank"),
      new Debuff("2", 2063, ["Burning Rage"], [244713], `${MarkupHelper.Style("boss", "Aggramar")} gained {abilities} {totalHits} time{plural}.`, "{abilitiesAndTimestamps}"),
      new Debuff("3", 2063, ["Wake of Flame"], [244736]),
      
      new Hit("4", 2063, ["Flare"], [245391]),
      new Hit("5", 2063, ["Empowered Flare"], [245392]),
      new Hit("6", 2063, ["Meteor Swarm"], [244686]),
      
      new PhaseDuration("7", 2063, "Intermission 1", "Had an {phase} duration of {averageDuration}.", ""),
      new PhaseDuration("8", 2063, "Intermission 2", "Had an {phase} duration of {averageDuration}.", ""),
      new Hit("9", 2063, ["Corrupt Aegis"], [254022]),
      new DebuffDuration("A", 2063, "Catalyzing Presence", "Catalyzing Presence (Removed)", null, "Had a total {ability} duration of {totalDuration}."),
      new Debuff("B", 2063, ["Molten Remnants"], [245916])
    ];
  }

}
