import { create } from 'zustand';

type useRenameProjectModalStore = {
	isOpen: boolean;
	onClose: () => void;
	onOpen: (projectId: string, projectName: string) => void;
	projectId: string | null;
	projectName: string | null;
};

export const useRenameProjectModal = create<useRenameProjectModalStore>((set) => ({
	isOpen: false,
	onClose: () => set({ isOpen: false, projectId: null, projectName: null }),
	onOpen: (projectId: string, projectName: string) => set({ isOpen: true, projectId, projectName }),
	projectId: null,
	projectName: null,
}));
