# 🌐 Configuração de Domínio Hostinger → Vercel

## 📋 Passo a Passo para Conectar Domínio

### 1️⃣ **Deploy no Vercel Primeiro**
```bash
# No seu terminal:
cd /Users/cristianosantos/civic-mobilization
npm run deploy:vercel
```

### 2️⃣ **Configurar DNS no Hostinger**

#### Opção A: Nameservers (Recomendado)
1. **Login na Hostinger** → Vá para "Domínios"
2. **Clique no seu domínio** (ex: marchabrasil.com)
3. **DNS/Nameservers** → Alterar Nameservers
4. **Substitua pelos nameservers do Vercel:**
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ```

#### Opção B: DNS Records (Alternativo)
Se preferir manter Hostinger DNS:

1. **Na Hostinger** → Domínios → Gerenciar DNS
2. **Adicionar/Editar Records:**

   **Para domínio principal (marchabrasil.com):**
   ```
   Tipo: A
   Nome: @
   Valor: 76.76.19.61
   TTL: 3600
   ```

   **Para www (www.marchabrasil.com):**
   ```
   Tipo: CNAME
   Nome: www
   Valor: cname.vercel-dns.com
   TTL: 3600
   ```

### 3️⃣ **Configurar no Vercel**

1. **Login no Vercel** → Vá para seu projeto
2. **Settings** → Domains
3. **Add Domain** → Digite: `marchabrasil.com`
4. **Add** → Adicione também `www.marchabrasil.com`

### 4️⃣ **Verificação**

**Aguarde propagação (5-48 horas)** e teste:
```bash
# Verificar DNS
nslookup marchabrasil.com

# Testar no navegador
https://marchabrasil.com
https://www.marchabrasil.com
```

## 🚀 **Comandos Rápidos**

### Deploy Completo:
```bash
# 1. Build e deploy
npm run build
npm run deploy:vercel

# 2. Verificar status
curl -I https://seu-projeto.vercel.app
```

### Configuração SSL:
- ✅ **Automático no Vercel** (Let's Encrypt)
- ✅ **HTTPS redirect** habilitado por padrão

## ⚡ **Configuração Expressa**

### Se você tem pressa:
1. **Deploy agora**: `npm run deploy:vercel`
2. **Use subdomínio temporário** do Vercel
3. **Configure domínio customizado depois**

### URLs temporárias:
- `https://marcha-brasil.vercel.app`
- `https://civic-mobilization.vercel.app`

## 🔧 **Troubleshooting**

### DNS não propaga:
```bash
# Verificar DNS
dig marchabrasil.com
dig www.marchabrasil.com

# Flush DNS local
sudo dscacheutil -flushcache
```

### Erro de SSL:
- Aguardar 24h para certificado automático
- Verificar se HTTPS redirect está ativo

### Domínio não funciona:
1. Verificar nameservers
2. Aguardar propagação
3. Limpar cache do navegador

## 📞 **Suporte**

- **Hostinger**: Chat/ticket support
- **Vercel**: Discord community
- **DNS Checker**: https://dnschecker.org

---

**Resultado final**: https://marchabrasil.com funcionando! 🇧🇷