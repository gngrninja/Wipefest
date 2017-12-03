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

export module ArgusTheUnmakerInsightConfigs {

  export function All(): InsightConfig[] {
    return [
      // Sweeping Scythe 248499 non-tank debuff
      // Sweeping Scythe 248499 stacks too high
      // Deadly Scythe 258039 non-tank debuff
      // Deadly Scythe 258039 stacks too high
      // Death Fog 248167 hits
      // Strength of the Sky 253903 debuff duration
      // Strength of the Sky 253903 max stacks per player
      // Strength of the Sea 253901 debuff duration
      // Strength of the Sea 253901 max stacks per player

      // Soulbomb 251570 target has Aggramar's Boon 255200 when Soulbomb Detonation 251571
      // Edge of Obliteration 251815 debuff

      // Cosmic Beacon 252616 interrupts
      // Starblast 253061 interrupts
      // Cosmic Ray 252707 damage except if Cosmic Ray 252729 debuff
      // Cosmic Power 255935 debuff on non-casting Constellar Desginates

      // End of All Things interrupt
      // Ember of Rage 257299 debuff
      // Ember of Rage 257299 debuff duration / debuff stacks?
      // Reorigination Module average lifespan
      // Reorigination Pulse 256396 deaths
      // Soul Detonation 256899 debuffs
      // Withering Roots 256399 max stack
    ];
  }

}
