import { Lancamento } from '../shared/entry.model';
import { EntryService } from './../shared/entry.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.scss']
})
export class EntryListComponent implements OnInit {

  lancamentos: Lancamento[] = [];

  constructor(private service: EntryService) { }

  ngOnInit() {
    this.service.getAll().subscribe(
      lancamentos => this.lancamentos = lancamentos.sort((a, b) => b.id - a.id),
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteLancamento(lancamento: Lancamento) {
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if (mustDelete) {
      this.service.delete(lancamento.id).subscribe(
        () => this.lancamentos = this.lancamentos.filter(elemento => elemento !== lancamento),
        () => alert('Erro ao tentar excluir')
      );
    }
  }

}
