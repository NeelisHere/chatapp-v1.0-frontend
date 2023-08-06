import axios from "axios"
import { useEffect, useState } from "react"
import { useChatStore } from '../store.js'
import { useNavigate } from "react-router-dom"
import { Box } from "@chakra-ui/react"
import SideDrawer from "../components/chatComponents/SideDrawer.jsx"
import MyChats from "../components/chatComponents/MyChats.jsx"
import ChatBox from "../components/chatComponents/ChatBox.jsx"


const ChatPage = () => {
	const { user, isLoggedIn, getCurrentUser } = useChatStore((state) => state)
	// const [chats, setChats] = useState([]);
	const navigate = useNavigate()
	useEffect(() => {
		// fetchChats('http://localhost:8000/api/v1/chats/get-chats')
		const fn = async() => {
			const currentUser = await JSON.parse(localStorage.getItem('userInfo'));
			await getCurrentUser(currentUser)
			// console.log(isLoggedIn)
			// if (!isLoggedIn) {
			// 	navigate('/')
			// }
		}
		fn()

	}, [])


	// const fetchChats = async (url) => {
	// 	const { data } = await axios.get(url)
	// 	const { chatData } = data.chatData;
	// 	console.log(data)
	// 	setChats(chatData)
	// }



	return (
		<div 
			style={{ width: '100%' }}
		>
			{isLoggedIn && <SideDrawer />}
			<Box
				display={'flex'}
				justifyContent={'space-between'}
				w={'100%'}
				// h={'91.5vh'}
				p={'10px'}
			>
				{isLoggedIn && <MyChats />}
				{isLoggedIn && <ChatBox />}
			</Box>
		</div>
	)
}

export default ChatPage
