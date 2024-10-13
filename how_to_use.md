# Backend:
	- BASE ("/"): 	
		- HTTP:GET "/reset" -> deletes the values from the database
		- HTTP:GET "/base"  -> sets the database data back to origin
		- HTTP:GET "/test"  -> returns the performance testing values on sql&nosql

	-USERS ("/sql/users/"):
	-USERS ("/nosql/users/"):
		- HTTP:GET "/" -> gets all of the saved users and their skins