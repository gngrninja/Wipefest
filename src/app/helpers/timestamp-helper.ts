﻿export module Timestamp {

    export function ToMinutesAndSeconds(duration: number): string {
        let minutes = Math.floor(duration / 60000);
        let seconds = Math.floor(duration / 1000) - 60 * minutes;

        return minutes + ":" + ("00" + seconds).substring(seconds.toString().length);
    }

    export function ToDayAndMonth(timestamp: number): string {
        let date = new Date(timestamp);
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        return date.getUTCDate() + " " + months[date.getUTCMonth()];
    }

    export function ToDateTimeString(timestamp: number): string {
        let timezoneOffsetInMilliseconds = new Date().getTimezoneOffset() * 60 * 1000;
        let dateString = new Date(timestamp - timezoneOffsetInMilliseconds).toUTCString();

        let words = dateString.split(" ");
        words[0] = words[0].slice(0, -1); // Remove comma after day
        words.pop(); // Remove timezone
        words.splice(3, 1); // Remove year
        words[words.length - 1] = words[words.length - 1].slice(0, -3); // Remove seconds

        return words.join(" ");
    }

    export function ToTime(timestamp: number): string {
        let dateString = ToDateTimeString(timestamp);
        let words = dateString.split(" ");

        return words[words.length - 1];
    }

    export function ToHoursOrMinutes(duration: number): string {
        let hours = Math.floor(duration / 3600000);

        if (hours > 0) {
            return hours + " hour" + (hours > 1 ? "s" : "");
        }

        let minutes = Math.floor(duration / 60000) - 60 * hours;

        return minutes + " minute" + (minutes > 1 ? "s" : "");
    }

}