import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function fetchPosts() {
  try {
    const data = await prisma.post.findMany()
    console.log(data)
    return data
  } catch (err) {
    console.error('DB Error', err)
    throw new Error('Failed to fetch Posts data')
  }
}