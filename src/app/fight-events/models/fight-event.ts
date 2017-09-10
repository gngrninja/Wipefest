import { Timestamp } from "app/helpers/timestamp-helper";
import { EventConfig } from "app/event-config/event-config";

export abstract class FightEvent {

    constructor(
        public config: EventConfig,
        public timestamp: number,
        public isFriendly: boolean,
        public childEvents: FightEvent[] = []) { }
    
    collapsed = true;
    get canCollapse(): boolean {
        return this.childEvents.length > 0 || this.details != null;
    }

    rowClass = "";
    get rowClasses(): string {
        return this.rowClass + ((this.config && this.config.style) ? ` ${this.config.style}` : '');
    }

    abstract get title(): string;
    get mediumTitle(): string { return this.title; };
    get shortTitle(): string { return this.title; };

    get tableTitle(): string {
        let isFriendly = this.isFriendly;
        this.isFriendly = true;
        let friendlyTitle = this.title;
        this.isFriendly = isFriendly;

        return friendlyTitle;
    }

    get minutesAndSeconds(): string {
        return Timestamp.ToMinutesAndSeconds(this.timestamp);
    }

    get details(): string {
        return null;
    }

    protected initials(input: string): string {
        return input.split(" ").map(w => w[0]).join("");
    }

    protected frequencyString(input: number): string {
        if (input <= 1) {
            return "";
        }
        return ` (${input})`;
    }

    isInstanceOf(classType: any): boolean {
        return this instanceof classType;
    }

}
