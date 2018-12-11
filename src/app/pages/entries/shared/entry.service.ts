import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap, catchError } from 'rxjs/operators';

import { CategoryService } from './../../categories/shared/category.service';
import { Lancamento } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Lancamento> {

  constructor(private categoryService: CategoryService, protected injector: Injector) {
    super('api/lancamentos', injector, Lancamento.fromJson);
  }

  create(lancamento: Lancamento): Observable<Lancamento> {
    return this.setCategoriaAndSendIt(lancamento, super.create.bind(this));
  }

  update(lancamento: Lancamento): Observable<Lancamento> {
    return this.setCategoriaAndSendIt(lancamento, super.update.bind(this));
  }

  private setCategoriaAndSendIt(lancamento: Lancamento, sendFn: any): Observable<Lancamento> {
    return this.categoryService.getById(lancamento.categoriaId).pipe(
      flatMap(categoria => {
        lancamento.categoria = categoria;
        return sendFn(lancamento);
      }),
      catchError(this.handleError)
    );
  }
}
