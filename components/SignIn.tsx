import React from 'react'
import Image from 'next/image'

export default function SignIn(): React.ReactElement {
  // const signInWithGoogle = async () => {
  //   const provider = new firebase.auth.GoogleAuthProvider()
  //   await auth.signInWithPopup(provider)
  // }

  return (
    <div>
      <div>
        <h1>Goodbye, Anki. 🙄</h1>
        <h1>Hello, Jerky. 🥩 😍</h1>
        <h2>Turn your spaced repitition from 😐 to 🔥.</h2>
        <button>
          <Image src="google.png" alt="Landscape picture" width={500} height={500} />
        </button>
      </div>
    </div>
  )
}
