# ✂️ ClipForge AI

Video clipper con IA — sube tu video, genera subtítulos dinámicos, detecta clips virales y exporta listos para TikTok, Reels y Shorts.

## 🚀 Deploy en Vercel (3 minutos)

### Paso 1: Sube a GitHub
```bash
git init
git add .
git commit -m "ClipForge AI"
git remote add origin https://github.com/TU_USUARIO/clipforge-ai.git
git push -u origin main
```

### Paso 2: Deploy en Vercel
1. Ve a [vercel.com](https://vercel.com) y logéate con GitHub
2. Click **"New Project"**
3. Importa tu repo `clipforge-ai`
4. En **Environment Variables** agrega:
   - `ANTHROPIC_API_KEY` = tu API key de Anthropic
5. Click **Deploy**

### Paso 3: ¡Listo!
Tu app estará en `https://clipforge-ai.vercel.app`

## 🔑 API Key de Anthropic

1. Ve a [console.anthropic.com](https://console.anthropic.com)
2. Crea una cuenta
3. Ve a **API Keys** → **Create Key**
4. Copia la key y pégala en Vercel

## 💻 Desarrollo local

```bash
# Instalar dependencias
npm install

# Crear archivo de variables
cp .env.example .env.local
# Edita .env.local y pon tu ANTHROPIC_API_KEY

# Correr en modo desarrollo
npm run dev
```

Abre http://localhost:3000

## ✨ Features

- 📹 **Sube cualquier video** (MP4, MOV, WebM)
- 🤖 **IA genera subtítulos** word-by-word sincronizados
- ✂️ **Detecta clips virales** con puntuación y caption sugerido
- 🎨 **10 estilos de caption** (Bold Behind, Neon, Karaoke, etc.)
- 🔤 **14 fuentes** premium de Google Fonts
- 🎨 **Color picker** con presets y personalizado
- 📱 **Safe Zone** por plataforma (TikTok, Instagram, YouTube)
- 🎬 **7 filtros** de video (Cinematic, Warm, Vintage, etc.)
- ⏩ **Control de velocidad** (0.5x a 2x)
- 💬 **Editor IA por chat** ("cambia a neon", "usa Bangers")
- 📤 **Exporta videos** con subtítulos incrustados (.webm)
- ⬇️ **Descarga directa** de cada clip

## 📁 Estructura

```
clipforge-ai/
├── app/
│   ├── layout.js          # Layout principal
│   ├── page.js            # Página principal
│   ├── globals.css         # Estilos globales
│   └── api/ai/route.js    # API proxy para Anthropic
├── components/
│   └── ClipForgeApp.js    # Componente principal
├── package.json
├── next.config.js
├── vercel.json
└── .env.example
```
