export type Note = {
    note: string;
    key: string;
    encrypted: boolean;
    editedAt: number;
    syncAt?: number;
};
