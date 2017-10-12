import { DebuffDuration } from "app/insights/configs/debuff-duration";

export class ConsumingHunger extends DebuffDuration {

    constructor() {
        super(2037, "Consuming Hunger", "Consuming Hunger (Removed)", 30000, null, null, null);
    }

}
