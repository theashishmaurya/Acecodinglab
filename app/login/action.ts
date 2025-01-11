'use server'

import  createClient  from '@/lib/supabase/supabaseServer'
import { redirect } from 'next/navigation'



export async function login(prevState:any , formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
   

  
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })


  
    if (error) {
      return {message :error.message}
    }  
      // Redirect to a "verify your email" page or directly to dashboard
      redirect('/dashboard/practice')  // or '/dashboard' if you don't require email verification
    } 
  