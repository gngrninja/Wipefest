import { InsightConfig } from "../../insight-config";
import { FightEvent } from "app/fight-events/models/fight-event";
import { MarkupHelper } from "app/helpers/markup-helper";
import { InsightContext } from "../../../models/insight-context";
import { DebuffEvent } from "app/fight-events/models/debuff-event";
import { DeathEvent } from "app/fight-events/models/death-event";
import { PlayerAndDuration } from "../../../models/player-and-duration";
import { Timestamp } from "app/helpers/timestamp-helper";
import { EndOfFightEvent } from "app/fight-events/models/end-of-fight-event";

export class PodDuration extends InsightConfig {

    constructor(id: string) {
        super(id, 2070,
            `Stayed inside each pod for a total of {totalDuration}, and an average of {averageDuration}.`,
            `{playersAndDurations}`, `
When a boss leaves their pod and joins the fight,
a player can jump in their pod to gain one of three special abilities (depending on which pod it is):
{ability:245103:Withering Fire:fire},
{ability:244902:Felshield Emitter:physical},
or {ability:245174:Summon Disruptor Beacon:shadow}.
The longer the player stays in the pod, the more they can help the raid with their special ability.
While the player is in the pod, they take increasing ticking damage from {ability:244172:Psychic Assault:shadow}.
A player can leave the pod at any time, and will be forced out if they die,
or if the current boss casts {ability:245227:Assume Command:physical}.`);
    }

    getProperties(context: InsightContext): any {
        if (context.fightInfo.difficulty == 3) {
            return null;
        }

        let enterPodEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Psychic Assault")
            .map(x => <DebuffEvent>x);

        if (enterPodEvents.length == 0) {
            return null;
        }

        let leavePodEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Psychic Scarring")
            .map(x => <DebuffEvent>x);

        let deathEvents = context.events
            .filter(x => x.config)
            .filter(x => x.config.name == "Deaths")
            .map(x => <DeathEvent>x);

        let playersAndDurations = enterPodEvents.map(enter => {
            let leavePodEvent: FightEvent =
                leavePodEvents.find(leave => leave.target.id == enter.target.id && leave.timestamp >= enter.timestamp) ||
                deathEvents.find(death => death.source.id == enter.target.id && death.timestamp >= enter.timestamp) ||
                context.events.find(x => x.config && x.config.eventType === "endOfFight");
            
            return new PlayerAndDuration(enter.target, leavePodEvent.timestamp - enter.timestamp);
        });

        let durations = playersAndDurations.map(x => x.duration);
        let totalDuration = durations.reduce((x, y) => x + y);
        let averageDuration = totalDuration / durations.length;

        return {
            playersAndDurations: MarkupHelper.PlayersAndDurations(playersAndDurations),
            totalDuration: MarkupHelper.Info(Timestamp.ToMinutesAndSeconds(totalDuration)),
            averageDuration: MarkupHelper.Info(Timestamp.ToSeconds(averageDuration))
        }
    }

}
