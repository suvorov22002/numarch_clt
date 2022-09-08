import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-document-viewer',
  templateUrl: './document-viewer.component.html',
  styleUrls: ['./document-viewer.component.css']
})
export class DocumentViewerComponent implements OnInit {

  @Input('imageCollection')
  imageCollection;


/*
  imgCollection1: Array<object> = [
    {
      image: 'assets/image2s/image004.jpg',
      thumbImage: 'assets/images/image004.jpg',
      title: '',
      alt: 'Image 5'
    },
    {
      image: 'assets/image2s/image004.jpg',
      thumbImage: '../../../Docs/images/REPORT.png',
      title: 'Image 2',
      alt: 'Image 2'
    }
  ];
  imgCollection: Array<object> = [
    {
      image: 'https://loremflickr.com/g/600/400/paris',
      thumbImage: 'https://loremflickr.com/g/1200/800/paris',
      alt: 'Image 1',
      title: 'Image 1'
    }, {
      image: 'assets/images/image058.jpg',
      thumbImage: 'assets/images/image058.jpg',
      title: 'Image 2',
      alt: 'Image 2'
    }, {
      image: 'assets/images/image044.jpg',
      thumbImage: 'assets/images/image044.jpg',
      title: 'Image 3',
      alt: 'Image 3'
    }, {
      image: 'assets/images/image023.jpg',
      thumbImage: 'assets/images/image023.jpg',
      title: 'Image 4',
      alt: 'Image 4'
    }, {
      image: 'assets/images/image004.jpg',
      thumbImage: 'assets/images/image004.jpg',
      title: 'Image 5',
      alt: 'Image 5'
    }, {
      image: 'assets/images/image000.jpg',
      thumbImage: 'assets/images/image000.jpg',
      title: 'Image 6',
      alt: 'Image 6'
    }
  ];
*/
  constructor() {
    console.log("this.imgCollection: "+this.imageCollection);
   }

  ngOnInit() {
    //console.log("this.imgCollection: "+this.imageCollection);
  }

}
