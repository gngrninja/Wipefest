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

            new HitUnlessRole("0", 2069, ["Shadow Strike"], [243960], "Tank"),
            new Debuff("4", 2069, ["Echoes of Doom"], [248732], null, `<p>{abilitiesAndTimestamps}</p>{playersAndFrequencies}`, `
On mythic difficulty, getting hit by {ability:243963:Alone in the Darkness:shadow}
will spawn a {npc:Shadow of Varimathras}.
This add will cast {ability:248732:Echoes of Doom:shadow},
debuffing a player with {ability:248732:Echoes of Doom:shadow},
which, when it expires, leaves a pool at the player's feet that deals shadow damage.
Because these pools deal shadow damage, they will trigger {ability:243961:Misery:shadow} if stepped in,
so need to be placed safely away from the raid.
Aim to kill all {npc:Shadow of Varimathras} adds before they can successfully cast {ability:248732:Echoes of Doom:shadow}.`),
            new MarkedPrey("1"),
            new Hit("2", 2069, ["Dark Fissure"], [244005]),
            new HitWithoutDebuff("3", 2069, ["Alone in the Darkness"], [243963], ["Necrotic Embrace"], [244094], 10000)
        ];
    }

}
