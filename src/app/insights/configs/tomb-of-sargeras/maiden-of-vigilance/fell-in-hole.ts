import { MarkupHelper } from "app/helpers/markup-helper";
import { DiedFromFalling } from "app/insights/configs/died-from-falling";

export class FellInHole extends DiedFromFalling {

    constructor() {
        super(2052,
            "{totalFrequency} player{plural} fell in the hole.",
            null,
            `Players must jump into the hole to gain {ability:241593:Aegwynn's Ward:physical},
which protects the raid from {ability:243276:Unstable Soul:fire} explosions.
However, if a player jumps too early, then the knockback from their explosion will not be enough to knock them out of the hole,
and they will fall to their death.`);
    }

}
