export interface ProblemType {
    importance: number;
    detail: string
}

export interface MachineType {
    id: number;
    title: string;
    code: string;
    level: number;
    battery: number;
    problems: ProblemType[];
    level_percent: number;
    rise_level: number;
    last_update: string;
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
    is_staff: boolean|null;
    date_joined: string|null;
}

export interface UserType {
    pk: Number
    email: string;
    is_active: boolean;
    is_staff: boolean;
    date_joined: string;
    delete_date: string|null
    delete_machines_date: string|null
}

export interface MachineAdminType {
    id: number;
    code: string;
    user: string|null;
    mqtt: boolean;
    notification: boolean;
    delete_date: string|null
    delete_records_date: string|null
    records: number
    last_update: string
    problems: ProblemType[],
    title: string|null
}

export interface MachineRecordsSupportType {
    year: boolean
    month: boolean
    week: boolean
    day: boolean
}

export interface MachineForMenu {
    title: string
    level: number
    topProblem: null | "warning" | "error"
    battery: number
}

export interface MachineForAdminMenu {
    title: string|null
    code: string
    user: string|null
    delete: boolean
}

// types
export interface Subscription {
    pk: number;
    title: string;
    about: string;
    month_paying: number|null;
    mqtt: boolean;
    email_notf: boolean;
    sms_notf: boolean;
    max_owners: boolean;
}

export interface SubscriptionParam {
    about: string;
    value: boolean;
}

export interface User {
    pk: number; 
    email: string; 
    is_active: boolean; 
    date_joined: string; 
    is_staff: boolean; 
    delete_at: null|string;
}

export interface Record {
    pk: number;
    level_m: number;
    level_percent: number;
    battery: number;
}

export interface SimpleCesspoolToUser {
    user: string;
    is_super_owner: true;
}

export interface Cesspool {
    pk: number;
    code: string;
    city: string;
    users: SimpleCesspoolToUser[];
    about: string|null;
    delete_at: string|null;
    subscription: string;
    record: Record|null;
}

export interface CesspoolToUser {
    pk: number;
    user: string;
    cesspool: Cesspool;
    title: string;
    contact_at_level: number;
    is_super_owner: true;
}