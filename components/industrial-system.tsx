'use client'

import { useState } from 'react'
import { Factory, User, Shield, Terminal } from 'lucide-react'
import { EmployeeFlow } from './employee-flow'
import { AdminFlow } from './admin-flow'

type View = 'menu' | 'employee' | 'admin'

export function IndustrialSystem() {
  const [view, setView] = useState<View>('menu')
  const [currentTime, setCurrentTime] = useState(new Date())

  // Atualiza o relógio a cada segundo
  useState(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(interval)
  })

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  if (view === 'employee') {
    return <EmployeeFlow onBack={() => setView('menu')} />
  }

  if (view === 'admin') {
    return <AdminFlow onBack={() => setView('menu')} />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Factory className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">SDOI - Sistema de Distribuição Operacional Industrial</h1>
                <p className="text-xs text-muted-foreground">Controle de Funcionários e Itinerários</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-mono text-primary">{formatTime(currentTime)}</div>
              <div className="text-xs text-muted-foreground capitalize">{formatDate(currentTime)}</div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-3xl">
          {/* Terminal Header */}
          <div className="bg-secondary border border-border rounded-t-lg px-4 py-2 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-primary" />
            <span className="text-sm font-mono text-muted-foreground">terminal@sdoi:~$</span>
            <span className="text-sm font-mono text-foreground">menu_principal</span>
          </div>

          {/* Terminal Body */}
          <div className="bg-card border-x border-b border-border rounded-b-lg p-8">
            <div className="space-y-6">
              {/* Welcome Message */}
              <div className="font-mono space-y-2">
                <p className="text-primary">╔════════════════════════════════════════════════════════════╗</p>
                <p className="text-primary">║     <span className="text-foreground">SISTEMA DE DISTRIBUIÇÃO OPERACIONAL INDUSTRIAL</span>       ║</p>
                <p className="text-primary">║                <span className="text-muted-foreground">Versão 1.0.0 - Build 2024</span>                   ║</p>
                <p className="text-primary">╚════════════════════════════════════════════════════════════╝</p>
              </div>

              <div className="border-t border-border pt-6">
                <p className="text-muted-foreground font-mono mb-6">Selecione o modo de acesso:</p>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Área do Funcionário */}
                  <button
                    onClick={() => setView('employee')}
                    className="group relative bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/50 rounded-lg p-6 text-left transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-info/10 rounded-lg group-hover:bg-info/20 transition-colors">
                        <User className="h-6 w-6 text-info" />
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-foreground mb-1">[1] ÁREA DO FUNCIONÁRIO</h3>
                        <p className="text-sm text-muted-foreground">Consultar itinerário operacional</p>
                        <p className="text-xs text-muted-foreground mt-2">→ Verificar setor e máquina designados</p>
                        <p className="text-xs text-muted-foreground">→ Gerar rota operacional</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-mono text-success">● ONLINE</span>
                    </div>
                  </button>

                  {/* Área Administrativa */}
                  <button
                    onClick={() => setView('admin')}
                    className="group relative bg-secondary hover:bg-secondary/80 border border-border hover:border-primary/50 rounded-lg p-6 text-left transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-warning/10 rounded-lg group-hover:bg-warning/20 transition-colors">
                        <Shield className="h-6 w-6 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-mono font-bold text-foreground mb-1">[2] ÁREA ADMINISTRATIVA</h3>
                        <p className="text-sm text-muted-foreground">Gerenciamento do sistema</p>
                        <p className="text-xs text-muted-foreground mt-2">→ Cadastrar/remover funcionários</p>
                        <p className="text-xs text-muted-foreground">→ Controle de colaboradores</p>
                      </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-mono text-warning">🔒 RESTRITO</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="border-t border-border pt-6 mt-6">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                  <span>Sistema Industrial v1.0</span>
                  <span>Ambiente de Produção</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Status Bar */}
      <footer className="border-t border-border bg-card py-2">
        <div className="container mx-auto px-4 flex items-center justify-between text-xs font-mono text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
              Sistema Operacional
            </span>
            <span>|</span>
            <span>Turnos: Manhã | Tarde | Noite</span>
          </div>
          <span>© 2024 SDOI Industrial</span>
        </div>
      </footer>
    </div>
  )
}
