import { InsightConfig } from "../configs/insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { DeathEvent } from "app/fight-events/models/death-event";
import { Death } from "../configs/death";

export class DiedFromFalling extends Death {

    constructor(
        id: string,
        boss: number,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, [3], insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{totalFrequency} player{plural} fell to their death{plural}.";
    }

}
