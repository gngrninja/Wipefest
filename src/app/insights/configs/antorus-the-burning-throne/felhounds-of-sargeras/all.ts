import { InsightConfig } from "app/insights/configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { Hit } from "app/insights/configs/hit";
import { HitBySomeoneElse } from "app/insights/configs/hit-by-someone-else";
import { Debuff } from "app/insights/configs/debuff";
import { HitWithoutDebuff } from "app/insights/configs/hit-without-debuff";
import { DebuffUnlessRole } from "app/insights/configs/debuff-unless-role";

export module FelhoundsOfSargerasInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new DebuffUnlessRole(2074, ["Smouldering", "Decay"], [251445, 245098], "Tank"),
            new HitWithoutDebuff(2074, ["Desolate Path"], [244767], ["Desolate Gaze"], [244768], 10000),
            new Hit(2074, ["Molten Flare"], [244163]),
            new Hit(2074, ["Consuming Sphere"], [254403]),
            new Debuff(2074, ["Weight of Darkness (Fear)"], [244071], "Feared by {abilities} {totalHits} time{plural}.")
        ];
    }

}
