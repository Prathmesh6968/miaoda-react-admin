import type { Anime, Episode, Review, WatchProgress, AnimeWithProgress, EpisodeWithProgress, ReviewWithUser, ContentType, Profile } from '@/types';

// Simple localStorage-based API for anime management
const ANIME_STORAGE_KEY = 'anime_data';
const EPISODES_STORAGE_KEY = 'episodes_data';
const PROFILES_STORAGE_KEY = 'profiles_data';

// Helper functions
function getAnimeData(): Anime[] {
  try {
    const data = localStorage.getItem(ANIME_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveAnimeData(anime: Anime[]) {
  localStorage.setItem(ANIME_STORAGE_KEY, JSON.stringify(anime));
}

function getEpisodesData(): Episode[] {
  try {
    const data = localStorage.getItem(EPISODES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveEpisodesData(episodes: Episode[]) {
  localStorage.setItem(EPISODES_STORAGE_KEY, JSON.stringify(episodes));
}

function getProfilesData(): Profile[] {
  try {
    const data = localStorage.getItem(PROFILES_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function saveProfilesData(profiles: Profile[]) {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const animeApi = {
  async getAll(filters?: {
    genres?: string[];
    season?: string;
    year?: number;
    status?: string;
    search?: string;
    content_type?: ContentType;
    limit?: number;
    offset?: number;
  }) {
    let data = getAnimeData();

    if (filters?.genres && filters.genres.length > 0) {
      data = data.filter(anime => 
        anime.genres?.some(g => filters.genres?.includes(g))
      );
    }

    if (filters?.season) {
      data = data.filter(anime => anime.season === filters.season);
    }

    if (filters?.year) {
      data = data.filter(anime => anime.release_year === filters.year);
    }

    if (filters?.status) {
      data = data.filter(anime => anime.status === filters.status);
    }

    if (filters?.content_type) {
      data = data.filter(anime => anime.content_type === filters.content_type);
    }

    if (filters?.search) {
      const search = filters.search.toLowerCase();
      data = data.filter(anime => anime.title.toLowerCase().includes(search));
    }

    data = data.sort((a, b) => 
      new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    );

    if (filters?.offset) {
      const limit = filters.limit || 10;
      data = data.slice(filters.offset, filters.offset + limit);
    } else if (filters?.limit) {
      data = data.slice(0, filters.limit);
    }

    return data;
  },

  async getById(id: string) {
    const data = getAnimeData();
    return data.find(anime => anime.id === id) || null;
  },

  async create(anime: Omit<Anime, 'id' | 'created_at' | 'rating'>) {
    const data = getAnimeData();
    const newAnime: Anime = {
      ...(anime as any),
      id: generateId(),
      created_at: new Date().toISOString(),
      rating: 0
    };
    data.push(newAnime);
    saveAnimeData(data);
    return newAnime;
  },

  async update(id: string, anime: Partial<Anime>) {
    const data = getAnimeData();
    const index = data.findIndex(a => a.id === id);
    if (index === -1) throw new Error('Anime not found');
    
    data[index] = { ...data[index], ...anime };
    saveAnimeData(data);
    return data[index];
  },

  async delete(id: string) {
    const data = getAnimeData();
    const filtered = data.filter(a => a.id !== id);
    saveAnimeData(filtered);
  },

  async getFeatured(limit = 6) {
    const data = getAnimeData();
    return data
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  },

  async getTrending(limit = 12) {
    const data = getAnimeData();
    return data
      .filter(a => a.status === 'Ongoing')
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, limit);
  },

  async getBySeriesName(seriesName: string) {
    const data = getAnimeData();
    return data
      .filter(a => a.series_name === seriesName)
      .sort((a, b) => (a.season_number || 1) - (b.season_number || 1));
  }
};

export const episodeApi = {
  async getByAnimeId(animeId: string) {
    const data = getEpisodesData();
    return data
      .filter(e => e.anime_id === animeId)
      .sort((a, b) => a.episode_number - b.episode_number);
  },

  async getById(id: string) {
    const data = getEpisodesData();
    return data.find(e => e.id === id) || null;
  },

  async create(episode: Omit<Episode, 'id' | 'created_at'>) {
    const data = getEpisodesData();
    const newEpisode: Episode = {
      ...(episode as any),
      id: generateId(),
      created_at: new Date().toISOString()
    };
    data.push(newEpisode);
    saveEpisodesData(data);
    return newEpisode;
  },

  async update(id: string, episode: Partial<Episode>) {
    const data = getEpisodesData();
    const index = data.findIndex(e => e.id === id);
    if (index === -1) throw new Error('Episode not found');
    
    data[index] = { ...data[index], ...episode };
    saveEpisodesData(data);
    return data[index];
  },

  async delete(id: string) {
    const data = getEpisodesData();
    const filtered = data.filter(e => e.id !== id);
    saveEpisodesData(filtered);
  }
};

// Stub implementations for unused APIs
export const watchlistApi = {
  async getByUserId(userId: string) { return []; },
  async add(userId: string, animeId: string) { return null; },
  async remove(userId: string, animeId: string) {},
  async isInWatchlist(userId: string, animeId: string) { return false; }
};

export const progressApi = {
  async getByUserId(userId: string, animeId?: string) { return []; },
  async getByEpisodeId(userId: string, episodeId: string) { return null; },
  async upsert(progress: Omit<WatchProgress, 'id' | 'updated_at'>) { return null; },
  async markWatched(userId: string, episodeId: string, animeId: string, watched: boolean) { return null; },
  async updatePosition(userId: string, episodeId: string, animeId: string, position: number) { return null; }
};

export const reviewApi = {
  async getByAnimeId(animeId: string) { return [] as ReviewWithUser[]; },
  async getUserReview(userId: string, animeId: string) { return null; },
  async create(review: Omit<Review, 'id' | 'created_at' | 'updated_at'>) { return null; },
  async update(id: string, review: Partial<Review>) { return null; },
  async delete(id: string) {}
};

export const profileApi = {
  async getById(id: string) {
    const data = getProfilesData();
    return data.find(p => p.id === id) || null;
  },

  async getAll() {
    return getProfilesData();
  },

  async update(id: string, profile: Partial<{ username: string; avatar_url: string }>) {
    const data = getProfilesData();
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], ...profile };
    saveProfilesData(data);
    return data[index];
  },

  async updateRole(id: string, role: 'user' | 'admin') {
    const data = getProfilesData();
    const index = data.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    data[index] = { ...data[index], role };
    saveProfilesData(data);
    return data[index];
  }
};
