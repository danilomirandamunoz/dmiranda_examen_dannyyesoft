import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DatatableComponent, ColumnMode } from "@swimlane/ngx-datatable";
import { CorporativoService } from 'app/shared/services/corporativo.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-corporativo',
  templateUrl: './corporativo.component.html',
  styleUrls: ['./corporativo.component.scss',
  "/assets/sass/libs/datatables.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CorporativoComponent implements OnInit {
  @ViewChild(DatatableComponent) table: DatatableComponent;

  formFiltros: FormGroup;
  // row data
  public rows = [];
  public ColumnMode = ColumnMode;
  public limitRef = 10;

    // column header
    public columns = [
      { name: "ID", prop: "id" },
      // { name: "COORPORATIVO", prop: "COORPORATIVO" },
      // { name: "URL", prop: "URL" },
      // { name: "INCORPORADO EL", prop: "D_FechaIncorporacion" },
      // { name: "Verified", prop: "Verified" },
      // { name: "Role", prop: "Role" },
      // { name: "Status", prop: "Status" },
      // { name: "Actions", prop: "Actions" },
    ];
  
    // private
    private tempData = [];
  
    constructor(private servicioCorporativo: CorporativoService,
      private spinner: NgxSpinnerService,) {

        this.crearFormulario();
      this.cargarCorporativos();
      //this.tempData = [];
    }
  crearFormulario() {
    this.formFiltros = new FormGroup({
      Status: new FormControl(""),
      CreadoPor: new FormControl(""),
      Asignado: new FormControl(""),
    });

    this.formFiltros.disable();
  }
  cargarCorporativos() {
    this.spinner.show();
    this.servicioCorporativo.obtenerCorporativos()
    .subscribe((res :any)=>{
      console.log("Corporativos", res.data);
      this.tempData = res.data;
      this.rows = res.data;
      this.spinner.hide();
    })
  }

/**
   * filterUpdate
   *
   * @param event
   */
 filterUpdate(event) {
  const val = event.target.value.toLowerCase();

  // filter our data
  const temp = this.tempData.filter(function (d) {
    return d.Username.toLowerCase().indexOf(val) !== -1 || !val;
  });

  // update the rows
  this.rows = temp;
  // Whenever the filter changes, always go back to the first page
  this.table.offset = 0;
}

/**
 * updateLimit
 *
 * @param limit
 */
updateLimit(limit) {
  this.limitRef = limit.target.value;
}

ngOnInit(): void {}

}
