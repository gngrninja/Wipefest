import { async, inject, TestBed } from "@angular/core/testing";
import { SpecializationsService } from "../specializations/specializations.service";
import { RaidFactory } from "../raid/raid";
import { TestDataService } from "../testing/test-data.service";

describe("RaidFactory", () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [
                TestDataService
            ]
        });
    }));

    it("should return a raid",
        async(inject([TestDataService], (testDataService: TestDataService) => {
            const data = testDataService.get("xyMd2kwb3W9zNrJF-13");

            const specializationsService = new SpecializationsService();

            const raid = RaidFactory.Get(
                data.combatEvents.filter(x => x.type === "combatantinfo"),
                data.report.friendlies,
                specializationsService);

            expect(raid).toEqual(data.raid);

            // TODO: Check - is this supposed to return NPCs and Pets?
        })));
});
