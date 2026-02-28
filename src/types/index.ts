// ============================================
// Core Types for Central 3.0
// ============================================

// --- Enums ---
export type MembershipStatus = 'member' | 'baptized_non_member' | 'non_baptized' | 'visitor';
export type Gender = 'M' | 'F' | 'other';
export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed';
export type CellStatus = 'active' | 'inactive' | 'multiplied';
export type CellMemberRole = 'participant' | 'trainee' | 'future_host';
export type MeetingDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
export type CellHealth = 'green' | 'yellow' | 'red';
export type ConvertStatus = 'new' | 'contacted' | 'connected' | 'integrated' | 'lost';
export type EventRegStatus = 'registered' | 'attended' | 'cancelled';
export type CourseStatus = 'draft' | 'open' | 'in_progress' | 'completed';
export type EnrollmentStatus = 'enrolled' | 'completed' | 'dropped';
export type ContributionType = 'tithe' | 'offering' | 'donation' | 'other';
export type PaymentMethod = 'cash' | 'credit_card' | 'debit_card' | 'pix' | 'bank_transfer' | 'other';
export type TransferType = 'transfer_out' | 'transfer_in' | 'dismissal' | 'death';
export type TimelineEventType = 'cell_joined' | 'cell_left' | 'course_enrolled' | 'course_completed' | 'event_attended' | 'contribution' | 'baptism' | 'conversion' | 'transfer' | 'badge_earned' | 'level_up';
export type AlertSeverity = 'info' | 'warning' | 'danger' | 'success';
export type InsightType = 'warning' | 'danger' | 'success' | 'info';

// --- Base ---
export interface Tenant {
    id: string;
    name: string;
    slug: string;
    custom_domain?: string;
    logo_url?: string;
    primary_color: string;
    secondary_color: string;
    cell_term: string;
    timezone: string;
    plan: 'free' | 'starter' | 'pro' | 'enterprise';
    max_cells: number;
    lgpd_dpo_email?: string;
    settings: Record<string, unknown>;
    created_at: string;
    updated_at: string;
}

