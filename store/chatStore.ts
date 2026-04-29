// store/chatStore.ts
import { create } from 'zustand';
import { Conversation, ChatMessage } from '../types/models';
import { MOCK_CONVERSATIONS } from '../services/mockData';
import { api } from '../services/api';

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeMessages: Record<string, ChatMessage[]>;
  isLoading: boolean;
  setActiveConversation: (id: string | null) => void;
  fetchConversations: () => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (
    conversationId: string,
    content: string,
    isAudio?: boolean,
    isFormCheck?: boolean,
    formCheckExercise?: string
  ) => void;
  replyFormCheck: (
    conversationId: string,
    messageId: string,
    coachNote: string,
    rating: number
  ) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: null,
  isLoading: false,
  activeMessages: {
    conv_1: [
      {
        id: 'msg_1',
        conversationId: 'conv_1',
        senderId: 'user_me',
        content:
          'Salut Alexandre ! Voici ma vidéo sur le Squat lourd à 175kg, j’aimerais ton avis sur ma profondeur et l’alignement des hanches.',
        createdAt: '14:20',
        status: 'READ',
        isFormCheck: true,
        formCheckData: {
          exerciseName: 'Squat Arrière 175kg',
          status: 'REVIEWED',
          coachNote:
            'Excellente trajectoire de barre. Garde la cage thoracique bombée et ouvre les hanches de 5° supplémentaires au point bas.',
          rating: 5,
        },
      },
      {
        id: 'msg_2',
        conversationId: 'conv_1',
        senderId: 'user_coach_alex',
        content:
          'Salut Thomas ! J’ai analysé ton Form Check. Ton verrouillage lombaire est impeccable, bravo pour la progression !',
        createdAt: '14:32',
        status: 'DELIVERED',
      },
      {
        id: 'msg_3',
        conversationId: 'conv_1',
        senderId: 'user_coach_alex',
        content: 'Note vocale explicative (0:42)',
        isAudio: true,
        audioDurationSeconds: 42,
        createdAt: '14:33',
        status: 'DELIVERED',
      },
    ],
    conv_2: [
      {
        id: 'msg_2_1',
        conversationId: 'conv_2',
        senderId: 'user_coach_sarah',
        content:
          'N’oublie pas d’augmenter ta ration de glucides 2h avant la séance de fractionné demain.',
        createdAt: 'Hier 18:30',
        status: 'READ',
      },
      {
        id: 'msg_2_2',
        conversationId: 'conv_2',
        senderId: 'user_me',
        content: 'Parfait merci pour les conseils sur la planification des glucides avant séance !',
        createdAt: 'Hier 19:40',
        status: 'READ',
      },
    ],
  },

  setActiveConversation: (id) => {
    set({ activeConversationId: id });
    if (id) {
      get()
        .fetchMessages(id)
        .catch(() => {});
    }
  },

  fetchConversations: async () => {
    set({ isLoading: true });
    const res = await api.getConversations();
    set({ isLoading: false });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      set({ conversations: res.data });
    }
  },

  fetchMessages: async (conversationId: string) => {
    const res = await api.getMessages(conversationId);
    if (res.data && Array.isArray(res.data)) {
      set((state) => ({
        activeMessages: {
          ...state.activeMessages,
          [conversationId]: res.data as any,
        },
      }));
    }
  },

  sendMessage: (
    conversationId,
    content,
    isAudio = false,
    isFormCheck = false,
    formCheckExercise = 'Exercice'
  ) => {
    const newMessage: ChatMessage = {
      id: `msg_${Date.now()}`,
      conversationId,
      senderId: 'user_me',
      content,
      isAudio,
      audioDurationSeconds: isAudio ? 24 : undefined,
      isFormCheck,
      formCheckData: isFormCheck
        ? {
            exerciseName: formCheckExercise,
            status: 'PENDING',
          }
        : undefined,
      createdAt: 'À l’instant',
      status: 'SENT',
    };

    // 1. Optimistic Update
    set((state) => {
      const currentList = state.activeMessages[conversationId] || [];
      const updatedMessages = {
        ...state.activeMessages,
        [conversationId]: [...currentList, newMessage],
      };

      const updatedConversations = state.conversations.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: newMessage,
            updatedAt: 'À l’instant',
          };
        }
        return conv;
      });

      return {
        activeMessages: updatedMessages,
        conversations: updatedConversations,
      };
    });

    // 2. Envoi en arrière-plan à l'API
    api
      .sendMessage(conversationId, {
        content,
        isAudio,
        audioDuration: isAudio ? 24 : undefined,
      })
      .catch(() => {});
  },

  replyFormCheck: (conversationId, messageId, coachNote, rating) =>
    set((state) => {
      const currentList = state.activeMessages[conversationId] || [];
      const updatedList = currentList.map((m) => {
        if (m.id === messageId && m.formCheckData) {
          return {
            ...m,
            formCheckData: {
              ...m.formCheckData,
              status: 'REVIEWED' as const,
              coachNote,
              rating,
            },
          };
        }
        return m;
      });

      return {
        activeMessages: {
          ...state.activeMessages,
          [conversationId]: updatedList,
        },
      };
    }),
}));
