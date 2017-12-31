import { InsightConfig } from "app/insights/configs/insight-config";
import { GlaiveStorm } from "app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/glaive-storm";
import { AstralVulnerability } from "app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/astral-vulnerability";
import { TwilightGlaive } from "app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/twilight-glaive";
import { MoonBurn } from "app/insights/configs/tomb-of-sargeras/sisters-of-the-moon/moon-burn";

export module SistersOfTheMoonInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new TwilightGlaive("0"),
            new GlaiveStorm("1"),
            new AstralVulnerability("2"),
            new MoonBurn("3")
        ];
    }

}
