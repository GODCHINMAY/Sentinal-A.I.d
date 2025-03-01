import React, { useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import './EnhancedCharts.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

function EnhancedCharts({ analysis }) {
  if (!analysis || analysis.length === 0) return null;

  // Calculate severity counts
  const severityCounts = analysis.reduce((acc, frame) => {
    acc[frame.damage_severity] = (acc[frame.damage_severity] || 0) + 1;
    return acc;
  }, {});
  
  const severeCount = severityCounts['Severe'] || 0;
  const moderateCount = severityCounts['Moderate'] || 0;
  const minorCount = severityCounts['Minor'] || 0;
  
  // Calculate response level counts
  const responseLevelCounts = {};
  analysis.forEach(frame => {
    responseLevelCounts[frame.critical_response_level] = 
      (responseLevelCounts[frame.critical_response_level] || 0) + 1;
  });
  
  // Prepare data for pie chart
  const pieData = {
    labels: ['Severe', 'Moderate', 'Minor'],
    datasets: [
      {
        data: [severeCount, moderateCount, minorCount],
        backgroundColor: ['#ff4d4d', '#ffa500', '#4CAF50'],
        borderColor: ['#cc0000', '#cc8400', '#3d8b40'],
        borderWidth: 1,
        hoverOffset: 15
      },
    ],
  };
  
  // Prepare data for bar chart
  const responseLabels = Object.keys(responseLevelCounts).sort((a, b) => parseInt(a) - parseInt(b));
  const responseData = responseLabels.map(level => responseLevelCounts[level]);
  
  // Create a color gradient from green to yellow to red based on response level
  const getColorForLevel = (level) => {
    const numLevel = parseInt(level);
    
    // Color mapping based on level
    switch(numLevel) {
      case 1: return '#4CAF50'; // Green
      case 2: return '#8BC34A'; // Light Green
      case 3: return '#FFC107'; // Amber/Yellow
      case 4: return '#FF9800'; // Orange
      case 5: return '#FF5722'; // Deep Orange
      default: return '#ff4d4d'; // Red for any higher levels
    }
  };

  const barData = {
    labels: responseLabels.map(level => `Level ${level}`),
    datasets: [
      {
        label: 'Number of Frames',
        data: responseData,
        backgroundColor: responseLabels.map(level => getColorForLevel(level)),
        borderColor: responseLabels.map(level => {
          const baseColor = getColorForLevel(level);
          // Darken the border color slightly
          return baseColor.replace(/[0-9a-f]{2}/g, (hex) => {
            const num = parseInt(hex, 16);
            return Math.max(0, num - 40).toString(16).padStart(2, '0');
          });
        }),
        borderWidth: 1,
        borderRadius: 5,
      },
    ],
  };
  
  // Chart options
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: 'white',
          font: {
            size: 14
          },
          padding: 20
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };
  
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          font: {
            size: 12
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'white',
          font: {
            size: 12
          }
        },
        grid: {
          display: false
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Critical Response Levels',
        color: 'white',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="enhanced-charts-container">
      <div className="chart-box">
        <h3>Damage Severity Distribution</h3>
        <div className="chart-wrapper pie-chart-wrapper">
          <Pie data={pieData} options={pieOptions} />
        </div>
        <p className="chart-description">
          This chart shows the distribution of damage severity across analyzed frames. 
          Severe damage (red) requires immediate attention, moderate damage (orange) needs assessment, 
          and minor damage (green) can be addressed during recovery phases.
        </p>
      </div>
      
      <div className="chart-box">
        <h3>Critical Response Levels</h3>
        <div className="chart-wrapper bar-chart-wrapper">
          <Bar data={barData} options={barOptions} />
        </div>
        <p className="chart-description">
          Critical response levels indicate the urgency of intervention needed. 
          Higher levels (4-5) require immediate emergency response, while lower levels (1-3) 
          can be managed with standard protocols and resources.
        </p>
      </div>
    </div>
  );
}

export default EnhancedCharts; 