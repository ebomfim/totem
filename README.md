# 🖥️ Guia de Instalação do Totem em Raspberry Pi

Este guia explica como configurar e rodar o sistema de totem localmente usando um Raspberry Pi.

---

## ✅ PRÉ-REQUISITOS

- Raspberry Pi com:
  - Raspberry Pi OS atualizado
  - Acesso à internet
  - Teclado e mouse (ou acesso via SSH)
- Chromium instalado
- Node.js 18 ou superior
- SQLite
- Projeto React/Next.js clonado ou copiado

---

## 🔧 1. Atualize o sistema

```bash
sudo apt update && sudo apt upgrade -y
```

---

## 🔧 2. Instale o Node.js e NPM

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

---

## 🔧 3. Instale dependências do sistema

```bash
sudo apt install git sqlite3 chromium-browser -y
```

---

## 📁 4. Clone ou copie o projeto

Se estiver no GitHub:

```bash
git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto
```

Ou copie manualmente via pen drive para uma pasta como:

```bash
cd ~/meu-totem
```

---

## 📦 5. Instale as dependências do projeto

```bash
npm install
```

---

## 🗃️ 6. Configure o banco de dados (Prisma + SQLite)

```bash
npx prisma generate
npx prisma migrate dev --name init
```

---

## 🚀 7. Inicie o servidor Next.js

Modo desenvolvimento:

```bash
npm run dev
```

Modo produção (recomendado):

```bash
npm run build
npm start
```

Acesse via navegador local em:

```
http://localhost:3000
```

---

## 🖼️ 8. Configurar modo Kiosk (Tela cheia automática)

Edite o arquivo:

```bash
nano ~/.config/lxsession/LXDE-pi/autostart
```

E adicione ao final:

```
@chromium-browser --kiosk http://localhost:3000
```

---

## ⚙️ (Opcional) Executar como serviço com PM2

```bash
sudo npm install -g pm2
pm2 start npm --name totem -- start
pm2 save
pm2 startup
```

---

## ✅ Pronto!

- O navegador abrirá em tela cheia com seu sistema
- Tudo funciona offline, com banco SQLite local
- Admin acessível com botão ⚙️ e senha
- A busca é resetada automaticamente após 10 segundos
