import { Categoria } from '../../categories/shared/category.model';
import { BaseResourceModel } from 'src/app/shared/models/base-resource.model';

export class Lancamento extends BaseResourceModel {
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
  ) {
    super();
  }

  static types = {
    expense: 'Despesa',
    revenue: 'Receita'
  };

  static fromJson(jsonData: any): Lancamento {
    return Object.assign(new Lancamento(), jsonData);
  }

  get paidText(): string {
    return this.pago ? 'Pago' : 'Pendente';
  }
}
