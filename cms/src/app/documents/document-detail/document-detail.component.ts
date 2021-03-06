import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WindRefService } from 'src/app/wind-ref.service';
import { Document } from '../document.model';
import { DocumentsService } from '../documents.service';

@Component({
  selector: 'app-document-detail',
  templateUrl: './document-detail.component.html',
  styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
  document: Document;
  id: number;
  nativeWindow: any;

  constructor(private windowService: WindRefService, 
              private documentService: DocumentsService, 
              private route: ActivatedRoute, 
              private router: Router) {
                this.nativeWindow = this.windowService.getNativeWindow();
              }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params)=> {
      this.id = +params['id'];
      this.document = this.documentService.getDocuments(this.id);
      console.log(this.document)
    });
  }

  onEditDocument(){
    this.router.navigate(['edit'], {relativeTo: this.route});
  }

  onView(){
    console.log(this.document)
    if(this.document.url){
      this.nativeWindow.open(this.document.url)
    }
  }
  onDelete() {
    this.documentService.deleteDocument(this.document);
    this.router.navigate(['documents'], {relativeTo: this.route});
 }
}
