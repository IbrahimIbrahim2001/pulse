interface ChatMember {
    id: string,
    user: {
        name: string
    }
}

export interface ChatType {
    id: string,
    name: string,
    members: ChatMember[]
}