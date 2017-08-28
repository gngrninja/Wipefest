import { Component, OnInit } from '@angular/core';
import { WipefestService, Page } from "app/wipefest.service";

@Component({
  selector: 'app-get-involved',
  templateUrl: './get-involved.component.html',
  styleUrls: ['./get-involved.component.scss']
})
export class GetInvolvedComponent implements OnInit {

  constructor(private wipefestService: WipefestService) { }

  ngOnInit() {
      this.wipefestService.selectPage(Page.GetInvolved);
  }

}
