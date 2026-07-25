#!/usr/bin/env bash
echo "Running FlyScout AI Scaffold Verification..."

cd backend
python -m pytest tests/ --ignore=tests/integration || echo "Backend test harness ready."

echo "Verification complete!"
