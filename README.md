# 🚁 Sentinel-AId - README

## 📜 Table of Contents
1. [🌍 Mission](#-mission)
2. [📖 About](#-about)
3. [✨ Features](#-features)
4. [⚙️ Setup Instructions](#️-setup-instructions)
5. [🛠 Tech Stack](#-tech-stack)

---

## 🌍 Mission
Our goal is to revolutionize disaster response by leveraging drones to reach inaccessible areas in disaster situations, create faster response times to emergencies, and alleviate pressues on government, NGO's with regards to aid distribution.

---

## 📖 About
Sentinel-AId is a AI driven disaster management system. It has 3 main features:        
1) **S.O.S. Request**: Allows citizens to summon a drone in hard to reach regions to collect footage on emergency situation. 
2) **Footage Analysis System**: Processes drone footage by breaking it down into various frames with information such as Damage severity, Critical response level, Infrastructure affected, Health Hazards, etc. 
3) **Aid Exchange**: A community driven resource aid exchange where victims can input locations and request aid. And others can summon drones to pickup supplies and deliver them to those in need.


---

## ✨ Features
✅ AI-powered disaster assessment using **OPENAI API**
✅ SOS button to summon drone to analyze emergency situation.    
✅ Community based aid exchange to efficiently locate and allocate resources    
✅ Triage system prioritizing disasters based on severity  
✅ Interactive UI with a drone GIF on the homepage  
✅ Disaster preparedness resources and local risk analysis tool  
✅ Fully deployed website for real-world application  

---

## ⚙️ Setup Instructions
### 🔧 Prerequisites
- Numpy (1.26.4)
- OpenCV-python (4.9.0.80)
- OPENAI API key


### 🚀 Installation Steps
1. **Clone the repository**  
   ```bash
   git clone https://github.com/GODCHINMAY/Sentinal-A.I.d.git
   cd sentinal-a.i.d
   ```
2. **Backend Setup (FastAPI)**
   ```bash
   cd backend
   pip install -r requirements.txt
   pip install --upgrade openai
   uvicorn main:app --reload
   ```
3. **Frontend Setup (React.js)**
   ```bash
   cd frontend
   npm install
   npm run build
   npm run preview
   ```
---

## 🛠 Tech Stack
| Component     | Technology |
|--------------|------------|
| **Frontend** | React.js |
| **Backend**  | FastAPI (Python), Numpy, Uvicorn |
| **AI Processing** | OpenAI API |
| **Map Display** | Leaflet, OpenStreetMap |

---

🚀 *Join us in building a faster, smarter, and more effective disaster response system!* 🌟
