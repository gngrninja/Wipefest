import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsCombatEventService } from "../warcraft-logs/warcraft-logs-combat-event.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { FightInfo } from "../reports/report";
import { EventConfigService } from "../event-configs/event-config-service";
import { EncountersService } from "../encounters/encounters.service";
import { SpecializationsService } from "../specializations/specializations.service";
import { FightService } from "app/engine/fights/fight.service";
import { WarcraftLogsDeathService } from "app/engine/warcraft-logs/warcraft-logs-death.service";
import { FightEventService } from "app/engine/fight-events/fight-event.service";
import { InsightService } from "app/engine/insights/insight.service";

describe("FightService", () => {
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

    it("should return a fight", async(inject([XHRBackend, Http], (mockBackend: MockBackend, http) => {
        var data = require("../testing/data/xyMd2kwb3W9zNrJF-13.json");

        const report = data.report;
        report.id = "xyMd2kwb3W9zNrJF";
        var fightInfo = {
            id: 13,
            start_time: 2313891,
            end_time: 2724731
        } as FightInfo;
        
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
            } else if (connection.request.url.indexOf(`report/tables/deaths/${report.id}?api_key=${apiKey}&start=${fightInfo.start_time}&end=${fightInfo.end_time}`) !== -1) {
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

        const info = data.report.fights.find(x => x.id === fightInfo.id);
        fightService.getFight(report, info, data.eventConfigs).subscribe(fight => {
            // Re-parse so that Jasmine compares properly
            const actual = JSON.parse(JSON.stringify(fight));

            expect(actual.report).toEqual(report);
            expect(actual.info).toEqual(info);
            expect(actual.eventConfigs).toEqual(data.eventConfigs);
            expect(actual.events).toEqual(data.events.map(x => {
                // When parsing, eventConfigs filter stack gets set to 0 as default
                if (x.config && x.config.filter && !x.config.filter.stack)
                    x.config.filter.stack = 0;

                return x;
            }));
            expect(actual.raid).toEqual(data.raid);
            expect(actual.insights).toEqual(data.insights);
        });
    })));
});
