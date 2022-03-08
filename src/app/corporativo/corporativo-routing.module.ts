import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CorporativoDetalleComponent } from './detalle/corporativo-detalle.component';
import { CorporativoComponent } from './listado/corporativo.component';


const routes: Routes = [
  {
    path: '',
    component: CorporativoComponent,
    data: {
      title: 'Corporativo'
    }
  },
  {
    path: 'detalle/:id',
    component: CorporativoDetalleComponent,
    data: {
      title: 'Detalle Corporativo'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CorporativoRoutingModule { }
