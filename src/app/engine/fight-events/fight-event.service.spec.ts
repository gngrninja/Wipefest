import { async, TestBed, inject } from "@angular/core/testing";
import { FightEventService } from "./fight-event.service";
import { TestDataService } from "../testing/test-data.service";

describe("FightEventService", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TestDataService
            ]
        });
    }));

    it("should return fight events", async(inject([TestDataService], (testDataService: TestDataService) => {
        const data = testDataService.get("xyMd2kwb3W9zNrJF-13");
        const service = new FightEventService();

        const events = service.getEvents(data.report, data.fightInfo, data.eventConfigs, data.combatEvents, data.deaths.entries);
        
        // Convert to Objects to Jasmine doesn't worry about types not matching
        // (FightEvent != AbilityEvent etc)
        const actual = JSON.parse(JSON.stringify(events));
        const expected = JSON.parse(JSON.stringify(data.events));

        expect(actual).toEqual(expected);

        // TODO: Check that these events line up with current live behaviour
    })));
});
