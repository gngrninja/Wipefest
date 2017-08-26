import { Component, OnInit, Input } from '@angular/core';
import { WipefestService } from "app/wipefest.service";
import { Response } from "@angular/http";

@Component({
    selector: 'error',
    template: `{{message}}`
})
export class ErrorComponent implements OnInit {

    @Input() error: Response;

    title = "Error :(";
    message = "An error has occurred.";
    
    ngOnInit() {
        if (this.error) {
            this.title = this.error.statusText;
            if (!this.title) {
                this.title = "Error";
            }
            this.title += " :(";

            switch (this.error.status) {
                case 503: this.message = "It looks like Warcraft Logs is unavailable. This could be due to heavy server load. Please try again later."; break;
                case 429: this.message = "Wipefest has exceeded the number of calls that Warcraft Logs will allow it to make. Please try again later."; break;
                case 404: this.message = "Whatever you were looking for couldn't be found."; break;
                case undefined: this.message = this.error.toString().replace("Error: ", ""); break;
                default: this.message = this.error.json().error; break;
            }

            if (!this.message) {
                this.message = "An error has occurred.";
            }
        }
    }

}
