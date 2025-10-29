import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class Peticiones {
  baseUrl = environment.api_key;

  constructor(private http: HttpClient) { }

  registro(datos: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/plain, */*'
    });

    return this.http.post(`${this.baseUrl}/users/registro`, datos, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      if (error.status === 0) {
        errorMessage = 'No se pudo conectar con el servidor. Verifique que esté ejecutándose.';
      } else if (error.status === 401) {
        errorMessage = 'Credenciales inválidas';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint no encontrado';
      } else {
        errorMessage = `Error ${error.status}: ${error.error?.message || error.message}`;
      }
    }

    console.error('Error en la petición:', error);
    return throwError(() => new Error(errorMessage));
  }
}