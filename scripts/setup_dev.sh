#!/usr/bin/env bash
echo "Setting up FlyScout AI Development Environment..."

cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp -n .env.example .env || true

cd ../frontend
npm install

echo "Scaffold setup complete!"
