import { UserCredentials } from 'src/app/core/interfaces/user-credentials';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service';
import { JwtService } from '../../jwt.service';
import { Observable, lastValueFrom, map } from 'rxjs';
import { StrapiArrayResponse, StrapiExtendedUser, StrapiLoginPayload, StrapiLoginResponse, StrapiMe, StrapiRegisterPayload, StrapiRegisterResponse, StrapiUser, } from 'src/app/core/interfaces/strapi';
import { UserRegisterInfo } from 'src/app/core/interfaces/user-register-info';
import { User } from 'src/app/core/interfaces/user';

export class AuthStrapiService extends AuthService {

  constructor(
    private jwtSvc: JwtService,
    private apiSvc: ApiService
  ) {

    super();
    this.jwtSvc.loadToken().subscribe(token=>{
      if(token){
        this.me().subscribe(user=>{
          this._logged.next(true);
          this._user.next(user);
        })
      }else{
        this._logged.next(false);
        this._user.next(null);
      }
    });
  }

  public login(credentials: UserCredentials): Observable<User> {
    return new Observable<User>((obs) => {
      const _credentials: StrapiLoginPayload = {
        identifier: credentials.username,
        password: credentials.password,
      };
      this.apiSvc.post('/auth/local', _credentials).subscribe({
        next: async (data: StrapiLoginResponse) => {
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          try {
            const user = await lastValueFrom(this.me());
            this._user.next(user);
            this._logged.next(true);
            obs.next(user);
            obs.complete();
          } catch (error) {
            obs.error(error);
          }
        },
        error: (err) => {
          obs.error(err);
        },
      });
    });
  }

  logout():Observable<void>{
    return this.jwtSvc.destroyToken().pipe(map(_=>{
      this._logged.next(false);
      return;
    }));
  }

  register(info: UserRegisterInfo): Observable<User> {
    return new Observable<User>((obs) => {
      const _info: StrapiRegisterPayload = {
        email: info.email,
        username: info.nickname,
        password: info.password,
      };
      this.apiSvc.post('/auth/local/register', _info).subscribe({
        next: async (data: StrapiRegisterResponse) => {
                    
          await lastValueFrom(this.jwtSvc.saveToken(data.jwt));
          const _extended_user:StrapiExtendedUser= {
            name: info.name,
            surname: info.surname,
            users_permissions_user: data.user.id,
          }
          try {
            await lastValueFrom(this.apiSvc.post('/users-extensions', {data:_extended_user}));
            const user = await lastValueFrom(this.me());
            this._user.next(user);
            this._logged.next(true);
            obs.next(user);
            obs.complete();  
          } catch (error) {
            obs.error(error);
          }
        },
        error:err=>{
          obs.error(err);
        }
      });
    });
  }
  public me(): Observable<User> {
    return new Observable<User>((obs) => {
      console.log("Paso -1:" + obs)
      this.apiSvc.get('/users/me').subscribe({
        next: async (user: StrapiMe) => {
          console.log("Paso 0:" + obs);
          let extended_user: StrapiArrayResponse<StrapiExtendedUser> = await lastValueFrom(
            this.apiSvc.get(`/user-extensions?filters[users_permissions_user]=${user.id}`)
          );
          console.log("Paso 1:" + extended_user);
          let ret: User = {
            id: user.id,
            name: extended_user.data[0].attributes.name,
            surname: extended_user.data[0].attributes.surname,
          };
          console.log("Paso2:" + ret);
          obs.next(ret);
          obs.complete();
        },
        error: (err) => {
          obs.error(err);
        },
      });
    });
  }
}
