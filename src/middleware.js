import { NextResponse } from 'next/server'

export function middleware(req) {
   let verify = req.cookies.get('token')

   if (!verify) {
      return NextResponse.rewrite(new URL('/', req.url))
   }
}

export const config = {
   matcher: ['/profile', '/chat', '/favourites', '/property/:path*'],
}