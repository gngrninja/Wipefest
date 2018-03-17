import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsCombatEventService } from "./warcraft-logs-combat-event.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Report, FightInfo } from "../reports/report";
import { EventConfigService } from "../event-configs/event-config-service";
import { EncountersService } from "../encounters/encounters.service";
import { SpecializationsService } from "../specializations/specializations.service";
import { CombatEvent } from "../combat-events/combat-event";

describe("WarcraftLogsCombatEventService", () => {
    const url = "https://www.warcraftlogs.com/v1/";
    const apiKey = "4755ffa6214768b13beab7deb1bfc85f";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
    }));

    it("should return combat events", async(inject([XHRBackend, Http], (mockBackend: MockBackend, http) => {
        var report = {
            id: "xyMd2kwb3W9zNrJF"
        } as Report;
        var fightInfo = {
            id: 13,
            start_time: 2313891,
            end_time: 2724731
        } as FightInfo;

        var data = require("../testing/data/xyMd2kwb3W9zNrJF-13.json");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf("report/events/" + report.id
                + "?api_key=" + apiKey
                + "&start=" + fightInfo.start_time
                + "&end=" + fightInfo.end_time) !== -1) {
                body = data.combatEvents[0];
            } else if (connection.request.url.indexOf("report/events/" + report.id
                + "?api_key=" + apiKey
                + "&start=" + data.combatEvents[0].nextPageTimestamp
                + "&end=" + fightInfo.end_time) !== -1) {
                body = data.combatEvents[1];
            } else if (connection.request.url.indexOf("report/events/" + report.id
                + "?api_key=" + apiKey
                + "&start=" + data.combatEvents[1].nextPageTimestamp
                + "&end=" + fightInfo.end_time) !== -1) {
                body = data.combatEvents[2];
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const encountersService = new EncountersService();
        const specializationsService = new SpecializationsService();
        const eventConfigService = new EventConfigService(encountersService, specializationsService, http);
        const combatEventService = new WarcraftLogsCombatEventService(eventConfigService, http, url, apiKey);

        let page = 0;
        combatEventService.getCombatEvents(report, fightInfo, data.eventConfigs).subscribe(combatEvents => {
            page++;

            const expectedCombatEvents = [].concat.apply([],
                data.combatEvents.slice(0, page)
                .map(x => x.events)) as CombatEvent[];
            
            expect(combatEvents).toEqual(expectedCombatEvents);
        });
    })));
});
