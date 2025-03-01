import React from 'react'
import { Link } from 'react-router-dom'

function Information() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Information</h1>
      
      <div className="prose max-w-none">
        <h2 className="text-2xl font-semibold mb-4">About Disaster Analysis</h2>
        <p className="mb-4">
          Our AI-powered system analyzes disaster footage to provide critical insights across five key metrics:
        </p>
        
        <ul className="list-disc pl-6 mb-6">
          <li>Damage Severity (Severe, Moderate, Minor)</li>
          <li>Critical Response Level (Scale 1-5)</li>
          <li>Infrastructure Affected</li>
          <li>Health Hazards</li>
          <li>Civilian Rescue Needed (Affirmative/Negative)</li>
        </ul>

        <Link to="/" className="text-blue-500 hover:text-blue-700">
          ← Back to Home
        </Link>
      </div>
    </div>
  )
}

export default Information 