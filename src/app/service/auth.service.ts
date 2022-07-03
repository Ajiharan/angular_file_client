import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = 'http://localhost:3000/login';
  constructor(private http: HttpClient) {}

  loginUser(data: any): Observable<any> {
    return this.http.post(this.baseUrl, data);
  }
}
