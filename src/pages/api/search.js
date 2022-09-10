import dbConnect from '../../utils/mongo'
import Apartment from '../../models/Apartment'

export default async function handler(req, res) {
   const { method } = req

   dbConnect()

   if (method === 'POST') {
      try {

         const search = new RegExp(req.body, "i")

         const results = await Apartment.find({ title: search })
         
         const cities = await Apartment.find({ 'address.city': search })

         if (!req.body) {
            return res.status(200).json({ cities: [...new Set(cities.map(({address}) => address.city))] })
         }

         res.status(200).json({ posts: results, cities: [...new Set(cities.map(({address}) => address.city))] })
      } catch (error) {
         res.status(500).json(error)
      }
   }
}