import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Categoria } from '../shared/category.model';
import { CategoryService } from './../shared/category.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoriaForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  categoria: Categoria = new Categoria();

  constructor(
    private form: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategoria();
    } else {
      this.updateCategoria();
    }
  }

  // METODOS PRIVADOS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm() {
    this.categoriaForm = this.form.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2)]],
      descricao: [null]
    });
  }

  private loadCategory() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.service.getById(+params.get('id')))
      ).subscribe(
        (categoria) => {
          this.categoria = categoria;
          this.categoriaForm.patchValue(categoria);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Nova Categoria';
    } else {
      const categoriaNome = this.categoria.nome || '';
      this.pageTitle = 'Editando Categoria: ' + categoriaNome;
    }
  }

  private createCategoria() {
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);

    this.service.create(categoria).subscribe(
      result => this.actionsForSuccess(result),
      error => this.actionsForError(error)
    );
  }

  private updateCategoria() {
    const categoria: Categoria = Object.assign(new Categoria(), this.categoriaForm.value);

    this.service.update(categoria).subscribe(
      result => this.actionsForSuccess(result),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(categoria: Categoria) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('categorias', { skipLocationChange: true }).then(
      () => this.router.navigate(['categorias', categoria.id, 'edit'])
    );
  }

  private actionsForError(error: any) {
    toastr.error('Ocorreu um erro ao processar a sua solicitação');

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor. Por favor, tente mais tarde.'];
    }
  }

}
