import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/core/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent  implements OnInit {

  @Input() user:User | null=null;
  @Input() languages:string[] = ["es","en"];
  @Input() languageSelected:string = "es";
  @Output() onSignout: EventEmitter<void> = new EventEmitter<void>()
  @Output() onProfile: EventEmitter<void> = new EventEmitter<void>()
  @Output() onLanguage = new EventEmitter();

  constructor() { }

  ngOnInit() {}

  setLanguage(lang:string){
    this.languageSelected = lang;
    this.onLanguage.emit(lang);
  }

  toProfilePage(event: Event) {
    this.onProfile.emit()
  }

  logoutClick(event: Event) {
    this.onSignout.emit()
  }
}