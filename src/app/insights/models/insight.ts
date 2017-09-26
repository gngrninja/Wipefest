export class Insight {

    constructor(private _title: string = "") { }

    get title(): string {
        return this._title;
    }
}
