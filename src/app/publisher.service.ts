import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private baseUrl: string = 'http://localhost:3000/file';
  constructor(private http: HttpClient) {}

  postFile(data: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, data);
  }
}
