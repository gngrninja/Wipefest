import { Observable } from "rxjs/Observable";
import { Report, FightInfo } from "app/engine/reports/report";
import { Death } from "app/engine/deaths/death";

export interface IDeathService {

    getDeaths(report: Report, fight: FightInfo): Observable<Death[]>

}

