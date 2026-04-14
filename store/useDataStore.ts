import { create } from 'zustand';
import { api } from '../services/api';
import { useAuthStore } from './useAuthStore';
import { colors } from '../theme/colors';

export interface Board {
  id: string;
  title: string;
  color?: string;
  starred?: boolean;
  cardCount?: number;
}

export interface CardItem {
  id: string;
  listId: string;
  title: string;
  description?: string;
  labelColor?: string;
  assigneeName?: string;
  dueDate?: string;
  attachmentCount?: number;
  commentCount?: number;
  completed?: boolean;
  members?: string[];
  labels?: { text: string; color: string }[];
  checklistItems?: { id: string; text: string; checked: boolean }[];
  comments?: { id: string; author: string; text: string; createdAt: string }[];
}

export interface ListItem {
  id: string;
  boardId: string;
  title: string;
  sections?: ListSection[];
}

export interface ListSection {
  id: string;
  listId: string;
  title: string;
  isCollapsed?: boolean;
  cardIds?: string[];
}

export interface Group {
  id: string;
  name: string;
  createdBy?: string;
  members?: string[];
  invitedMembers?: string[];
  createdAt?: string;
}

interface DataState {
  boards: Board[];
  lists: ListItem[];
  cards: CardItem[];
  groups: Group[];
  isLoading: boolean;
  fetchBoards: () => Promise<void>;
  fetchListsAndCards: (boardId: string) => Promise<void>;
  fetchGroups: () => Promise<void>;
  createBoard: (title: string, color?: string) => Promise<void>;
  createList: (boardId: string, title: string) => Promise<void>;
  createCard: (listId: string, title: string) => Promise<void>;
  createGroup: (name: string) => Promise<void>;
  deleteGroup: (groupId: string) => Promise<void>;
  inviteMemberToGroup: (groupId: string, userId: string) => Promise<void>;
  acceptGroupInvitation: (groupId: string) => Promise<void>;
  removeGroupMember: (groupId: string, userId: string) => Promise<void>;
  updateCard: (cardId: string, updates: Partial<CardItem>) => void;
  toggleStar: (boardId: string) => void;
}

const dummyBoards: Board[] = [
  { id: '1', title: 'Product Roadmap', color: colors.boardColors[0], starred: true, cardCount: 12 },
  { id: '2', title: 'Design System', color: colors.boardColors[2], starred: false, cardCount: 8 },
  { id: '3', title: 'Marketing Q2', color: colors.boardColors[4], starred: false, cardCount: 5 },
  { id: '4', title: 'Engineering Backlog', color: colors.boardColors[1], starred: true, cardCount: 20 },
  { id: '5', title: 'Onboarding Flow', color: colors.boardColors[5], starred: false, cardCount: 7 },
];

const dummyLists: ListItem[] = [
  { id: 'l1', boardId: '1', title: 'Backlog' },
  { id: 'l2', boardId: '1', title: 'In Progress' },
  { id: 'l3', boardId: '1', title: 'Review' },
  { id: 'l4', boardId: '1', title: 'Done' },
];

