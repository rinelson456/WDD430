import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {
  messagesChanged = new EventEmitter<Message[]>();
  messages: Message[] = [];
  maxMessageId: number;

  constructor(private http: HttpClient) { 
    this.getMessages()
   }

   getMaxId(): number {

    let maxId = 0

    for(let message of this.messages){
      let currentId = parseInt(message.id)
        if(currentId > maxId){
          maxId = currentId
        }
    }
    return maxId
  }

  getMessage(id: string): Message[]{
    for(let message of this.messages){
      if(message.id === id){
        return message[id];
      }
    }
    return null
  }

  addMessage(message: Message){
    if (!message) {
      return;
    }

    // make sure id of the new Message is empty
    message.id = '';

    const headers = new HttpHeaders({'Content-Type': 'application/json'});

    // add to database
    this.http.post<{ message: string, messages: Message }>('http://localhost:3000/messages',
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // add new message to messages
          this.messages.push(responseData.messages);
        }
      );
  }

  getMessages(){
    this.http
      .get<Message[]>('https://wdd430cms.firebaseio.com/messages.json').subscribe(
        // success method
        (messages: Message[] ) => {
           this.messages = messages
           this.maxMessageId = this.getMaxId()
           console.log('here')
           this.messagesChanged.emit(this.messages.slice());
        },
        // error method
        (error: any) => {
           console.log(error)
        });
}

storeMessages(){
  const messages = JSON.stringify(this.messages.slice());

  const headers = new HttpHeaders();
  headers.set('Content-Type', 'application/json; charset=utf-8');
  this.http.put('https://wdd430cms.firebaseio.com/messages.json', messages, {headers: headers}).subscribe(
      () => {
        this.messagesChanged.emit(this.messages.slice());
      }
  );
}
}
