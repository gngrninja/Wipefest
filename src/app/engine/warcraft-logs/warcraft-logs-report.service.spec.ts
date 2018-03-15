import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsReportService } from "./warcraft-logs-report.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

describe("WarcraftLogsReportService", () => {
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

    it("should return a report", async(inject([XHRBackend, Http], (mockBackend: MockBackend, http) => {
        const reportId = "fCMRaqD3nc6gVZX9";
        var expectedResponse = require("./warcraft-logs-report.service.spec.data.json");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf(`report/fights/${reportId}?api_key=${apiKey}`) !== -1) {
                body = expectedResponse;
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const service = new WarcraftLogsReportService(http, url, apiKey);

        service.getReport(reportId).subscribe(report => {
            expect(report).toEqual(expectedResponse);
        });
    })));
});
