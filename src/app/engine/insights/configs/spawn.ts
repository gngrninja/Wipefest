import { InsightConfig } from "../configs/insight-config";
import { SpawnEvent } from "app/fight-events/models/spawn-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "../models/insight-context";

export class Spawn extends InsightConfig {

    constructor(
        id: string,
        boss: number,
        private eventConfigName: string,
        insightTemplate: string = null,
        detailsTemplate: string = null,
        tipTemplate: string = null) {

        super(id, boss, insightTemplate, detailsTemplate, tipTemplate);

        if (insightTemplate == null) this.insightTemplate = "{totalSpawns} {spawn}{plural} spawned.";
        if (detailsTemplate == null) this.detailsTemplate = "{timestamps}";
    }

    getProperties(context: InsightContext): any {
        let spawnEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == this.eventConfigName && x.config.eventType == "spawn")
            .map(x => <SpawnEvent>x);

        if (spawnEvents.length == 0) {
            return null;
        }

        let timestamps = spawnEvents.map(x => x.timestamp);
        let totalSpawns = spawnEvents.length;
        
        return {
            spawn: MarkupHelper.Style("npc", this.eventConfigName),
            totalSpawns: MarkupHelper.Info(totalSpawns),
            plural: this.getPlural(totalSpawns),
            timestamps: MarkupHelper.Timestamps(timestamps)
        }
    }

}
