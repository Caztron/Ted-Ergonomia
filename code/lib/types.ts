export type Funcao = 'Soldador' | 'Operador' | 'Supervisor' | 'Montador' | 'Inspetor' | 'Técnico'

export type Turno = 'Manhã' | 'Tarde' | 'Noite'

export type Status = 'Ativo' | 'Ausente'

export interface Funcionario {
  id: string
  nome: string
  funcao: Funcao
  turno: Turno
  status: Status
}

export interface SetorConfig {
  nome: string
  area: string
  maquinas: string[]
}

export interface Itinerario {
  funcionario: Funcionario
  setor: string
  area: string
  maquina: string
  horario: string
  rota: string
}

export const TURNOS_HORARIOS: Record<Turno, string> = {
  'Manhã': '06:00 às 14:00',
  'Tarde': '14:00 às 22:00',
  'Noite': '22:00 às 06:00'
}

export const SETORES_POR_FUNCAO: Record<Funcao, SetorConfig> = {
  'Soldador': {
    nome: 'Setor de Soldagem',
    area: 'Área de Soldagem',
    maquinas: ['MIG 01', 'MIG 02', 'MIG 03', 'TIG 01', 'TIG 02', 'Ponto 01', 'Ponto 02']
  },
  'Operador': {
    nome: 'Linha de Montagem',
    area: 'Linha de Montagem',
    maquinas: ['Prensa 01', 'Prensa 02', 'Torno CNC 01', 'Torno CNC 02', 'Fresadora 01']
  },
  'Supervisor': {
    nome: 'Central de Controle',
    area: 'Central de Controle',
    maquinas: ['Terminal Central', 'Estação de Monitoramento', 'Sala de Controle']
  },
  'Montador': {
    nome: 'Linha de Montagem',
    area: 'Área de Montagem',
    maquinas: ['Estação 01', 'Estação 02', 'Estação 03', 'Bancada 01', 'Bancada 02']
  },
  'Inspetor': {
    nome: 'Controle de Qualidade',
    area: 'Área de Inspeção',
    maquinas: ['Medidor 3D', 'Bancada de Teste', 'Estação de Inspeção Visual']
  },
  'Técnico': {
    nome: 'Manutenção',
    area: 'Oficina de Manutenção',
    maquinas: ['Bancada Técnica 01', 'Bancada Técnica 02', 'Estação de Diagnóstico']
  }
}

export const ADMIN_PASSWORD = '123'
