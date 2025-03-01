import React from 'react'
import { Link } from 'react-router-dom'

function About() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%'
    }}>
      <h1 className="text-4xl font-bold mb-6" style={{color: 'white'}}>About Us</h1>
      <p className="text-2xl mb-6" style={{color: 'white'}}>Made by Chinmay</p>
      <Link to="/" className="text-blue-500 hover:text-blue-700">
        ← Back to Home
      </Link>
    </div>
  )
}

export default About 