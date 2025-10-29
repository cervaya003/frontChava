import { Component, OnInit } from '@angular/core';
import { Peticiones } from '../../services/peticiones.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {

  private datos: any = {
    'email': 'cervaya.003@gmail.com',
    'nombre': 'Hector'
  }

  public p: boolean = false;

  constructor(
    private Peticion: Peticiones
  ) { }

  ngOnInit() {
    this.Peticion.registro(this.datos).subscribe({
      next: (res: any) => {
        this.p = true;
      },
      error: () => {

      },
    });
  }

}
