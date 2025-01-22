import { User } from 'types/user';
import { create } from 'zustand';

type StoreType = {
  user: User | null;
  setUser: (user: User) => void;
};

const useStore = create<StoreType>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user: user })),
}));

export default useStore;
