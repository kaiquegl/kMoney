import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDatabase implements InMemoryDbService {
  createDb() {
    const categorias = [
      { id: 1, nome: 'Lazer', descricao: 'Cinema, parques, praia, etc' },
      { id: 2, nome: 'Saúde', descricao: 'Plano de Saúde e Remédios' },
      { id: 3, nome: 'Moradia', descricao: 'Pagamentos de Contas da Casa' },
      { id: 4, nome: 'Salário', descricao: 'Recebimento de Salário' },
      { id: 5, nome: 'Freelas', descricao: 'Trabalhos como FreeLancer' },
    ];

    return { categorias };
  }
}
