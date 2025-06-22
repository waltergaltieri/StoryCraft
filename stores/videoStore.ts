import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

// Types
export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
}

export interface Scene {
  id: string;
  description: string;
  isEdited?: boolean;
}

export interface EnhancedScene extends Scene {
  videoUrl?: string;
  videoProgress?: number;
  generationStatus?: 'idle' | 'generating' | 'completed' | 'failed';
  errorMessage?: string;
  aimlJobId?: string;
  optimizedPrompt?: string;
  localVideoPath?: string;
  // New fields for better error handling and retry logic
  errorType?: string;
  canRetry?: boolean;
  isStuck?: boolean;
  retryCount?: number;
  lastPolledAt?: string;
  completedAt?: string;
  lastRetryAt?: string;
}

export interface VideoProject {
  id: string;
  title: string;
  objective: string;
  tone: string;
  style: string;
  duration: number;
  description: string;
  scenes: EnhancedScene[];
  createdAt: Date;
  status: 'draft' | 'generating' | 'completed' | 'failed';
  completedVideos: number;
  totalScenes: number;
  finalVideoUrl?: string;
  localFinalVideoPath?: string;
  concatenationStatus?: 'idle' | 'concatenating' | 'completed' | 'failed';
}

export type CreationStep = 'selection' | 'script-generation' | 'scene-editing' | 'video-generation' | 'concatenating' | 'completed';

// Interfaces para campañas
export interface Campaign {
  id: string;
  name: string;
  objective: string;
  tone: string;
  style: string;
  duration: number;
  campaignDescription: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  scheduledDays: string[];
  scheduledTimes: string[];
  socialNetworks: string[];
  startDate: string;
  endDate?: string;
  totalVideos: number;
  generatedVideos: number;
  publishedVideos: number;
  createdAt: string;
  constants: {
    watermark?: string;
    brandElements?: string[];
    recurringPersons?: string[];
  };
  contentPlan: WeeklyContentPlan[];
}

export interface WeeklyContentPlan {
  weekNumber: number;
  startDate: string;
  endDate: string;
  videos: CampaignVideo[];
}

export interface CampaignVideo {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  scheduledTime: string;
  socialNetworks: string[];
  status: 'scheduled' | 'generating' | 'generated' | 'published' | 'failed';
  videoUrl?: string;
  scenes: EnhancedScene[];
  generatedTitle?: string;
  generatedDescription?: string;
  publishedAt?: string;
}

// Nueva interfaz para imágenes subidas
export interface UploadedImage {
  id: string;
  file: File;
  preview: string; // URL para preview
  type: 'persona' | 'objeto' | 'entorno';
  tag: string; // Ej: "Personaje_1", "Objeto_1", "Entorno_1"
  description?: string; // Descripción generada por IA
  isAnalyzing?: boolean; // Estado de análisis
  analysisError?: string; // Error en análisis
  uploadedAt: Date;
}

interface VideoStore {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { name: string; email: string; company?: string }) => void;
  logout: () => void;

  // Video Projects History
  projects: VideoProject[];
  currentProject: VideoProject | null;
  
  // Campaigns
  campaigns: Campaign[];
  currentCampaign: Campaign | null;
  
  // Current creation flow
  currentStep: CreationStep;
  projectName: string;
  objective: string;
  tone: string;
  style: string;
  duration: number;
  description: string;
  scenes: EnhancedScene[];
  isLoading: boolean;
  error: string | null;
  concatenationProgress: number; // Progreso de concatenación
  
  // Image management
  uploadedImages: UploadedImage[];
  maxImages: number;
  
  // OpenAI quota status
  openaiQuotaStatus: {
    hasQuota: boolean;
    message: string;
    mode: 'ai' | 'fallback' | 'uncertain';
    lastChecked: Date | null;
  };

  // Actions
  setCurrentStep: (step: CreationStep) => void;
  setProjectName: (name: string) => void;
  setObjective: (objective: string) => void;
  setTone: (tone: string) => void;
  setStyle: (style: string) => void;
  setDuration: (duration: number) => void;
  setDescription: (description: string) => void;
  setScenes: (scenes: EnhancedScene[]) => void;
  updateScene: (sceneId: string, newDescription: string) => void;
  setError: (error: string | null) => void;

  // Project management
  createNewProject: () => void;
  saveCurrentProject: () => void;
  loadProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  startNewProject: () => void;

  // API calls
  generateScript: () => Promise<void>;
  generateAllVideos: () => Promise<void>;
  generateSingleVideo: (sceneId: string) => Promise<void>;
  pollVideoStatus: (sceneId: string) => Promise<void>;
  refreshAllVideoStatus: () => Promise<void>;

  // Video processing
  concatenateVideos: () => Promise<void>;
  downloadVideoLocally: (videoUrl: string, filename: string) => Promise<string | null>;
  createConcatenatedVideoBlob: (videoPaths: string[]) => Promise<Blob>;
  saveVideoBlob: (blob: Blob, filename: string) => Promise<string | null>;
  saveProjectLocally: () => void;
  loadLocalProjects: () => VideoProject[];

  // Reset
  reset: () => void;

  // New functions
  retrySceneGeneration: (sceneId: string, retryType?: 'same-prompt' | 'regenerate-prompt' | 'force-new') => Promise<void>;
  diagnoseSceneIssue: (sceneId: string) => Promise<any>;
  
  // Emergency functions
  stopAllPolling: () => void;
  forceStopGeneratingScenes: () => void;
  
  // Image management functions
  uploadImage: (file: File, type: 'persona' | 'objeto' | 'entorno') => Promise<void>;
  removeImage: (imageId: string) => void;
  analyzeImageWithAI: (imageId: string) => Promise<void>;
  insertImageTag: (tag: string, position: number) => void;
  replaceTagsInDescription: (text: string) => string;
  fileToBase64: (file: File) => Promise<string>;
  
  // OpenAI quota management
  checkOpenAIQuota: () => Promise<void>;
  setQuotaStatus: (status: { hasQuota: boolean; message: string; mode: 'ai' | 'fallback' | 'uncertain' }) => void;
  
  // Campaign management
  createCampaign: (campaignData: Omit<Campaign, 'id' | 'createdAt' | 'generatedVideos' | 'publishedVideos' | 'contentPlan'>) => Promise<void>;
  updateCampaign: (campaignId: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (campaignId: string) => void;
  pauseCampaign: (campaignId: string) => void;
  resumeCampaign: (campaignId: string) => void;
  archiveCampaign: (campaignId: string) => void;
  generateCampaignContent: (campaignId: string) => Promise<void>;
  generateVideoDescriptions: (campaignId: string) => Promise<void>;
  generateSpecificVideoDescription: (campaignDescription: string, objective: string, scheduledDate: string, socialNetworks: string[], videoNumber: number, totalVideosInWeek: number) => Promise<string>;
  regenerateVideoDescription: (campaignId: string, videoId: string) => Promise<void>;
  generateCampaignVideo: (campaignId: string, videoId: string) => Promise<void>;
  simulatePublishVideo: (campaignId: string, videoId: string) => Promise<void>;
  downloadCampaignVideo: (campaignId: string, videoId: string) => void;
}

