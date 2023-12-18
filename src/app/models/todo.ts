export interface TodoModel {
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean;
    showNotification?: boolean
}

export type filterType = 'all' | 'active' | 'completed';