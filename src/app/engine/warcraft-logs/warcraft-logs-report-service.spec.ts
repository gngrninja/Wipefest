import { TestBed, async } from "@angular/core/testing";
import { WarcraftLogsReportService } from "./warcraft-logs-report.service";
import { Http, HttpModule, XHRBackend, Response, ResponseOptions } from "@angular/http";
import { MockBackend } from "@angular/http/testing";
import { inject } from "@angular/core/testing";

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

    it("should return a report", async(inject([XHRBackend, Http], (mockBackend, http) => {
        var reportJson =
            '{"fights":[{"id":1,"start_time":678063,"end_time":784143,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":8013,"fightPercentage":8013,"lastPhaseForPercentageDisplay":2,"name":"Aggramar"},{"id":2,"start_time":877695,"end_time":990960,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":8029,"fightPercentage":8029,"lastPhaseForPercentageDisplay":2,"name":"Aggramar"},{"id":3,"start_time":1202286,"end_time":1328872,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":7880,"fightPercentage":7880,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":4,"start_time":1421011,"end_time":1761754,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":3990,"fightPercentage":3990,"lastPhaseForPercentageDisplay":4,"name":"Aggramar"},{"id":5,"start_time":1986165,"end_time":2156296,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":6756,"fightPercentage":6756,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":6,"start_time":2253474,"end_time":2597756,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":3976,"fightPercentage":3976,"lastPhaseForPercentageDisplay":4,"name":"Aggramar"},{"id":7,"start_time":2711761,"end_time":3176130,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":1445,"fightPercentage":1445,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":8,"start_time":3278536,"end_time":3502752,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":5798,"fightPercentage":5798,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":9,"start_time":3579495,"end_time":3991106,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2186,"fightPercentage":2186,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":10,"start_time":4083910,"end_time":4431982,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":3996,"fightPercentage":3996,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":11,"start_time":4538097,"end_time":4867863,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":3991,"fightPercentage":3991,"lastPhaseForPercentageDisplay":4,"name":"Aggramar"},{"id":12,"start_time":4967919,"end_time":5366290,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":3223,"fightPercentage":3223,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":13,"start_time":5783333,"end_time":5969980,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":6593,"fightPercentage":6593,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":14,"start_time":6122054,"end_time":6283997,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":6964,"fightPercentage":6964,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":15,"start_time":6370952,"end_time":6750272,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2933,"fightPercentage":2933,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":16,"start_time":6865631,"end_time":7268784,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2576,"fightPercentage":2576,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":17,"start_time":7405170,"end_time":7584034,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":6557,"fightPercentage":6557,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":18,"start_time":7665391,"end_time":7845652,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":6600,"fightPercentage":6600,"lastPhaseForPercentageDisplay":3,"name":"Aggramar"},{"id":19,"start_time":7880081,"end_time":7882508,"boss":0,"name":"Aggramar"},{"id":20,"start_time":7977029,"end_time":8385580,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2151,"fightPercentage":2151,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":21,"start_time":8559757,"end_time":8949191,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2950,"fightPercentage":2950,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":22,"start_time":9043724,"end_time":9501393,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":1358,"fightPercentage":1358,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":23,"start_time":9627350,"end_time":10043494,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2578,"fightPercentage":2578,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":24,"start_time":10194352,"end_time":10298707,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":8012,"fightPercentage":8012,"lastPhaseForPercentageDisplay":2,"name":"Aggramar"},{"id":25,"start_time":10395075,"end_time":10917540,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":300,"fightPercentage":300,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"},{"id":26,"start_time":11011292,"end_time":11401979,"boss":2063,"size":20,"difficulty":5,"kill":false,"partial":3,"bossPercentage":2823,"fightPercentage":2823,"lastPhaseForPercentageDisplay":5,"name":"Aggramar"}],"lang":"en","friendlies":[{"name":"Raekón","id":21,"guid":84896926,"type":"Priest","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Arciryas","id":16,"guid":102329138,"type":"Monk","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Skirimus","id":7,"guid":101989879,"type":"DeathKnight","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Aelanu","id":3,"guid":86639338,"type":"Paladin","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Frankii","id":9,"guid":68759558,"type":"Shaman","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Aqui","id":14,"guid":100751522,"type":"Monk","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Evangeleena","id":1,"guid":104523564,"type":"Paladin","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Ohnefell","id":11,"guid":102461172,"type":"Druid","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Dissi","id":8,"guid":100999496,"type":"Warlock","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Raintide","id":17,"guid":101177199,"type":"Shaman","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Kakhaas","id":13,"guid":89916396,"type":"Monk","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Hati","id":90,"guid":106551,"type":"Pet","fights":[{"id":23,"instances":1}]},{"name":"Rustdari","id":10,"guid":94817358,"type":"DemonHunter","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Flucloxx","id":5,"guid":96021257,"type":"Druid","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Garrow","id":2,"guid":97493959,"type":"Warrior","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Heskeey","id":19,"guid":102448599,"type":"Hunter","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Yazíd","id":18,"guid":95096952,"type":"DemonHunter","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Xénubis","id":15,"guid":68005243,"type":"Paladin","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Petak","id":4,"guid":101172747,"type":"Monk","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Plannk","id":12,"guid":91648655,"type":"Warrior","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]},{"name":"Icecdeath","id":20,"guid":82175837,"type":"DeathKnight","fights":[{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6},{"id":7},{"id":8},{"id":9},{"id":10},{"id":11},{"id":12},{"id":13},{"id":14},{"id":15},{"id":16},{"id":17},{"id":18},{"id":19},{"id":20},{"id":21},{"id":22},{"id":23},{"id":24},{"id":25},{"id":26}]}],"enemies":[{"name":"Wake of Flame","id":82,"guid":122581,"type":"NPC","fights":[{"id":7,"instances":4,"groups":3},{"id":9,"instances":3,"groups":2},{"id":12,"instances":2,"groups":1},{"id":15,"instances":2,"groups":1},{"id":16,"instances":2,"groups":1},{"id":20,"instances":2,"groups":2},{"id":21,"instances":1,"groups":1},{"id":22,"instances":1,"groups":1},{"id":23,"instances":1,"groups":1},{"id":25,"instances":4,"groups":2},{"id":26,"instances":3,"groups":1}]},{"name":"Ember of Taeshalach","id":65,"guid":122532,"type":"NPC","fights":[{"id":1,"instances":10,"groups":1},{"id":2,"instances":10,"groups":1},{"id":3,"instances":10,"groups":1},{"id":4,"instances":20,"groups":2},{"id":5,"instances":10,"groups":1},{"id":6,"instances":20,"groups":2},{"id":7,"instances":28,"groups":2},{"id":8,"instances":10,"groups":1},{"id":9,"instances":26,"groups":2},{"id":10,"instances":20,"groups":2},{"id":11,"instances":20,"groups":2},{"id":12,"instances":23,"groups":2},{"id":13,"instances":10,"groups":1},{"id":14,"instances":10,"groups":1},{"id":15,"instances":23,"groups":2},{"id":16,"instances":23,"groups":2},{"id":17,"instances":10,"groups":1},{"id":18,"instances":10,"groups":1},{"id":20,"instances":26,"groups":2},{"id":21,"instances":23,"groups":2},{"id":22,"instances":26,"groups":2},{"id":23,"instances":26,"groups":2},{"id":24,"instances":10,"groups":1},{"id":25,"instances":29,"groups":2},{"id":26,"instances":23,"groups":2}]},{"name":"Aggramar","id":42,"guid":121975,"type":"Boss","lockBossFrame":true,"fights":[{"id":1,"instances":1},{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":1},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":1},{"id":8,"instances":1},{"id":9,"instances":1},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":19,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":22,"instances":1},{"id":23,"instances":1},{"id":24,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Flame of Taeshalach","id":64,"guid":121985,"type":"NPC","fights":[{"id":1,"instances":2,"groups":1},{"id":2,"instances":2,"groups":1},{"id":3,"instances":2,"groups":1},{"id":4,"instances":4,"groups":2},{"id":5,"instances":2,"groups":1},{"id":6,"instances":4,"groups":2},{"id":7,"instances":4,"groups":2},{"id":8,"instances":2,"groups":1},{"id":9,"instances":4,"groups":2},{"id":10,"instances":4,"groups":2},{"id":11,"instances":4,"groups":2},{"id":12,"instances":4,"groups":2},{"id":13,"instances":2,"groups":1},{"id":14,"instances":2,"groups":1},{"id":15,"instances":4,"groups":2},{"id":16,"instances":4,"groups":2},{"id":17,"instances":2,"groups":1},{"id":18,"instances":2,"groups":1},{"id":20,"instances":4,"groups":2},{"id":21,"instances":4,"groups":2},{"id":22,"instances":4,"groups":2},{"id":23,"instances":4,"groups":2},{"id":24,"instances":2,"groups":1},{"id":25,"instances":4,"groups":2},{"id":26,"instances":4,"groups":2}]}],"friendlyPets":[{"name":"Healing Tide Totem","id":66,"guid":59764,"type":"Pet","petOwner":17,"fights":[{"id":1,"instances":1},{"id":4,"instances":1},{"id":6,"instances":1},{"id":7,"instances":2},{"id":8,"instances":1},{"id":9,"instances":2},{"id":10,"instances":2},{"id":11,"instances":1},{"id":12,"instances":2},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":2},{"id":21,"instances":1},{"id":22,"instances":2},{"id":23,"instances":2},{"id":25,"instances":2},{"id":26,"instances":2}]},{"name":"Storm Totem","id":30,"guid":106317,"type":"Pet","petOwner":9,"fights":[{"id":4,"instances":5},{"id":5,"instances":2},{"id":6,"instances":6},{"id":7,"instances":8},{"id":8,"instances":3},{"id":9,"instances":5},{"id":10,"instances":4},{"id":11,"instances":6},{"id":12,"instances":6},{"id":13,"instances":2},{"id":14,"instances":2},{"id":15,"instances":9},{"id":16,"instances":5},{"id":17,"instances":2},{"id":18,"instances":2},{"id":20,"instances":7},{"id":21,"instances":9},{"id":22,"instances":10},{"id":25,"instances":7},{"id":26,"instances":8}]},{"name":"Fire Spirit","id":52,"guid":69791,"type":"Pet","petOwner":13,"fights":[{"id":1,"instances":5},{"id":2,"instances":3},{"id":3,"instances":5},{"id":4,"instances":10},{"id":5,"instances":8},{"id":6,"instances":12},{"id":7,"instances":15},{"id":8,"instances":8},{"id":9,"instances":16},{"id":10,"instances":13},{"id":11,"instances":11},{"id":12,"instances":14},{"id":13,"instances":5},{"id":14,"instances":8},{"id":15,"instances":14},{"id":16,"instances":13},{"id":17,"instances":8},{"id":18,"instances":8},{"id":20,"instances":14},{"id":21,"instances":14},{"id":22,"instances":14},{"id":23,"instances":14},{"id":24,"instances":5},{"id":25,"instances":18},{"id":26,"instances":14}]},{"name":"Serpent Ward","id":92,"guid":106378,"type":"Pet","petOwner":9,"fights":[{"id":25,"instances":1}]},{"name":"Sneaky Snake","id":55,"guid":121661,"type":"Pet","petOwner":19,"fights":[{"id":1,"instances":8},{"id":3,"instances":12},{"id":4,"instances":45},{"id":5,"instances":12},{"id":6,"instances":48},{"id":7,"instances":60},{"id":8,"instances":23},{"id":9,"instances":48},{"id":10,"instances":28},{"id":11,"instances":23},{"id":12,"instances":41},{"id":13,"instances":5},{"id":14,"instances":8},{"id":15,"instances":38},{"id":16,"instances":33},{"id":17,"instances":23},{"id":18,"instances":27},{"id":20,"instances":27},{"id":21,"instances":31},{"id":22,"instances":35},{"id":23,"instances":38},{"id":24,"instances":12},{"id":25,"instances":56},{"id":26,"instances":39}]},{"name":"Rune Weapon","id":45,"guid":27893,"type":"Pet","petOwner":7,"fights":[{"id":1,"instances":2},{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":4},{"id":5,"instances":2},{"id":6,"instances":4},{"id":7,"instances":4},{"id":8,"instances":2},{"id":9,"instances":4},{"id":10,"instances":2},{"id":11,"instances":2},{"id":12,"instances":2},{"id":13,"instances":2},{"id":14,"instances":2},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":2},{"id":18,"instances":2},{"id":20,"instances":2},{"id":21,"instances":2},{"id":22,"instances":2},{"id":23,"instances":2},{"id":24,"instances":2},{"id":25,"instances":2},{"id":26,"instances":2}]},{"name":"Greater Fire Elemental","id":41,"guid":95061,"type":"Pet","petOwner":9,"fights":[{"id":1,"instances":1},{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":2},{"id":5,"instances":1},{"id":6,"instances":2},{"id":7,"instances":2},{"id":8,"instances":1},{"id":9,"instances":2},{"id":10,"instances":2},{"id":11,"instances":2},{"id":12,"instances":2},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":2},{"id":21,"instances":2},{"id":22,"instances":2},{"id":23,"instances":2},{"id":24,"instances":1},{"id":25,"instances":2},{"id":26,"instances":2}]},{"name":"Demonic Gateway","id":35,"guid":59271,"type":"Pet","petOwner":8,"fights":[{"id":3,"instances":1},{"id":4,"instances":1},{"id":6,"instances":1},{"id":11,"instances":1},{"id":13,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":25,"instances":1}]},{"name":"Lightning Surge Totem","id":77,"guid":61245,"type":"Pet","petOwner":17,"fights":[{"id":4,"instances":2},{"id":5,"instances":1},{"id":6,"instances":2},{"id":7,"instances":4},{"id":8,"instances":2},{"id":9,"instances":3},{"id":10,"instances":2},{"id":11,"instances":2},{"id":12,"instances":2},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":2},{"id":21,"instances":3},{"id":22,"instances":3},{"id":23,"instances":2},{"id":25,"instances":4},{"id":26,"instances":2}]},{"name":"Earth Spirit","id":48,"guid":69792,"type":"Pet","petOwner":4,"fights":[{"id":1,"instances":6},{"id":2,"instances":4},{"id":3,"instances":6},{"id":4,"instances":7},{"id":5,"instances":7},{"id":6,"instances":11},{"id":7,"instances":17},{"id":8,"instances":9},{"id":9,"instances":15},{"id":10,"instances":12},{"id":11,"instances":12},{"id":12,"instances":15},{"id":13,"instances":7},{"id":14,"instances":7},{"id":15,"instances":13},{"id":16,"instances":12},{"id":17,"instances":7},{"id":18,"instances":7},{"id":20,"instances":15},{"id":21,"instances":13},{"id":22,"instances":16},{"id":23,"instances":13},{"id":24,"instances":6},{"id":25,"instances":17},{"id":26,"instances":13}]},{"name":"Earthbind Totem","id":74,"guid":2630,"type":"Pet","petOwner":17,"fights":[{"id":3,"instances":1},{"id":4,"instances":2},{"id":5,"instances":1},{"id":6,"instances":2},{"id":7,"instances":2},{"id":8,"instances":1},{"id":9,"instances":2},{"id":10,"instances":2},{"id":11,"instances":2},{"id":12,"instances":2},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":2},{"id":21,"instances":1},{"id":22,"instances":2},{"id":23,"instances":2},{"id":25,"instances":4},{"id":26,"instances":2}]},{"name":"Greater Lightning Elemental","id":59,"guid":97022,"type":"Pet","petOwner":9,"fights":[{"id":1,"instances":1},{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":5},{"id":5,"instances":3},{"id":6,"instances":5},{"id":7,"instances":5},{"id":8,"instances":3},{"id":9,"instances":6},{"id":10,"instances":5},{"id":11,"instances":5},{"id":12,"instances":5},{"id":13,"instances":2},{"id":14,"instances":2},{"id":15,"instances":5},{"id":16,"instances":6},{"id":17,"instances":3},{"id":18,"instances":3},{"id":20,"instances":4},{"id":21,"instances":5},{"id":22,"instances":6},{"id":23,"instances":6},{"id":24,"instances":2},{"id":25,"instances":6},{"id":26,"instances":5}]},{"name":"Docker","id":26,"guid":31631550,"type":"Pet","petOwner":19,"fights":[{"id":1,"instances":1},{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":1},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":1},{"id":8,"instances":1},{"id":9,"instances":1},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":22,"instances":1},{"id":23,"instances":1},{"id":24,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Void Tendril","id":63,"guid":98167,"type":"Pet","petOwner":21,"fights":[{"id":1,"instances":2},{"id":2,"instances":2},{"id":3,"instances":4},{"id":4,"instances":8},{"id":5,"instances":6},{"id":6,"instances":6},{"id":7,"instances":17},{"id":8,"instances":5},{"id":9,"instances":13},{"id":10,"instances":13},{"id":11,"instances":10},{"id":12,"instances":14},{"id":13,"instances":5},{"id":14,"instances":6},{"id":15,"instances":13},{"id":16,"instances":13},{"id":17,"instances":10},{"id":18,"instances":4},{"id":20,"instances":14},{"id":21,"instances":9},{"id":22,"instances":19},{"id":23,"instances":12},{"id":24,"instances":1},{"id":25,"instances":17},{"id":26,"instances":12}]},{"name":"Demonic Gateway","id":36,"guid":59262,"type":"Pet","petOwner":8,"fights":[{"id":4,"instances":1},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":1},{"id":8,"instances":1},{"id":9,"instances":1},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":22,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Chi-Ji","id":71,"guid":100868,"type":"Pet","petOwner":16,"fights":[{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":5},{"id":5,"instances":1},{"id":6,"instances":4},{"id":7,"instances":6},{"id":8,"instances":2},{"id":9,"instances":6},{"id":10,"instances":5},{"id":11,"instances":4},{"id":12,"instances":5},{"id":13,"instances":3},{"id":14,"instances":3},{"id":15,"instances":5},{"id":16,"instances":6},{"id":17,"instances":4},{"id":18,"instances":1},{"id":20,"instances":6},{"id":21,"instances":4},{"id":22,"instances":8},{"id":23,"instances":5},{"id":24,"instances":1},{"id":25,"instances":9},{"id":26,"instances":5}]},{"name":"Mindbender","id":61,"guid":62982,"type":"Pet","petOwner":21,"fights":[{"id":1,"instances":1},{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":5},{"id":5,"instances":3},{"id":6,"instances":5},{"id":7,"instances":6},{"id":8,"instances":3},{"id":9,"instances":6},{"id":10,"instances":5},{"id":11,"instances":5},{"id":12,"instances":6},{"id":13,"instances":3},{"id":14,"instances":2},{"id":15,"instances":6},{"id":16,"instances":6},{"id":17,"instances":3},{"id":18,"instances":3},{"id":20,"instances":6},{"id":21,"instances":5},{"id":22,"instances":6},{"id":23,"instances":5},{"id":24,"instances":1},{"id":25,"instances":7},{"id":26,"instances":5}]},{"name":"Efflorescence","id":67,"guid":47649,"type":"Pet","petOwner":5,"fights":[{"id":9,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Beast","id":46,"guid":128752,"type":"Pet","petOwner":19,"fights":[{"id":1,"instances":19},{"id":2,"instances":20},{"id":3,"instances":17},{"id":4,"instances":58},{"id":5,"instances":31},{"id":6,"instances":62},{"id":7,"instances":70},{"id":8,"instances":37},{"id":9,"instances":73},{"id":10,"instances":63},{"id":11,"instances":56},{"id":12,"instances":68},{"id":13,"instances":38},{"id":14,"instances":24},{"id":15,"instances":71},{"id":16,"instances":75},{"id":17,"instances":33},{"id":18,"instances":30},{"id":20,"instances":74},{"id":21,"instances":60},{"id":22,"instances":67},{"id":23,"instances":74},{"id":24,"instances":19},{"id":25,"instances":90},{"id":26,"instances":77}]},{"name":"Hati","id":27,"guid":106551,"type":"Pet","petOwner":19,"fights":[{"id":1,"instances":1},{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":1},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":1},{"id":8,"instances":1},{"id":9,"instances":1},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":22,"instances":2},{"id":23,"instances":1},{"id":24,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Healing Stream Totem","id":39,"guid":3527,"type":"Pet","petOwner":17,"fights":[{"id":1,"instances":3},{"id":2,"instances":4},{"id":3,"instances":5},{"id":4,"instances":9},{"id":5,"instances":6},{"id":6,"instances":12},{"id":7,"instances":14},{"id":8,"instances":7},{"id":9,"instances":14},{"id":10,"instances":12},{"id":11,"instances":11},{"id":12,"instances":13},{"id":13,"instances":4},{"id":14,"instances":6},{"id":15,"instances":13},{"id":16,"instances":11},{"id":17,"instances":6},{"id":18,"instances":4},{"id":20,"instances":14},{"id":21,"instances":13},{"id":22,"instances":15},{"id":23,"instances":14},{"id":24,"instances":2},{"id":25,"instances":18},{"id":26,"instances":10}]},{"name":"Earthen Shield Totem","id":58,"guid":100943,"type":"Pet","petOwner":17,"fights":[{"id":1,"instances":1},{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":5},{"id":5,"instances":3},{"id":6,"instances":5},{"id":7,"instances":6},{"id":8,"instances":3},{"id":9,"instances":6},{"id":10,"instances":4},{"id":11,"instances":5},{"id":12,"instances":4},{"id":13,"instances":2},{"id":14,"instances":2},{"id":15,"instances":5},{"id":16,"instances":5},{"id":17,"instances":2},{"id":18,"instances":3},{"id":20,"instances":5},{"id":21,"instances":5},{"id":22,"instances":5},{"id":23,"instances":5},{"id":24,"instances":2},{"id":25,"instances":6},{"id":26,"instances":4}]},{"name":"Lightning Surge Totem","id":79,"guid":61245,"type":"Pet","petOwner":9,"fights":[{"id":4,"instances":2},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":2},{"id":8,"instances":1},{"id":9,"instances":2},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":15,"instances":3},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":3},{"id":21,"instances":3},{"id":22,"instances":3},{"id":23,"instances":3},{"id":25,"instances":2},{"id":26,"instances":3}]},{"name":"Earthbind Totem","id":75,"guid":2630,"type":"Pet","petOwner":9,"fights":[{"id":3,"instances":1},{"id":4,"instances":1},{"id":10,"instances":2},{"id":11,"instances":1},{"id":15,"instances":1},{"id":16,"instances":3},{"id":20,"instances":2},{"id":21,"instances":1},{"id":22,"instances":4},{"id":23,"instances":2},{"id":25,"instances":1},{"id":26,"instances":2}]},{"name":"Spirit Link Totem","id":70,"guid":53006,"type":"Pet","petOwner":17,"fights":[{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":2},{"id":5,"instances":1},{"id":6,"instances":2},{"id":7,"instances":2},{"id":8,"instances":1},{"id":9,"instances":2},{"id":10,"instances":1},{"id":11,"instances":2},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":2},{"id":16,"instances":2},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":2},{"id":21,"instances":2},{"id":22,"instances":2},{"id":23,"instances":2},{"id":24,"instances":1},{"id":25,"instances":2},{"id":26,"instances":2}]},{"name":"Resonance Totem","id":29,"guid":102392,"type":"Pet","petOwner":9,"fights":[{"id":4,"instances":5},{"id":5,"instances":2},{"id":6,"instances":7},{"id":7,"instances":8},{"id":8,"instances":3},{"id":9,"instances":6},{"id":10,"instances":4},{"id":11,"instances":7},{"id":12,"instances":6},{"id":14,"instances":2},{"id":15,"instances":9},{"id":16,"instances":6},{"id":17,"instances":2},{"id":18,"instances":2},{"id":20,"instances":8},{"id":21,"instances":9},{"id":22,"instances":10},{"id":25,"instances":7},{"id":26,"instances":8}]},{"name":"Zhevzek","id":6,"guid":31210852,"type":"Pet","petOwner":8,"fights":[{"id":1,"instances":1},{"id":2,"instances":1},{"id":3,"instances":1},{"id":4,"instances":1},{"id":5,"instances":1},{"id":6,"instances":1},{"id":7,"instances":1},{"id":8,"instances":1},{"id":9,"instances":1},{"id":10,"instances":1},{"id":11,"instances":1},{"id":12,"instances":1},{"id":13,"instances":1},{"id":14,"instances":1},{"id":15,"instances":1},{"id":16,"instances":1},{"id":17,"instances":1},{"id":18,"instances":1},{"id":20,"instances":1},{"id":21,"instances":1},{"id":22,"instances":1},{"id":23,"instances":1},{"id":24,"instances":1},{"id":25,"instances":1},{"id":26,"instances":1}]},{"name":"Fire Spirit","id":50,"guid":69791,"type":"Pet","petOwner":4,"fights":[{"id":1,"instances":6},{"id":2,"instances":4},{"id":3,"instances":6},{"id":4,"instances":7},{"id":5,"instances":7},{"id":6,"instances":11},{"id":7,"instances":17},{"id":8,"instances":9},{"id":9,"instances":15},{"id":10,"instances":12},{"id":11,"instances":12},{"id":12,"instances":15},{"id":13,"instances":7},{"id":14,"instances":7},{"id":15,"instances":13},{"id":16,"instances":12},{"id":17,"instances":7},{"id":18,"instances":7},{"id":20,"instances":15},{"id":21,"instances":13},{"id":22,"instances":16},{"id":23,"instances":13},{"id":24,"instances":6},{"id":25,"instances":17},{"id":26,"instances":13}]},{"name":"Rune Weapon","id":43,"guid":27893,"type":"Pet","petOwner":20,"fights":[{"id":1,"instances":2},{"id":2,"instances":2},{"id":3,"instances":2},{"id":4,"instances":4},{"id":5,"instances":2},{"id":6,"instances":2},{"id":7,"instances":4},{"id":8,"instances":2},{"id":9,"instances":2},{"id":10,"instances":2},{"id":11,"instances":2},{"id":12,"instances":6},{"id":13,"instances":2},{"id":14,"instances":2},{"id":15,"instances":4},{"id":16,"instances":4},{"id":17,"instances":2},{"id":18,"instances":2},{"id":20,"instances":4},{"id":21,"instances":4},{"id":22,"instances":4},{"id":23,"instances":4},{"id":24,"instances":2},{"id":25,"instances":4},{"id":26,"instances":4}]},{"name":"Jeeves","id":83,"guid":35642,"type":"Pet","petOwner":2,"fights":[{"id":16,"instances":1}]},{"name":"Tailwind Totem","id":32,"guid":106321,"type":"Pet","petOwner":9,"fights":[{"id":4,"instances":5},{"id":5,"instances":2},{"id":7,"instances":8},{"id":9,"instances":5},{"id":10,"instances":3},{"id":11,"instances":6},{"id":12,"instances":6},{"id":14,"instances":1},{"id":15,"instances":9},{"id":16,"instances":5},{"id":17,"instances":2},{"id":18,"instances":1},{"id":20,"instances":7},{"id":21,"instances":9},{"id":22,"instances":10},{"id":25,"instances":7},{"id":26,"instances":8}]},{"name":"Earth Spirit","id":51,"guid":69792,"type":"Pet","petOwner":13,"fights":[{"id":1,"instances":5},{"id":2,"instances":3},{"id":3,"instances":5},{"id":4,"instances":10},{"id":5,"instances":8},{"id":6,"instances":12},{"id":7,"instances":15},{"id":8,"instances":8},{"id":9,"instances":16},{"id":10,"instances":13},{"id":11,"instances":11},{"id":12,"instances":14},{"id":13,"instances":5},{"id":14,"instances":8},{"id":15,"instances":14},{"id":16,"instances":13},{"id":17,"instances":8},{"id":18,"instances":8},{"id":20,"instances":14},{"id":21,"instances":14},{"id":22,"instances":14},{"id":23,"instances":14},{"id":24,"instances":5},{"id":25,"instances":18},{"id":26,"instances":14}]},{"name":"Ember Totem","id":31,"guid":106319,"type":"Pet","petOwner":9,"fights":[{"id":4,"instances":5},{"id":5,"instances":2},{"id":7,"instances":8},{"id":9,"instances":5},{"id":10,"instances":4},{"id":11,"instances":6},{"id":12,"instances":6},{"id":15,"instances":9},{"id":16,"instances":6},{"id":18,"instances":2},{"id":20,"instances":8},{"id":21,"instances":9},{"id":22,"instances":10},{"id":25,"instances":7},{"id":26,"instances":8}]}],"enemyPets":[],"phases":[{"boss":2063,"phases":["Stage One: Wrath of Aggramar","Intermission: Fires of Taeshalach","Stage Two: Champion of Sargeras","Intemission: Taeshalach\'s Rage","Stage Three: The Avenger"]}],"title":"Antorus Mythic","owner":"Fluclox","start":1520881405842,"end":1520892857908,"zone":17,"id":"fCMRaqD3nc6gVZX9"}';

        mockBackend.connections.subscribe((connection) => {
            connection.mockRespond(new Response(new ResponseOptions({
                body: reportJson
            })));
        });

        const service = new WarcraftLogsReportService(http, url, apiKey);

        service.getReport("fCMRaqD3nc6gVZX9").subscribe(report => {
            expect(JSON.stringify(report)).toBe(reportJson);
        });
    })));
});
