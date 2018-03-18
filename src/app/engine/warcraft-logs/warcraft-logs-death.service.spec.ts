import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsDeathService } from "./warcraft-logs-death.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { TestDataService } from "../testing/test-data.service";

describe("WarcraftLogsDeathService", () => {
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

    it("should return deaths", async(inject([TestDataService, XHRBackend, Http], (testDataService: TestDataService, mockBackend: MockBackend, http) => {
        const data = testDataService.get("xyMd2kwb3W9zNrJF-13");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf(`report/tables/deaths/${data.report.id}?api_key=${apiKey}&start=${data.fightInfo.start_time}&end=${data.fightInfo.end_time}`) !== -1) {
                body = data.deaths;
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const service = new WarcraftLogsDeathService(http, url, apiKey);
        
        service.getDeaths(data.report, data.fightInfo).subscribe(deaths => {
            expect(deaths).toEqual(data.deaths.entries);
        });
    })));
});
