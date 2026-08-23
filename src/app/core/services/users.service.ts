import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FakeStoreUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private http: HttpClient) {}

  getDemoUsers(): Observable<FakeStoreUser[]> {
    return this.http.get<FakeStoreUser[]>(`${environment.apiUrl}/users?limit=5`);
  }
}