const dummyCards: CardItem[] = [
  {
    id: 'c1', listId: 'l1', title: 'Design new onboarding screens',
    description: 'Create wireframes and high-fidelity mockups for the onboarding flow.',
    labelColor: colors.labelColors.purple,
    assigneeName: 'Alice Chen',
    dueDate: '2026-04-20',
    attachmentCount: 2,
    commentCount: 3,
    members: ['Alice Chen', 'Bob Smith'],
    labels: [{ text: 'Design', color: colors.labelColors.purple }],
    checklistItems: [
      { id: 'ci1', text: 'Wireframes', checked: true },
      { id: 'ci2', text: 'Hi-fi mockups', checked: false },
      { id: 'ci3', text: 'Review with team', checked: false },
    ],
    comments: [
      { id: 'cm1', author: 'Bob Smith', text: 'Wireframes look great! Proceeding to hi-fi.', createdAt: '2026-04-09T10:00:00Z' },
    ],
  },
  {
    id: 'c2', listId: 'l1', title: 'Integrate payment gateway',
    description: 'Set up Stripe with webhook handling and retry logic.',
    labelColor: colors.labelColors.red,
    assigneeName: 'Bob Smith',
    dueDate: '2026-04-15',
    commentCount: 1,
    members: ['Bob Smith'],
    labels: [{ text: 'Backend', color: colors.labelColors.red }],
  },
  {
    id: 'c3', listId: 'l2', title: 'Build push notification service',
    description: 'Implement FCM for Android and APNs for iOS.',
    labelColor: colors.labelColors.blue,
    assigneeName: 'Carol D',
    dueDate: '2026-04-18',
    attachmentCount: 1,
    commentCount: 5,
    members: ['Carol D', 'Alice Chen'],
    labels: [{ text: 'Mobile', color: colors.labelColors.blue }],
    checklistItems: [
      { id: 'ci4', text: 'FCM setup', checked: true },
      { id: 'ci5', text: 'APNs setup', checked: true },
      { id: 'ci6', text: 'Test on device', checked: false },
    ],
  },
  {
    id: 'c4', listId: 'l2', title: 'Refactor auth middleware',
    labelColor: colors.labelColors.yellow,
    assigneeName: 'Dave K',
    dueDate: '2026-04-12',
    completed: false,
    members: ['Dave K'],
    labels: [{ text: 'Urgent', color: colors.labelColors.yellow }],
  },
  {
    id: 'c5', listId: 'l3', title: 'Write API documentation',
    labelColor: colors.labelColors.sky,
    assigneeName: 'Eve M',
    commentCount: 2,
    members: ['Eve M'],
    labels: [{ text: 'Docs', color: colors.labelColors.sky }],
  },
  {
    id: 'c6', listId: 'l4', title: 'Set up CI/CD pipeline',
    labelColor: colors.labelColors.green,
    assigneeName: 'Alice Chen',
    completed: true,
    members: ['Alice Chen'],
    labels: [{ text: 'DevOps', color: colors.labelColors.green }],
  },
];

