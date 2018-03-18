import { async, TestBed, inject } from "@angular/core/testing";
import { InsightService } from "./insight.service";
import { InsightContext } from "./models/insight-context";
import { TestDataService } from "../testing/test-data.service";

describe("InsightService", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TestDataService
            ]
        });
    }));

    it("should return insights",
        async(inject([TestDataService], (testDataService: TestDataService) => {
        const data = testDataService.get("xyMd2kwb3W9zNrJF-13");
        
        const context = new InsightContext(
            data.report,
            data.fightInfo,
            data.raid,
            data.events);

        const service = new InsightService();
        
        const insights = service.getInsights(data.fightInfo.boss, context);
        
        expect(insights).toEqual(data.insights);

        // TODO: Check that these insights line up with current live behaviour
    })));
});
