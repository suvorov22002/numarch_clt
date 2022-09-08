import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-property',
  templateUrl: './document-property.component.html',
  styleUrls: ['./document-property.component.css']
})
export class DocumentPropertyComponent implements OnInit {

  types = [
    {label: 'TEXT', value: 'TEXT'},
    {label: 'DATE', value: 'DATE'},
    {label: 'CONTENT', value: 'CONTENT'},
    {label: 'NUMBER', value: 'NUMBER'},
    {label: 'COMBOBOX', value: 'COMBOBOX'}
  ];

  obj:any;

  constructor() { }

  ngOnInit() {
    this.obj = {};
    this.obj.type = null;
  }

}
