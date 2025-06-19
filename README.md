# StoryCraft AI

Una plataforma de generación de videos impulsada por IA que transforma ideas en contenido profesional para agencias de marketing.

## 🎯 Características

- **Generación de Scripts IA**: Crea guiones profesionales basados en objetivo, tono y estilo
- **96 Combinaciones de Prompts**: Sistema de prompts optimizado para diferentes tipos de contenido
- **Integración con Veo 3**: Generación de videos usando Google's Veo 3 a través de AIML API
- **Editor de Escenas**: Edita y personaliza cada escena antes de generar videos
- **Dashboard de Proyectos**: Gestiona todos tus proyectos de video en un lugar
- **Autenticación**: Sistema de login con gestión de usuarios
- **Diseño Responsivo**: Interfaz moderna con soporte para dispositivos móviles

## 🚀 Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Estado**: Zustand con persistencia
- **APIs**: OpenAI GPT-4, AIML API (Google Veo 3)
- **UI**: Componentes personalizados con Lucide React
- **Estilos**: Tailwind CSS con tema personalizado

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- API Keys:
  - OpenAI API Key
  - AIML API Key

## 🛠️ Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/storycraft-ai.git
cd storycraft-ai
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz del proyecto:
```env
OPENAI_API_KEY=tu_openai_api_key_aquí
AIMLAPI_KEY=tu_aiml_api_key_aquí
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
```
http://localhost:3000
```

## 🎨 Uso

### 1. Autenticación
- Ingresa tu nombre, email y empresa (opcional)
- Accede al dashboard principal

### 2. Crear Video
- **Paso 1**: Selecciona objetivo, tono y estilo
- **Paso 2**: Elige duración (8s, 16s, 24s, 32s) y describe tu video
- **Paso 3**: Genera el guión con IA
- **Paso 4**: Edita las escenas generadas
- **Paso 5**: Genera videos individuales o todos a la vez

### 3. Gestión de Proyectos
- Ver historial de proyectos
- Editar proyectos existentes
- Descargar videos completados
- Eliminar proyectos no deseados

## 🔧 Estructura del Proyecto

```
StoryCraft/
├── app/                 # App Router (Next.js 14)
│   ├── api/            # API Routes
│   ├── dashboard/      # Dashboard page
│   ├── create/         # Video creation flow
│   └── login/          # Authentication
├── components/         # React Components
│   ├── ui/            # UI Components base
│   ├── VideoCreator.tsx
│   ├── SceneEditor.tsx
│   └── VideoPreview.tsx
├── lib/               # Utilities y configuración
│   ├── prompts.ts     # 96 prompts para AI Filmmaker
│   ├── prompt-engineering.ts
│   └── config.ts      # Configuración de APIs
└── stores/            # Zustand stores
    └── videoStore.ts  # Estado global de la aplicación
```

## 🎯 APIs Implementadas

### `/api/filmmaker`
Genera scripts de video usando OpenAI GPT-4 con sistema de prompts optimizado.

### `/api/prompt-engineering` 
Optimiza descripciones de escenas para mejorar la generación de video.

### `/api/generate-video`
Inicia generación de video usando Google Veo 3 a través de AIML API.

### `/api/poll-video`
Verifica el estado de generación de videos y obtiene URLs de descarga.

## 🎨 Paleta de Colores

- **Primario**: Indigo (`#6366f1`)
- **Secundario**: Purple (`#8b5cf6`) 
- **Acentos**: Green (`#10b981`), Amber (`#f59e0b`)
- **Fondo**: Slate dark (`#0f172a`, `#1e293b`)

## 🚀 Deployment

### Vercel (Recomendado)
```bash
npm run build
npx vercel --prod
```

### Docker
```bash
docker build -t storycraft-ai .
docker run -p 3000:3000 storycraft-ai
```

## 🔐 Seguridad

- ✅ API Keys protegidas en variables de entorno
- ✅ Validación de entrada en todas las APIs
- ✅ Manejo de errores robusto
- ✅ Timeouts configurados para APIs externas

## 📝 Notas de Desarrollo

### Sistema de Prompts
- 96 combinaciones únicas (4 objetivos × 4 tonos × 6 estilos)
- Prompts optimizados para marketing profesional
- Soporte para duraciones variables

### Estado de Generación
- `idle`: Listo para generar
- `generating`: Video en proceso
- `completed`: Video listo
- `failed`: Error en generación

## 🐛 Troubleshooting

### Error 403 en AIML API
- Verificar que la API key tenga créditos suficientes
- Revisar límites de tier en https://aimlapi.com/app/billing

### Error de compilación
- Ejecutar `npm run build` para verificar errores
- Verificar que todas las dependencias estén instaladas

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

---

**Desarrollado con ❤️ para agencias de marketing que buscan crear contenido de video profesional con IA.** 