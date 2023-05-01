export interface Subscription {
    pk: number;
    title: string;
    about: string;
    month_paying: number|null;
    mqtt: boolean;
    email_notf: boolean;
    sms_notf: boolean;
    max_owners: number;
    change_parts: boolean;
}

export interface User {
    pk: number;
    email: string;
    is_active: boolean;
    date_joined: string;
    is_staff: boolean;
    delete_at: null|string;
    permissions: string[];
    groups: string[];
    created_by: string|null;
}

export interface ContextUser {
    pk: number|null;
    email: string|null;
    is_active: boolean|null;
    date_joined: string|null;
    is_staff: boolean|null;
    delete_at: string|null;
    permissions: string[]|null;
}

export interface UserAsField {
    pk: number
    email: string;
}

export interface Record {
    pk: number;
    level_m: number;
    level_percent: number;
    battery: number;
    battery_voltage: number;
    date: string;
    created_on_debug_mode: boolean;
    mqtt_message: string|null;
}

export interface SimpleCesspoolToUser {
    pk: number;
    user: string;
    is_super_owner: true;
}

export interface Cesspool {
    pk: number;
    code: string;
    city: string|null;
    about: string|null;
    delete_at: string|null;
    subscription: Subscription;
    record: Record|null;
    problems: string[];
    owner: null|UserAsField;
    subscription_expiration_date: string|null;
    is_subsription_expirate: boolean;
    debug_mode: boolean;
    created_by: UserAsField|undefined|null;
}

export interface CesspoolToUser {
    pk: number;
    user: string;
    cesspool: Cesspool;
    title: string;
    contact_at_level: number;
    is_super_owner: true;
    cesspool_users: undefined|string[];
}

export interface City {
    id: number;
    title: string;
    district: string;
    delete_at: null|string,
    manager: UserAsField;
    created_by: UserAsField|null;
}


export interface CreatedByItem {
    pk: number;
    title: string|number;
    model: string;
}