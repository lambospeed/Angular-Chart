import { HttpClient, HttpResponse, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class CommonService {

  constructor(
    private http: HttpClient,
  ){
  }

  request(endpoint:string) {
    // let headers = new HttpHeaders().set('Access-Control-Allow-Origin', 'coinmarketcap.com')
    let promise = new Promise((resolve, reject) => {
      this.http.get(endpoint)
        .toPromise()
        .then((response: any) => {
          resolve(response);
        })
        .catch((error: HttpErrorResponse) => {
          if (error) {
            console.log('error in http response')
            console.log(error)
            reject(error);
          }
        })
    });
    return promise;
  }
}
