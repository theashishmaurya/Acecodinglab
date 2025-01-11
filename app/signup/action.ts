'use server'

import  createClient from '@/lib/supabase/supabaseServer'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'





export async function signUp(formData: FormData) {
    const supabase = createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string
    const role = "candidate"
  
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })
  
    if (error) {
    console.error(error)
      redirect ('/error')
    }

  
    if (data.user) {
      // Insert the user into your custom users table
      const { error: insertError } = await supabase.schema('public')
        .from('users')
        .insert({
          id: data.user.id,
          full_name: fullName,
          email: email,
          role: role,
        })
  
      if (insertError) {
        // If there was an error inserting into the custom table, 
        // you might want to delete the auth user and return an error
        const { error } =  await supabase.auth.admin.deleteUser(data.user.id)
        console.error(error)
        
        if (error) {
          redirect ('/error')
        }
      }
  
      // You might want to trigger an email verification here
      // await supabase.auth.resend({
      //   type: 'signup',
      //   email: email,
      // })
  
      // Redirect to a "verify your email" page or directly to dashboard
      redirect('/dashboard/practice')   // or '/dashboard' if you don't require email verification
    } else {
      redirect ('/error')
    }
  }