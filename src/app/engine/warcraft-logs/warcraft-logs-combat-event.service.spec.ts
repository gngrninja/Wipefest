import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsCombatEventService } from "./warcraft-logs-combat-event.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { EventConfigService } from "../event-configs/event-config-service";
import { EncountersService } from "../encounters/encounters.service";
import { SpecializationsService } from "../specializations/specializations.service";
import { TestDataService } from "../testing/test-data.service";

describe("WarcraftLogsCombatEventService", () => {
    const url = "https://www.warcraftlogs.com/v1/";
    const apiKey = "4755ffa6214768b13beab7deb1bfc85f";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                TestDataService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
    }));

    it("should return combat events", async(inject([TestDataService, XHRBackend, Http], (testDataService: TestDataService, mockBackend: MockBackend, http) => {
        const data = testDataService.get("xyMd2kwb3W9zNrJF-13");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf("report/events/" + data.report.id
                + "?api_key=" + apiKey
                + "&start=" + data.fightInfo.start_time
                + "&end=" + data.fightInfo.end_time) !== -1) {
                body = data.combatEventPages[0];
            } else if (connection.request.url.indexOf("report/events/" + data.report.id
                + "?api_key=" + apiKey
                + "&start=" + data.combatEventPages[0].nextPageTimestamp
                + "&end=" + data.fightInfo.end_time) !== -1) {
                body = data.combatEventPages[1];
            } else if (connection.request.url.indexOf("report/events/" + data.report.id
                + "?api_key=" + apiKey
                + "&start=" + data.combatEventPages[1].nextPageTimestamp
                + "&end=" + data.fightInfo.end_time) !== -1) {
                body = data.combatEventPages[2];
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const encountersService = new EncountersService();
        const specializationsService = new SpecializationsService();
        const eventConfigService = new EventConfigService(encountersService, specializationsService, http);
        const combatEventService = new WarcraftLogsCombatEventService(eventConfigService, http, url, apiKey);
        
        combatEventService.getCombatEvents(data.report, data.fightInfo, data.eventConfigs).subscribe(combatEvents => {
            expect(combatEvents).toEqual(data.combatEvents);
        });
    })));
});
