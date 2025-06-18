import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SignatureService {
  private baseUrl: string = environment.apiUrl + "api/signatures";

  constructor(private http: HttpClient) { }

  createSignature(signature: any) {
    const signatureUrl: string = `${this.baseUrl}`;
    return this.http.post(signatureUrl, signature);
  }

  getSignaturesByUserId(userId: string) {
    return this.http.get<any[]>(`${this.baseUrl}/user/${userId}`);
  }

  getSignatureById(signatureId: string) {
    return this.http.get<any>(`${this.baseUrl}/${signatureId}`);
  }

  deleteSignature(signatureId: string) {
    return this.http.delete(`${this.baseUrl}/${signatureId}`);
  }

  updateSignature(signatureId: string, updatedData: any) {
    return this.http.put(`${this.baseUrl}/${signatureId}`, updatedData);
  }
}
