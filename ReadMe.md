# CD Microfluidics Webpage

- - - 
This repo is dedicated to the development of the Cd Microfluidics Lab webpage.
- - - 
## Index
* Home
    Dedicated to explaining a bit about the lab and its history.
* Projects
    Dedicated to showcasing some of the projects the lab has worked on
* People
    Dedicated to showcasing the people who are part of the lab
* Gallery
    Dedicated to showcasing images that the lab users may want to share
* Maps
    Dedicated to showcasing the lab's presence and impact around the world
## What an Admin can do
1. Add/Find/Delete Admin
2. Add/Find/Delete/Update Project
3. Add/Find/Delete/Update Publications
4. Add/Find/Delete/Update Pictures
4. Add/Delete Markers on the map

## What a Registered user can do
- - - 
1. Add Comments to Publications
2. Add Projects to their Bookmarks

## What a visitor can do
- - - 
1. Read Publication Comments
2. Browse the Lab webpage
3. Register to become a user


## List of available endpoints with their required attributes
NOTE: All endpoints start with /cd-microfluidics
 - - - 

### Pictures Endpoints
1. **get all Pictures**
* url : /pictures
* method : GET
* required Data: none

2. **get Picture by id**
* url : /getPictureByID/:id
* method : GET
* required Data: picture id
* requires admin login

3. **create a new Picture**
* url : /createPicture
* method : POST
* required Data: description, image file
* requires admin login

4. **delete a  Picture by ID**
* url : deletePicture/:id
* method : DELETE
* required Data: id
* requires admin login

5. **update a  Picture by ID**
* url : updatePicture/:id
* method : PATCH
* required Data: id
* requires admin login

- - -
 
### User Endpoints
1. **get all Users**
* url : /users
* method : GET
* required Data: none

2. **get User by id**
* url : /getUserID/:id
* method : GET
* required Data: User id

3. **get User by email**
* url : /getUser/:email
* method : GET
* required Data: User email
* requires admin login

3. **create a new User**
* url : /createUser
* method : POST
* required Data: firstName,LastName,email,password,bookmarks

3. **User Login**
* url : /login
* method : POST
* required Data: email,password

3. **create a new Admin**
* url : /createAdmin
* method : POST
* required Data: firstName,LastName,email,password
* requires admin login

4. **delete a  User by ID**
* url : deleteUser/:id
* method : DELETE
* required Data: id
* requires admin login

- - -
 
### People Endpoints
1. **get all People**
* url : /people
* method : GET
* required Data: none

2. **get Person by id**
* url : /getPersonByID/:id
* method : GET
* required Data:  id
* requires admin login

3. **get Person by first name**
* url : /getPerson/:firstName
* method : GET
* required Data:first name
* requires admin login

3. **create a new Persom**
* url : /createPerson
* method : POST
* required Data: firstName,LastName,description,major
* requires admin login

4. **delete a  Person by ID**
* url : deletePerson/:id
* method : DELETE
* required Data: id
* requires admin login

4. **update a  Person by ID**
* url : updatePerson/:id
* method : PATCH
* required Data: id
* requires admin login

- - -
 
### Publications Endpoints
1. **get all Publications**
* url : /publications
* method : GET
* required Data: none

2. **get Publication by id**
* url : /getPublicationByID/:id
* method : GET
* required Data:  id
* requires admin login

3. **get Publication by title**
* url : /getPublication/:title
* method : GET
* required Data: title


3. **create a new Publication**
* url : /createPublication
* method : POST
* required Data: title,description,url,date,image,comments
* requires admin login

4. **delete a  Publication by ID**
* url : deletePublication/:id
* method : DELETE
* required Data: id
* requires admin login

4. **update a  Publication by ID**
* url : updatePublication/:id
* method : PATCH
* required Data: id
* requires admin login

- - -
 
### Projects Endpoints
1. **get all Projects**
* url : /projects
* method : GET
* required Data: none

2. **get Project by id**
* url : /getProjectByID/:id
* method : GET
* required Data:  id

3. **get Project by title**
* url : /getProject/:title
* method : GET
* required Data: title

3. **create a new Project**
* url : /createProject
* method : POST
* required Data: title,description,url,date,Image
* requires admin login

4. **delete a  Project by ID**
* url : deleteProject/:id
* method : DELETE
* required Data: id
* requires admin login

4. **update a  Project by ID**
* url : updateProject/:id
* method : PATCH
* required Data: id
* requires admin login

- - -
 
### Comments Endpoints
1. **get all Comments**
* url : /Comments
* method : GET
* required Data: none

3. **create a new Comment**
* url : /createComment
* method : POST
* required Data: title,content,idUser,idPost

4. **delete a  Comment by ID**
* url : deleteComment/:id
* method : DELETE
* required Data: id

- - -
 
### Marker Endpoints
1. **get all Markers**
* url : /markers
* method : GET
* required Data: none

3. **create a new Marker**
* url : /marker
* method : POST
* required Data: lat,long,content
* requires admin login

4. **delete a  Marker by ID**
* url : deleteComment/:id
* method : DELETE
* required Data: id
* requires admin login


- - -
 
### Bookmarks Endpoints

3. **create a new Bookmark**
* url : /createBookmark
* method : POST
* required Data: idUser,idProject

- - -