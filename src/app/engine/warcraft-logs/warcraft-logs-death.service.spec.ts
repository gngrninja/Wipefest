import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsDeathService } from "./warcraft-logs-death.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { Report, FightInfo } from "../reports/report";

describe("WarcraftLogsDeathService", () => {
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

    it("should return deaths", async(inject([XHRBackend, Http], (mockBackend: MockBackend, http) => {
        var report = {
            id: "xyMd2kwb3W9zNrJF"
        } as Report;
        var fightInfo = {
            id: 13,
            start_time: 2313891,
            end_time: 2724731
        } as FightInfo;

        var expectedResponse = require("./warcraft-logs-death.service.spec.data.json");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf(`report/tables/deaths/${report.id}?api_key=${apiKey}&start=${fightInfo.start_time}&end=${fightInfo.end_time}`) !== -1) {
                body = expectedResponse;
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const service = new WarcraftLogsDeathService(http, url, apiKey);
        
        service.getDeaths(report, fightInfo).subscribe(deaths => {
            expect(deaths).toEqual(expectedResponse.entries);
        });
    })));
});
