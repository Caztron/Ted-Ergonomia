'use client'

import { useState } from 'react'
import { ArrowLeft, User, Search, MapPin, Clock, Wrench, AlertTriangle, CheckCircle, Terminal } from 'lucide-react'
import { useStore, gerarItinerario } from '@/lib/store'
import type { Itinerario } from '@/lib/types'

interface EmployeeFlowProps {
  onBack: () => void
}

export function EmployeeFlow({ onBack }: EmployeeFlowProps) {
  const [credencial, setCredencial] = useState('')
  const [itinerario, setItinerario] = useState<Itinerario | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)

  const { getFuncionario } = useStore()

  const handleSearch = () => {
    setError(null)
    setItinerario(null)

    if (!credencial.trim()) {
      setError('Por favor, informe a credencial/ID do funcionário')
      return
    }

    setIsSearching(true)

    // Simula delay de busca no sistema
    setTimeout(() => {
      const funcionario = getFuncionario(credencial.toUpperCase())

      if (!funcionario) {
        setError('Credencial não encontrada no sistema. Verifique o ID informado.')
        setIsSearching(false)
        return
      }

      if (funcionario.status === 'Ausente') {
        setError(`Colaborador ${funcionario.nome} está marcado como AUSENTE. Itinerário bloqueado.`)
        setIsSearching(false)
        return
      }

      const novoItinerario = gerarItinerario(funcionario)
      setItinerario(novoItinerario)
      setIsSearching(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleReset = () => {
    setCredencial('')
    setItinerario(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-muted-foreground" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <User className="h-5 w-5 text-info" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Área do Funcionário</h1>
                <p className="text-xs text-muted-foreground">Consulta de Itinerário Operacional</p>
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
            <Terminal className="h-4 w-4 text-info" />
            <span className="text-sm font-mono text-muted-foreground">terminal@sdoi:~$</span>
            <span className="text-sm font-mono text-foreground">consultar_itinerario</span>
          </div>

          {/* Terminal Body */}
          <div className="bg-card border-x border-b border-border rounded-b-lg p-8">
            {!itinerario ? (
              <div className="space-y-6">
                <div className="font-mono space-y-2">
                  <p className="text-info">╔══════════════════════════════════════════════╗</p>
                  <p className="text-info">║     <span className="text-foreground">SISTEMA DE CONSULTA DE ITINERÁRIO</span>        ║</p>
                  <p className="text-info">╚══════════════════════════════════════════════╝</p>
                </div>

                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-mono text-muted-foreground">Informe sua Credencial/ID:</span>
                    <div className="mt-2 relative">
                      <input
                        type="text"
                        value={credencial}
                        onChange={(e) => setCredencial(e.target.value.toUpperCase())}
                        onKeyPress={handleKeyPress}
                        placeholder="Ex: F001"
                        className="w-full bg-input border border-border rounded-lg px-4 py-3 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-info/50 focus:border-info"
                        autoFocus
                      />
                      <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </label>

                  {error && (
                    <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-mono text-destructive font-semibold">ERRO NO SISTEMA</p>
                        <p className="text-sm font-mono text-destructive/80 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="flex-1 bg-info hover:bg-info/90 text-info-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSearching ? (
                        <span className="flex items-center justify-center gap-2">
                          <span className="animate-spin">⟳</span>
                          Consultando...
                        </span>
                      ) : (
                        'CONSULTAR ITINERÁRIO'
                      )}
                    </button>
                    <button
                      onClick={onBack}
                      className="px-6 py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
                    >
                      VOLTAR
                    </button>
                  </div>
                </div>

                {/* Dicas */}
                <div className="border-t border-border pt-6">
                  <p className="text-xs font-mono text-muted-foreground mb-2">Credenciais de teste disponíveis:</p>
                  <div className="flex flex-wrap gap-2">
                    {['F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007', 'F008'].map((id) => (
                      <button
                        key={id}
                        onClick={() => setCredencial(id)}
                        className="px-2 py-1 bg-secondary hover:bg-secondary/80 border border-border rounded text-xs font-mono transition-colors"
                      >
                        {id}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Success Header */}
                <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/30 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-success" />
                  <div>
                    <p className="font-mono font-semibold text-success">ITINERÁRIO GERADO COM SUCESSO</p>
                    <p className="text-xs font-mono text-success/80">Colaborador autenticado e localizado no sistema</p>
                  </div>
                </div>

                {/* Itinerary Card */}
                <div className="bg-secondary border border-border rounded-lg overflow-hidden">
                  <div className="bg-primary/10 border-b border-border px-4 py-3">
                    <p className="font-mono font-bold text-primary">ITINERÁRIO OPERACIONAL</p>
                  </div>

                  <div className="p-6 space-y-4">
                    {/* Employee Info */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-muted-foreground">COLABORADOR</p>
                        <p className="font-mono font-semibold text-foreground">{itinerario.funcionario.nome}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-mono text-muted-foreground">CREDENCIAL</p>
                        <p className="font-mono font-semibold text-foreground">{itinerario.funcionario.id}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <Wrench className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">FUNÇÃO</p>
                          <p className="font-mono font-semibold text-foreground">{itinerario.funcionario.funcao}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="h-5 w-5 text-info mt-0.5" />
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">TURNO / HORÁRIO</p>
                          <p className="font-mono font-semibold text-foreground">{itinerario.funcionario.turno}</p>
                          <p className="text-sm font-mono text-muted-foreground">{itinerario.horario}</p>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-border pt-4 grid gap-4 md:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <MapPin className="h-5 w-5 text-success mt-0.5" />
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">SETOR DESIGNADO</p>
                          <p className="font-mono font-semibold text-foreground">{itinerario.setor}</p>
                          <p className="text-sm font-mono text-muted-foreground">{itinerario.area}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="h-5 w-5 flex items-center justify-center text-warning mt-0.5">⚙</div>
                        <div>
                          <p className="text-xs font-mono text-muted-foreground">MÁQUINA DESIGNADA</p>
                          <p className="font-mono font-semibold text-foreground">{itinerario.maquina}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Route */}
                  <div className="bg-primary/5 border-t border-border px-6 py-4">
                    <p className="text-xs font-mono text-muted-foreground mb-2">ROTA OPERACIONAL</p>
                    <p className="font-mono font-bold text-primary text-lg">{itinerario.rota}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 bg-info hover:bg-info/90 text-info-foreground font-mono font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    NOVA CONSULTA
                  </button>
                  <button
                    onClick={onBack}
                    className="px-6 py-3 border border-border hover:bg-secondary font-mono rounded-lg transition-colors"
                  >
                    MENU PRINCIPAL
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
