export module Timestamp {

    export function ToMinutesAndSeconds(timestamp: number): string {
        let minutes = Math.floor(timestamp / 60000);
        let seconds = Math.floor(timestamp / 1000) - 60 * minutes;

        return minutes + ":" + ("00" + seconds).substring(seconds.toString().length);
    }

    export function ToDayAndMonth(timestamp: number): string {
        let date = new Date(timestamp);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return date.getUTCDate() + " " + months[date.getUTCMonth()];
    }

}