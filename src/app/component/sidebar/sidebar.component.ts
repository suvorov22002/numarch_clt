import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

//const fs=require('fs');
//const fs = require('fs').promises;
//const path = require('path');


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  
  fileName = '';
 
  toppings = new FormControl();
  toppingList: Array<any> = [];
  
  constructor() { }

  ngOnInit() {
    //this.loadFiles();
    this.toppingList = ['Nom client', 'Numero compte', 'Date', 'Lieu', 'Contenu', 'Objet'];
  }
}

/*
function getFilenames(path, extension) {
  return fs
      .readdirSync(path)
      .filter(
          item =>
              fs.statSync(Path.join(path, item)).isFile() &&
              (extension === undefined || Path.extname(item) === extension)
      )
      .sort();
}

/*
async function walk(dir) {
    let files = await fs.readdir(dir);
    files = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) return walk(filePath);
        else if(stats.isFile()) return filePath;
    }));

    return files.reduce((all, folderContents) => all.concat(folderContents), []);
}
*/