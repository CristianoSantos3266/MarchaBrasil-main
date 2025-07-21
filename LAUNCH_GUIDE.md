# 🚀 Marcha Brasil - Guia de Lançamento

## ✅ Status Atual da Plataforma

### Funcionalidades Completas
- ✅ Interface principal com mapa interativo
- ✅ Sistema de navegação com todas as páginas
- ✅ Protestos e manifestações (tratoradas incluídas)
- ✅ Feed de manifestações futuras
- ✅ FAQ completo
- ✅ Páginas de apoio e doação
- ✅ Design responsivo com cores da bandeira brasileira
- ✅ Heroicons em toda a interface (sem emojis desnecessários)

### Pendências Críticas para Lançamento

## 🔧 1. Configuração do Banco de Dados (URGENTE)

### Opção A: Configurar Supabase Próprio
```bash
# 1. Criar conta em supabase.com
# 2. Criar novo projeto
# 3. Obter URL e API Key
# 4. Atualizar .env.local:
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
```

### Opção B: Usar Modo Demo (Lançamento Imediato)
```bash
# Adicionar ao .env.local:
NEXT_PUBLIC_DEMO_MODE=true
```

## 🌐 2. Deploy e Hospedagem

### Opção Recomendada: Vercel
```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Configurar domínio customizado
# marchabrasil.com -> Vercel dashboard
```

### Configurações de Ambiente para Produção
```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1Ijoicm91dHN5...
NEXT_PUBLIC_DEMO_MODE=false
```

## 📧 3. Configuração de Email (Opcional para lançamento)

### Para contato@marchabrasil.com:
- Configurar MX records no DNS
- Usar Gmail Workspace ou similar

## 🔒 4. Segurança e Compliance

### DNS e SSL:
- ✅ HTTPS automático (Vercel)
- Configurar DNSSEC
- Adicionar headers de segurança

### Políticas:
- Termos de uso
- Política de privacidade
- LGPD compliance

## 📊 5. Monitoramento (Pós-lançamento)

```bash
# Adicionar Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Monitoramento de erros
NEXT_PUBLIC_SENTRY_DSN=https://...
```

## 🚀 Passos para Lançamento HOJE

### Cenário 1: Lançamento Completo (2-3 horas)
1. Configurar Supabase novo
2. Deploy no Vercel com domínio
3. Configurar email
4. Testes finais

### Cenário 2: Lançamento Rápido (30 minutos)
1. Ativar DEMO_MODE=true
2. Deploy no Vercel
3. Usar subdomínio Vercel temporário
4. Configurar domínio depois

## 📱 URLs de Produção Sugeridas

- **Principal**: https://marchabrasil.com
- **Alternativas**: 
  - https://marcha-brasil.vercel.app (temporário)
  - https://mobilizacao-civica.com

## ⚡ Comando de Deploy Rápido

```bash
# No diretório do projeto:
echo "NEXT_PUBLIC_DEMO_MODE=true" >> .env.local
npm run build
npx vercel --prod
```

## 📋 Checklist Final

- [ ] Testar todas as páginas em produção
- [ ] Verificar responsividade mobile
- [ ] Testar formulários de contato
- [ ] Verificar velocidade de carregamento
- [ ] Confirmar SEO básico
- [ ] Backup do código fonte

## 🆘 Suporte Técnico

Em caso de problemas:
1. Verificar logs do Vercel
2. Testar localmente: `npm run dev`
3. Verificar variáveis de ambiente
4. Consultar documentação Vercel/Supabase

---

**Pronto para lançar! 🇧🇷**