'use client'

import { useState } from 'react'
import { ArrowLeft, Shield, Lock, UserPlus, UserMinus, Users, Terminal, AlertTriangle, CheckCircle, X } from 'lucide-react'
import { useStore } from '@/lib/store'
import { ADMIN_PASSWORD, type Funcao, type Turno } from '@/lib/types'

interface AdminFlowProps {
  onBack: () => void
}

type AdminView = 'login' | 'panel' | 'add' | 'remove' | 'list'

const FUNCOES: Funcao[] = ['Soldador', 'Operador', 'Supervisor', 'Montador', 'Inspetor', 'Técnico']
const TURNOS: Turno[] = ['Manhã', 'Tarde', 'Noite']

export function AdminFlow({ onBack }: AdminFlowProps) {
  const [view, setView] = useState<AdminView>('login')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  // Add employee form
  const [newEmployee, setNewEmployee] = useState({
    id: '',
    nome: '',
    funcao: 'Soldador' as Funcao,
    turno: 'Manhã' as Turno
  })
  const [addError, setAddError] = useState<string | null>(null)
  const [addSuccess, setAddSuccess] = useState<string | null>(null)

  // Remove employee
  const [removeId, setRemoveId] = useState('')
  const [removePassword, setRemovePassword] = useState('')
  const [removeError, setRemoveError] = useState<string | null>(null)
  const [removeSuccess, setRemoveSuccess] = useState<string | null>(null)

  const { funcionarios, addFuncionario, removeFuncionario, toggleStatus } = useStore()

  const handleLogin = () => {
    setLoginError(null)

    if (!password) {
      setLoginError('Por favor, informe a senha de acesso')
      return
    }

    setIsAuthenticating(true)

    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        setView('panel')
      } else {
        setLoginError('Senha inválida. Acesso negado.')
      }
      setIsAuthenticating(false)
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  const handleAddEmployee = () => {
    setAddError(null)
    setAddSuccess(null)

    if (!newEmployee.id || !newEmployee.nome) {
      setAddError('Todos os campos são obrigatórios')
      return
    }

    const result = addFuncionario(newEmployee)

    if (result.success) {
      setAddSuccess(`Funcionário ${newEmployee.nome} cadastrado com sucesso!`)
      setNewEmployee({ id: '', nome: '', funcao: 'Soldador', turno: 'Manhã' })
    } else {
      setAddError(result.error || 'Erro ao cadastrar funcionário')
    }
  }

  const handleRemoveEmployee = () => {
    setRemoveError(null)
    setRemoveSuccess(null)

    if (removePassword !== ADMIN_PASSWORD) {
      setRemoveError('Senha inválida. Remoção bloqueada.')
      return
    }

    if (!removeId) {
      setRemoveError('Informe a credencial do funcionário')
      return
    }

    const funcionario = funcionarios.find(f => f.id === removeId.toUpperCase())
    const result = removeFuncionario(removeId.toUpperCase())

    if (result.success && funcionario) {
      setRemoveSuccess(`Funcionário ${funcionario.nome} removido com sucesso!`)
      setRemoveId('')
      setRemovePassword('')
    } else {
      setRemoveError(result.error || 'Erro ao remover funcionário')
    }
  }

  const renderLogin = () => (
    <div className="space-y-6">
      <div className="font-mono space-y-2">
        <p className="text-warning">╔══════════════════════════════════════════════╗</p>
        <p className="text-warning">║     <span className="text-foreground">ACESSO ADMINISTRATIVO RESTRITO</span>           ║</p>
        <p className="text-warning">╚══════════════════════════════════════════════╝</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-lg">
        <Lock className="h-5 w-5 text-warning" />
        <p className="text-sm font-mono text-warning">Área restrita. Autenticação necessária.</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-mono text-muted-foreground">Senha de Acesso:</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="••••••"
            className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warning/50 focus:border-warning"
            autoFocus
          />
        </label>

        {loginError && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm font-mono text-destructive">{loginError}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleLogin}
            disabled={isAuthenticating}
            className="flex-1 bg-warning hover:bg-warning/90 text-warning-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {isAuthenticating ? 'Autenticando...' : 'ACESSAR SISTEMA'}
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
          >
            VOLTAR
          </button>
        </div>
      </div>
    </div>
  )

  const renderPanel = () => (
    <div className="space-y-6">
      <div className="font-mono space-y-2">
        <p className="text-success">╔══════════════════════════════════════════════╗</p>
        <p className="text-success">║     <span className="text-foreground">PAINEL ADMINISTRATIVO</span>                    ║</p>
        <p className="text-success">╚══════════════════════════════════════════════╝</p>
      </div>

      <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
        <CheckCircle className="h-5 w-5 text-success" />
        <p className="text-sm font-mono text-success">Acesso autorizado. Bem-vindo, Administrador.</p>
      </div>

      <div className="grid gap-3">
        <button
          onClick={() => setView('add')}
          className="flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 border border-border hover:border-success/50 rounded-lg transition-all group"
        >
          <div className="p-2 bg-success/10 group-hover:bg-success/20 rounded-lg transition-colors">
            <UserPlus className="h-5 w-5 text-success" />
          </div>
          <div className="text-left">
            <p className="font-mono font-semibold text-foreground">[1] Adicionar Funcionário</p>
            <p className="text-xs text-muted-foreground">Cadastrar novo colaborador no sistema</p>
          </div>
        </button>

        <button
          onClick={() => setView('remove')}
          className="flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 border border-border hover:border-destructive/50 rounded-lg transition-all group"
        >
          <div className="p-2 bg-destructive/10 group-hover:bg-destructive/20 rounded-lg transition-colors">
            <UserMinus className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-left">
            <p className="font-mono font-semibold text-foreground">[2] Remover Funcionário</p>
            <p className="text-xs text-muted-foreground">Remover colaborador do sistema</p>
          </div>
        </button>

        <button
          onClick={() => setView('list')}
          className="flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 border border-border hover:border-info/50 rounded-lg transition-all group"
        >
          <div className="p-2 bg-info/10 group-hover:bg-info/20 rounded-lg transition-colors">
            <Users className="h-5 w-5 text-info" />
          </div>
          <div className="text-left">
            <p className="font-mono font-semibold text-foreground">[3] Listar Funcionários</p>
            <p className="text-xs text-muted-foreground">Visualizar todos os colaboradores</p>
          </div>
        </button>

        <button
          onClick={onBack}
          className="flex items-center gap-4 p-4 bg-secondary hover:bg-secondary/80 border border-border rounded-lg transition-all group"
        >
          <div className="p-2 bg-muted rounded-lg">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="text-left">
            <p className="font-mono font-semibold text-foreground">[4] Voltar ao Menu Principal</p>
            <p className="text-xs text-muted-foreground">Retornar à tela inicial</p>
          </div>
        </button>
      </div>
    </div>
  )

  const renderAddEmployee = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="font-mono">
          <p className="text-success font-semibold">CADASTRO DE FUNCIONÁRIO</p>
          <p className="text-xs text-muted-foreground">Preencha os dados do novo colaborador</p>
        </div>
        <button
          onClick={() => { setView('panel'); setAddError(null); setAddSuccess(null) }}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground">Credencial/ID:</span>
            <input
              type="text"
              value={newEmployee.id}
              onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value.toUpperCase() })}
              placeholder="Ex: F009"
              className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-success/50 focus:border-success"
            />
          </label>
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground">Nome Completo:</span>
            <input
              type="text"
              value={newEmployee.nome}
              onChange={(e) => setNewEmployee({ ...newEmployee, nome: e.target.value })}
              placeholder="Nome do funcionário"
              className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-success/50 focus:border-success"
            />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground">Função:</span>
            <select
              value={newEmployee.funcao}
              onChange={(e) => setNewEmployee({ ...newEmployee, funcao: e.target.value as Funcao })}
              className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-success/50 focus:border-success"
            >
              {FUNCOES.map((funcao) => (
                <option key={funcao} value={funcao}>{funcao}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-mono text-muted-foreground">Turno:</span>
            <select
              value={newEmployee.turno}
              onChange={(e) => setNewEmployee({ ...newEmployee, turno: e.target.value as Turno })}
              className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-success/50 focus:border-success"
            >
              {TURNOS.map((turno) => (
                <option key={turno} value={turno}>{turno}</option>
              ))}
            </select>
          </label>
        </div>

        {addError && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm font-mono text-destructive">{addError}</p>
          </div>
        )}

        {addSuccess && (
          <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
            <p className="text-sm font-mono text-success">{addSuccess}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleAddEmployee}
            className="flex-1 bg-success hover:bg-success/90 text-success-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            CADASTRAR FUNCIONÁRIO
          </button>
          <button
            onClick={() => { setView('panel'); setAddError(null); setAddSuccess(null) }}
            className="px-6 py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  )

  const renderRemoveEmployee = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="font-mono">
          <p className="text-destructive font-semibold">REMOÇÃO DE FUNCIONÁRIO</p>
          <p className="text-xs text-muted-foreground">Confirme a senha para remover</p>
        </div>
        <button
          onClick={() => { setView('panel'); setRemoveError(null); setRemoveSuccess(null) }}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <p className="text-sm font-mono text-destructive">Atenção: Esta ação é irreversível!</p>
      </div>

      <div className="space-y-4">
        <label className="block">
          <span className="text-sm font-mono text-muted-foreground">Senha de Confirmação:</span>
          <input
            type="password"
            value={removePassword}
            onChange={(e) => setRemovePassword(e.target.value)}
            placeholder="••••••"
            className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive"
          />
        </label>

        <label className="block">
          <span className="text-sm font-mono text-muted-foreground">Credencial do Funcionário:</span>
          <input
            type="text"
            value={removeId}
            onChange={(e) => setRemoveId(e.target.value.toUpperCase())}
            placeholder="Ex: F001"
            className="w-full mt-2 bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive/50 focus:border-destructive"
          />
        </label>

        {removeError && (
          <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0" />
            <p className="text-sm font-mono text-destructive">{removeError}</p>
          </div>
        )}

        {removeSuccess && (
          <div className="flex items-start gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
            <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
            <p className="text-sm font-mono text-success">{removeSuccess}</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleRemoveEmployee}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            REMOVER FUNCIONÁRIO
          </button>
          <button
            onClick={() => { setView('panel'); setRemoveError(null); setRemoveSuccess(null) }}
            className="px-6 py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
          >
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  )

  const renderListEmployees = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="font-mono">
          <p className="text-info font-semibold">LISTA DE FUNCIONÁRIOS</p>
          <p className="text-xs text-muted-foreground">{funcionarios.length} colaboradores cadastrados</p>
        </div>
        <button
          onClick={() => setView('panel')}
          className="p-2 hover:bg-secondary rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-muted-foreground" />
        </button>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-secondary px-4 py-2 border-b border-border">
          <div className="grid grid-cols-12 gap-2 text-xs font-mono text-muted-foreground">
            <div className="col-span-2">ID</div>
            <div className="col-span-3">NOME</div>
            <div className="col-span-2">FUNÇÃO</div>
            <div className="col-span-2">TURNO</div>
            <div className="col-span-2">STATUS</div>
            <div className="col-span-1">AÇÃO</div>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {funcionarios.map((funcionario, index) => (
            <div
              key={funcionario.id}
              className={`px-4 py-3 border-b border-border last:border-b-0 ${index % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}`}
            >
              <div className="grid grid-cols-12 gap-2 items-center text-sm font-mono">
                <div className="col-span-2 text-primary font-semibold">{funcionario.id}</div>
                <div className="col-span-3 text-foreground truncate">{funcionario.nome}</div>
                <div className="col-span-2 text-muted-foreground">{funcionario.funcao}</div>
                <div className="col-span-2 text-muted-foreground">{funcionario.turno}</div>
                <div className="col-span-2">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${
                    funcionario.status === 'Ativo' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-destructive/20 text-destructive'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      funcionario.status === 'Ativo' ? 'bg-success' : 'bg-destructive'
                    }`}></span>
                    {funcionario.status}
                  </span>
                </div>
                <div className="col-span-1">
                  <button
                    onClick={() => toggleStatus(funcionario.id)}
                    className="text-xs text-info hover:text-info/80 transition-colors"
                  >
                    Alterar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setView('panel')}
        className="w-full py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
      >
        VOLTAR AO PAINEL
      </button>
    </div>
  )

  const renderContent = () => {
    switch (view) {
      case 'login':
        return renderLogin()
      case 'panel':
        return renderPanel()
      case 'add':
        return renderAddEmployee()
      case 'remove':
        return renderRemoveEmployee()
      case 'list':
        return renderListEmployees()
      default:
        return renderLogin()
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={view === 'login' ? onBack : () => setView('panel')}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Shield className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Área Administrativa</h1>
                <p className="text-xs text-muted-foreground">
                  {view === 'login' ? 'Autenticação Necessária' : 'Gerenciamento do Sistema'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
          {/* Terminal Header */}
          <div className="bg-secondary border border-border rounded-t-lg px-4 py-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-warning" />
            <span className="text-sm font-mono text-muted-foreground">terminal@sdoi:~$</span>
            <span className="text-sm font-mono text-foreground">admin_panel</span>
          </div>

          {/* Terminal Body */}
          <div className="bg-card border-x border-b border-border rounded-b-lg p-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  )
}
