import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AutoresComponent } from './autores/autores.component';
import { AutoresModComponent } from './autores-mod/autores-mod.component';
import { LoginComponent } from './login/login.component';
import { AppLayoutComponent } from './app-layout/app-layout.component';
import { InicioComponent } from './inicio/inicio.component';
import { ParametrosComponent } from './parametros/parametros.component';
import { StockComponent } from './stock/stock.component';
import { EditorialesComponent } from './editoriales/editoriales.component';
import { EditorialesModComponent } from './editoriales-mod/editoriales-mod.component';
import { LibrosComponent } from './libros/libros.component';
import { LibrosModComponent } from './libros-mod/libros-mod.component';

const routes: Routes = [
  {
    path: '', component: LoginComponent, data: {animation: "Entra", title: "Login"}
  },
  { 
    path: '', 
    component: AppLayoutComponent, data: {animation: "Entra" },
    children: [
      { path: 'parametros',  component: ParametrosComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'autores',  component: AutoresComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'autores-mod',  component: AutoresModComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'editoriales',  component: EditorialesComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'editoriales-mod',  component: EditorialesModComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'libros',  component: LibrosComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'libros-mod',  component: LibrosModComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'inicio',  component: InicioComponent , data: {animation: "Entra", title: "Inicio"}},
      { path: 'stock', component: StockComponent, data: {animation: "Entra", title: "Stock"}}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
