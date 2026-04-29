// services/api.ts
import { Platform } from 'react-native';

// Détection dynamique de l'URL de l'API (Production VPS ou Environnement Local)
const DEFAULT_API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000/api/v1' : 'http://localhost:3000/api/v1';

const DEFAULT_SOCKET_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || DEFAULT_API_URL;
export const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || DEFAULT_SOCKET_URL;

class ApiClient {
  private token: string | null = null;

  constructor() {
    // Restaurer le token depuis le stockage local (Web / Session)
    if (typeof window !== 'undefined' && window.localStorage) {
      this.token = window.localStorage.getItem('fitconnect_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined' && window.localStorage) {
      if (token) {
        window.localStorage.setItem('fitconnect_token', token);
      } else {
        window.localStorage.removeItem('fitconnect_token');
      }
    }
  }

  getToken(): string | null {
    return this.token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<{ data: T | null; error: string | null }> {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errMsg = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errBody = await response.json();
          if (errBody.message)
            errMsg = Array.isArray(errBody.message) ? errBody.message.join(', ') : errBody.message;
        } catch {
          // Ignorer si le corps n'est pas du JSON
        }
        return { data: null, error: errMsg };
      }

      const data = await response.json();
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message || 'Erreur réseau ou serveur injoignable' };
    }
  }

  // --- Health Check ---
  async checkHealth() {
    return this.request<{ status: string; timestamp: string }>('/health');
  }

  // --- Auth ---
  async login(email: string, password: string) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.data?.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res;
  }

  async register(fullName: string, username: string, email: string, password: string) {
    const res = await this.request<{ user: any; accessToken: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, username, email, password }),
    });
    if (res.data?.accessToken) {
      this.setToken(res.data.accessToken);
    }
    return res;
  }

  async getMe() {
    return this.request<any>('/users/me');
  }

  logout() {
    this.setToken(null);
  }

  // --- Workouts ---
  async startWorkout(title: string) {
    return this.request<{ id: string; title: string; startedAt: string }>('/workouts/start', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async addSet(
    sessionId: string,
    data: {
      exerciseId: string;
      exerciseName: string;
      weightKg: number;
      reps: number;
      isCompleted: boolean;
      type?: 'WARMUP' | 'NORMAL' | 'DROPSET' | 'FAILURE';
    }
  ) {
    return this.request(`/workouts/${sessionId}/sets`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async finishWorkout(sessionId: string, durationSeconds: number) {
    return this.request<any>(`/workouts/${sessionId}/finish`, {
      method: 'POST',
      body: JSON.stringify({ durationSeconds }),
    });
  }

  async getWorkoutHistory() {
    return this.request<any[]>('/workouts/history');
  }

  // --- Feed & Posts ---
  async getFeed(filter: 'FOR_YOU' | 'FOLLOWING' | 'GYM' = 'FOR_YOU') {
    return this.request<any[]>(`/posts/feed?filter=${filter}`);
  }

  async createPost(postData: any) {
    return this.request<any>('/posts', {
      method: 'POST',
      body: JSON.stringify(postData),
    });
  }

  async toggleReaction(postId: string, type: 'FIRE' | 'MUSCLE' | 'ENERGY' | 'FOCUS') {
    return this.request<any>(`/posts/${postId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ type }),
    });
  }

  async addComment(postId: string, content: string, parentId?: string) {
    return this.request<any>(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content, parentId }),
    });
  }

  // --- Coaches ---
  async getCoaches(specialty?: string, search?: string) {
    const params = new URLSearchParams();
    if (specialty && specialty !== 'TOUS') params.append('specialty', specialty);
    if (search) params.append('search', search);
    return this.request<any[]>(`/coaches?${params.toString()}`);
  }

  async applyForCoachCertification(diplomaName: string) {
    return this.request('/coaches/apply', {
      method: 'POST',
      body: JSON.stringify({ diplomaName }),
    });
  }

  // --- Chat ---
  async getConversations() {
    return this.request<any[]>('/chat/conversations');
  }

  async getMessages(conversationId: string) {
    return this.request<any[]>(`/chat/conversations/${conversationId}/messages`);
  }

  async sendMessage(
    conversationId: string,
    messageData: { content: string; type?: string; isAudio?: boolean; audioDuration?: number }
  ) {
    return this.request<any>(`/chat/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }
}

export const api = new ApiClient();
