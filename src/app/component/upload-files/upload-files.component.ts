import { HttpClient, HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UploadFilesService } from 'src/app/service/upload-files.service';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css'],
  providers: [UploadFilesService]
})
export class UploadFilesComponent implements OnInit {

  selectedFiles: FileList;
  progressInfos = [];
  message = '';

  fileInfos: Observable<any>;
  fileName = '';
 
  
  constructor(private uploadService: UploadFilesService, private http:HttpClient) { }

  ngOnInit() {
    this.fileInfos = this.uploadService.getFiles();
    this.fileInfos. 
    subscribe(
      event => {
        console.log(event);
      },
      err => {
        console.log(err);
      });
  }

  selectFiles(event) {
    console.log('onchange file: '+event);
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    console.log('onchange file: '+this.selectedFiles.length);

/*
    const file:File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();

            formData.append("thumbnail", file);

            const upload$ = this.http.post("/assets/documents/", formData);

            upload$.subscribe();}*/
  }

  uploadFiles() {
    this.message = '';
  
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.upload(i, this.selectedFiles[i]);
    }
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
  
    this.uploadService
   // .create(file)
    .upload(file)
    .subscribe(
      event => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(100 * event.loaded / event.total);
        } else if (event instanceof HttpResponse) {
          this.fileInfos = this.uploadService.getFiles();
        }
      },
      err => {
        this.progressInfos[idx].value = 0;
        this.message = 'Could not upload the file:' + file.name;
        console.log(err);
      });
  }

}
