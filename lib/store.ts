import { create } from 'zustand'
import type { Funcionario, Status, Funcao, Turno } from './types'

interface StoreState {
  funcionarios: Funcionario[]
  addFuncionario: (funcionario: Omit<Funcionario, 'status'>) => { success: boolean; error?: string }
  removeFuncionario: (id: string) => { success: boolean; error?: string }
  getFuncionario: (id: string) => Funcionario | undefined
  updateStatus: (id: string, status: Status) => void
  toggleStatus: (id: string) => void
}

// Dados iniciais para simulação
const funcionariosIniciais: Funcionario[] = [
  { id: 'F001', nome: 'Carlos Silva', funcao: 'Soldador', turno: 'Manhã', status: 'Ativo' },
  { id: 'F002', nome: 'Maria Santos', funcao: 'Operador', turno: 'Manhã', status: 'Ativo' },
  { id: 'F003', nome: 'João Oliveira', funcao: 'Supervisor', turno: 'Tarde', status: 'Ativo' },
  { id: 'F004', nome: 'Ana Costa', funcao: 'Montador', turno: 'Manhã', status: 'Ativo' },
  { id: 'F005', nome: 'Pedro Souza', funcao: 'Inspetor', turno: 'Tarde', status: 'Ausente' },
  { id: 'F006', nome: 'Lucia Ferreira', funcao: 'Técnico', turno: 'Noite', status: 'Ativo' },
  { id: 'F007', nome: 'Roberto Lima', funcao: 'Soldador', turno: 'Noite', status: 'Ativo' },
  { id: 'F008', nome: 'Fernanda Alves', funcao: 'Operador', turno: 'Tarde', status: 'Ativo' },
]

export const useStore = create<StoreState>((set, get) => ({
  funcionarios: funcionariosIniciais,

  addFuncionario: (funcionario) => {
    const { funcionarios } = get()
    
    // Validar ID duplicado
    if (funcionarios.some(f => f.id === funcionario.id)) {
      return { success: false, error: 'Já existe um funcionário com esta credencial/ID' }
    }

    // Validar campos obrigatórios
    if (!funcionario.id || !funcionario.nome || !funcionario.funcao || !funcionario.turno) {
      return { success: false, error: 'Todos os campos são obrigatórios' }
    }

    const novoFuncionario: Funcionario = {
      ...funcionario,
      status: 'Ativo'
    }

    set({ funcionarios: [...funcionarios, novoFuncionario] })
    return { success: true }
  },

  removeFuncionario: (id) => {
    const { funcionarios } = get()
    const funcionario = funcionarios.find(f => f.id === id)

    if (!funcionario) {
      return { success: false, error: 'Funcionário não encontrado no sistema' }
    }

    set({ funcionarios: funcionarios.filter(f => f.id !== id) })
    return { success: true }
  },

  getFuncionario: (id) => {
    return get().funcionarios.find(f => f.id === id)
  },

  updateStatus: (id, status) => {
    set((state) => ({
      funcionarios: state.funcionarios.map(f =>
        f.id === id ? { ...f, status } : f
      )
    }))
  },

  toggleStatus: (id) => {
    set((state) => ({
      funcionarios: state.funcionarios.map(f =>
        f.id === id ? { ...f, status: f.status === 'Ativo' ? 'Ausente' : 'Ativo' } : f
      )
    }))
  }
}))

// Função utilitária para gerar itinerário
export function gerarItinerario(funcionario: Funcionario) {
  const { SETORES_POR_FUNCAO, TURNOS_HORARIOS } = require('./types')
  
  const setorConfig = SETORES_POR_FUNCAO[funcionario.funcao]
  const maquinaIndex = Math.floor(Math.random() * setorConfig.maquinas.length)
  const maquina = setorConfig.maquinas[maquinaIndex]
  
  return {
    funcionario,
    setor: setorConfig.nome,
    area: setorConfig.area,
    maquina,
    horario: TURNOS_HORARIOS[funcionario.turno],
    rota: `${funcionario.funcao} → ${setorConfig.area} → ${maquina}`
  }
}
