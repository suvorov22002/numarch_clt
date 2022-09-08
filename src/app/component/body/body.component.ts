import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  page : boolean = true;

  constructor(private routeParams: ActivatedRoute) { }

  ngOnInit() {

    this.routeParams.queryParams.subscribe(params => {
        var res;
        console.log("params: ",JSON.stringify(params));
        res = params['qr']; // recuperation des roles du user dans l'url

        if (res.match('code') === null) {
          console.log("res: ",res);
          this.page = false;
        }
        else {
          console.log("res: ",res);
          this.page = true;
        }
        
     });

  }

}
