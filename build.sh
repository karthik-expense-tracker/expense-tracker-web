set -e

docker build -t karthikdasari05/expense-tracker-expense-tracker-web:latest .
docker push karthikdasari05/expense-tracker-expense-tracker-web:latest
cd /Users/karthikdasari/workspace/my-projects/expense-tracker
docker compose up -d expense-tracker-web