import { CategoryService } from './../../categories/shared/category.service';
import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Lancamento } from '../shared/entry.model';
import { EntryService } from './../shared/entry.service';

import { switchMap } from 'rxjs/operators';
import toastr from 'toastr';
import { Categoria } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.scss']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  lancamentoForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm = false;
  lancamento: Lancamento = new Lancamento();
  categorias: Array<Categoria>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  };

  ptBr = {
    firstDayOfWeek: 0,
    dayNames: ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
    dayNamesMin: ['Do', 'Se', 'Te', 'Qu', 'Qu', 'Se', 'Sa'],
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho',
      'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
    today: 'Hoje',
    clear: 'Limpar'
  };

  constructor(
    private form: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: EntryService,
    private categoriaService: CategoryService
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategorias();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createLancamento();
    } else {
      this.updateLancamento();
    }
  }

  get typeOptions(): Array<any> {
    return Object.entries(Lancamento.types).map(
      ([value, text]) => {
        return {
          label: text,
          value: value
        };
      }
    );
  }

  // METODOS PRIVADOS
  private setCurrentAction() {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm() {
    this.lancamentoForm = this.form.group({
      id: [null],
      nome: [null, [Validators.required, Validators.minLength(2)]],
      descricao: [null],
      tipo: ['expense', Validators.required],
      valor: [null, Validators.required],
      data: [null, Validators.required],
      pago: [true, Validators.required],
      categoriaId: [null, Validators.required],
    });
  }

  private loadEntry() {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.service.getById(+params.get('id')))
      ).subscribe(
        (lancamento) => {
          this.lancamento = lancamento;
          this.lancamentoForm.patchValue(lancamento);
        },
        (error) => alert('Ocorreu um erro no servidor, tente mais tarde')
      );
    }
  }

  private loadCategorias() {
    this.categoriaService.getAll().subscribe(
      categorias => this.categorias = categorias
    );
  }

  private setPageTitle() {
    if (this.currentAction === 'new') {
      this.pageTitle = 'Cadastro de Novo Lancamento';
    } else {
      const lancamentoNome = this.lancamento.nome || '';
      this.pageTitle = 'Editando Lancamento: ' + lancamentoNome;
    }
  }

  private createLancamento() {
    const lancamento: Lancamento = Lancamento.fromJson(this.lancamentoForm.value);

    this.service.create(lancamento).subscribe(
      result => this.actionsForSuccess(result),
      error => this.actionsForError(error)
    );
  }

  private updateLancamento() {
    const lancamento: Lancamento = Lancamento.fromJson(this.lancamentoForm.value);

    this.service.update(lancamento).subscribe(
      result => this.actionsForSuccess(result),
      error => this.actionsForError(error)
    );
  }

  private actionsForSuccess(lancamento: Lancamento) {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigateByUrl('lancamentos', { skipLocationChange: true }).then(
      () => this.router.navigate(['lancamentos', lancamento.id, 'edit'])
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
