# Tree

A simple web application that imitates a file explorer using a tree structure. .Net and Angular play the main role. The database is supported by Entity Framework.

To run the application you have to install docker and run

docker run --name tree -e POSTGRES_USER=appuser -e POSTGRES_PASSWORD=Pa$$w0rd -p 5432:5432 -d postgres:latest

make sure that docker container is running

run project in rider and freely add folders, fake files, delete move etc.
