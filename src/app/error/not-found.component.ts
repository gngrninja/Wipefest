import { Component } from '@angular/core';

@Component({
  selector: 'not-found',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class NotFoundComponent {

    title = "Not Found :(";
    message = "Whatever you were looking for couldn't be found.";

}
