# ZAPHIR server

This application (a **# ZAPHIR server**) was built using **Nodejs**, **Express** and **MonogoDB** database. I have built the following routes within this application:

```bash
POST /api/users/signup
POST /api/users/login
GET /api/users
GET /api/users/:id/image

POST /api/places
PATCH /api/places/:pid
GET /api/places/:pid
GET /api/places/:pid/image
GET /api/places/user/:uid
DELETE /api/places/:pid
```

I used MVC (just a design pattern) to build my REST-API

# try project

if you are intrested to try the project go to [**zaphir**](https://zaphir-react.vercel.app/)
and use credentials:

```bash
email: test@test.com
password: 123456
```
