import { create } from 'zustand';
import { fetchWithFallback } from '../services/api';

interface DataState {
  boards: any[];
  lists: any[];
  cards: any[];
  isLoading: boolean;
  fetchBoards: () => Promise<void>;
  fetchListsAndCards: (boardId: string) => Promise<void>;
}

const dummyBoards = [
  { id: '1', title: 'Gen-Z Project Alpha', blurHash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' },
  { id: '2', title: 'Vibe Check 2026', blurHash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' },
];

const dummyLists = [
  { id: 'l1', boardId: '1', title: 'To Do' },
  { id: 'l2', boardId: '1', title: 'In Progress' }
];

const dummyCards = [
  { id: 'c1', listId: 'l1', title: 'Implement Gen-Z UI', description: 'Make it pop with neon colors and glass effects. Add animations.' },
  { id: 'c2', listId: 'l1', title: 'Configure Tailwind', description: 'Ensure NativeWind v4 resolves all paths.' },
  { id: 'c3', listId: 'l2', title: 'Fix Layout Bugs', description: 'Address the root layout navigation issue.' }
];

export const useDataStore = create<DataState>((set) => ({
  boards: [],
  lists: [],
  cards: [],
  isLoading: false,
  fetchBoards: async () => {
    set({ isLoading: true });
    try {
      const data = await fetchWithFallback('/boards', {}, dummyBoards);
      set({ boards: data, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
  fetchListsAndCards: async (boardId: string) => {
    set({ isLoading: true });
    try {
      const listsData = await fetchWithFallback(`/boards/${boardId}/lists`, {}, dummyLists.filter(l => l.boardId === boardId));
      const cardsData = (await Promise.all(
        listsData.map(async (list: any) => {
          const fallbackCards = dummyCards.filter((card) => card.listId === list.id);
          return fetchWithFallback(`/cards/${list.id}`, {}, fallbackCards);
        })
      )).flat();
      set({ lists: listsData, cards: cardsData, isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  }
}));
