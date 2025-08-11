# sirenveer

**Traffic Congestion Predictor Using AI + FastAPI + React**

`sirenveer` is a full‑stack web application that predicts traffic congestion levels (red,yellow,green) from uploaded images using a trained AI model. The frontend is built with React + Vite, and the backend uses FastAPI with a machine learning model trained on a balanced dataset of traffic scenes.

---

## ​ Project Overview

This project leverages machine learning to classify traffic congestion levels in images. It can serve as a foundation for smart traffic monitoring systems or educational demonstrations on AI image classification.

---

## ​ Tech Stack

### Frontend
- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- Tailwind CSS (if used)

### Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- Python 3.9+
- Machine Learning model (trained using a balanced dataset of traffic scenes)

### AI/ML
- Model trained on images with:
  - **Low traffic**
  - **Medium traffic**
  - **High traffic**
- Likely frameworks: `PyTorch`(customize as needed)

---

## ​ Features

- Upload an image of a traffic scene  
- Backend analyzes the image using an AI model  
- Prediction returned: `green`, `yellow`, or `red` congestion  
- Clean and fast UI with React + Vite

---

## ​ Folder Structure (suggested)
sirenveer/
├── frontend/ # Vite + React app
│ ├── public/
│ └── src/
│ ├── components/
│ └── App.jsx
├── backend/ # FastAPI app
│ ├── main.py
│ ├── model/ # Trained ML model
│ └── utils.py
├── README.md
└── requirements.txt


---

## ​​ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/aaravaggarwal3535/sirenveer.git
cd sirenveer
```

### 2. Run the Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```




