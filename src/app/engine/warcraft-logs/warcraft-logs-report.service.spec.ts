import { TestBed, async, inject } from "@angular/core/testing";
import { WarcraftLogsReportService } from "./warcraft-logs-report.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";
import { TestDataService } from "../testing/test-data.service";

describe("WarcraftLogsReportService", () => {
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

    it("should return a report", async(inject([TestDataService, XHRBackend, Http], (testDataService: TestDataService, mockBackend: MockBackend, http) => {
        const data = testDataService.get("xyMd2kwb3W9zNrJF-13");

        mockBackend.connections.subscribe((connection: MockConnection) => {
            let body = {};
            if (connection.request.url.indexOf(`report/fights/${data.report.id}?api_key=${apiKey}`) !== -1) {
                body = data.report;
            }

            connection.mockRespond(new Response(new ResponseOptions({
                body: body
            })));
        });

        const service = new WarcraftLogsReportService(http, url, apiKey);

        service.getReport(data.report.id).subscribe(report => {
            expect(report).toEqual(data.report);
        });
    })));
});
