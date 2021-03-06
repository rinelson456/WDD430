import { Component, OnInit } from '@angular/core';
import { Message } from '../message.model';
import { MessagesService } from '../messages.service';

@Component({
  selector: 'app-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [];


  constructor(private messageService: MessagesService) { }

  ngOnInit(): void {
    this.messageService.getMessages();
    this.messageService.messagesChanged.subscribe(
      (messages: Message[]) => {
        this.messages = messages;
      }
    )
  }

  onMessageAdded(message : Message){
    this.messages.push(message);
  }

}
