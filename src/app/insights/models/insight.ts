export class Insight {

    constructor(public id: string, public boss: number, private _title: string = "", private _details: string = "", private _tip: string = "") { }

    get title(): string {
        return this._title;
    }

    get details(): string {
        return this._details == null ? null : this._details.split("\r").join("").split("\n").join("") == "." ? null : this._details;
    }

    get tip(): string {
        return this._tip == null ? null : this._tip.split("\r").join("").split("\n").join("") == "." ? null : this._tip;
    }
}
