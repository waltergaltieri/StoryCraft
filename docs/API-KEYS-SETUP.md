# 🔑 Configuración de API Keys - StoryCraft

## 🎯 Problema Resuelto

Este documento explica cómo manejar las API keys correctamente para evitar problemas con GitHub y tener un desarrollo fluido.

## ⚠️ Situación Anterior (Problemática)

- ❌ API keys hardcodeadas en el código
- ❌ GitHub bloquea push por seguridad  
- ❌ Necesidad de quitar/poner keys constantemente
- ❌ Ciclo problemático entre desarrollo y GitHub

## ✅ Solución Implementada

### **Sistema Híbrido Inteligente**

1. **Variables de entorno por defecto** (seguro para GitHub)
2. **Fallbacks comentados** para desarrollo local rápido
3. **Scripts automatizados** para verificación
4. **Documentación clara** del proceso

## 🚀 Configuración Inicial (Una Sola Vez)

### **Paso 1: Crear .env.local**

```bash
# Copia el archivo de ejemplo
npm run setup-env

# O manualmente:
cp .env.example .env.local
```

### **Paso 2: Configurar tus API Keys**

Edita `.env.local` con tus credenciales reales:

```bash
# OpenAI API Key (REQUERIDA)
OPENAI_API_KEY=sk-tu-key-real-aqui

# KieAI API Key (REQUERIDA) 
KIEAI_API_KEY=tu-kieai-key-aqui

# AIML API Key (OPCIONAL)
AIMLAPI_KEY=tu-aiml-key-aqui
```

### **Paso 3: Verificar Configuración**

```bash
# Verificar que todo esté correcto
npm run check-config

# Ejecutar con verificación automática
npm run dev-safe
```

## 🔧 Para Desarrollo Rápido (Opcional)

Si necesitas desarrollo rápido sin configurar .env.local:

### **Opción A: Descomenta fallbacks localmente**

En `lib/config.ts`, descomenta estas líneas SOLO LOCALMENTE:

```typescript
// 🚨 SOLO PARA DESARROLLO LOCAL - NUNCA HACER PUSH ASÍ
const finalOpenaiKey = openaiKey || openaiKeyFallback; // ← Descomenta
const finalKieaiKey = kieaiKey || kieaiKeyFallback;     // ← Descomenta
```

## 📤 Antes de Hacer Push a GitHub

### **IMPORTANTE:** Siempre verifica que no haya keys hardcodeadas:

```bash
# Verificar que no hay keys expuestas
grep -r "sk-proj" . --exclude-dir=node_modules
grep -r "f087ff06" . --exclude-dir=node_modules

# Si encuentras keys, comenta las líneas de fallback en lib/config.ts
```

### **Proceso de Push Seguro:**

1. **Comenta fallbacks** (si los descomentaste)
2. **Verifica que .env.local no esté en git:**
   ```bash
   git status  # .env.local NO debe aparecer
   ```
3. **Haz push normal:**
   ```bash
   git add .
   git commit -m "tu mensaje"
   git push
   ```

## 🔍 Scripts Disponibles

| Script | Función |
|--------|---------|
| `npm run check-config` | Verifica configuración de API keys |
| `npm run setup-env` | Crea .env.local desde .env.example |
| `npm run dev-safe` | Verifica config + ejecuta dev |
| `npm run dev` | Ejecuta desarrollo normal |

## 🚨 Solución de Problemas

### **Error: "API Keys no encontradas"**

```bash
# 1. Verificar que .env.local existe
ls -la .env.local

# 2. Verificar contenido (sin mostrar keys)
npm run check-config

# 3. Recrear si es necesario
npm run setup-env
```

### **Error: "GitHub bloquea push"**

1. Verifica que no hay keys hardcodeadas:
   ```bash
   git diff HEAD~1  # Ver cambios del último commit
   ```

2. Si hay keys expuestas, coméntalas en `lib/config.ts`

3. Hace commit de la corrección:
   ```bash
   git add lib/config.ts
   git commit -m "security: comentar fallbacks de API keys"
   git push
   ```

### **Error: "Next.js no carga variables"**

1. Reinicia el servidor:
   ```bash
   # Ctrl+C para parar
   npm run dev
   ```

2. Verifica sintaxis de .env.local (sin espacios alrededor del =):
   ```bash
   OPENAI_API_KEY=sk-...  # ✅ Correcto
   OPENAI_API_KEY = sk-...  # ❌ Incorrecto
   ```

## 📁 Archivos Importantes

- `.env.local` - TUS keys reales (nunca se sube a GitHub)
- `.env.example` - Plantilla (se sube a GitHub)
- `lib/config.ts` - Sistema de configuración
- `scripts/check-config.js` - Script de verificación

## 🎯 Beneficios de Esta Solución

- ✅ **Seguro para GitHub** (no bloquea push)
- ✅ **Fácil desarrollo local** (fallbacks comentados disponibles)
- ✅ **Verificación automática** (scripts de validación)
- ✅ **Documentación clara** (este archivo)
- ✅ **Proceso simple** (una configuración inicial)

---

**💡 Recuerda:** Una vez configurado .env.local correctamente, no necesitas volver a tocar las API keys. El sistema funcionará tanto en desarrollo como en producción. 