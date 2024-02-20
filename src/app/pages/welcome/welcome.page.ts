import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from 'src/app/core/interfaces/user';
import { ApiService } from 'src/app/core/services/api/api.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  private user: User | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.user = this.apiService.getUser();
    this.apiService.user$.subscribe();
    
    // Leer el parámetro 'from' de la URL
    this.route.queryParams.subscribe(params => {
      const from = params['from'];
      
      // Redirigir en función del valor de 'from'
      if (from === 'perfil') {
        this.router.navigate(['/perfil']);
      } else {
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 3000);
      }
    });
  }
}
