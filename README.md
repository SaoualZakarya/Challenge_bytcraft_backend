# Challenge_bytcraft_backend
 This is dynamic task manager application that enables users to create, update, and manage tasks.With implementation of user authentication and authorization for secure access.We use database -mongodb- to store task details and create APIs for CRUD (Create, Read, Update, Delete and complete) tasks.


 ## This is overview about the project 


 # to use the backend 

you need to install node on your computer.

after run this command :

 ### git clone https://github.com/zakaryaalgeria/Challenge_bytcraft_backend.git

 after navigate to the Challenge_bytcraft_backend and run the command :
 ### npm install 
 the dependencies will be installed in the folder node_modules .

   ## The acces to my db is from anywhere so you can use mine directly
  # About  the endpoint that include in this project and you can use it 

    to create user            method :  POST 
  ## http://localhost:4000/api/user/create

    to login user            method :  POST
   ## http://localhost:4000/api/user/login

    to refresh the user token            method:   GET
   ## http://localhost:4000/api/user/refresh

    to logout user           method:  GET
   ## http://localhost:4000/api/user/logout

    to create task for user           method :  POST
   ## http://localhost:4000/api/task/create

    to get all task for user            method:   GET
   ## http://localhost:4000/api/task/all

    to get single task           method:  GET
   ## http://localhost:4000/api/task/single/:task_id

    to make task complete        method : PUT
   ## http://localhost:4000/api/task/complete/:task_id   

    to delete task              method : DELETE
   ## http://localhost:4000/api/task/:task_id 

    to update task               method : PUT  
   ## http://localhost:4000/api/task/update/64db74a9bf83c6db68b54977

    to generate forget passowrd token and send the link to the user          method :  POST                 
   ## http://localhost:4000/api/user/forgot-password-token           

    to handle the link to reset the passwork that already be sent            method : PUT    
   ## http://localhost:4000/api/user/reset-password/:token

    update login user                 method : PUT 
   ## http://localhost:4000/api/user/update

    update password login user                method : PUT    
   ## http://localhost:4000/api/user/update-password


   ## if you want best practice using me database you can test the api with POSTMAN 
