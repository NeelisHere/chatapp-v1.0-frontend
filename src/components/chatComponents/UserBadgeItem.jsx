import { Box } from "@chakra-ui/react"
import { CloseIcon, EmailIcon } from "@chakra-ui/icons"

const UserBadgeItem = ({ user, groupAdmin, handleFunction }) => {
    // console.log(`${user._id}, ${groupAdmin}`)
    return (
        <Box
            px={2}
            py={1}
            borderRadius={"md"}
            m={1}
            mb={2}
            variant={'solid'}
            fontSize={12}
            backgroundColor={user._id === groupAdmin ? 'teal' : '#f4f4f4'}
            color={user._id === groupAdmin ? 'white' : 'black'}
            cursor={'pointer'}
            onClick={handleFunction}
        >
            {user.username}
            <CloseIcon pl={1} />
        </Box>
        // <Badge colorScheme='purple' >{ user.username }</Badge>
    )
}

export default UserBadgeItem
