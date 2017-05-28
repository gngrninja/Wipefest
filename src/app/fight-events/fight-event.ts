export abstract class FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean) { }

    rowClass = "";

    abstract get title(): string;
    get mediumTitle(): string { return this.title; };
    get shortTitle(): string { return this.title; };

    get minutesAndSeconds(): string {
        let minutes = Math.floor(this.timestamp / 60000);
        let seconds = Math.floor(this.timestamp / 1000) - 60 * minutes;

        return minutes + ":" + ("00" + seconds).substring(seconds.toString().length);
    }

    protected initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }

    isInstanceOf(classType: any): boolean {
        return this instanceof classType;
    }

}