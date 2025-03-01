import React from 'react'

function Rebuild() {
  const plans = [
    {
      title: "Flood Recovery",
      icon: "🌊",
      description: "Comprehensive flood recovery plan including water removal, structural drying, and mold prevention. Our approach focuses on quick water extraction and protecting buildings from long-term water damage.",
      steps: ["Water extraction", "Building drying", "Mold prevention", "Structure reinforcement"]
    },
    {
      title: "Fire Restoration",
      icon: "🔥",
      description: "Specialized fire and smoke damage restoration plan. We focus on removing smoke damage, restoring affected structures, and implementing fire-resistant improvements.",
      steps: ["Smoke removal", "Structure repair", "Fire-resistant upgrades", "Air quality restoration"]
    },
    {
      title: "Earthquake Reinforcement",
      icon: "🏗️",
      description: "Seismic retrofitting and structural reinforcement plan for earthquake-affected areas. Includes building stabilization and implementation of earthquake-resistant features.",
      steps: ["Structure assessment", "Foundation repair", "Seismic retrofitting", "Safety upgrades"]
    },
    {
      title: "Hurricane Protection",
      icon: "🌪️",
      description: "Hurricane damage recovery and future protection plan. Focuses on structural repairs and implementing hurricane-resistant features for better future protection.",
      steps: ["Debris removal", "Structure reinforcement", "Window protection", "Roof strengthening"]
    },
    {
      title: "Landslide Mitigation",
      icon: "⛰️",
      description: "Comprehensive plan for areas affected by landslides. Includes ground stabilization, drainage improvement, and preventive measures for future incidents.",
      steps: ["Ground stabilization", "Drainage systems", "Slope reinforcement", "Monitoring setup"]
    },
    {
      title: "Tsunami Recovery",
      icon: "🌊",
      description: "Specialized plan for tsunami-affected coastal areas. Focuses on infrastructure rebuilding, implementing early warning systems, and coastal protection measures.",
      steps: ["Infrastructure rebuild", "Warning systems", "Coastal protection", "Community planning"]
    }
  ]

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1800px',
      margin: '0 auto'
    }}>
      <h1 style={{
        color: 'white',
        textAlign: 'center',
        fontSize: '3.5rem',
        marginBottom: '30px',
        fontWeight: '700'
      }}>
        Rebuild & Recover
      </h1>
      <p style={{
        color: '#B0B0B0',
        textAlign: 'center',
        fontSize: '2rem',
        marginBottom: '60px',
        lineHeight: '1.6'
      }}>
        Select from our specialized recovery plans tailored to different types of disasters
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '30px',
        padding: '20px'
      }}>
        {plans.map((plan, index) => (
          <div key={index} style={{
            backgroundColor: '#2A2A2A',
            borderRadius: '20px',
            padding: '35px',
            position: 'relative',
            minHeight: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <div style={{fontSize: '50px', marginBottom: '20px'}}>{plan.icon}</div>
            <h3 style={{
              color: '#FFFFFF',
              fontSize: '2.2rem',
              marginBottom: '20px',
              fontWeight: '600'
            }}>{plan.title}</h3>
            <p style={{
              color: '#B0B0B0',
              fontSize: '1.4rem',
              marginBottom: '25px',
              lineHeight: '1.6'
            }}>{plan.description}</p>
            
            <ul style={{
              color: '#B0B0B0',
              listStyle: 'none',
              padding: 0,
              marginBottom: '80px'
            }}>
              {plan.steps.map((step, stepIndex) => (
                <li key={stepIndex} style={{
                  margin: '12px 0',
                  fontSize: '1.3rem',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <span style={{marginRight: '15px', color: '#FFFFFF'}}>✓</span>
                  {step}
                </li>
              ))}
            </ul>

            <div style={{
              backgroundColor: '#1A1A1A',
              padding: '15px',
              borderRadius: '10px',
              position: 'absolute',
              bottom: '35px',
              left: '35px',
              right: '35px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '10px'
              }}>
                <span style={{color: '#808080', fontSize: '1.4rem'}}>Feasibility:</span>
                <span style={{color: '#808080', fontSize: '1.4rem'}}>{60 + index * 10}%</span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#333333',
                borderRadius: '4px',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${60 + index * 10}%`,
                  backgroundColor: '#4CAF50',
                  borderRadius: '4px'
                }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rebuild 