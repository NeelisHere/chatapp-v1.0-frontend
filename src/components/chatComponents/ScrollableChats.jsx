import ScrollableFeed from 'react-scrollable-feed'
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../../config/chatLogics'
import { useChatStore } from '../../store'
import { Avatar, Box, Tooltip } from '@chakra-ui/react'
import { useState, useEffect, useRef } from 'react'
import './styles.css'

const ScrollableChats = ({ messages }) => {
    const { user } = useChatStore((state) => state)
    const messageEl = useRef(null);
    useEffect(() => {
        if (messageEl) {
            messageEl.current.addEventListener('DOMNodeInserted', (event) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
            });
        }
    }, [])

    return (
        <div className='messages' ref={messageEl}>
            {
                messages && messages.map((msg, index) => {
                    return (
                        <div style={{ display: 'flex' }} key={index}>
                            {
                                (
                                    isSameSender(messages, msg, index, user._id) ||
                                    isLastMessage(messages, index, user._id)
                                )
                                &&
                                (
                                    <Tooltip
                                        label={msg.sender.username}
                                        placement='bottom-start'
                                        hasArrow
                                    >
                                        <Avatar
                                            mt={'7px'}
                                            // mr={1}
                                            p={1}
                                            size={'sm'}
                                            cursor={'pointer'}
                                            name={msg.sender.username}
                                            src={msg.sender.pic}
                                        />
                                    </Tooltip>
                                )
                            }
                            <Box
                                bg={msg.sender._id === user._id ? 'teal' : 'white'}
                                color={msg.sender._id === user._id ? 'white' : 'black'}
                                boxShadow={'base'}
                                maxWidth={'75%'}
                                // borderRadius={'5px'}
                                borderTopLeftRadius={'5px'}
                                borderBottomRightRadius={'5px'}
                                padding={'5px 15px'}
                                marginLeft={isSameSenderMargin(messages, msg, index, user._id)}
                                marginTop={isSameUser(messages, msg, index, user._id) ? '3px' : '10px'}
                            >
                                {msg.content}
                            </Box>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default ScrollableChats
