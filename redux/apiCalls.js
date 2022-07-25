import { useDispatch } from 'react-redux'
import { start, success, error } from './userSlice'

export const setUser = async (user) => {
    useDispatch(start())
    try {
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })

        useDispatch(success(response.data))
    } catch (err) {
        useDispatch(error())
    }
}