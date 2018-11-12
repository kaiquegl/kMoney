import { Categoria } from '../shared/category.model';
import { CategoryService } from './../shared/category.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  categorias: Categoria[] = [];

  constructor(private service: CategoryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      categorias => this.categorias = categorias,
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteCategoria(categoria: Categoria) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.service.delete(categoria.id).subscribe(
        () => this.categorias = this.categorias.filter(elemento => elemento !== categoria),
        () => alert('Erro ao tentar excluir')
      );
    }
  }

}
