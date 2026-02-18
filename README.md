# Dr. Olana Wakoya Gichile Portfolio Website

Modern medical portfolio website built with:
- Backend: Django + Django REST Framework + MySQL
- Frontend: React (Vite) + Tailwind CSS
- API communication: Axios + JWT authentication

## Features
- Dynamic profile, skills, education, experience
- Portfolios & Products showcase with images
- Blog posts with rich text & categories
- Contact form (messages saved in admin)
- Protected admin panel for content management

## Setup

### Backend and Frontend setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

Install the required build dependencies(on linux)
sudo apt update
sudo apt install -y \
    pkg-config \
    default-libmysqlclient-dev \
    build-essential \
    python3-dev


pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver


cd frontend
npm install
npm run dev
