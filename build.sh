set -e

docker build -t karthikdasari05/expense-tracker-expense-tracker-web:latest .
docker push karthikdasari05/expense-tracker-expense-tracker-web:latest

# docker compose path
cd /Users/karthikdasari/workspace/my-projects/expense-tracker/expense-tracker-docker
docker compose up -d expense-tracker-web