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
}

export type CreationStep = 'selection' | 'script-generation' | 'scene-editing' | 'video-generation' | 'completed';

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
  objective: string;
  tone: string;
  style: string;
  duration: number;
  description: string;
  scenes: EnhancedScene[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentStep: (step: CreationStep) => void;
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
      objective: '',
      tone: '',
      style: '',
      duration: 8,
      description: '',
      scenes: [],
      isLoading: false,
      error: null,

      // Actions
      setCurrentStep: (step) => set({ currentStep: step }),
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
        const newProject: VideoProject = {
          id: Math.random().toString(36).substr(2, 9),
          title: `${get().objective} - ${get().style}`,
          objective: get().objective,
          tone: get().tone,
          style: get().style,
          duration: get().duration,
          description: get().description,
          scenes: get().scenes,
          createdAt: new Date(),
          status: 'draft',
          completedVideos: 0,
          totalScenes: get().scenes.length
        };
        
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
          set({
            currentProject: project,
            objective: project.objective,
            tone: project.tone,
            style: project.style,
            duration: project.duration,
            description: project.description,
            scenes: project.scenes,
            currentStep: project.scenes.length > 0 ? 'scene-editing' : 'selection'
          });
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
      },

      startNewProject: () => {
        set({
          currentStep: 'selection',
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

        for (const scene of scenes) {
          if (scene.generationStatus !== 'completed') {
            await get().generateSingleVideo(scene.id);
          }
        }

        get().saveCurrentProject();
        set({ currentStep: 'completed' });
      },

      generateSingleVideo: async (sceneId: string) => {
        const scenes = get().scenes;
        const sceneIndex = scenes.findIndex(s => s.id === sceneId);
        
        if (sceneIndex === -1) return;

        // Update scene status to generating
        const updatedScenes = [...scenes];
        updatedScenes[sceneIndex] = {
          ...updatedScenes[sceneIndex],
          generationStatus: 'generating',
          videoProgress: 0
        };
        set({ scenes: updatedScenes });

        try {
          // Step 1: Optimize prompt for Veo 3
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

          // Step 2: Generate video with Veo 3
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
        const scenes = get().scenes;
        const scene = scenes.find(s => s.id === sceneId);
        
        if (!scene?.aimlJobId) return;

        const maxAttempts = 30; // 5 minutes max
        let attempts = 0;

        const poll = async (): Promise<void> => {
          if (attempts >= maxAttempts) {
            // Update scene status to failed
            const updatedScenes = scenes.map(s =>
              s.id === sceneId
                ? { ...s, generationStatus: 'failed' as const, errorMessage: 'Generation timeout' }
                : s
            );
            set({ scenes: updatedScenes });
            return;
          }

          try {
            const response = await axios.get(`/api/poll-video?generationId=${scene.aimlJobId}`);
            
            if (response.data.status === 'completed' && response.data.videoUrl) {
              // Update scene with completed video
              const updatedScenes = scenes.map(s =>
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
              
            } else if (response.data.status === 'error') {
              // Update scene status to failed
              const updatedScenes = scenes.map(s =>
                s.id === sceneId
                  ? { 
                      ...s, 
                      generationStatus: 'failed' as const,
                      errorMessage: response.data.errorMessage || 'Generation failed'
                    }
                  : s
              );
              set({ scenes: updatedScenes });
              
            } else {
              // Still processing (waiting or generating), continue polling
              attempts++;
              setTimeout(poll, 10000); // Poll every 10 seconds
              
              // Update progress
              const progress = response.data.progress || Math.min(50 + (attempts * 2), 95);
              const updatedScenes = scenes.map(s =>
                s.id === sceneId
                  ? { ...s, videoProgress: progress }
                  : s
              );
              set({ scenes: updatedScenes });
            }
            
          } catch (error) {
            console.error('Error polling video status:', error);
            attempts++;
            if (attempts < maxAttempts) {
              setTimeout(poll, 10000);
            }
          }
        };

        await poll();
      },

      reset: () => {
        set({
          currentStep: 'selection',
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