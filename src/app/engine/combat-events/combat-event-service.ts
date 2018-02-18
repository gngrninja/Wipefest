import { Observable } from "rxjs/Observable";
import { CombatEvent } from "app/engine/combat-events/combat-event";
import { Report, FightInfo } from "app/engine/reports/report";
import { EventConfig } from "app/event-config/event-config";

export interface ICombatEventService {

    getCombatEvents(report: Report, fight: FightInfo, eventConfigs: EventConfig[]): Observable<CombatEvent[]>

}

