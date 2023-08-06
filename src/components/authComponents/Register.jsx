import React, { useState } from 'react'
import { VStack } from '@chakra-ui/react'
import { FormControl } from '@chakra-ui/react'
import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
import { useForm } from "react-hook-form";
import { Button } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const toast = useToast()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const {
        handleSubmit,
        register,
        // formState: { errors, isSubmitting },
    } = useForm()

    const onSubmit = async (values) => {
        setLoading(true)
        if (values.pfp.length === 0) {
            // console.log(values.pfp)
            setLoading(false)
            return;
        }
        const { type: image_type } = values.pfp[0]
        const allowedImageTypes = ['jpeg', 'jpg', 'png']
        if (allowedImageTypes.includes(image_type.split('/')[1])) {
            const data = new FormData()
            data.append("file", values.pfp[0])
            data.append('upload_preset', 'chat-app-v1.0')
            data.append('cloud_name', 'npaul-703')
            fetch('https://api.cloudinary.com/v1_1/npaul-703/image/upload', {
                method: 'POST',
                body: data
            }).then((res) => res.json())
                .then( async (data) => {
                    values.pfp = data.url.toString()
                    // console.log(values)
                    try {
                        const config = {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                        const {data} = await axios.post('https://chat-app-v1-0-backend.onrender.com/api/v1/users/register', values, config)
                        // console.log(data)
                        toast({
                            title: 'Success:',
                            description: "Account created successfully.",
                            status: 'success',
                            duration: 9000,
                            isClosable: true,
                        })
                        localStorage.setItem('userInfo', JSON.stringify(data.user))
                        setLoading(false)
                        navigate('/chats')

                    } catch (error) {
                        console.log(error)
                        setLoading(false)
                        toast({
                            title: 'Error:',
                            description: "Couldn't register.",
                            status: 'warning',
                            duration: 9000,
                            isClosable: true,
                        })
                    }
                })
                .catch((err) => {
                    console.log(err)
                    setLoading(false)
                    toast({
                        title: 'Error:',
                        description: "Couldn't upload image.",
                        status: 'warning',
                        duration: 9000,
                        isClosable: true,
                    })
                })

        } else {
            toast({
                title: 'Error:',
                description: "Please select an image.",
                status: 'warning',
                duration: 9000,
                isClosable: true,
            })
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
                    {/* <FormLabel>Email</FormLabel> */}
                    <Input
                        placeholder='Email'
                        {...register('email', {
                            required: 'This is required',
                        })}
                    />
                </FormControl>

                <FormControl>
                    {/* <FormLabel>Password</FormLabel> */}
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='password'
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

                <FormControl>
                    {/* <FormLabel>Confirm Password</FormLabel> */}
                    <InputGroup>
                        <Input
                            type={show ? 'text' : 'password'}
                            placeholder='Confirm Password'
                            {...register('confirmedPassword', {
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

                <FormControl>
                    {/* <FormLabel>Upload Profile Picture</FormLabel> */}
                    <Input
                        type='file'
                        p={1.5}
                        accept='image/*'
                        {...register('pfp')}
                    />
                </FormControl>
                <Button
                    width={'100%'}
                    colorScheme='teal'
                    isLoading={loading}
                    type='submit'
                    style={{
                        marginTop: 30,
                        color: 'white'
                    }}
                >
                    Register
                </Button>
            </VStack >

        </form>
    )
}

export default Register
