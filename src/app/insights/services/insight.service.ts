import { Injectable } from '@angular/core';
import { Insight } from "app/insights/models/insight";
import { AvoidableDamageInsight } from "app/insights/models/avoidable-damage-insight";
import { FightEvent } from "app/fight-events/models/fight-event";
import { InsightConfig, AvoidableDamageInsightConfig } from "app/insights/models/insight-config";
import { DamageEvent } from "app/fight-events/models/damage-event";

@Injectable()
export class InsightService {

    getInsight(config: InsightConfig, events: FightEvent[]): Insight {
        switch (config.type) {
            case "avoidableDamage":
                return this.getAvoidableDamageInsight(<AvoidableDamageInsightConfig>config, events);
            default: {
                throw new Error(`'${config.type}' is an unsupported insight type`);
            }
        }
    }

    private getAvoidableDamageInsight(config: AvoidableDamageInsightConfig, events: FightEvent[]): AvoidableDamageInsight {

        let damageEvents = events
            .filter(x => x.config)
            .filter(x => x.config.name == config.eventConfigName && x.config.eventType == "damage")
            .map(x => <DamageEvent>x);

        if (damageEvents.length == 0) {
            return null;
        }
        
        let players = damageEvents.map(x => x.target).filter((x, index, array) => array.indexOf(x) == index);
        let playersAndHits = players.map(player => <any>{ player: player, hits: damageEvents.filter(x => x.target == player).length });

        return new AvoidableDamageInsight(damageEvents[0].ability, playersAndHits);
    }

}
