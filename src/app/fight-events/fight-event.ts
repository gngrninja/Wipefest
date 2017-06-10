import { Timestamp } from "app/helpers/timestamp-helper";

export abstract class FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean) { }

    rowClass = "";

    abstract get title(): string;
    get mediumTitle(): string { return this.title; };
    get shortTitle(): string { return this.title; };

    get minutesAndSeconds(): string {
        return Timestamp.ToMinutesAndSeconds(this.timestamp);
    }

    protected initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }

    isInstanceOf(classType: any): boolean {
        return this instanceof classType;
    }

}