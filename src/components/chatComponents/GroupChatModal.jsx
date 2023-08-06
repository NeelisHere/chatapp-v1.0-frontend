import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
    Spinner,
} from '@chakra-ui/react'
import { useState } from 'react'
import { useChatStore } from '../../store'
import axios from 'axios'
import UserListItem from './UserListItem'
import UserBadgeItem from './UserBadgeItem'

const GroupChatModal = ({ children }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const toast = useToast()
    const [groupChatStates, setGroupChatStates] = useState({
        groupChatName: '',
        selectedUsers: [],
        search: '',
        searchResult: []
    })
    const [loading, setLoading] = useState(false)
    const { user, chats, setChats } = useChatStore((state) => state)
    const handleSearch = async (e) => {
        setGroupChatStates({...groupChatStates, search: e.target.value})
        if(!e){
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.get(`/api/v1/users/all-users?search=${groupChatStates.search}`, config)
            // console.log('->', groupChatStates)
            setLoading(false)
            setGroupChatStates({...groupChatStates, searchResult: data.users})

        } catch (error) {
            toast({
                title: 'Error occured',
                description: 'Failed to load the Chats',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    const handleSubmit = async () => {
        const { groupChatName, selectedUsers } = groupChatStates
        if(!groupChatName || !selectedUsers){
            toast({
                title: 'Data insufficient',
                description: 'Please fill all the details.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
            return;
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            const { data } = await axios.post(`/api/v1/chats/group/create`, {
                name: groupChatName,
                users: JSON.stringify(selectedUsers.map((user)=>user._id))
            }, config)
            // console.log('->', groupChatStates)
            setChats([data, ...chats])
            setLoading(false)
            onClose()
            toast({
                title: 'New Group-Chat Created',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })

        } catch (error) {
            toast({
                title: 'Error occured',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'bottom-left'
            })
        }
    }
    const handleDelete = (userToDelete) => {
        setLoading(true)
        setGroupChatStates({
            ...groupChatStates, 
            selectedUsers: groupChatStates.selectedUsers.filter((user)=> user._id !== userToDelete._id),
            searchResult: [userToDelete, ...groupChatStates.searchResult]
        })
        setLoading(false)
    }
    const handleGroup = (userToAdd) => {
        // alert(userToAdd.username)
        setLoading(true)
        setGroupChatStates({
            ...groupChatStates, 
            searchResult: groupChatStates.searchResult.filter((user)=> user._id !== userToAdd._id),
            selectedUsers: [...groupChatStates.selectedUsers, userToAdd]
        })
        setLoading(false)
    }

    return (
        <Box bg={'#f4f4f4'}>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader display={'flex'} justifyContent={'center'}>
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display={'flex'}
                        flexDir={'column'}
                        justifyContent={'center'} 
                        alignItems={'center'}
                        
                    >
                        <FormControl>
                            <Input
                                placeholder='Chat Name'
                                mb={3}
                                w={'100%'}
                                bg={'white'}
                                onChange={(e) => {
                                    setGroupChatStates({ ...groupChatStates, groupChatName: e.target.value })
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder='Add users'
                                mb={3}
                                w={'100%'}
                                bg={'white'}
                                onChange={handleSearch}
                            />
                        </FormControl>
                         
                        <Box w={'100%'} display={'flex'} flexWrap={'wrap'}>
                            {
                                groupChatStates.selectedUsers.map((user, index)=>{
                                    return(
                                        <UserBadgeItem 
                                            key={index} 
                                            user={user} 
                                            handleFunction={()=>{
                                                handleDelete(user)
                                            }} 
                                        />
                                    )
                                })
                            }
                        </Box>
                        <br />
                        {
                            loading?
                            <Spinner/>:
                            (
                                groupChatStates.searchResult?.map((user, index)=>{
                                    return(
                                        <UserListItem
                                            key={index}
                                            user={user}
                                            handleFunction={()=>{
                                                handleGroup(user)
                                            }}
                                            isInGroupChatModal={true}
                                        />
                                    )
                                })
                            )
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button w={'100%'} colorScheme='teal' onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default GroupChatModal
