export interface TodoModel {
    id: number;
    title: string;
    completed: boolean;
    editing?: boolean
}

export type filterType = 'all' | 'active' | 'completed';