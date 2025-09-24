export default function ChatMemberName({ recipientName }: {
    recipientName: string | undefined
}) {
    return (
        <p className="font-semibold text-foreground group-hover:text-primary transition-colors duration-200 truncate" >
            {recipientName}
        </p>
    )
}
