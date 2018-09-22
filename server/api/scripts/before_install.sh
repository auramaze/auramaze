#!/bin/bash
mkdir ~/.aws
echo '[default]
aws_access_key_id = '"$AWS_ACCESS_KEY_ID"'
aws_secret_access_key = '"$AWS_SECRET_ACCESS_KEY"'
' > ~/.aws/credentials
echo '[default]
region = us-east-2
' > ~/.aws/config
echo '{
  "host": "'"$AWS_RDS_HOST"'",
  "user": "auramaze",
  "password": "'"$AWS_RDS_PASSWORD"'",
  "database": "auramaze"
}' > ~/.aws/rds
