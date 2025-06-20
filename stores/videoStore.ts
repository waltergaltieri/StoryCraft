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

interface VideoStore {
  // Authentication
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: { name: string; email: string; company?: string }) => void;
  logout: () => void;

  // Video Projects History
  projects: VideoProject[];
  currentProject: VideoProject | null;
  
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
          const response = await axios.post('/api/filmmaker', {
            objective,
            tone,
            style,
            duration,
            description
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
          // Step 1: Optimize prompt for video generation
          const promptResponse = await axios.post('/api/prompt-engineering', {
            scene: scenes[sceneIndex].description
          });

          const optimizedPrompt = promptResponse.data.optimizedPrompt;
          
          // Update scene with optimized prompt
          updatedScenes[sceneIndex] = {
            ...updatedScenes[sceneIndex],
            optimizedPrompt,
            videoProgress: 25
          };
          set({ scenes: [...updatedScenes] });

          // Step 2: Generate video with Veo 3 (KieAI)
          const videoResponse = await axios.post('/api/generate-video', {
            prompt: optimizedPrompt,
            duration: 8,
            enhancePrompt: true,
            generateAudio: true
          });

          if (videoResponse.data.generationId) {
            const generationId = videoResponse.data.generationId;
            
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
          console.error(`Error generating video for scene ${sceneId}:`, error);
          
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
        // Get initial scene info
        const initialScene = get().scenes.find(s => s.id === sceneId);
        if (!initialScene?.aimlJobId) return;

        const maxAttempts = 30; // 5 minutes max
        let attempts = 0;

        const poll = async (): Promise<void> => {
          if (attempts >= maxAttempts) {
            // Update scene status to failed - use fresh scenes state
            const currentScenes = get().scenes;
            const updatedScenes = currentScenes.map(s =>
              s.id === sceneId
                ? { ...s, generationStatus: 'failed' as const, errorMessage: 'Generation timeout' }
                : s
            );
            set({ scenes: updatedScenes });
            return;
          }

          try {
            const response = await axios.get(`/api/poll-video?generationId=${initialScene.aimlJobId}`);
            
            if (response.data.status === 'completed' && response.data.videoUrl) {
              // Update scene with completed video - use fresh scenes state
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'completed' as const,
                      videoUrl: response.data.videoUrl,
                      videoProgress: 100
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              get().saveCurrentProject();
              
              console.log(`✅ Scene ${sceneId} completed successfully with video: ${response.data.videoUrl}`);
              return; // Stop polling for this scene
              
            } else if (response.data.status === 'error') {
              // Update scene status to failed - use fresh scenes state
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'failed' as const,
                      errorMessage: response.data.errorMessage || 'Generation failed'
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              return; // Stop polling for this scene
              
            } else {
              // Still processing (waiting or generating), continue polling
              attempts++;
              
              // Update progress - use fresh scenes state
              const progress = response.data.progress || Math.min(50 + (attempts * 2), 95);
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { ...s, videoProgress: progress }
                  : s
              );
              set({ scenes: updatedScenes });
              
              // Continue polling
              setTimeout(poll, 10000); // Poll every 10 seconds
            }
            
          } catch (error) {
            console.error(`Error polling video status for scene ${sceneId}:`, error);
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 10000);
            } else {
              // Max attempts reached, mark as failed
              const currentScenes = get().scenes;
              const updatedScenes = currentScenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'failed' as const,
                      errorMessage: 'Polling failed after maximum attempts'
                    }
                  : s
              );
              set({ scenes: updatedScenes });
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
      }
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
