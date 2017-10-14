import { InsightConfig } from "app/insights/configs/insight-config";
import { Death } from "app/insights/configs/death";
import { DebuffDuration } from "app/insights/configs/debuff-duration";
import { Debuff } from "app/insights/configs/debuff";
import { StackThreshold } from "app/insights/configs/stack-threshold";
import { Hit } from "app/insights/configs/hit";

export module GorothInsightConfigs {

    export function All(): InsightConfig[] {
        return [
            new Debuff(2032, ["Infernal Burning"], [233062]),
            new StackThreshold(2032, ["Burning Armor (2)"], [231363], 2),
            new Hit(2032, ["Infernal Spike"], [233021]),
            new Hit(2032, ["Fel Pool"], [230348]),
            new Hit(2032, ["Infernal Detonation"], [233900], null, "{timestamps}")
        ];
    }

}
