# Backend:
	- BASE ("/"): 	
		- HTTP:GET "/reset" -> deletes the values from the database
		- HTTP:GET "/base"  -> sets the database data back to origin
		- HTTP:GET "/test"  -> returns the performance testing values on sql&nosql

	-USERS ("/sql/users/"):
	-USERS ("/nosql/users/"):
		- HTTP:GET "/" -> gets all of the saved users (*)

	-SKINS ("/sql/skins/"):
	-SKINS ("/nosql/skins/"):
		- HTTP:GET "/" -> gets all of the saved skins (mapped)

	-MAPS ("/sql/maps/"):
	-MAPS ("/nosql/maps/"):
		- HTTP:GET "/" -> gets all of the saved maps (mapped)

	-REPLAYS ("/sql/replays/"):
	-REPLAYS ("/nosql/replays/"):
		- HTTP:GET "/" -> gets all of the saved replays (mapped)