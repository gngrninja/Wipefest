import { InsightConfig } from "app/insights/configs/insight-config";
import { Death } from "app/insights/configs/death";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Debuff } from "app/insights/configs/debuff";
import { StackThreshold } from "app/insights/configs/stack-threshold";
import { Hit } from "app/insights/configs/hit";
import { Spawn } from "app/insights/configs/spawn";
import { Cast } from "app/insights/configs/cast";
import { HitHard } from "app/insights/configs/hit-hard";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { WeaponKilledFirst } from "app/insights/configs/antorus-the-burning-throne/garothi-worldbreaker/weapon-killed-first";

export module GarothiWorldbreakerInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            //Hit by Fel Bombardment
            //Hit by Decimation > 2m
            //Carnage casts
            //Big Eradication hits
            //Didn't soak Annihilation
            //Killed Annhilator/Decimator first

            new WeaponKilledFirst(),
            new Hit(2076, ["Fel Bombardment"], [244532]),
            new Hit(2076, ["Decimation > 2m"], [244449], "Failed to move out of {abilities} {totalHits} time{plural}."),
            new Cast(2076, ["Carnage"], [244106]),
            new HitHard(2076, ["Eradication"], [244969], 2500000)
        ];
    }

}
