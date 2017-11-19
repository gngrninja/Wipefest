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

export module PortalKeeperHasabelInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            // Average number of stacks when Reality Tear expires
            // Catastrophic Implosion casts (no one on platform)
            // If heroic: Don't get Caustic Slime debuff or Caustic Detonation damage
            // If heroic: Don't get Cloying Shadows debuff or Hungering Gloom damage

            new Hit(2064, ["Collapsing World > 3m"], [243984]),
            new Hit(2064, ["Felstorm Barrage"], [244001]),
            new Interrupt(2064, ["Fiery Detonation"], [244709]),
            new Interrupt(2064, ["Howling Shadows"], [245504]),

            new Interrupt(2064, ["Unstable Portal"], [255805]),

            new Interrupt(2064, ["Flames of Xoroth"], [244607]),
            new Hit(2064, ["Supernova"], [244601]),

            new DebuffDuration(2064, "Felsilk Wrap", "Felsilk Wrap (Removed)"),

            new DebuffDuration(2064, "Delusions", "Delusions (Removed)"),
            new DebuffDuration(2064, "Mind Fog", "Mind Fog (Removed)")
        ];
    }

}
