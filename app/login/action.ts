'use server'

import { createClient } from '@/lib/supabase/supabaseServer'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'



export async function login(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
   

    console.log("triggered")
  
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })


  
    if (error) {
      redirect ('/error')
    }
  
  
      // Redirect to a "verify your email" page or directly to dashboard
      redirect('/dashboard')  // or '/dashboard' if you don't require email verification
    } 
  