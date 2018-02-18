import { Report, FightInfo } from "app/engine/reports/report";
import { Fight } from "app/engine/fights/fight";
import { EventConfigService } from "app/engine/event-configs/event-config-service";
import { ICombatEventService } from "app/engine/combat-events/combat-event-service";
import { EventConfig } from "app/event-config/event-config";
import { Observable } from "rxjs/Observable";
import { FightEventService } from "app/engine/fight-events/fight-event.service";
import { IDeathService } from "app/engine/deaths/death.service";
import { Death } from "app/engine/deaths/death";
import { CombatEvent } from "app/engine/combat-events/combat-event";
import { SpecializationsService } from "app/engine/specializations/specializations.service";
import { RaidFactory } from "app/engine/raid/raid";
import { InsightService } from "app/engine/insights/insight.service";
import { InsightContext } from "app/engine/insights/insight-context";

export class FightService {

    constructor(
        private deathService: IDeathService,
        private combatEventService: ICombatEventService,
        private fightEventService: FightEventService,
        private specializationsService: SpecializationsService,
        private insightService: InsightService) { }

    getFight(report: Report, fightInfo: FightInfo, eventConfigs: EventConfig[]): Observable<Fight> {
        let deaths: Death[] = [];

        return this.deathService.getDeaths(report, fightInfo)
            .flatMap(x => {
                deaths = x;
                return this.combatEventService.getCombatEvents(report, fightInfo, eventConfigs);
            })
            .map(combatEvents => {
                let events = this.fightEventService.getEvents(report, fightInfo, eventConfigs, combatEvents, deaths);
                let raid = RaidFactory.Get(combatEvents.filter(x => x.type === 'combatantinfo'), report.friendlies, this.specializationsService);
                let insights = this.insightService.getInsights(fightInfo.boss, new InsightContext(report, fightInfo, raid, events));

                return new Fight(report, fightInfo, raid, eventConfigs, events, insights);
            });
    }

}

