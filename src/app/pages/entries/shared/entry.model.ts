import { Categoria } from '../../categories/shared/category.model';

export class Lancamento {
  constructor(
    public id?: number,
    public nome?: string,
    public descricao?: string,
    public tipo?: string,
    public valor?: string,
    public data?: string,
    public pago?: boolean,
    public categoriaId?: number,
    public categoria?: Categoria
  ) { }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  };

  get paidText(): string {
    return this.pago ? 'Pago' : 'Pendente';
  }
}
