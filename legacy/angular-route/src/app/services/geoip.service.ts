import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
// import { throwError } from 'rxjs';
// import { HttpErrorResponse } from '@angular/common/http';
// import { catchError } from 'rxjs/operators';

// const httpOptions = {
//   headers: new HttpHeaders({
//       'Accept': 'application/json',
//   }),
// };

const api_key = '74b7d9f44b0b4bdd8418e39eefd94b74';
const url = `https://api.ipgeolocation.io/ipgeo?apiKey=${api_key}&ip=`;

@Injectable({
  providedIn: 'root'
})


export class GeoipService {

  constructor(private http: HttpClient) {
    console.log('Geoip Service Listo');
   }

  get(endpoint: string) {
    return this.http.get(`${url}${endpoint}`);
  }

//   private handleError(error: HttpErrorResponse) {
//     if (error.error instanceof ErrorEvent) {
//       // A client-side or network error occurred. Handle it accordingly.
//       console.error('An error occurred:', error.error.message);
//     } else {
//       // The backend returned an unsuccessful response code.
//       // The response body may contain clues as to what went wrong,
//       console.error(
//         `Backend returned code ${error.status}, ` +
//         `body was: ${error.error}`);
//     }
//     // return an observable with a user-facing error message
//     return throwError({
//       status: error.status,
//       message: 'Something bad happened; please try again later.',
//     });
// };
}
