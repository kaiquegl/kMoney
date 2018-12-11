import { BaseResourceService } from 'src/app/shared/services/base-resource.service';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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
    return this.categoryService.getById(lancamento.categoriaId).pipe(
      flatMap(categoria => {
        lancamento.categoria = categoria;
        return super.create(lancamento);
      })
    );
  }

  update(lancamento: Lancamento): Observable<Lancamento> {
    return this.categoryService.getById(lancamento.categoriaId).pipe(
      flatMap(categoria => {
        lancamento.categoria = categoria;
        return super.update(lancamento);
      })
    );
  }
}
