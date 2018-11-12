import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Lancamento } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath = 'api/lancamentos';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Lancamento[]> {
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamentos)
    );
  }

  getById(id: number): Observable<Lancamento> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamento)
    );
  }

  create(lancamento: Lancamento): Observable<Lancamento> {
    return this.http.post(this.apiPath, lancamento).pipe(
      catchError(this.handleError),
      map(this.jsonDataToLancamento)
    );
  }

  update(lancamento: Lancamento): Observable<Lancamento> {
    const url = `${this.apiPath}/${lancamento.id}`;

    return this.http.put(url, lancamento).pipe(
      catchError(this.handleError),
      map(() => lancamento)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }

  // METODOS PRIVADOS
  private jsonDataToLancamentos(jsonData: any[]): Lancamento[] {
    const lancamentos: Lancamento[] = [];
    jsonData.forEach(element => {
      const lancamento = Object.assign(new Lancamento(), element);
      lancamentos.push(lancamento);
    });
    return lancamentos;
  }

  private jsonDataToLancamento(jsonData: any): Lancamento {
    return Object.assign(new Lancamento(), jsonData);
  }

  private handleError(error: any): Observable<any> {
    console.log('Erro na requisição => ', error);
    return throwError(error);
  }
}
