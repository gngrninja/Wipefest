export class Parse {

    difficulty: number;
    kill: number;
    name: string;
    partition: number;
    size: number;
    specs: ParseSpec[];

}

export class ParseSpec {

    class: string;
    spec: string;
    data: ParseSpecData[];

}

export class ParseSpecData {

    duration: number;
    percent: number;
    ilvl: number;
    report_code: string;
    report_fight: number;

}