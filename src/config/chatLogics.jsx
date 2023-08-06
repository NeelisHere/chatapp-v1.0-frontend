export const isSameSender = (messages, msg, index, userId) => {
    return(
        (index < messages.length - 1) &&
        (
            messages[index+1].sender._id !== msg.sender._id || 
            messages[index+1].sender._id === 'undefined'
        ) &&
        (messages[index].sender._id !== userId)
    )
}

export const isLastMessage = (messages, index, userId) => {
    return (
        (index === messages.length - 1) &&
        (messages[messages.length - 1].sender._id !== userId) &&
        (messages[messages.length - 1].sender._id)
    )
}

export const isSameSenderMargin = (messages, msg, index, userId) => {
    if (
        (index < messages.length - 1) &&
        (messages[index+1].sender._id === msg.sender._id ) &&
        (messages[index].sender._id !== userId)
    ) return 33
    else if (
        (
            (index < messages.length - 1) &&
            (messages[index+1].sender._id !== msg.sender._id ) &&
            (messages[index].sender._id !== userId)
        )||
        ((index === messages.length - 1) && (messages[index].sender._id !== userId))
    ) return 0;
    else return 'auto'
}

export const isSameUser = (messages, msg, i) => {
    return ( i>0 && messages[i-1].sender._id === msg.sender._id )
}

export const getSender = (loggedUser, users) => {
    console.log('2.', loggedUser, users)
    return (
        users[0]._id === loggedUser._id?
        users[1].username : users[0].username
    ) 
}

