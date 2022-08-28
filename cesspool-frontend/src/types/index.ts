export interface ProblemType {
    importance: number;
    detail: string
}

export interface MachineType {
    id: number;
    title: string|null;
    code: string;
    level: number|null;
    max_level: number|null;
    battery: number|null;
    problems: ProblemType[];
    level_percent: number|null;
    rise_level: number;
    last_update: string|null;
}

export interface RecordType {
    id: number;
    level: number;
    level_percent: number;
    battery: number;
    date: string
}

export interface UserType {
    email: string|null;
    is_active: boolean|null;
    is_superuser: boolean|null;
    date_joined: string|null;
}

export interface MachineAdminType {
    id: number;
    code: string;
    user: string|null;
}