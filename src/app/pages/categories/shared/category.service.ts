import { Injectable, Injector } from '@angular/core';
import { Categoria } from './category.model';
import { BaseResourceService } from 'src/app/shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<Categoria> {

  constructor(protected injector: Injector) {
    super('api/categorias', injector, Categoria.fromJson);
  }
}
