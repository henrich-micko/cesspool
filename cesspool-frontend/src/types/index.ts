export interface ProblemType {
    importance: number;
    detail: string
}

export interface MachineType {
    id: number;
    title: string|null;
    code: string;
    level: number|null;
    battery: number|null;
    problems: ProblemType[];
    level_percent: number|null;
    rise_level: number;
    last_update: string|null;
    hight_level: number;
}

export interface RecordType {
    id: number;
    level: number;
    level_percent: number;
    battery: number;
    date: string
}

export interface ContextUserType {
    email: string|null;
    is_active: boolean|null;
    is_superuser: boolean|null;
    date_joined: string|null;
}

export interface UserType {
    pk: Number
    email: string;
    is_active: boolean;
    is_superuser: boolean;
    date_joined: string;
}


export interface MachineAdminType {
    id: number;
    code: string;
    user: string|null;
    mqtt: boolean;
    notification: boolean;
    autocorrect: boolean
    delete_date: string|null
    delete_records_date: string|null
    records: number
    last_update: string|null
    problems: ProblemType[],
    title: string|null
}

export interface MachineRecordsSupportType {
    year: boolean
    month: boolean
    week: boolean
    day: boolean
}