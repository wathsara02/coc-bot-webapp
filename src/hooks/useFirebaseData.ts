import { useState, useEffect } from 'react';
import { ref, onValue, off } from 'firebase/database';
import { database } from '../firebase/config';

export interface GlobalLoot {
  gold: number;
  elixir: number;
  dark_elixir: number;
}

export interface UserData {
  name: string;
  device_id: string;
  registered_time: string;
  used_key: string;
  attack_count: number;
  last_online?: string;
  loot: {
    gold: number;
    elixir: number;
    dark_elixir: number;
  };
}

export interface Feedback {
  user_name: string;
  device_id: string;
  feedback: string;
  timestamp: string;
}

// Hook for global loot data
export const useGlobalLoot = () => {
  const [globalLoot, setGlobalLoot] = useState<GlobalLoot>({ gold: 0, elixir: 0, dark_elixir: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const globalLootRef = ref(database, 'global_loot');
    
    const unsubscribe = onValue(globalLootRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === 'object') {
          setGlobalLoot({
            gold: Number(data.gold) || 0,
            elixir: Number(data.elixir) || 0,
            dark_elixir: Number(data.dark_elixir) || 0
          });
        } else {
          // Set default values if no data exists
          setGlobalLoot({
            gold: 0,
            elixir: 0,
            dark_elixir: 0
          });
        }
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching global loot:', err);
        setError('Failed to fetch global loot data');
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setError(error.message || 'Firebase connection error');
      setLoading(false);
    });

    return () => off(globalLootRef, 'value', unsubscribe);
  }, []);

  return { globalLoot, loading, error };
};

// Hook for users data
export const useUsers = () => {
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [userCount, setUserCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const usersRef = ref(database, 'users');
    
    const unsubscribe = onValue(usersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data && typeof data === 'object') {
          setUsers(data);
          setUserCount(Object.keys(data).length);
        } else {
          setUsers({});
          setUserCount(0);
        }
        setError(null);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users data');
        setLoading(false);
      }
    }, (error) => {
      console.error('Firebase error:', error);
      setError(error.message || 'Firebase connection error');
      setLoading(false);
    });

    return () => off(usersRef, 'value', unsubscribe);
  }, []);

  return { users, userCount, loading, error };
};

// Hook for feedback data
export const useFeedback = () => {
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const feedbackRef = ref(database, 'feedbacks');
    
    const unsubscribe = onValue(feedbackRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          setFeedback(data);
        } else {
          setFeedback({});
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch feedback data');
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => off(feedbackRef, 'value', unsubscribe);
  }, []);

  return { feedback, loading, error };
};

// Hook for news/announcements
export const useNews = () => {
  const [news, setNews] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const newsRef = ref(database, 'news');
    
    const unsubscribe = onValue(newsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          if (typeof data === 'string') {
            setNews(data);
          } else if (typeof data === 'object' && data.message) {
            setNews(data.message);
          } else {
            setNews(JSON.stringify(data));
          }
        } else {
          setNews('No announcements');
        }
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news data');
        setLoading(false);
      }
    }, (error) => {
      setError(error.message);
      setLoading(false);
    });

    return () => off(newsRef, 'value', unsubscribe);
  }, []);

  return { news, loading, error };
};