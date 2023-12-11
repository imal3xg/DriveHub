import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, delay, of, tap } from 'rxjs';
import { User } from './core/interfaces/user';
import { AuthService } from './core/services/api/auth.service';
import { ApiService } from './core/services/api/api.service';
import { IonMenu } from '@ionic/angular';
import { CustomTranslateService } from './core/services/custom-translate.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

    protected _user = new BehaviorSubject<User | undefined>(undefined);
    public user$ = this._user.asObservable();
    lang: string = "es";
    public user: User | undefined;
    
  constructor(
    public authSvc: AuthService,
    private router: Router,
    private apiSvc: ApiService,
    public auth: AuthService,
    public translate: CustomTranslateService
  ) {
    this.translate.use(this.lang);
    this.authSvc.isLogged$.subscribe(logged => {
      if (logged) {
          // Si el usuario está autenticado, navega a home.
          this.authSvc.me().subscribe(data => {
              apiSvc.updateUser(data);
              this.router.navigate(['/home']);
          });
      }
      else
          // Si el usuario no está autenticado, navega a welcome.
          this.router.navigate(['/login']);
  });
  }

  onLang(lang:string){
    this.lang = lang;
    //this.translate.use(this.lang);
    return false;    
  }

  toProfilePage(menu:IonMenu){
    this.router.navigate(['/perfil']);
  }

  close(menu:IonMenu){
    of('').pipe(delay(500),tap(_=>menu.close())).subscribe();
  }
  
  onSignOut(menu:IonMenu){
    this.auth.logout().subscribe(async _=>{
      await this.router.navigate(['/login']);
      menu.close();
    });
  }

  routeInclude(path:string):boolean{
    return this.router.url.includes(path);
  }
}
