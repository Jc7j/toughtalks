import { NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

import prisma from '@/lib/prisma'
import { User } from '@/lib/definitions'

const { getUser } = getKindeServerSession()

export async function GET() {
  try {
    const kindeUser = await getUser()
    console.log(" yrdydydrydy",kindeUser?.id)
    const user = await prisma.user.findUnique({
      where: {
        id: kindeUser?.id,
      },
    })
    return NextResponse.json(user, { status: 200 })

  } catch (err) {
    console.error('Failed to fetch user', err)
    return NextResponse.json(
      {
        error: 'Failed to GET user info. Internal server error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const kindeUser = await getUser()
    console.log("Userrrr Oatch user", kindeUser)
    const { name, email } = (await req.json()) as User
    const user = await prisma.user.findUnique({
      where: {
        id: 'kp_03b3fdf709fd4ae2a477378e597f17dc',
      },
    })
    console.log("userrrrr:", user)

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Internal Server Error' },
        { status: 500 }
      )
    }

    if (user.email === email && user.name === name) {
      return NextResponse.json(
        { error: 'Fields are the exact same' },
        { status: 500 }
      )
    }

    console.log("user", user)
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        name,
        email,
      },
    })

    return NextResponse.json({message: 'User is updated'}, {status: 200})
  } catch (err) {
    console.error('Failed to update user', err)
    return NextResponse.json(
      {
        error: 'Failed to UPDATE user info. Internal server error',
      },
      { status: 500 }
    )
  }
}