// --- People ---
export interface Person {
    id: string;
    tenant_id: string;
    auth_user_id?: string;
    full_name: string;
    preferred_name?: string;
    birth_date?: string;
    gender?: Gender;
    marital_status?: MaritalStatus;
    photo_url?: string;
    cpf?: string;
    rg?: string;
    phone?: string;
    whatsapp?: string;
    email?: string;
    address_street?: string;
    address_number?: string;
    address_complement?: string;
    address_neighborhood?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
    latitude?: number;
    longitude?: number;
    membership_status: MembershipStatus;
    membership_date?: string;
    baptism_date?: string;
    conversion_date?: string;
    family_id?: string;
    lgpd_consent: boolean;
    lgpd_consent_date?: string;
    tags: string[];
    notes?: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface PersonWithRelations extends Person {
    cell_members?: (CellMember & { cells?: Pick<Cell, 'id' | 'name' | 'category'> })[];
    meeting_attendance?: MeetingAttendanceWithRelations[];
    family?: Family;
}

export interface Family {
    id: string;
    tenant_id: string;
    name: string;
    created_at: string;
}

export interface PersonTransfer {
    id: string;
    person_id: string;
    tenant_id: string;
    type: TransferType;
    destination_church?: string;
    origin_church?: string;
    reason?: string;
    letter_url?: string;
    date: string;
    created_at: string;
}

export interface PersonTimeline {
    id: string;
    person_id: string;
    tenant_id: string;
    event_type: TimelineEventType;
    event_date: string;
    title: string;
    description?: string;
    metadata?: Record<string, unknown>;
    created_at: string;
}

// --- Cells ---
export interface Cell {
    id: string;
    tenant_id: string;
    name: string;
    category?: string;
    leader_id: string;
    co_leader_id?: string;
    host_id?: string;
    trainee_id?: string;
    supervision_id?: string;
    meeting_day?: MeetingDay;
    meeting_time?: string;
    address_street?: string;
    address_number?: string;
    address_neighborhood?: string;
    address_city?: string;
    address_state?: string;
    address_zip?: string;
    latitude?: number;
    longitude?: number;
    max_participants: number;
    status: CellStatus;
    multiplied_from_id?: string;
    multiplication_target_date?: string;
    created_at: string;
    updated_at: string;
}

export interface CellWithRelations extends Cell {
    leader?: Pick<Person, 'id' | 'full_name' | 'phone'>;
    co_leader?: Pick<Person, 'id' | 'full_name' | 'phone'>;
    host?: Pick<Person, 'id' | 'full_name'>;
    trainee?: Pick<Person, 'id' | 'full_name'>;
    supervision?: Pick<Supervision, 'id' | 'name'>;
    cell_members?: CellMemberWithPerson[];
    members_count?: number;
    health?: CellHealth;
    last_meeting_date?: string;
}

export interface CellMember {
    id: string;
    cell_id: string;
    person_id: string;
    role: CellMemberRole;
    joined_at: string;
    left_at?: string;
}

export interface CellMemberWithPerson extends CellMember {
    person?: Pick<Person, 'id' | 'full_name' | 'phone' | 'membership_status' | 'photo_url'>;
}

// --- Meetings ---
export interface CellMeeting {
    id: string;
    cell_id: string;
    tenant_id: string;
    meeting_date: string;
    gods_presence?: number;
    had_supervision_visit: boolean;
    decisions_for_christ: number;
    offering_amount?: number;
    theme?: string;
    observations?: string;
    submitted_by: string;
    submitted_at: string;
}

export interface CellMeetingWithRelations extends CellMeeting {
    submitted_by_person?: Pick<Person, 'full_name'>;
    meeting_attendance?: MeetingAttendanceWithRelations[];
}

export interface MeetingAttendance {
    id: string;
    meeting_id: string;
    person_id: string;
    present: boolean;
    is_visitor: boolean;
}

export interface MeetingAttendanceWithRelations extends MeetingAttendance {
    person?: Pick<Person, 'id' | 'full_name'>;
    cell_meetings?: CellMeeting & { cells?: Pick<Cell, 'name'> };
}

// --- Cell Lessons ---
export interface CellLesson {
    id: string;
    tenant_id: string;
    title: string;
    content: string;
    scripture_reference?: string;
    discussion_questions?: string[];
    ai_generated: boolean;
    author_id?: string;
    week_date?: string;
    created_at: string;
}

// --- Supervisions ---
export interface Supervision {
    id: string;
    tenant_id: string;
    name: string;
    level: number;
    parent_id?: string;
    supervisor_id: string;
    created_at: string;
}

export interface SupervisionWithRelations extends Supervision {
    supervisor?: Pick<Person, 'id' | 'full_name'>;
    cells?: CellWithRelations[];
    children?: SupervisionWithRelations[];
    members_total?: number;
    presence_avg?: number;
    cells_count?: number;
}

export interface SupervisionVisit {
    id: string;
    supervision_id: string;
    cell_id: string;
    tenant_id: string;
    visit_date: string;
    visitor_id: string;
    checklist: Record<string, boolean>;
    notes?: string;
    created_at: string;
}

export interface SupervisionMeeting {
    id: string;
    supervision_id: string;
    tenant_id: string;
    meeting_date: string;
    agenda?: string;
    minutes?: string;
    attendees: string[];
    created_at: string;
}

// --- New Converts ---
export interface NewConvert {
    id: string;
    person_id: string;
    tenant_id: string;
    conversion_date: string;
    conversion_context?: string;
    assigned_cell_id?: string;
    consolidator_id?: string;
    status: ConvertStatus;
    first_contact_at?: string;
    follow_ups: Record<string, unknown>[];
    created_at: string;
}

export interface NewConvertWithRelations extends NewConvert {
    person?: Person;
    consolidator?: Pick<Person, 'id' | 'full_name'>;
    assigned_cell?: Pick<Cell, 'id' | 'name'>;
}

// --- Events ---
export interface Event {
    id: string;
    tenant_id: string;
    name: string;
    description?: string;
    start_date: string;
    end_date: string;
    location?: string;
    capacity?: number;
    is_active: boolean;
    banner_url?: string;
    created_at: string;
    updated_at?: string;
}

export interface EventWithRelations extends Event {
    event_registrations?: EventRegistration[];
    registered_count?: number;
    attended_count?: number;
}

export interface EventRegistration {
    id: string;
    tenant_id: string;
    event_id: string;
    person_id: string;
    status: EventRegStatus;
    registration_date: string;
}

// --- Courses ---
export interface Course {
    id: string;
    tenant_id: string;
    name: string;
    description?: string;
    instructor_id?: string;
    start_date?: string;
    end_date?: string;
    total_classes: number;
    status: CourseStatus;
    created_at: string;
    updated_at?: string;
}

export interface CourseWithRelations extends Course {
    instructor?: Pick<Person, 'id' | 'full_name'>;
    course_enrollments?: CourseEnrollment[];
    course_classes?: CourseClass[];
    enrolled_count?: number;
    completed_count?: number;
    classes_count?: number;
}

export interface CourseClass {
    id: string;
    course_id: string;
    class_date: string;
    theme?: string;
    created_at: string;
}

export interface CourseEnrollment {
    id: string;
    tenant_id: string;
    course_id: string;
    person_id: string;
    status: EnrollmentStatus;
    enrollment_date: string;
}

export interface CourseAttendance {
    id: string;
    class_id: string;
    enrollment_id: string;
    present: boolean;
}

// --- Contributions ---
export interface Contribution {
    id: string;
    tenant_id: string;
    person_id?: string;
    amount: number;
    type: ContributionType;
    date: string;
    payment_method: PaymentMethod;
    description?: string;
    created_by?: string;
    created_at: string;
}

export interface ContributionWithRelations extends Contribution {
    person?: Pick<Person, 'id' | 'full_name'>;
}

// --- Gamification ---
export interface GamificationProfile {
    id: string;
    person_id: string;
    tenant_id: string;
    xp: number;
    level: number;
    level_name: string;
    created_at: string;
    updated_at: string;
}

export interface Badge {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    icon: string;
    xp_reward: number;
    criteria: Record<string, unknown>;
    created_at: string;
}

export interface PersonBadge {
    id: string;
    person_id: string;
    badge_id: string;
    earned_at: string;
    badge?: Badge;
}

// --- Dashboard ---
export interface DashboardStats {
    peopleCount: number;
    cellsCount: number;
    presenceAvg: number;
    totalDecisions: number;
}

export interface DashboardInsight {
    type: InsightType;
    message: string;
    action: string;
    href: string;
}

export interface Alert {
    id: string;
    type: AlertSeverity;
    title: string;
    message: string;
    action_label?: string;
    action_href?: string;
    created_at: string;
    read: boolean;
}

// --- Membership Status Labels ---
export const MEMBERSHIP_STATUS_LABELS: Record<MembershipStatus, string> = {
    member: 'Membro',
    baptized_non_member: 'Batizado não-membro',
    non_baptized: 'Não batizado',
    visitor: 'Visitante',
};

export const MEMBERSHIP_STATUS_COLORS: Record<MembershipStatus, string> = {
    member: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    baptized_non_member: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    non_baptized: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    visitor: 'bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400',
};

export const CONVERT_STATUS_LABELS: Record<ConvertStatus, string> = {
    new: 'Novo',
    contacted: 'Contatado',
    connected: 'Conectado',
    integrated: 'Integrado',
    lost: 'Perdido',
};

export const CONVERT_STATUS_COLORS: Record<ConvertStatus, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-amber-100 text-amber-700',
    connected: 'bg-purple-100 text-purple-700',
    integrated: 'bg-emerald-100 text-emerald-700',
    lost: 'bg-red-100 text-red-700',
};

export const CELL_HEALTH_LABELS: Record<CellHealth, string> = {
    green: 'Saudável',
    yellow: 'Atenção',
    red: 'Crítica',
};

export const CELL_HEALTH_COLORS: Record<CellHealth, string> = {
    green: 'bg-emerald-500',
    yellow: 'bg-amber-500',
    red: 'bg-red-500',
};
