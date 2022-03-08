import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { CoorporativoContactoModel } from "app/shared/models/CorporativoContacto.model";
import { CorporativoService } from "app/shared/services/corporativo.service";
import { NgxSpinnerService } from "ngx-spinner";
import swal from 'sweetalert2';

@Component({
  selector: "app-corporativo-detalle",
  templateUrl: "./corporativo-detalle.component.html",
  styleUrls: [
    "./corporativo-detalle.component.scss",
    "/assets/sass/pages/page-users.scss",
    "/assets/sass/libs/select.scss",
  ],
})
export class CorporativoDetalleComponent implements OnInit {
  formDatosGenerales: FormGroup;
  formContacto: FormGroup;
  editar: boolean = false;
  idCorporativo: number;
  nombreBotonGuardar: string = "Agregar Contacto";

  contactos:CoorporativoContactoModel[]=[];

  constructor(
    private route: ActivatedRoute,
    private service: CorporativoService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {
    this.crearFormulario();
    this.cargarParametros();
  }
  cargarParametros() {
    this.route.params.subscribe((parametro) => {
      this.idCorporativo = parametro["id"];
      if (this.idCorporativo != 0) {
        this.spinner.show();
        this.obtenercoorporativo();
      } else {
        this.router.navigate(["/error"]);
      }
    });
  }

  obtenercoorporativo(){
    this.service.obtenerDetalleCorporativo(this.idCorporativo).subscribe(
      (res) => {
        this.corporativo = res;
        this.contactos = this.corporativo.tw_contactos_corporativo;
        this.formDatosGenerales.patchValue({
          Id: this.corporativo.id,
          NombreCorto: this.corporativo.S_NombreCorto,
          NombreCompleto: this.corporativo.S_NombreCompleto,
          FechaIncorporacion: this.crearFormatoFecha(
            this.corporativo.D_FechaIncorporacion
          ),
          Status: this.corporativo.S_Activo,
          UrlSistema: this.corporativo.S_SystemUrl,
        });
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        console.error(err);
      }
    );
  }

  crearFormulario() {
    this.formDatosGenerales = new FormGroup({
      Id: new FormControl(0),
      NombreCorto: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      NombreCompleto: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      Status: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      FechaIncorporacion: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      UrlSistema: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
    });

    this.formContacto = new FormGroup({
      id: new FormControl(0),
      S_Nombre: new FormControl("", Validators.required),
      S_Puesto: new FormControl("", Validators.required),
      S_Comentarios: new FormControl("", Validators.required),
      N_TelefonoFijo: new FormControl("", Validators.required),
      N_TelefonoMovil: new FormControl("", Validators.required),
      S_Email: new FormControl("", [Validators.required, Validators.email]),
      tw_corporativo_id: new FormControl(0),
    });

    
  }

  corporativo: any;

  ngOnInit(): void {}

  editarDatosGenerales() {
    this.formDatosGenerales.enable();
    this.editar = true;
  }

  cancelarEdicion() {
    this.formDatosGenerales.disable();
    this.editar = false;
  }

  guardarCambios() {
    this.formDatosGenerales.disable();
    this.editar = false;
  }

  crearFormatoFecha(fecha: any): any {
    const date: Date = new Date(fecha);
    if (date.getFullYear() <= 1900) {
      return "";
    }
    const año = date.getFullYear();
    const mes = date.getMonth() + 1;
    const dia = date.getDate();

    return { year: año, month: mes, day: dia };
  }

  cancelarContacto(){
    this.formContacto.reset();
  }

  editarContacto(contacto:CoorporativoContactoModel){
    this.formContacto.patchValue({
      id: contacto.id,
      S_Nombre: contacto.S_Nombre,
      S_Puesto: contacto.S_Puesto,
      S_Comentarios: contacto.S_Comentarios,
      N_TelefonoFijo: contacto.N_TelefonoFijo,
      N_TelefonoMovil: contacto.N_TelefonoMovil,
      S_Email: contacto.S_Email,
      tw_corporativo_id: this.idCorporativo
    });

    this.nombreBotonGuardar = "Actualizar Contacto";
  }

  guardarContacto(){

    if(this.formContacto.valid){
      let contacto: CoorporativoContactoModel = this.formContacto.value;
      contacto.tw_corporativo_id = this.idCorporativo;
      console.log(contacto);
      this.spinner.show();
      this.service.guardarContacto(contacto)
      .subscribe(res=>{
        if(res==-1)
        {
          swal.fire(
            'Error',
            "No se ha podido guardar el contacto",
            'error'
          );
          this.spinner.hide();
          return;
        }
        
        this.obtenercoorporativo();
        this.formContacto.reset();
        this.nombreBotonGuardar = "Agregar Contacto";
        swal.fire(
          'OK',
          'Contacto agregado correctamente',
          'success'
        )
        this.spinner.hide();
      },
      err=>{
        swal.fire(
          'Error',
          err,
          'error'
        )
        this.spinner.hide();
      })
    }
    

  }

  confirmarEliminarContacto(contacto:CoorporativoContactoModel){

    swal.fire({
      text: `¿Esta seguro de eliminar el contacto: ${contacto.S_Nombre}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText:"No"
    }).then((result) => {
      if (result.value) {
        this.eliminarContacto(contacto.id);
      }
    })
  }

  eliminarContacto(id){
    this.spinner.show();
    this.service.eliminarContacto(id)
    .subscribe(res=>{
      if(res==-1)
      {
        swal.fire(
          'Error',
          "No se ha podido eliminar el contacto",
          'error'
        );
        this.spinner.hide();
        return;
      }
      this.contactos = this.contactos.filter(x=>x.id != id);
      swal.fire(
        'OK',
        'Contacto eliminado correctamente',
        'success'
      )
      this.spinner.hide();
    },
    err=>{
      swal.fire(
        'Error',
        err,
        'error'
      )
      this.spinner.hide();
    });
  }
}
