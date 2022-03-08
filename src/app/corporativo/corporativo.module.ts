import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CorporativoRoutingModule } from './corporativo-routing.module';
import { CorporativoComponent } from './listado/corporativo.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CorporativoDetalleComponent } from './detalle/corporativo-detalle.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OnlyNumberDirective } from 'app/shared/directives/only-number.directive';
import { SharedModule } from 'app/shared/shared.module';


@NgModule({
  declarations: [CorporativoComponent, CorporativoDetalleComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    SharedModule,
    CorporativoRoutingModule,
    NgxDatatableModule,
    NgxSpinnerModule
  ]
})
export class CorporativoModule { }
