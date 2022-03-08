import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";
import { of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { CoorporativoContactoModel } from "../models/CorporativoContacto.model";

@Injectable({
  providedIn: "root",
})
export class CorporativoService {
  public apiURL = environment.apiURL;
  public authToken = "Bearer " + localStorage.getItem("tokenscloud");

  constructor(private httpClient: HttpClient) {}

  obtenerCorporativos() {
    let url = `${this.apiURL}/corporativos`;
    return this.httpClient
      .get(url, { 
        headers: {
          Authorization: `${this.authToken}`,
        },
      })
      .pipe(map((res) => res));
  }

  obtenerDetalleCorporativo(id:number) {
    let url = `${this.apiURL}/corporativos/${id}`;
    return this.httpClient
      .get(url, {headers: {Authorization: `${this.authToken}`},
      })
      .pipe(map((res:any) => res.data.corporativo));
  }

  guardarContacto(contacto:CoorporativoContactoModel){
    let url = `${this.apiURL}/contactos`;

    if(contacto.id==0){
      return this.httpClient.post(url, contacto,{headers: {Authorization: `${this.authToken}`}})
      .pipe(
        map((data: any) => data),
        catchError(_ => of(-1))
      );
    }
    else{
      url += `/${contacto.id}`
      return this.httpClient.put(url, contacto,{headers: {Authorization: `${this.authToken}`}})
      .pipe(
        map((data: any) => data),
        catchError(_ => of(-1))
      );
    }

    
  }

  eliminarContacto(id:number){
    let url = `${this.apiURL}/contactos/${id}`;
    return this.httpClient.delete(url,{headers: {Authorization: `${this.authToken}`}})
    .pipe(
      map((data: any) => data),
      catchError(_ => of(-1))
    );
  }
}