const useVideoStore = create<VideoStore>()(
  persist(
    (set, get) => ({
      // Authentication
      user: null,
      isAuthenticated: false,
      login: (userData) => {
        const user: User = {
          id: Math.random().toString(36).substr(2, 9),
          ...userData
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false,
          projects: [],
          currentProject: null
        });
        get().reset();
      },

        // Video Projects
  projects: [],
  currentProject: null,
  
  // Campaigns
  campaigns: [],
  currentCampaign: null,

      // Current creation state
      currentStep: 'selection',
      projectName: '',
      objective: '',
      tone: '',
      style: '',
      duration: 8, // Compatible con Kling 1.0 Pro (10 segundos por escena)
      description: '',
      scenes: [],
      isLoading: false,
        error: null,
  concatenationProgress: 0,
  
  // Image management
  uploadedImages: [],
  maxImages: 10,
  
  // OpenAI quota status
  openaiQuotaStatus: {
    hasQuota: true,
    message: 'No verificado',
    mode: 'ai',
    lastChecked: null
  },

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
      setProjectName: (projectName) => set({ projectName }),
      setObjective: (objective) => set({ objective }),
      setTone: (tone) => set({ tone }),
      setStyle: (style) => set({ style }),
      setDuration: (duration) => set({ duration }),
      setDescription: (description) => set({ description }),
      setScenes: (scenes) => set({ scenes }),
      setError: (error) => set({ error }),

      updateScene: (sceneId, newDescription) => {
        const scenes = get().scenes.map(scene =>
          scene.id === sceneId
            ? { ...scene, description: newDescription, isEdited: true }
            : scene
        );
        set({ scenes });
        
        // Update current project if exists
        const currentProject = get().currentProject;
        if (currentProject) {
          const updatedProject = { ...currentProject, scenes };
          set({ currentProject: updatedProject });
          get().saveCurrentProject();
        }
      },

      // Project management
      createNewProject: () => {
        const { projectName, objective, tone, style, duration, description, scenes } = get();
        
        // Generar ID único para el proyecto
        const projectId = `project-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
        
        const newProject: VideoProject = {
          id: projectId,
          title: projectName || `${objective} - ${style}`, // Usar nombre del proyecto o fallback
          objective,
          tone,
          style,
          duration,
          description,
          scenes,
          createdAt: new Date(),
          status: 'draft',
          completedVideos: 0,
          totalScenes: scenes.length
        };
        
        console.log(`🆕 Nuevo proyecto creado: "${newProject.title}" (ID: ${projectId})`);
        set({ currentProject: newProject });
      },

      saveCurrentProject: () => {
        const currentProject = get().currentProject;
        if (!currentProject) return;

        const projects = get().projects;
        const existingIndex = projects.findIndex(p => p.id === currentProject.id);
        
        const updatedProject = {
          ...currentProject,
          scenes: get().scenes,
          completedVideos: get().scenes.filter(s => s.generationStatus === 'completed').length,
          status: get().scenes.every(s => s.generationStatus === 'completed') ? 'completed' as const :
                 get().scenes.some(s => s.generationStatus === 'generating') ? 'generating' as const :
                 get().scenes.some(s => s.generationStatus === 'failed') ? 'failed' as const : 'draft' as const
        };

        if (existingIndex >= 0) {
          const newProjects = [...projects];
          newProjects[existingIndex] = updatedProject;
          set({ projects: newProjects, currentProject: updatedProject });
        } else {
          set({ 
            projects: [...projects, updatedProject],
            currentProject: updatedProject
          });
        }
      },

      loadProject: (projectId) => {
        const project = get().projects.find(p => p.id === projectId);
        if (project) {
          // Determinar el paso correcto basado en el estado del proyecto
          let currentStep: CreationStep = 'selection';
          
          if (project.status === 'completed' && project.finalVideoUrl) {
            // Proyecto completado con video final - IR DIRECTO AL VIDEO FINAL
            currentStep = 'completed';
          } else if (project.concatenationStatus === 'concatenating') {
            // Proyecto en proceso de concatenación
            currentStep = 'concatenating';
          } else if (project.scenes.length > 0) {
            const completedScenes = project.scenes.filter(s => s.generationStatus === 'completed').length;
            const generatingScenes = project.scenes.filter(s => s.generationStatus === 'generating').length;
            
            if (completedScenes === project.scenes.length && !project.finalVideoUrl) {
              // Todas las escenas completadas pero SIN video final - Mostrar botón "Crear Video Final"
              currentStep = 'scene-editing';
            } else if (generatingScenes > 0 || completedScenes > 0) {
              // Algunas escenas en progreso o completadas
              currentStep = 'video-generation';
            } else {
              // Escenas creadas pero videos no iniciados
              currentStep = 'scene-editing';
            }
          }
          
          set({
            currentProject: project,
            projectName: project.title,
            objective: project.objective,
            tone: project.tone,
            style: project.style,
            duration: project.duration,
            description: project.description,
            scenes: project.scenes,
            currentStep,
            concatenationProgress: project.status === 'completed' ? 100 : 0
          });
          
          console.log(`📂 Proyecto cargado: "${project.title}" (ID: ${projectId}) - Paso: ${currentStep}`);
        }
      },

      deleteProject: (projectId) => {
        const projects = get().projects.filter(p => p.id !== projectId);
        set({ projects });
        
        const currentProject = get().currentProject;
        if (currentProject?.id === projectId) {
          set({ currentProject: null });
          get().reset();
        }
        
        // Limpiar blobs del proyecto eliminado
        if ((window as any).storyCraftVideoBlobs && (window as any).storyCraftVideoBlobs[projectId]) {
          const projectBlobs = (window as any).storyCraftVideoBlobs[projectId];
          Object.values(projectBlobs).forEach((item: any) => {
            if (item.url) {
              URL.revokeObjectURL(item.url);
            }
          });
          delete (window as any).storyCraftVideoBlobs[projectId];
          console.log(`🗑️ Blobs del proyecto ${projectId} limpiados`);
        }
      },

      startNewProject: () => {
        set({
          currentStep: 'selection',
          projectName: '',
          objective: '',
          tone: '',
          style: '',
          duration: 8,
          description: '',
          scenes: [],
          isLoading: false,
          error: null,
          currentProject: null
        });
      },

      // API calls
      generateScript: async () => {
        const { objective, tone, style, duration, description } = get();
        
        if (!objective || !tone || !style || !description) {
          set({ error: 'Please fill in all required fields' });
          return;
        }

        set({ isLoading: true, error: null, currentStep: 'script-generation' });

        try {
          // Reemplazar tags con descripciones de imágenes
          const processedDescription = get().replaceTagsInDescription(description);
          
          console.log('🎬 Generando guión con parámetros:', {
            objective,
            tone,
            style,
            duration,
            originalDescription: description?.substring(0, 100) + '...',
            processedDescription: processedDescription?.substring(0, 100) + '...',
            hasImageTags: description !== processedDescription,
            uploadedImages: get().uploadedImages.length
          });

          const response = await axios.post('/api/filmmaker', {
            objective,
            tone,
            style,
            duration,
            description: processedDescription // Usar descripción procesada
          });

          const scenesData = response.data.scenes || [];
          const enhancedScenes: EnhancedScene[] = scenesData.map((scene: any, index: number) => ({
            id: `scene-${index + 1}`,
            description: typeof scene.description === 'string' ? scene.description : JSON.stringify(scene.description),
            generationStatus: 'idle' as const
          }));

          set({ 
            scenes: enhancedScenes,
            currentStep: 'scene-editing',
            isLoading: false 
          });

          // Create and save project
          get().createNewProject();
          get().saveCurrentProject();
          
        } catch (error) {
          console.error('Error generating script:', error);
          set({ 
            error: 'Failed to generate script. Please try again.',
            isLoading: false,
            currentStep: 'selection'
          });
        }
      },

      generateAllVideos: async () => {
        const scenes = get().scenes;
        set({ currentStep: 'video-generation' });

        // First, check if any scenes are already generating and poll their status
        for (const scene of scenes) {
          if (scene.generationStatus === 'generating' && scene.aimlJobId) {
            console.log(`🔄 Scene ${scene.id} already generating, checking status...`);
            get().pollVideoStatus(scene.id); // Don't await, let it run in parallel
          }
        }

        // Then generate new videos for scenes that need it
        for (const scene of scenes) {
          if (scene.generationStatus !== 'completed' && scene.generationStatus !== 'generating') {
            await get().generateSingleVideo(scene.id);
          }
        }

        get().saveCurrentProject();
        // No cambiar a 'completed' aquí - dejar que la auto-concatenación se active
        // El componente VideoGenerationProgress se encargará de activar la concatenación
      },

      generateSingleVideo: async (sceneId: string) => {
        const scenes = get().scenes;
        const sceneIndex = scenes.findIndex(s => s.id === sceneId);
        
        if (sceneIndex === -1) return;
        
        // Skip if already completed
        if (scenes[sceneIndex].generationStatus === 'completed') {
          console.log(`⏭️ Scene ${sceneId} already completed, skipping generation`);
          return;
        }

        // Update scene status to generating
        const updatedScenes = [...scenes];
        updatedScenes[sceneIndex] = {
          ...updatedScenes[sceneIndex],
          generationStatus: 'generating',
          videoProgress: 0
        };
        set({ scenes: updatedScenes });

        try {
          // 🧠 REGENERACIÓN CONTEXTUAL INTELIGENTE
          // Preparar contexto completo del proyecto para mantener coherencia
          const currentProject = get().currentProject;
          const { objective, tone, style, duration, description, projectName } = get();
          
          const sceneToRegenerate = {
            id: sceneId,
            description: typeof scenes[sceneIndex].description === 'string' 
              ? scenes[sceneIndex].description 
              : JSON.stringify(scenes[sceneIndex].description),
            sceneNumber: sceneIndex + 1
          };

          const projectContext = {
            objective,
            tone,
            style,
            duration,
            description,
            projectTitle: projectName || currentProject?.title || 'Video Project'
          };

          const allScenes = scenes.map((scene, index) => ({
            id: scene.id,
            description: typeof scene.description === 'string' 
              ? scene.description 
              : JSON.stringify(scene.description),
            sceneNumber: index + 1,
            isTarget: scene.id === sceneId
          }));

          console.log(`🧠 Regenerando Escena ${sceneIndex + 1} con contexto completo del proyecto:`);
          console.log(`📋 Proyecto: "${projectContext.projectTitle}"`);
          console.log(`🎯 Objetivo: ${objective} | Tono: ${tone} | Estilo: ${style}`);
          console.log(`📚 Total escenas: ${scenes.length} | Regenerando: Escena ${sceneIndex + 1}`);

          // Step 1: Generar prompt contextual que mantiene coherencia narrativa
          const promptResponse = await axios.post('/api/prompt-engineering', {
            scene: sceneToRegenerate.description,
            regenerationMode: true,
            sceneToRegenerate,
            projectContext,
            allScenes,
            contextualPrompt: true
          });

          const optimizedPrompt = promptResponse.data.optimizedPrompt;
          
          console.log(`✨ Prompt contextual generado para Escena ${sceneIndex + 1}`);
          console.log(`📝 Longitud del prompt: ${optimizedPrompt.length} caracteres`);
          
          // Update scene with optimized prompt
          updatedScenes[sceneIndex] = {
            ...updatedScenes[sceneIndex],
            optimizedPrompt,
            videoProgress: 25
          };
          set({ scenes: [...updatedScenes] });

          // Step 2: Generate video with Veo 3 (KieAI) usando prompt contextual
          const videoResponse = await axios.post('/api/generate-video', {
            prompt: optimizedPrompt,
            duration: Math.round(duration / scenes.length), // Duración proporcional
            enhancePrompt: false, // Ya está optimizado contextualmente
            generateAudio: true,
            sceneContext: {
              sceneNumber: sceneIndex + 1,
              totalScenes: scenes.length,
              isRegeneration: true,
              projectStyle: style
            }
          });

          if (videoResponse.data.generationId) {
            const generationId = videoResponse.data.generationId;
            
            console.log(`🎬 Iniciando generación de video para Escena ${sceneIndex + 1} con ID: ${generationId}`);
            
            // Update scene with generation ID
            updatedScenes[sceneIndex] = {
              ...updatedScenes[sceneIndex],
              aimlJobId: generationId,
              videoProgress: 50
            };
            set({ scenes: [...updatedScenes] });

            // Step 3: Poll for completion
            await get().pollVideoStatus(sceneId);
          } else {
            throw new Error(videoResponse.data.message || 'Failed to start video generation');
          }

        } catch (error: any) {
          console.error(`❌ Error regenerando video para Escena ${sceneIndex + 1}:`, error);
          
          // Update scene status to failed
          updatedScenes[sceneIndex] = {
            ...updatedScenes[sceneIndex],
            generationStatus: 'failed',
            errorMessage: error.response?.data?.error || error.message || 'Unknown error',
            videoProgress: 0
          };
          set({ scenes: [...updatedScenes] });
        }
      },

      pollVideoStatus: async (sceneId: string) => {
        const initialScene = get().scenes.find(s => s.id === sceneId);
        if (!initialScene || !initialScene.aimlJobId) {
          console.error('Scene not found or missing aimlJobId:', sceneId);
          return;
        }

        console.log(`📊 Starting polling for scene ${sceneId} with aimlJobId: ${initialScene.aimlJobId}`);

        const maxAttempts = 40; // Reducido a 6.7 minutos máximo
        let attempts = 0;
        let consecutiveErrors = 0;
        let lastStatus = 'generating';
        let stuckAtProgressCount = 0;
        let lastProgress = 0;
        let isPollingActive = true; // 🚨 CONTROL DE PARADA

        const poll = async (): Promise<void> => {
          // 🚨 MÚLTIPLES CONDICIONES DE PARADA
          if (!isPollingActive || attempts >= maxAttempts || stuckAtProgressCount > 8) {
            isPollingActive = false; // Detener polling
            
            // Determinar el tipo de error basado en la situación
            let errorType = 'TIMEOUT';
            let errorMessage = 'Tiempo de espera agotado - polling detenido para evitar consumo excesivo';
            
            if (consecutiveErrors > 3) {
              errorType = 'CONNECTION_ERROR';
              errorMessage = 'Problemas de conexión - polling detenido';
            } else if (stuckAtProgressCount > 8) {
              errorType = 'PROGRESS_STUCK';
              errorMessage = 'Generación atascada - polling detenido para prevenir bucle infinito';
            }

            console.log(`🛑 POLLING DETENIDO para scene ${sceneId}: ${errorMessage}`);

            const currentScenes = get().scenes;
            const updatedScenes = currentScenes.map(s =>
              s.id === sceneId
                ? { 
                    ...s, 
                    generationStatus: 'failed' as const, 
                    errorMessage,
                    errorType,
                    canRetry: true,
                    lastPolledAt: new Date().toISOString()
                  }
                : s
            );
            set({ scenes: updatedScenes });
            return;
          }

          try {
            const response = await axios.get(`/api/poll-video?generationId=${initialScene.aimlJobId}`);
            
            // Reset consecutive errors on successful response
            consecutiveErrors = 0;
            
            if (response.data.status === 'completed' && response.data.videoUrl) {
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'completed' as const,
                      videoUrl: response.data.videoUrl,
                      videoProgress: 100,
                      completedAt: new Date().toISOString(),
                      errorType: undefined,
                      errorMessage: undefined
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              get().saveCurrentProject();
              
              console.log(`✅ Scene ${sceneId} completed successfully with video: ${response.data.videoUrl}`);
              return;
              
            } else if (response.data.status === 'error') {
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'failed' as const,
                      errorMessage: response.data.errorMessage || 'Error en la generación',
                      errorType: response.data.code || 'GENERATION_ERROR',
                      canRetry: true,
                      lastPolledAt: new Date().toISOString()
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              return;
              
            } else {
              // Still processing - analizar progreso
              attempts++;
              
              const currentProgress = response.data.progress || Math.min(10 + (attempts * 1.5), 95);
              
              // Detectar si está atascado en el mismo progreso
              if (currentProgress === lastProgress) {
                stuckAtProgressCount++;
              } else {
                stuckAtProgressCount = 0;
                lastProgress = currentProgress;
              }
              
              // Detectar si está atascado en 50% por mucho tiempo
              if (currentProgress === 50 && attempts > 10) {
                stuckAtProgressCount = Math.max(stuckAtProgressCount, 6);
              }

              // 🚨 CONDICIÓN CRÍTICA: Si está muy atascado, detener
              if (stuckAtProgressCount > 8) {
                console.log(`🛑 DETENIENDO polling para scene ${sceneId} - demasiado tiempo atascado`);
                isPollingActive = false;
                return; // Salir inmediatamente
              }
              
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      videoProgress: currentProgress,
                      lastPolledAt: new Date().toISOString(),
                      isStuck: stuckAtProgressCount > 5
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              
              // 🚨 SOLO continuar si el polling sigue activo
              if (isPollingActive && attempts < maxAttempts) {
                const pollingInterval = stuckAtProgressCount > 3 ? 15000 : 12000;
                setTimeout(poll, pollingInterval);
              } else {
                console.log(`🛑 Polling detenido para scene ${sceneId} - límites alcanzados`);
                isPollingActive = false;
              }
            }
            
          } catch (error) {
            console.error(`Error polling video status for scene ${sceneId}:`, error);
            consecutiveErrors++;
            attempts++;
            
            // Analizar el tipo de error
            let errorType = 'UNKNOWN_ERROR';
            let errorMessage = 'Error desconocido';
            
                         if (axios.isAxiosError(error)) {
               if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
                 errorType = 'TIMEOUT_ERROR';
                 errorMessage = 'Tiempo de espera agotado en la consulta';
               } else if (error.response && error.response.status === 404) {
                 errorType = 'NOT_FOUND';
                 errorMessage = 'Video no encontrado en el servidor';
               } else if (error.response && error.response.status === 429) {
                 errorType = 'RATE_LIMIT';
                 errorMessage = 'Límite de consultas excedido';
               } else if (error.response && error.response.status >= 500) {
                 errorType = 'SERVER_ERROR';
                 errorMessage = 'Error del servidor de video';
               }
             }
            
            // Si hay muchos errores consecutivos, marcar como fallido
            if (consecutiveErrors >= 5 || attempts >= maxAttempts) {
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'failed' as const,
                      errorMessage: errorMessage,
                      errorType: errorType,
                      canRetry: true,
                      lastPolledAt: new Date().toISOString()
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              return;
            }
            
            // 🚨 SOLO continuar si el polling sigue activo
            if (isPollingActive && attempts < maxAttempts && consecutiveErrors < 5) {
              const retryInterval = Math.min(15000 * Math.pow(1.5, consecutiveErrors), 60000);
              setTimeout(poll, retryInterval);
            } else {
              console.log(`🛑 Polling detenido por errores para scene ${sceneId}`);
              isPollingActive = false;
            }
          }
        };

        await poll();
      },

      refreshAllVideoStatus: async () => {
        const scenes = get().scenes;
        const generatingScenes = scenes.filter(s => 
          s.generationStatus === 'generating' && s.aimlJobId
        );

        if (generatingScenes.length === 0) {
          console.log('📊 No scenes currently generating, nothing to refresh');
          return;
        }

        console.log(`📊 Refreshing status for ${generatingScenes.length} generating scenes...`);
        
        // Log details about each generating scene
        generatingScenes.forEach(scene => {
          console.log(`🔍 Scene ${scene.id}: aimlJobId=${scene.aimlJobId}, status=${scene.generationStatus}, progress=${scene.videoProgress}%`);
        });
        
        // Poll all generating scenes in parallel
        const promises = generatingScenes.map(scene => 
          get().pollVideoStatus(scene.id)
        );
        
        await Promise.allSettled(promises);
        console.log('📊 Finished refreshing all video statuses');
      },

      // Video processing
      concatenateVideos: async () => {
        console.log('🎬 Función concatenateVideos llamada');
        
        const scenes = get().scenes;
        const completedScenes = scenes.filter(s => s.generationStatus === 'completed' && s.videoUrl);
        
        console.log('📊 Estado de escenas para concatenación:', {
          totalScenes: scenes.length,
          completedScenes: completedScenes.length,
          scenesData: scenes.map(s => ({
            id: s.id,
            status: s.generationStatus,
            hasVideoUrl: !!s.videoUrl,
            videoUrl: s.videoUrl ? s.videoUrl.substring(0, 50) + '...' : 'NO'
          }))
        });
        
        if (completedScenes.length === 0) {
          console.error('❌ No hay videos completados para concatenar');
          set({ error: 'No hay videos completados para concatenar' });
          return;
        }

        set({ 
          currentStep: 'concatenating',
          concatenationProgress: 0,
          error: null 
        });

        try {
          // Simular proceso de concatenación
          // En un entorno real, aquí usarías FFmpeg.js o similar
          set({ concatenationProgress: 25 });
          
          // Descargar cada video localmente primero EN ORDEN CORRECTO
          const localVideoPaths: string[] = [];
          const project = get().currentProject;
          const projectId = project?.id || 'unknown';
          
          console.log(`📥 Descargando ${completedScenes.length} videos en orden para proyecto: ${project?.title} (${projectId})`);
          
          for (let i = 0; i < completedScenes.length; i++) {
            const scene = completedScenes[i];
            console.log(`📥 Descargando Escena ${i + 1}: ${scene.description.substring(0, 50)}...`);
            
            if (scene.videoUrl) {
              // Nombre de archivo único por proyecto y escena
              const filename = `${projectId}-scene-${i + 1}-${scene.id}.mp4`;
              const localPath = await get().downloadVideoLocally(scene.videoUrl, filename);
              
              if (localPath) {
                localVideoPaths.push(localPath);
                console.log(`✅ Escena ${i + 1} descargada correctamente: ${filename}`);
              } else {
                console.error(`❌ Error descargando Escena ${i + 1}: ${filename}`);
              }
            }
            set({ concatenationProgress: 25 + (i + 1) / completedScenes.length * 50 });
          }
          
          console.log(`📥 Total de videos descargados: ${localVideoPaths.length}/${completedScenes.length}`);

          // Simular concatenación (en producción usarías FFmpeg.js)
          set({ concatenationProgress: 75 });
          
          // Para el MVP, crear un "video final" simulado
          const finalVideoBlob = await get().createConcatenatedVideoBlob(localVideoPaths);
          const finalVideoUrl = URL.createObjectURL(finalVideoBlob);
          
          // Guardar localmente el video final
          const finalFilename = `${projectId}-final-video-${Date.now()}.webm`;
          const localFinalPath = await get().saveVideoBlob(finalVideoBlob, finalFilename);

          set({ concatenationProgress: 100 });

          // Actualizar el proyecto actual
          const currentProject = get().currentProject;
          if (currentProject) {
            const updatedProject = {
              ...currentProject,
              finalVideoUrl,
              localFinalVideoPath: localFinalPath || undefined,
              concatenationStatus: 'completed' as const,
              status: 'completed' as const
            };
            
            // Actualizar también la lista de proyectos
            const projects = get().projects;
            const updatedProjects = projects.map(p => 
              p.id === currentProject.id ? updatedProject : p
            );
            
            set({ 
              currentProject: updatedProject,
              projects: updatedProjects,
              currentStep: 'completed' 
            });
            
            // Guardar proyecto localmente
            get().saveProjectLocally();
            
            console.log(`✅ Proyecto ${currentProject.title} completado con video final`);
          }

        } catch (error) {
          console.error('Error concatenating videos:', error);
          set({ 
            error: 'Error al concatenar videos. Intenta nuevamente.',
            concatenationProgress: 0,
            currentStep: 'video-generation'
          });
        }
      },

      downloadVideoLocally: async (videoUrl: string, filename: string) => {
        try {
          console.log(`📥 Descargando video: ${filename}`);
          
          const response = await fetch(videoUrl);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const blob = await response.blob();
          console.log(`📥 Video descargado: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);
          
          // Crear URL local para el blob
          const localUrl = URL.createObjectURL(blob);
          
          // Guardar referencia del blob para evitar que se libere prematuramente
          const currentProject = get().currentProject;
          if (currentProject) {
            // Crear un "almacén" temporal de blobs por proyecto
            if (!(window as any).storyCraftVideoBlobs) {
              (window as any).storyCraftVideoBlobs = {};
            }
            if (!(window as any).storyCraftVideoBlobs[currentProject.id]) {
              (window as any).storyCraftVideoBlobs[currentProject.id] = {};
            }
            (window as any).storyCraftVideoBlobs[currentProject.id][filename] = {
              blob,
              url: localUrl,
              timestamp: Date.now()
            };
          }
          
          return localUrl;
          
        } catch (error) {
          console.error(`Error descargando video ${filename}:`, error);
          return null;
        }
      },

      createConcatenatedVideoBlob: async (videoPaths: string[]) => {
        try {
          console.log('🎬 Iniciando concatenación REAL de videos CON AUDIO:', videoPaths.map((_, i) => `Escena ${i + 1}`));
          
          if (videoPaths.length === 1) {
            // Si solo hay un video, devolverlo directamente
            console.log('📹 Solo una escena, devolviendo video original');
            const response = await fetch(videoPaths[0]);
            return await response.blob();
          }

          // CONCATENACIÓN REAL CON AUDIO usando Canvas + Audio Context
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) throw new Error('No se pudo crear contexto de canvas');

          // Configurar canvas para video HD
          canvas.width = 1920; // 1080p width
          canvas.height = 1080; // 1080p height

          // Crear AudioContext para manejar audio
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const audioDestination = audioContext.createMediaStreamDestination();

          // Combinar streams de video y audio
          const videoStream = canvas.captureStream(30); // 30 FPS
          const combinedStream = new MediaStream([
            ...videoStream.getVideoTracks(),
            ...audioDestination.stream.getAudioTracks()
          ]);

          // Crear MediaRecorder con stream combinado
          const mediaRecorder = new MediaRecorder(combinedStream, {
            mimeType: 'video/webm;codecs=vp9,opus' // Video con audio
          });

          const chunks: Blob[] = [];
          
          return new Promise<Blob>((resolve, reject) => {
            mediaRecorder.ondataavailable = (event) => {
              if (event.data.size > 0) {
                chunks.push(event.data);
              }
            };

            mediaRecorder.onstop = () => {
              audioContext.close();
              const finalBlob = new Blob(chunks, { type: 'video/webm' });
              console.log(`✅ Video final concatenado CON AUDIO: ${videoPaths.length} escenas, tamaño: ${(finalBlob.size / 1024 / 1024).toFixed(2)}MB`);
              resolve(finalBlob);
            };

            mediaRecorder.onerror = (error) => {
              console.error('Error en MediaRecorder:', error);
              audioContext.close();
              reject(error);
            };

            // Función para reproducir cada video en el canvas Y capturar audio
            const playVideosSequentially = async () => {
              mediaRecorder.start();
              
              for (let i = 0; i < videoPaths.length; i++) {
                console.log(`🎬 Procesando Escena ${i + 1}/${videoPaths.length} (Video + Audio)`);
                
                try {
                  const video = document.createElement('video');
                  video.crossOrigin = 'anonymous';
                  video.muted = false; // IMPORTANTE: NO silenciar para capturar audio
                  video.volume = 1.0; // Volumen completo
                  
                  // Cargar video
                  await new Promise<void>((resolveVideo, rejectVideo) => {
                    video.onloadedmetadata = () => {
                      console.log(`📹 Video ${i + 1} cargado: ${video.duration}s`);
                      resolveVideo();
                    };
                    video.onerror = () => rejectVideo(new Error(`Error cargando video ${i + 1}`));
                    video.src = videoPaths[i];
                  });

                  // Crear fuente de audio para este video
                  let audioSource: MediaElementAudioSourceNode | null = null;
                  try {
                    audioSource = audioContext.createMediaElementSource(video);
                    audioSource.connect(audioDestination);
                    console.log(`🔊 Audio conectado para Escena ${i + 1}`);
                  } catch (audioError) {
                    console.warn(`⚠️ No se pudo conectar audio para Escena ${i + 1}:`, audioError);
                  }

                  // Reproducir video en canvas Y capturar audio
                  await new Promise<void>((resolvePlayback) => {
                    video.currentTime = 0;
                    
                    const playPromise = video.play();
                    if (playPromise) {
                      playPromise.catch(playError => {
                        console.warn(`⚠️ Error reproduciendo video ${i + 1}:`, playError);
                      });
                    }

                    const drawFrame = () => {
                      if (video.ended || video.paused) {
                        console.log(`✅ Escena ${i + 1} completada (Video + Audio)`);
                        
                        // Desconectar audio source
                        if (audioSource) {
                          try {
                            audioSource.disconnect();
                          } catch (disconnectError) {
                            console.warn('Error desconectando audio:', disconnectError);
                          }
                        }
                        
                        resolvePlayback();
                        return;
                      }

                      // Dibujar frame actual en canvas
                      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                      requestAnimationFrame(drawFrame);
                    };

                    video.ontimeupdate = drawFrame;
                    video.onended = () => {
                      // Desconectar audio source
                      if (audioSource) {
                        try {
                          audioSource.disconnect();
                        } catch (disconnectError) {
                          console.warn('Error desconectando audio:', disconnectError);
                        }
                      }
                      resolvePlayback();
                    };
                  });

                } catch (error) {
                  console.error(`Error procesando video ${i + 1}:`, error);
                  throw error;
                }
              }

              console.log('🎬 Todas las escenas procesadas (Video + Audio), finalizando grabación...');
              mediaRecorder.stop();
            };

            // Iniciar procesamiento
            playVideosSequentially().catch(reject);
          });

        } catch (error) {
          console.error('Error en concatenación real:', error);
          throw error;
        }
      },

      saveVideoBlob: async (blob: Blob, filename: string) => {
        try {
          const url = URL.createObjectURL(blob);
          console.log(`💾 Video final guardado: ${filename} (${(blob.size / 1024 / 1024).toFixed(2)}MB)`);
          
          // Guardar referencia del blob final
          const currentProject = get().currentProject;
          if (currentProject) {
            if (!(window as any).storyCraftVideoBlobs) {
              (window as any).storyCraftVideoBlobs = {};
            }
            if (!(window as any).storyCraftVideoBlobs[currentProject.id]) {
              (window as any).storyCraftVideoBlobs[currentProject.id] = {};
            }
            (window as any).storyCraftVideoBlobs[currentProject.id]['final'] = {
              blob,
              url,
              filename,
              timestamp: Date.now()
            };
            
            console.log(`💾 Video final registrado en proyecto: ${currentProject.title}`);
          }
          
          return url;
        } catch (error) {
          console.error('Error guardando video final:', error);
          return null;
        }
      },

      saveProjectLocally: () => {
        try {
          const currentProject = get().currentProject;
          if (!currentProject) return;

          // Obtener proyectos existentes del localStorage
          const existingProjects: VideoProject[] = JSON.parse(
            localStorage.getItem('storycraft-projects') || '[]'
          );

          // Actualizar o agregar el proyecto actual
          const projectIndex = existingProjects.findIndex(p => p.id === currentProject.id);
          
          if (projectIndex >= 0) {
            existingProjects[projectIndex] = currentProject;
          } else {
            existingProjects.push(currentProject);
          }

          // Guardar en localStorage
          localStorage.setItem('storycraft-projects', JSON.stringify(existingProjects));
          
          console.log('Proyecto guardado localmente:', currentProject.title);
          
        } catch (error) {
          console.error('Error saving project locally:', error);
        }
      },

      loadLocalProjects: () => {
        try {
          const projectsData = localStorage.getItem('storycraft-projects');
          if (!projectsData) return [];

          const projects: VideoProject[] = JSON.parse(projectsData);
          
          // Actualizar el estado con los proyectos cargados
          set({ projects });
          
          return projects;
        } catch (error) {
          console.error('Error loading local projects:', error);
          return [];
        }
      },

      reset: () => {
        // Limpiar URLs de preview de imágenes
        const currentImages = get().uploadedImages;
        currentImages.forEach(image => {
          URL.revokeObjectURL(image.preview);
        });

        set({
          currentStep: 'selection',
          projectName: '',
          objective: '',
          tone: '',
          style: '',
          duration: 8,
          description: '',
          scenes: [],
          isLoading: false,
          error: null,
          currentProject: null,
          uploadedImages: []
        });
      },

      // New functions
      retrySceneGeneration: async (sceneId: string, retryType: 'same-prompt' | 'regenerate-prompt' | 'force-new' = 'same-prompt') => {
        const scene = get().scenes.find(s => s.id === sceneId);
        if (!scene) {
          console.error('Scene not found for retry:', sceneId);
          return;
        }

        console.log(`🔄 Retrying scene ${sceneId} with type: ${retryType}`);

        // Resetear estado de la escena
        const currentScenes = get().scenes;
        const updatedScenes = currentScenes.map(s =>
          s.id === sceneId
            ? { 
                ...s, 
                generationStatus: 'generating' as const,
                videoProgress: 0,
                errorMessage: undefined,
                errorType: undefined,
                canRetry: false,
                isStuck: false,
                retryCount: (s.retryCount || 0) + 1,
                lastRetryAt: new Date().toISOString()
              }
            : s
        );
        set({ scenes: updatedScenes });

        try {
          let promptToUse = scene.optimizedPrompt || scene.description;
          
                     if (retryType === 'regenerate-prompt') {
             // Regenerar el prompt con contexto adicional
             const variations = [
               'enhanced cinematic quality, professional video production',
               'improved visual storytelling, dynamic composition',
               'better lighting and atmosphere, high-end production value',
               'refined cinematography, smooth camera movements'
             ];
             const randomVariation = variations[Math.floor(Math.random() * variations.length)];
             promptToUse = `${scene.description}. ${randomVariation}`;
           } else if (retryType === 'force-new') {
            // Forzar un prompt completamente nuevo con variaciones
            const variations = [
              'cinematic style, high quality, professional lighting',
              'dynamic camera movement, vivid colors, detailed textures',
              'atmospheric lighting, rich details, smooth motion',
              'professional cinematography, balanced composition, natural flow'
            ];
            const randomVariation = variations[Math.floor(Math.random() * variations.length)];
            promptToUse = `${scene.description}. ${randomVariation}`;
          }

          // Llamar a la API de generación
          const response = await axios.post('/api/generate-video', {
            prompt: promptToUse,
            sceneId: sceneId,
            retryAttempt: (scene.retryCount || 0) + 1
          });

          if (response.data.success && response.data.generationId) {
            // Actualizar con el nuevo job ID
            const scenesAfterGeneration = get().scenes;
            const updatedScenesAfterGeneration = scenesAfterGeneration.map(s =>
              s.id === sceneId
                ? { 
                    ...s, 
                    aimlJobId: response.data.generationId,
                    optimizedPrompt: promptToUse,
                    videoProgress: 10
                  }
                : s
            );
            set({ scenes: updatedScenesAfterGeneration });

            // Comenzar polling
            await get().pollVideoStatus(sceneId);
            
          } else {
            throw new Error('Failed to start video generation');
          }
          
        } catch (error) {
          console.error('Error retrying scene generation:', error);
          
          // Marcar como fallido el reintento
          const scenesAfterError = get().scenes;
          const updatedScenesAfterError = scenesAfterError.map(s =>
            s.id === sceneId
              ? { 
                  ...s, 
                  generationStatus: 'failed' as const,
                  errorMessage: 'Error al reintentar la generación',
                  errorType: 'RETRY_FAILED',
                  canRetry: true
                }
              : s
          );
          set({ scenes: updatedScenesAfterError });
        }
      },

      // Nueva función para diagnóstico de problemas
      diagnoseSceneIssue: async (sceneId: string) => {
        const scene = get().scenes.find(s => s.id === sceneId);
        if (!scene) return null;

        const diagnosis = {
          sceneId,
          status: scene.generationStatus,
          errorType: scene.errorType,
          canRetry: scene.canRetry,
          isStuck: scene.isStuck,
          progress: scene.videoProgress,
          retryCount: scene.retryCount || 0,
          recommendations: [] as string[],
          actions: [] as { label: string; action: string; type: 'primary' | 'secondary' }[]
        };

        // Analizar problema y generar recomendaciones
        if (scene.errorType === 'TIMEOUT' || scene.isStuck) {
          diagnosis.recommendations.push('El video se quedó atascado durante la generación');
          diagnosis.actions.push({
            label: 'Reintentar con mismo prompt',
            action: 'retry-same',
            type: 'primary'
          });
          diagnosis.actions.push({
            label: 'Regenerar prompt optimizado',
            action: 'retry-regenerate',
            type: 'secondary'
          });
        } else if (scene.errorType === 'NOT_FOUND') {
          diagnosis.recommendations.push('El video no se encontró en el servidor');
          diagnosis.actions.push({
            label: 'Generar nuevo video',
            action: 'retry-new',
            type: 'primary'
          });
        } else if (scene.errorType === 'SERVER_ERROR') {
          diagnosis.recommendations.push('Problema temporal del servidor');
          diagnosis.actions.push({
            label: 'Reintentar ahora',
            action: 'retry-same',
            type: 'primary'
          });
        } else if (scene.errorType === 'GENERATION_ERROR') {
          diagnosis.recommendations.push('El prompt podría tener contenido problemático');
          diagnosis.actions.push({
            label: 'Mejorar prompt automáticamente',
            action: 'retry-regenerate',
            type: 'primary'
          });
          diagnosis.actions.push({
            label: 'Crear prompt completamente nuevo',
            action: 'retry-new',
            type: 'secondary'
          });
        }

                 return diagnosis;
       },

       // Image management functions
       uploadImage: async (file: File, type: 'persona' | 'objeto' | 'entorno') => {
         const currentImages = get().uploadedImages;
         
         if (currentImages.length >= get().maxImages) {
           set({ error: `Máximo ${get().maxImages} imágenes por proyecto` });
           return;
         }

         // Generar tag único
         const typeCount = currentImages.filter(img => img.type === type).length + 1;
         const typeNames = {
           'persona': 'Personaje',
           'objeto': 'Objeto', 
           'entorno': 'Entorno'
         };
         const tag = `${typeNames[type]}_${typeCount}`;

         // Crear preview URL
         const preview = URL.createObjectURL(file);

         const newImage: UploadedImage = {
           id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
           file,
           preview,
           type,
           tag,
           isAnalyzing: true,
           uploadedAt: new Date()
         };

         // Agregar imagen al estado
         set({ 
           uploadedImages: [...currentImages, newImage],
           error: null 
         });

         // Analizar imagen con IA
         await get().analyzeImageWithAI(newImage.id);
       },

       removeImage: (imageId: string) => {
         const currentImages = get().uploadedImages;
         const imageToRemove = currentImages.find(img => img.id === imageId);
         
         if (imageToRemove) {
           // Limpiar URL de preview
           URL.revokeObjectURL(imageToRemove.preview);
           
           // Remover imagen
           const updatedImages = currentImages.filter(img => img.id !== imageId);
           set({ uploadedImages: updatedImages });
         }
       },

       analyzeImageWithAI: async (imageId: string) => {
         const currentImages = get().uploadedImages;
         const image = currentImages.find(img => img.id === imageId);
         
         if (!image) return;

         try {
           // Convertir imagen a base64
           const base64 = await get().fileToBase64(image.file);
           
           // Llamar a API de análisis
           const response = await axios.post('/api/analyze-image', {
             image: base64,
             type: image.type,
             filename: image.file.name
           });

           if (response.data.success) {
             // Actualizar imagen con descripción
             const updatedImages = currentImages.map(img =>
               img.id === imageId
                 ? { 
                     ...img, 
                     description: response.data.description,
                     isAnalyzing: false,
                     analysisError: undefined
                   }
                 : img
             );
             set({ uploadedImages: updatedImages });
           } else {
             throw new Error(response.data.error || 'Error analyzing image');
           }

         } catch (error) {
           console.error('Error analyzing image:', error);
           
           // Marcar error en la imagen
           const updatedImages = currentImages.map(img =>
             img.id === imageId
               ? { 
                   ...img, 
                   isAnalyzing: false,
                   analysisError: 'Error al analizar la imagen'
                 }
               : img
           );
           set({ uploadedImages: updatedImages });
         }
       },

       insertImageTag: (tag: string, position: number) => {
         const currentDescription = get().description;
         const newDescription = 
           currentDescription.slice(0, position) + 
           tag + 
           currentDescription.slice(position);
         set({ description: newDescription });
       },

       replaceTagsInDescription: (text: string) => {
         const images = get().uploadedImages;
         let replacedText = text;

         images.forEach(image => {
           if (image.description) {
             const tagRegex = new RegExp(image.tag, 'g');
             replacedText = replacedText.replace(tagRegex, image.description);
           }
         });

         return replacedText;
       },

       // Helper function
       fileToBase64: (file: File): Promise<string> => {
         return new Promise((resolve, reject) => {
           const reader = new FileReader();
           reader.readAsDataURL(file);
           reader.onload = () => {
             if (typeof reader.result === 'string') {
               resolve(reader.result.split(',')[1]); // Remove data:image/jpeg;base64, prefix
             } else {
               reject(new Error('Failed to convert file to base64'));
             }
           };
           reader.onerror = error => reject(error);
         });
       },

       // OpenAI quota management functions
       checkOpenAIQuota: async () => {
         try {
           console.log('🔍 Verificando fondos de OpenAI...');
           
           const response = await axios.get('/api/check-quota');
           const { hasQuota, message, mode } = response.data;
           
           set({
             openaiQuotaStatus: {
               hasQuota,
               message,
               mode,
               lastChecked: new Date()
             }
           });
           
           console.log(`✅ Estado de fondos: ${message}`);
           
         } catch (error) {
           console.error('Error verificando fondos:', error);
           
           set({
             openaiQuotaStatus: {
               hasQuota: false,
               message: 'Error verificando fondos - usando modo respaldo',
               mode: 'fallback',
               lastChecked: new Date()
             }
           });
         }
       },

       setQuotaStatus: (status) => {
         set({
           openaiQuotaStatus: {
             ...status,
             lastChecked: new Date()
           }
         });
       },

       // Campaign management functions
       createCampaign: async (campaignData) => {
         const newCampaign: Campaign = {
           ...campaignData,
           id: `campaign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
           createdAt: new Date().toISOString(),
           generatedVideos: 0,
           publishedVideos: 0,
           contentPlan: []
         };

         set(state => ({
           campaigns: [...state.campaigns, newCampaign]
         }));

         // Generar plan de contenido automáticamente
         await get().generateCampaignContent(newCampaign.id);
       },

       updateCampaign: (campaignId, updates) => {
         set(state => ({
           campaigns: state.campaigns.map(campaign =>
             campaign.id === campaignId ? { ...campaign, ...updates } : campaign
           )
         }));
       },

       deleteCampaign: (campaignId) => {
         set(state => ({
           campaigns: state.campaigns.filter(campaign => campaign.id !== campaignId)
         }));
       },

       pauseCampaign: (campaignId) => {
         get().updateCampaign(campaignId, { status: 'paused' });
       },

       resumeCampaign: (campaignId) => {
         get().updateCampaign(campaignId, { status: 'active' });
       },

       archiveCampaign: (campaignId) => {
         get().updateCampaign(campaignId, { status: 'archived' });
       },

       generateCampaignContent: async (campaignId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         // Calcular fechas y generar plan de contenido
         const startDate = new Date(campaign.startDate);
         const endDate = campaign.endDate ? new Date(campaign.endDate) : new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 días por defecto
         
         const contentPlan: WeeklyContentPlan[] = [];
         let currentWeek = 1;
         let currentDate = new Date(startDate);

         while (currentDate <= endDate) {
           const weekStart = new Date(currentDate);
           const weekEnd = new Date(currentDate.getTime() + 6 * 24 * 60 * 60 * 1000);
           
           const weekVideos: CampaignVideo[] = [];
           
           // Generar videos para esta semana
           for (let day = 0; day < 7; day++) {
             const videoDate = new Date(weekStart.getTime() + day * 24 * 60 * 60 * 1000);
             const dayName = videoDate.toLocaleDateString('es-ES', { weekday: 'long' });
             
             if (campaign.scheduledDays.includes(dayName) || campaign.scheduledDays.includes('Todos los días')) {
               campaign.scheduledTimes.forEach(time => {
                 const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                 
                 weekVideos.push({
                   id: videoId,
                   title: `${campaign.name} - ${videoDate.toLocaleDateString('es-ES')}`,
                   description: `[Pendiente de generar] - ${campaign.campaignDescription}`,
                   scheduledDate: videoDate.toISOString().split('T')[0],
                   scheduledTime: time,
                   socialNetworks: campaign.socialNetworks,
                   status: 'scheduled',
                   scenes: []
                 });
               });
             }
           }

           if (weekVideos.length > 0) {
             contentPlan.push({
               weekNumber: currentWeek,
               startDate: weekStart.toISOString().split('T')[0],
               endDate: weekEnd.toISOString().split('T')[0],
               videos: weekVideos
             });
           }

           currentDate = new Date(weekEnd.getTime() + 1 * 24 * 60 * 60 * 1000);
           currentWeek++;
         }

         // Actualizar campaña con el plan de contenido
         const totalVideos = contentPlan.reduce((sum, week) => sum + week.videos.length, 0);
         
         get().updateCampaign(campaignId, {
           contentPlan,
           totalVideos
         });

         // Generar descripciones específicas con IA
         await get().generateVideoDescriptions(campaignId);
       },

       generateVideoDescriptions: async (campaignId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         console.log('🤖 Generando descripciones específicas para cada video...');

         for (let weekIndex = 0; weekIndex < campaign.contentPlan.length; weekIndex++) {
           const week = campaign.contentPlan[weekIndex];
           
           for (let videoIndex = 0; videoIndex < week.videos.length; videoIndex++) {
             const video = week.videos[videoIndex];
             
             try {
               // Generar descripción específica usando IA
               const specificDescription = await get().generateSpecificVideoDescription(
                 campaign.campaignDescription,
                 campaign.objective,
                 video.scheduledDate,
                 video.socialNetworks,
                 videoIndex + 1,
                 week.videos.length
               );

               // Actualizar el video con la nueva descripción
               const updatedVideo = {
                 ...video,
                 description: specificDescription
               };

               const updatedContentPlan = [...campaign.contentPlan];
               updatedContentPlan[weekIndex].videos[videoIndex] = updatedVideo;

               get().updateCampaign(campaignId, {
                 contentPlan: updatedContentPlan
               });

             } catch (error) {
               console.error(`Error generando descripción para video ${video.id}:`, error);
               // Mantener descripción por defecto si hay error
             }
           }
         }

         console.log('✅ Descripciones generadas completamente');
       },

       generateSpecificVideoDescription: async (campaignDescription, objective, scheduledDate, socialNetworks, videoNumber, totalVideosInWeek) => {
         try {
           const response = await fetch('/api/prompt-engineering', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               type: 'campaign_video_description',
               campaignDescription,
               objective,
               scheduledDate,
               socialNetworks: socialNetworks.join(', '),
               videoNumber,
               totalVideosInWeek
             }),
           });

           if (!response.ok) {
             throw new Error('Error en la generación de descripción');
           }

           const data = await response.json();
           return data.description || `Contenido específico basado en: ${campaignDescription}`;
         } catch (error) {
           console.error('Error generando descripción específica:', error);
           return `Contenido específico basado en: ${campaignDescription}`;
         }
       },

       regenerateVideoDescription: async (campaignId, videoId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         // Encontrar el video
         let targetVideo: CampaignVideo | null = null;
         let weekIndex = -1;
         let videoIndex = -1;

         for (let i = 0; i < campaign.contentPlan.length; i++) {
           const videoIdx = campaign.contentPlan[i].videos.findIndex(v => v.id === videoId);
           if (videoIdx !== -1) {
             targetVideo = campaign.contentPlan[i].videos[videoIdx];
             weekIndex = i;
             videoIndex = videoIdx;
             break;
           }
         }

         if (!targetVideo) return;

         try {
           // Regenerar descripción específica
           const newDescription = await get().generateSpecificVideoDescription(
             campaign.campaignDescription,
             campaign.objective,
             targetVideo.scheduledDate,
             targetVideo.socialNetworks,
             videoIndex + 1,
             campaign.contentPlan[weekIndex].videos.length
           );

           // Actualizar el video
           const updatedVideo = {
             ...targetVideo,
             description: newDescription
           };

           const updatedContentPlan = [...campaign.contentPlan];
           updatedContentPlan[weekIndex].videos[videoIndex] = updatedVideo;

           get().updateCampaign(campaignId, {
             contentPlan: updatedContentPlan
           });

           console.log('✅ Descripción regenerada exitosamente');
         } catch (error) {
           console.error('Error regenerando descripción:', error);
         }
       },

       simulatePublishVideo: async (campaignId, videoId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         // Encontrar el video en el plan de contenido
         let targetVideo: CampaignVideo | null = null;
         let weekIndex = -1;
         let videoIndex = -1;

         for (let i = 0; i < campaign.contentPlan.length; i++) {
           const videoIdx = campaign.contentPlan[i].videos.findIndex(v => v.id === videoId);
           if (videoIdx !== -1) {
             targetVideo = campaign.contentPlan[i].videos[videoIdx];
             weekIndex = i;
             videoIndex = videoIdx;
             break;
           }
         }

         if (!targetVideo) return;

         // Generar título y descripción optimizados
         const generatedTitle = `🚀 ${targetVideo.title} | ${campaign.name}`;
         const generatedDescription = `${targetVideo.description}\n\n📈 Optimizado para ${targetVideo.socialNetworks.join(', ')}\n#marketing #contenido #${campaign.name.toLowerCase().replace(/\s+/g, '')}`;

         // Simular publicación
         const updatedVideo: CampaignVideo = {
           ...targetVideo,
           status: 'published',
           generatedTitle,
           generatedDescription,
           publishedAt: new Date().toISOString()
         };

         // Actualizar el video en la campaña
         const updatedContentPlan = [...campaign.contentPlan];
         updatedContentPlan[weekIndex].videos[videoIndex] = updatedVideo;

         get().updateCampaign(campaignId, {
           contentPlan: updatedContentPlan,
           publishedVideos: campaign.publishedVideos + 1
         });

         console.log(`📱 Video "${generatedTitle}" simulado como publicado en ${targetVideo.socialNetworks.join(', ')}`);
       },

       generateCampaignVideo: async (campaignId, videoId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         // Encontrar el video en el plan de contenido
         let targetVideo: CampaignVideo | null = null;
         let weekIndex = -1;
         let videoIndex = -1;

         for (let i = 0; i < campaign.contentPlan.length; i++) {
           const videoIdx = campaign.contentPlan[i].videos.findIndex(v => v.id === videoId);
           if (videoIdx !== -1) {
             targetVideo = campaign.contentPlan[i].videos[videoIdx];
             weekIndex = i;
             videoIndex = videoIdx;
             break;
           }
         }

         if (!targetVideo) return;

         // Marcar video como generando
         const updatedVideo: CampaignVideo = {
           ...targetVideo,
           status: 'generating'
         };

         const updatedContentPlan = [...campaign.contentPlan];
         updatedContentPlan[weekIndex].videos[videoIndex] = updatedVideo;

         get().updateCampaign(campaignId, {
           contentPlan: updatedContentPlan
         });

         try {
           // Configurar el estado para generar el video usando el sistema existente
           const videoConfig = {
             objective: campaign.objective,
             tone: campaign.tone,
             style: campaign.style,
             duration: campaign.duration,
             description: targetVideo.description,
             watermark: campaign.constants.watermark || '',
             brandElements: campaign.constants.brandElements || [],
             recurringPersons: campaign.constants.recurringPersons || []
           };

                       // Usar el sistema de generación existente
            set({
              currentStep: 'script-generation',
              objective: videoConfig.objective,
              tone: videoConfig.tone,
              style: videoConfig.style,
              duration: videoConfig.duration,
              description: videoConfig.description,
              scenes: []
            });

           // Generar script
           await get().generateScript();
           
           // Generar videos de las escenas
           await get().generateAllVideos();

                       // Marcar video como generado y actualizar con URL
            const currentState = get();
            const finalVideo: CampaignVideo = {
              ...updatedVideo,
              status: 'generated',
              videoUrl: `campaign_video_${videoId}_${Date.now()}.mp4`,
              scenes: currentState.scenes
            };

           const finalContentPlan = [...campaign.contentPlan];
           finalContentPlan[weekIndex].videos[videoIndex] = finalVideo;

           get().updateCampaign(campaignId, {
             contentPlan: finalContentPlan,
             generatedVideos: campaign.generatedVideos + 1
           });

         } catch (error) {
           console.error('Error generando video de campaña:', error);
           
           // Marcar video como fallido
           const failedVideo: CampaignVideo = {
             ...updatedVideo,
             status: 'failed'
           };

           const failedContentPlan = [...campaign.contentPlan];
           failedContentPlan[weekIndex].videos[videoIndex] = failedVideo;

           get().updateCampaign(campaignId, {
             contentPlan: failedContentPlan
           });
         }
       },

       downloadCampaignVideo: (campaignId, videoId) => {
         const campaign = get().campaigns.find(c => c.id === campaignId);
         if (!campaign) return;

         // Encontrar el video en el plan de contenido
         let targetVideo: CampaignVideo | null = null;

         for (const week of campaign.contentPlan) {
           const video = week.videos.find(v => v.id === videoId);
           if (video) {
             targetVideo = video;
             break;
           }
         }

         if (!targetVideo || !targetVideo.videoUrl) {
           alert('Video no disponible para descarga');
           return;
         }

         // Simular descarga del video
         const link = document.createElement('a');
         link.href = targetVideo.videoUrl;
         link.download = `${targetVideo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.mp4`;
         document.body.appendChild(link);
         link.click();
         document.body.removeChild(link);
       },

       // 🚨 FUNCIONES DE EMERGENCIA
       stopAllPolling: () => {
         console.log('🛑 EMERGENCIA: Deteniendo todos los pollings activos');
         
         // Marcar todas las escenas que están generando como fallidas
         const currentScenes = get().scenes;
         const updatedScenes = currentScenes.map(scene => {
           if (scene.generationStatus === 'generating') {
             console.log(`🛑 Deteniendo polling para scene ${scene.id}`);
             return {
               ...scene,
               generationStatus: 'failed' as const,
               errorMessage: 'Polling detenido manualmente para prevenir consumo excesivo',
               errorType: 'MANUAL_STOP',
               canRetry: true,
               lastPolledAt: new Date().toISOString()
             };
           }
           return scene;
         });
         
         set({ scenes: updatedScenes });
         console.log('✅ Todos los pollings han sido detenidos');
       },

       forceStopGeneratingScenes: () => {
         console.log('🚨 FUERZA MAYOR: Deteniendo todas las generaciones activas');
         
         const currentScenes = get().scenes;
         const generatingCount = currentScenes.filter(s => s.generationStatus === 'generating').length;
         
         if (generatingCount === 0) {
           console.log('ℹ️ No hay escenas generándose actualmente');
           return;
         }

         const updatedScenes = currentScenes.map(scene => ({
           ...scene,
           generationStatus: scene.generationStatus === 'generating' ? 'failed' as const : scene.generationStatus,
           errorMessage: scene.generationStatus === 'generating' 
             ? 'Generación detenida por emergencia - consumo excesivo detectado' 
             : scene.errorMessage,
           errorType: scene.generationStatus === 'generating' ? 'EMERGENCY_STOP' : scene.errorType,
           canRetry: scene.generationStatus === 'generating' ? true : scene.canRetry,
           videoProgress: scene.generationStatus === 'generating' ? 0 : scene.videoProgress,
           lastPolledAt: scene.generationStatus === 'generating' ? new Date().toISOString() : scene.lastPolledAt
         }));
         
         set({ 
           scenes: updatedScenes,
           currentStep: 'scene-editing', // Volver al paso anterior
           error: `⚠️ ${generatingCount} generaciones detenidas por consumo excesivo`
         });
         
         console.log(`✅ ${generatingCount} generaciones han sido detenidas por emergencia`);
       },
      }),
      {
      name: 'video-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        projects: state.projects
      })
    }
  )
);

export default useVideoStore; 
