# Backend:
	- BASE ("/"): 	
		- HTTP:GET "/reset" -> deletes the values from the database
		- HTTP:GET "/base"  -> sets the database data back to origin

	- TEST ("/test")
		- HTTP:GET "/"  -> returns the previously done tests.
		- HTTP:GET "/basic?size=NUMBER"  -> returns the performance testing values on different settings based on [size]
		- HTTP:GET "/advanced" -> returns the performance testing values on sql&nosql with 3 predefined sizes
		- HTTP:GET "/eternity" -> returns the performance testing values on sql&nosql with 4 predefined sizes (warning: takes very long because of 6 digit document count)

	-USERS ("/users/"):
		- HTTP:GET "/" -> gets all of the saved users and their skins
		- HTTP:GET "/search?s=STRING" -> Google type searching the Documents
		- HTTP:GET "/delete?id=STRING" -> Delete one Document
		- HTTP:POST "/edit" {user body} -> Updates one Document
		- HTTP:POST "/create" {user body} -> Inserts one Document
		