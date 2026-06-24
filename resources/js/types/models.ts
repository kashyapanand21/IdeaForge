export interface User {
    id: number
    name: string
    email: string
    avatar: string | null
    email_verified_at: string | null
    created_at: string
    updated_at: string
}

export interface TeamMember extends User {
    pivot: {
        role: 'owner' | 'admin' | 'member'
    }
}

export interface Idea {
    id: number
    user_id: number
    team_id: number | null
    title: string
    problem: string
    solution: string
    target_user: string
    biggest_risk: string
    status: 'raw' | 'in_discussion' | 'validated' | 'shelved'
    is_pinned: boolean
    shared_at: string | null
    comments_count: number
    created_at: string | null
    updated_at: string | null
}

export interface TeamInvite {
    id: number
    team_id: number
    invited_by: number
    email: string
    role: 'admin' | 'member'
    status: 'pending' | 'accepted' | 'declined' | 'expired'
    expires_at: string | null
    created_at: string | null
}

export interface Team {
    id: number
    owner_id: number
    name: string
    description: string | null
    avatar: string | null
    created_at: string | null
    updated_at: string | null
    // these only exist when the controller loads them
    members?: TeamMember[]
    ideas?: Idea[]
    invites?: TeamInvite[]
}