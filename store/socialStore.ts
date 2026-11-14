// store/socialStore.ts
import { create } from 'zustand';
import { Post, ReactionType, Story } from '../types/models';
import { MOCK_POSTS, MOCK_STORIES } from '../services/mockData';
import { api } from '../services/api';

interface SocialState {
  posts: Post[];
  stories: Story[];
  savedPostIds: string[];
  isLoadingFeed: boolean;
  fetchFeed: (filter?: 'FOR_YOU' | 'FOLLOWING' | 'GYM') => Promise<void>;
  toggleReaction: (postId: string, reaction: ReactionType) => void;
  addComment: (postId: string, content: string, authorUser: any, parentId?: string) => void;
  toggleSavePost: (postId: string) => void;
  createPost: (
    post: Omit<Post, 'id' | 'createdAt' | 'reactionsCount' | 'commentsCount' | 'comments'>
  ) => void;
  markStorySeen: (storyId: string) => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: MOCK_POSTS,
  stories: MOCK_STORIES,
  savedPostIds: [],
  isLoadingFeed: false,

  fetchFeed: async (filter = 'FOR_YOU') => {
    set({ isLoadingFeed: true });
    const res = await api.getFeed(filter);
    set({ isLoadingFeed: false });
    if (res.data && Array.isArray(res.data) && res.data.length > 0) {
      // Fusionner les données de l'API avec les posts locaux
      set({ posts: res.data });
    }
  },

  toggleReaction: (postId, reaction) => {
    // 1. Optimistic Update dans l'interface
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;
        const isSameReaction = p.myReaction === reaction;
        const countDiff = isSameReaction ? -1 : p.myReaction ? 0 : 1;
        return {
          ...p,
          myReaction: isSameReaction ? undefined : reaction,
          reactionsCount: Math.max(0, p.reactionsCount + countDiff),
        };
      }),
    }));

    // 2. Appel asynchrone en arrière-plan vers l'API
    api.toggleReaction(postId, reaction).catch(() => {
      // En cas d'erreur ou offline, l'état optimiste reste affiché
    });
  },

  addComment: (postId, content, authorUser, parentId) => {
    const newComment = {
      id: `c_${Date.now()}`,
      postId,
      author: {
        id: authorUser.id,
        username: authorUser.username,
        fullName: authorUser.fullName,
        avatarUrl: authorUser.avatarUrl,
        isVerified: authorUser.isVerified,
        role: authorUser.role,
      },
      content,
      createdAt: 'À l’instant',
      likesCount: 0,
      isLikedByMe: false,
      replies: [],
    };

    // 1. Optimistic Update
    set((state) => ({
      posts: state.posts.map((p) => {
        if (p.id !== postId) return p;
        if (parentId) {
          const updatedComments = p.comments.map((c) => {
            if (c.id === parentId) {
              return {
                ...c,
                replies: [...(c.replies || []), newComment],
              };
            }
            return c;
          });
          return {
            ...p,
            commentsCount: p.commentsCount + 1,
            comments: updatedComments,
          };
        }

        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [newComment, ...p.comments],
        };
      }),
    }));

    // 2. Appel en tâche de fond vers l'API
    api.addComment(postId, content, parentId).catch(() => {});
  },

  toggleSavePost: (postId) =>
    set((state) => {
      const isSaved = state.savedPostIds.includes(postId);
      return {
        savedPostIds: isSaved
          ? state.savedPostIds.filter((id) => id !== postId)
          : [...state.savedPostIds, postId],
      };
    }),

  createPost: (newPostData) => {
    const fullPost: Post = {
      ...newPostData,
      id: `post_${Date.now()}`,
      createdAt: 'À l’instant',
      reactionsCount: 0,
      commentsCount: 0,
      comments: [],
    };

    // 1. Mise à jour instantanée de l'interface
    set((state) => ({
      posts: [fullPost, ...state.posts],
    }));

    // 2. Persistance en base de données via l'API
    api
      .createPost({
        content: newPostData.content,
        mediaUrls: newPostData.mediaUrls,
        postType: newPostData.postType,
        location: newPostData.location,
        workoutSummary: newPostData.workoutSummary,
        beforeAfter: newPostData.beforeAfter,
      })
      .catch(() => {});
  },

  markStorySeen: (storyId) =>
    set((state) => ({
      stories: state.stories.map((s) => (s.id === storyId ? { ...s, hasSeen: true } : s)),
    })),
}));
