import React from 'react'
import { Link } from 'react-router-dom'
import groupPhoto from '../assets/groupphoto.png'
import './About.css'
import EarthDroneAnimation from "./Globe"

function About() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      padding: '40px'
    }}>
      <h1 style={{
        color: 'white',
        fontSize: '3.5rem',
        marginBottom: '40px',
        fontWeight: '700'
      }}>About Us</h1>
      
      <div style={{
        backgroundColor: 'rgba(51, 51, 51, 0.7)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '800px',
        textAlign: 'center',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <img 
          src={groupPhoto} 
          alt="Team Photo" 
          style={{
            maxWidth: '100%',
            borderRadius: '10px',
            marginBottom: '30px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />
        
        <p style={{
          color: 'white',
          fontSize: '2rem',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>Made by Paul Edelman (Computer Science & Applied Mathematics, 2027), Shaurya Kumar (Computer Science & Applied Mathematics, 2027), 
        and Chinmay Agrawal (Data Science & Mathematics, 2027). This was a project completed for HenHacks, the third annual hackathon hosted by the University of Delaware.
        </p>
        
        <p style={{
          color: '#ff9999',
          fontSize: '1.6rem',
          lineHeight: '1.6'
        }}>Revolutionizing disaster response through artificial intelligence</p>
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        margin: '0 auto 40px',
        height: '400px',
        width: '100%'
      }}>
        <EarthDroneAnimation />
      </div>
    </div>
  )
}

export default About 