import { SignIn } from '@clerk/clerk-react';
import React from 'react'

const SignInPage = () => {
  return <main className='flex h-screen w-full items-center justify-center'>
    <SignIn/>
</main>
  
}

export default SignInPage;