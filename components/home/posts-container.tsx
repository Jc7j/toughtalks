'use client'

import React, { useEffect, useState, useRef } from 'react'

import { Post } from '@/lib/definitions'
import PostCard from './post-card'

export default function PostsContainer() {
  const [posts, setPosts] = useState<Post[]>([])
  const postRefs = useRef<(HTMLDivElement | null)[]>(new Array(posts.length))
  const animationEndRef = useRef<{
    [key: string]: { animated: boolean; fullyOutOfView: boolean }
  }>({})

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        if (!response.ok) {
          throw new Error(
            'Network response was not ok. Unable to fetch posts for homepage'
          )
        }
        const data: Post[] = await response.json()
        setPosts(data)
      } catch (error) {
        console.error('Failed to fetch posts:', error)
      }
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = entry.target as HTMLDivElement
          const postId = target.getAttribute('data-post-id')

          if (postId) {
            if (!animationEndRef.current[postId]) {
              animationEndRef.current[postId] = {
                animated: false,
                fullyOutOfView: false,
              }
            }

            if (entry.isIntersecting) {
              if (!animationEndRef.current[postId].animated) {
                target.classList.add('animate-tilt-in')
                animationEndRef.current[postId].animated = true
                animationEndRef.current[postId].fullyOutOfView = false
              }
            } else {
              if (entry.intersectionRatio < 0.1) {
                animationEndRef.current[postId].fullyOutOfView = true
              }
              if (animationEndRef.current[postId].fullyOutOfView) {
                setTimeout(() => {
                  if (animationEndRef.current[postId].fullyOutOfView) {
                    target.classList.remove('animate-tilt-in')
                    animationEndRef.current[postId].animated = false
                  }
                }, 1000) // Delay for resetting the animation state
              }
            }
          }
        })
      },
      { threshold: [0, 0.1, 1] }
    )

    posts.forEach((_, index) => {
      const currentRef = postRefs.current[index]
      if (currentRef) {
        observer.observe(currentRef)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [posts])

  return (
    <div className="grid grid-cols-1 mx-4 gap-x-10 gap-y-4 items-center my-3 justify-center bg-red-50 lg:grid-cols-customCard">
      {[...posts].reverse().map((post, index) => (
        <div
          ref={(el) => (postRefs.current[index] = el)}
          key={post.id}
          data-post-id={post.id}
        >
          <PostCard
            id={post.id}
            content={post.content}
            timeTillExpire={new Date(post.timeTillExpire)}
          />
        </div>
      ))}
    </div>
  )
}
