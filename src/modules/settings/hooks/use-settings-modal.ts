import { create } from 'zustand';

type useSettingsModalStore = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: () => void;
};

export const useSettingsModal = create<useSettingsModalStore>((set) => ({
	isOpen: false,
	onClose: () => set({ isOpen: false }),
	onOpen: () => set({ isOpen: true }),
}));
