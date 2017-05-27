export abstract class FightEvent {

    constructor(
        public timestamp: number,
        public isFriendly: boolean) { }

    abstract get title(): string;
    abstract get mediumTitle(): string;
    abstract get shortTitle(): string;

    get minutesAndSeconds(): string {
        let minutes = Math.floor(this.timestamp / 60000);
        let seconds = Math.floor(this.timestamp / 1000) - 60 * minutes;

        return minutes + ":" + ("00" + seconds).substring(seconds.toString().length);
    }

    isInstanceOf(classType: any): boolean {
        return this instanceof classType;
    }

}