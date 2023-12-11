import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { CustomTranslateService } from 'src/app/core/services/custom-translate.service';

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

  constructor(
    private router: Router,
    public transService: CustomTranslateService
  ) { }

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

  onLanguageChanged(event: Event) {
    this.onLanguage.emit(event);
  }
}