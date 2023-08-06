import React, { useState } from 'react'
import { VStack, useToast } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { Button } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (values) => {
        // console.log(values)
        setLoading(true)
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }
            const {data} = await axios.post('https://chat-app-v1-0-backend.onrender.com/api/v1/users/login', values, config)
            // console.log(data)
            toast({
                title: 'Success:',
                description: "Logged in successfully.",
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
            localStorage.setItem('userInfo', JSON.stringify({...data.user, token: data.token}))
            setLoading(false)
            navigate('/chats')

        } catch (error) {
            // console.log(error)
            toast({
                title: 'Error:',
                description: "Login failed.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={'5px'}>
                <FormControl>
                    {/* <FormLabel>Username</FormLabel> */}
                    <Input
                        placeholder='Username'
                        {...register('username', {
                            required: 'This is required',
                            minLength: { value: 4, message: 'Minimum length should be 4' },
                        })}
                    />
                </FormControl>

                <FormControl>
                    {/* <FormLabel>Password</FormLabel> */}
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='Password'
                            {...register('password', {
                                required: 'This is required',
                                minLength: { value: 4, message: 'Minimum length should be 4' },
                            })}
                        />
                        <InputRightAddon width={'4.5rem'}>
                            <Button
                                h={'1.75rem'}
                                size={'sm'}
                                onClick={() => {
                                    setShow(!show)
                                }}
                            >
                                {show ? 'Hide' : 'Show'}
                            </Button>
                        </InputRightAddon>
                    </InputGroup>
                </FormControl>

                <Button
                    width={'100%'}
                    colorScheme='teal'
                    isLoading={loading}
                    type='submit'
                    style={{
                        marginTop: 30,
                        // backgroundColor: 'black',
                        color: 'white'
                    }}
                >
                    Login
                </Button>
            </VStack >

        </form>
    )
}

export default Login
