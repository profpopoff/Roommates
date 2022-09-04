import { useCallback, useState } from "react"

export const useHttp = () => {

   const [loading, setLoading] = useState(false)
   const [error, setError] = useState(null)
   const [success, setSuccess] = useState(false)

   const request = useCallback(async (url, method = 'GET', body = null, headers = {}) => {

      setLoading(true)
      setError(null)
      setSuccess(false)

      try {

         const response = await fetch(url, { method, body, headers })

         const data = await response.json()

         if (!response.ok) {
            throw new Error(data.message || 'Something went wrong...')
         }

         setLoading(false)
         setSuccess(true)

         return data

      } catch (error) {
         setLoading(false)
         setError(error.message)
         throw error
      }
   }, [])

   return { request, success, loading, error }
}