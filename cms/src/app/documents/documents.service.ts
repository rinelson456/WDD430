import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Document } from './document.model';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {
  documents: Document[] = [];
  maxDocumentId: number;

  documentSelectedEvent = new EventEmitter<Document>();
  documentChangedEvent = new Subject<Document[]>();

  constructor(private http: HttpClient) { 
    this.maxDocumentId = this.getMaxId();
    this.getDocument();
  }

  getContacts(): Document[] {
    return this.documents.slice();
  }

  getContact(id: string): Document{
    for(let document of this.documents){
      if(document.id === id){
        return document;
      }
    }
    return null
  }

  getDocument(){
    this.http
      .get<Document[]>('http://localhost:3000/documents').subscribe(
        // success method
        (documents: Document[] ) => {
           this.documents = documents
           this.maxDocumentId = this.getMaxId()
           this.documentChangedEvent.next(this.documents.slice())
        },
        // error method
        (error: any) => {
           console.log(error)
        });
}

  getDocuments(index: number){
    return this.documents[index];
  }

  deleteDocument(document: Document) {

    if (!document) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === document.id);

    if (pos < 0) {
      return;
    }

    // delete from database
    this.http.delete('http://localhost:3000/documents/' + document.id)
      .subscribe(
        (response: Response) => {
          this.documents.splice(pos, 1);
        }
      );
  }

  getMaxId(): number {

    let maxId = 0

    for(let document of this.documents){
      let currentId = parseInt(document.id)
        if(currentId > maxId){
          maxId = currentId
        }
    }
    return maxId
  }
  addDocument(document: Document) {
    if (!document) {
      return;
    }

    // make sure id of the new Document is empty
    document.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, document: Document }>('http://localhost:3000/documents',
      document,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new document to documents
          this.documents.push(responseData.document);
        }
      );
  }

  updateDocument(originalDocument: Document, newDocument: Document) {
    if (!originalDocument || !newDocument) {
      return;
    }

    const pos = this.documents.findIndex(d => d.id === originalDocument.id);

    if (pos < 0) {
      return;
    }

    // set the id of the new Document to the id of the old Document
    newDocument.id = originalDocument.id;

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // update database
    this.http.put('http://localhost:3000/documents/' + originalDocument.id,
      newDocument, { headers: headers })
      .subscribe(
        (response: Response) => {
          this.documents[pos] = newDocument;
        }
      );
  }

  storeDocuments(){
    this.documentChangedEvent.next(this.documents.slice())
    const documents = JSON.stringify(this.documents.slice());

    const headers = new HttpHeaders();
    headers.set('Content-Type', 'application/json; charset=utf-8');
    this.http.put('https://wdd430cms.firebaseio.com/documents.json', documents, {headers: headers}).subscribe(
        () => {
          this.documentChangedEvent.next(this.documents.slice())
        }
    );
  }
}