export const useDataStore = create<DataState>((set, get) => ({
  boards: [],
  lists: [],
  cards: [],
  groups: [],
  isLoading: false,

  fetchBoards: async () => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const data = await api.boards.getAll(token);
      const mapped: Board[] = (data as any[]).map((b, i) => ({
        id: b.id,
        title: b.title,
        color: colors.boardColors[i % colors.boardColors.length],
        starred: false,
        cardCount: 0,
      }));
      set({ boards: mapped, isLoading: false });
    } catch {
      set({ boards: dummyBoards, isLoading: false });
    }
  },

  fetchListsAndCards: async (boardId: string) => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const listsData = (await api.lists.getByBoardId(boardId, token)) as any[];
      const cardsData = (
        await Promise.all(
          listsData.map(async (list: any) => {
            try {
              const cards = (await api.cards.getByListId(list.id, token)) as any[];
              return cards.map((c, i) => ({
                ...c,
                listId: list.id,
                labelColor: colors.boardColors[i % colors.boardColors.length],
              }));
            } catch {
              return dummyCards.filter((c) => c.listId === list.id);
            }
          })
        )
      ).flat() as CardItem[];
      set({ lists: listsData, cards: cardsData, isLoading: false });
    } catch {
      const fallbackLists = dummyLists.filter((l) => l.boardId === boardId);
      const fallbackCards = dummyCards.filter((c) =>
        fallbackLists.some((l) => l.id === c.listId)
      );
      set({ lists: fallbackLists, cards: fallbackCards, isLoading: false });
    }
  },

  fetchGroups: async () => {
    set({ isLoading: true });
    try {
      const token = useAuthStore.getState().token;
      const data = await api.groups.getAll(token);
      const mapped: Group[] = (data as any[]).map((g) => ({
        id: g.id,
        name: g.name,
        createdBy: g.createdBy,
        members: g.members || [],
        invitedMembers: g.invitedMembers || [],
        createdAt: g.createdAt,
      }));
      set({ groups: mapped, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch groups:', error);
      set({ groups: [], isLoading: false });
    }
  },

  createBoard: async (title: string, color?: string) => {
    const token = useAuthStore.getState().token;
    try {
      const newBoard: any = await api.boards.create({ title }, token);
      const board: Board = {
        id: newBoard.id,
        title: newBoard.title,
        color: color ?? colors.boardColors[get().boards.length % colors.boardColors.length],
        starred: false,
      };
      set((s) => ({ boards: [...s.boards, board] }));
    } catch {
      const optimistic: Board = {
        id: `local_${Date.now()}`,
        title,
        color: color ?? colors.boardColors[get().boards.length % colors.boardColors.length],
        starred: false,
      };
      set((s) => ({ boards: [...s.boards, optimistic] }));
    }
  },

  createList: async (boardId: string, title: string) => {
    const token = useAuthStore.getState().token;
    try {
      const newList: any = await api.lists.create({ boardId, title }, token);
      set((s) => ({ lists: [...s.lists, { id: newList.id, boardId, title }] }));
    } catch {
      const optimistic: ListItem = { id: `local_${Date.now()}`, boardId, title };
      set((s) => ({ lists: [...s.lists, optimistic] }));
    }
  },

  createCard: async (listId: string, title: string) => {
    const token = useAuthStore.getState().token;
    try {
      const newCard: any = await api.cards.create(listId, { title }, token);
      const card: CardItem = { id: newCard.id, listId, title };
      set((s) => ({ cards: [...s.cards, card] }));
    } catch {
      const optimistic: CardItem = { id: `local_${Date.now()}`, listId, title };
      set((s) => ({ cards: [...s.cards, optimistic] }));
    }
  },

  createGroup: async (name: string) => {
    const token = useAuthStore.getState().token;
    try {
      const newGroup: any = await api.groups.create({ name }, token);
      const group: Group = {
        id: newGroup.id,
        name: newGroup.name,
        createdBy: newGroup.createdBy,
        members: newGroup.members || [],
        invitedMembers: newGroup.invitedMembers || [],
        createdAt: newGroup.createdAt,
      };
      set((s) => ({ groups: [...s.groups, group] }));
    } catch (error) {
      console.error('Failed to create group:', error);
      throw error;
    }
  },

  deleteGroup: async (groupId: string) => {
    const token = useAuthStore.getState().token;
    try {
      await api.groups.delete(groupId, token);
      set((s) => ({ groups: s.groups.filter((g) => g.id !== groupId) }));
    } catch (error) {
      console.error('Failed to delete group:', error);
      throw error;
    }
  },

  inviteMemberToGroup: async (groupId: string, userId: string) => {
    const token = useAuthStore.getState().token;
    try {
      await api.groups.invite(groupId, { userId }, token);
      set((s) => ({
        groups: s.groups.map((g) =>
          g.id === groupId
            ? {
              ...g,
              invitedMembers: [...(g.invitedMembers || []), userId],
            }
            : g
        ),
      }));
    } catch (error) {
      console.error('Failed to invite member:', error);
      throw error;
    }
  },

  acceptGroupInvitation: async (groupId: string) => {
    const token = useAuthStore.getState().token;
    try {
      await api.groups.acceptInvitation(groupId, token);
      const userId = useAuthStore.getState().user?.id;
      set((s) => ({
        groups: s.groups.map((g) =>
          g.id === groupId
            ? {
              ...g,
              members: [...(g.members || []), userId || ''],
              invitedMembers: (g.invitedMembers || []).filter((u) => u !== userId),
            }
            : g
        ),
      }));
    } catch (error) {
      console.error('Failed to accept invitation:', error);
      throw error;
    }
  },

  removeGroupMember: async (groupId: string, userId: string) => {
    const token = useAuthStore.getState().token;
    try {
      await api.groups.removeMember(groupId, { userId }, token);
      set((s) => ({
        groups: s.groups.map((g) =>
          g.id === groupId
            ? {
              ...g,
              members: (g.members || []).filter((u) => u !== userId),
            }
            : g
        ),
      }));
    } catch (error) {
      console.error('Failed to remove member:', error);
      throw error;
    }
  },

  updateCard: (cardId: string, updates: Partial<CardItem>) => {
    set((s) => ({
      cards: s.cards.map((c) => (c.id === cardId ? { ...c, ...updates } : c)),
    }));
  },

  toggleStar: (boardId: string) => {
    set((s) => ({
      boards: s.boards.map((b) =>
        b.id === boardId ? { ...b, starred: !b.starred } : b
      ),
    }));
  },
}));
