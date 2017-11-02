import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Hit } from "app/insights/configs/hit";
import { HitBySomeoneElse } from "app/insights/configs/hit-by-someone-else";
import { Debuff } from "app/insights/configs/debuff";
import { HitWithoutDebuff } from "app/insights/configs/hit-without-debuff";
import { DebuffUnlessRole } from "app/insights/configs/debuff-unless-role";
import { DebuffDuration } from "app/insights/configs/debuff-duration";

export module FelhoundsOfSargerasInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DebuffUnlessRole(2074, ["Smouldering", "Decay"], [251445, 245098], "Tank", null, null, `
The ${MarkupHelper.Style("boss", "Felhounds")} will regularly cast {ability:251445:Smouldering:fire} / {ability:245098:Decay:shadow},
which deal damage and apply a debuff to all players stood in front of them.
Only tanks need to get hit by this, so players should be sure not to stand in front of either boss.`),

            new HitWithoutDebuff(2074, ["Desolate Path"], [244767], ["Desolate Gaze"], [244768], 10000,
                "Failed to dodge {damageAbilties} {totalHits} time{plural}.", null, `
At 33 energy, ${MarkupHelper.Style("boss", "F'Harg")} will target several players with {ability:244768:Desolate Gaze:physical}.
6 seconds later, ${MarkupHelper.Style("boss", "F'Harg")} will cast {ability:244767:Desolate Path:fire},
causing a manifestation of flame to charge through the targeted players
and deal damage to anyone caught in its path.
Targeted players should move out of the raid, trying to make it easier for other players to dodge this mechanic.
This insight shows the hits to players that were not affected by the {ability:244768:Desolate Gaze:physical} debuff.`),

            new Hit(2074, ["Molten Flare"], [244163], null, null, `
At 66 energy, ${MarkupHelper.Style("boss", "F'Harg")} targets several players with {ability:244072:Molten Touch:fire},
stunning and damaging them.
The targeted player will send flame missiles towards other players,
which those players need to dodge to avoid unnecessary damage.
If the raid is grouped up when this happens, it is useful to move as a group.`),

            new Hit(2074, ["Consuming Sphere"], [254403], null, null, `
At 33 energy, ${MarkupHelper.Style("boss", "Shatug")} spawns a {ability:254403:Consuming Sphere:shadow},
will pulls the raid towards its location.
Players need to run away from the sphere to avoid hitting it,
which deals damage and applies a debuff that increases the damage taken from the sphere.`),

            new Debuff(2074, ["Weight of Darkness (Fear)"], [244071],
                "Feared by {abilities} {totalHits} time{plural}.", null, `
At 66 energy, ${MarkupHelper.Style("boss", "Shatug")} targets players with {ability:254429:Weight of Darkness:shadow},
which progressively slows the target for 5 seconds.
When the debuff expires, targets within 8 yards are feared, unless there are at least 2 other players within 8 yards.
Counter this mechanic by ensuring every target has enough players stacked on them to prevent the fear.`),

            new DebuffDuration(2074, "Sargeras' Blessing", "Sargeras' Blessing (Removed)", null,
                "Had a total {ability} duration of {totalDuration}.", null, `
Whenever ${MarkupHelper.Style("boss", "F'Harg")} and ${MarkupHelper.Style("boss", "Shatug")} are within 40 yards of one another,
they gain {ability:246057:Sargeras' Blessing:shadow},
which massively increases their damage done.
Prevent them from gaining this debuff by tanking them at least 40 yards apart.
Ranged players can stay between the two bosses, so that everything is within their range.`)
        ];
    }

}
