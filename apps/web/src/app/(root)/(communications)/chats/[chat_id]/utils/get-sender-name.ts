export const getSenderName = (members: any[], senderId: string) => {
    const sender = members.find(member => member.user.id === senderId);
    return sender?.user?.name || 'Unknown User';
};