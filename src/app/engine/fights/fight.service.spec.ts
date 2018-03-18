import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsCombatEventService } from "../warcraft-logs/warcraft-logs-combat-event.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { EventConfigService } from "../event-configs/event-config-service";
import { EncountersService } from "../encounters/encounters.service";
import { SpecializationsService } from "../specializations/specializations.service";
import { FightService } from "../fights/fight.service";
import { WarcraftLogsDeathService } from "../warcraft-logs/warcraft-logs-death.service";
import { FightEventService } from "../fight-events/fight-event.service";
import { InsightService } from "../insights/insight.service";
import { TestDataService } from "../testing/test-data.service";

describe("FightService", () => {
    const url = "URL";
    const apiKey = "WCL_API_KEY";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                TestDataService,
                { provide: XHRBackend, useClass: MockBackend }
            ]
        });
    }));

    it("should return a fight", async(inject([TestDataService, XHRBackend, Http], (testDataService: TestDataService, mockBackend: MockBackend, http) => {
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
            } else if (connection.request.url.indexOf(`report/tables/deaths/${data.report.id}?api_key=${apiKey}&start=${data.fightInfo.start_time}&end=${data.fightInfo.end_time}`) !== -1) {
                body = data.deaths;
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const encountersService = new EncountersService();
        const specializationsService = new SpecializationsService();
        const eventConfigService = new EventConfigService(encountersService, specializationsService, http);
        const deathService = new WarcraftLogsDeathService(http, url, apiKey);
        const combatEventService = new WarcraftLogsCombatEventService(eventConfigService, http, url, apiKey);
        const fightEventService = new FightEventService();
        const insightService = new InsightService();
        const fightService = new FightService(
            deathService,
            combatEventService,
            fightEventService,
            specializationsService,
            insightService);

        fightService.getFight(data.report, data.fightInfo, data.eventConfigs).subscribe(fight => {
            expect(fight.report).toEqual(data.report);
            expect(fight.info).toEqual(data.fightInfo);
            expect(fight.eventConfigs).toEqual(data.eventConfigs);
            expect(fight.raid).toEqual(data.raid);
            expect(fight.insights).toEqual(data.insights);

            // Convert to Objects to Jasmine doesn't worry about types not matching
            // (FightEvent != AbilityEvent etc)
            expect(JSON.parse(JSON.stringify(fight.events)))
                .toEqual(JSON.parse(JSON.stringify(data.events)));
        });
    })));
});
