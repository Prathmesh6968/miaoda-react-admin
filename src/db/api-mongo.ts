// MongoDB API - Calls backend server instead of localStorage
import type { Anime, Episode, Profile } from '@/types';

const API_BASE = process.env.VITE_API_URL || 'http://localhost:5001/api';

export const animeApi = {
  async getAll(filters?: any) {
    try {
      const response = await fetch(`${API_BASE}/anime`);
      if (!response.ok) throw new Error('Failed to fetch anime');
      return await response.json();
    } catch (error) {
      console.error('Error fetching anime:', error);
      return [];
    }
  },

  async getById(id: string) {
    try {
      const response = await fetch(`${API_BASE}/anime/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching anime:', error);
      return null;
    }
  },

  async create(anime: Omit<Anime, 'id' | 'created_at' | 'rating'>) {
    try {
      const response = await fetch(`${API_BASE}/anime`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anime)
      });
      if (!response.ok) throw new Error('Failed to create anime');
      return await response.json();
    } catch (error) {
      console.error('Error creating anime:', error);
      throw error;
    }
  },

  async update(id: string, anime: Partial<Anime>) {
    try {
      const response = await fetch(`${API_BASE}/anime/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(anime)
      });
      if (!response.ok) throw new Error('Failed to update anime');
      return await response.json();
    } catch (error) {
      console.error('Error updating anime:', error);
      throw error;
    }
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE}/anime/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete anime');
    } catch (error) {
      console.error('Error deleting anime:', error);
      throw error;
    }
  },

  async getFeatured(limit = 6) {
    return this.getAll();
  },

  async getTrending(limit = 12) {
    return this.getAll();
  },

  async getBySeriesName(seriesName: string) {
    const all = await this.getAll();
    return all.filter((a: any) => a.series_name === seriesName);
  }
};

export const episodeApi = {
  async getByAnimeId(animeId: string) {
    try {
      const response = await fetch(`${API_BASE}/episodes/${animeId}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching episodes:', error);
      return [];
    }
  },

  async getById(id: string) {
    return null;
  },

  async create(episode: Omit<Episode, 'id' | 'created_at'>) {
    try {
      const response = await fetch(`${API_BASE}/episodes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(episode)
      });
      if (!response.ok) throw new Error('Failed to create episode');
      return await response.json();
    } catch (error) {
      console.error('Error creating episode:', error);
      throw error;
    }
  },

  async update(id: string, episode: Partial<Episode>) {
    return null;
  },

  async delete(id: string) {
    try {
      const response = await fetch(`${API_BASE}/episodes/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete episode');
    } catch (error) {
      console.error('Error deleting episode:', error);
      throw error;
    }
  }
};

export const profileApi = {
  async getById(id: string) {
    return null;
  },

  async getAll() {
    try {
      const response = await fetch(`${API_BASE}/profiles`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }
  },

  async update(id: string, profile: any) {
    return null;
  },

  async updateRole(id: string, role: 'user' | 'admin') {
    try {
      const response = await fetch(`${API_BASE}/profiles/${id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role })
      });
      if (!response.ok) throw new Error('Failed to update role');
      return await response.json();
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  }
};

// Stub implementations
export const watchlistApi = {
  async getByUserId(userId: string) { return []; },
  async add(userId: string, animeId: string) { return null; },
  async remove(userId: string, animeId: string) {},
  async isInWatchlist(userId: string, animeId: string) { return false; }
};

export const progressApi = {
  async getByUserId(userId: string, animeId?: string) { return []; },
  async getByEpisodeId(userId: string, episodeId: string) { return null; },
  async upsert(progress: any) { return null; },
  async markWatched(userId: string, episodeId: string, animeId: string, watched: boolean) { return null; },
  async updatePosition(userId: string, episodeId: string, animeId: string, position: number) { return null; }
};

export const reviewApi = {
  async getByAnimeId(animeId: string) { return []; },
  async getUserReview(userId: string, animeId: string) { return null; },
  async create(review: any) { return null; },
  async update(id: string, review: any) { return null; },
  async delete(id: string) {}
};
