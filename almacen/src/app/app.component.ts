import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CabeceraComponent } from "./componentes/cabecera/cabecera.component";
import { FormularioComponent } from "./componentes/formulario/formulario.component";
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { NavegacionComponent } from "./componentes/navegacion/navegacion.component";
import { PieComponent } from "./componentes/pie/pie.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CabeceraComponent, NavegacionComponent, PieComponent, FormularioComponent, CommonModule,IniciarSesionComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'almacen';
  mostrarCabeceraYPie = true;

constructor(private router: Router) {
  this.router.events.subscribe((event) => {
    if (event instanceof NavigationEnd) {
      if (event.url === '/miscelanea' || event.url === '/') {
        this.mostrarCabeceraYPie = false;

      }else {
        this.mostrarCabeceraYPie = true;
      }
    }
  });
}
}

