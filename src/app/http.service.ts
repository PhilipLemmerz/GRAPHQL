import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  api = 'http://localhost:8080';

  createEntry(entry: any) {
    return this.http.post<any>(`${this.api}/admin/create`, entry);
  }

  loadAll() {
    return this.http.get<any>(`${this.api}/admin/loadAll`);
  }

  deleteOne(_id :any) {
    return this.http.delete<any>(`${this.api}/admin/deleteOne/${_id}`);
  }

  signUpUser(userData: any){
    return this.http.post<any>(`${this.api}/auth/signup`, userData);
  }

  login(loginData: any) {
    return this.http.post<any>(`${this.api}/auth/login`, loginData);
  }


}
