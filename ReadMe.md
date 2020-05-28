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