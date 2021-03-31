const users = []

const addUser = ({id, username, room}) =>
{
	username = username.trim().toLowerCase() ; 
	room = room.trim().toLowerCase() ; 

	if ( !username || !room )
		return { error : "Username and Room are required" }

	const existingUser = users.find((user) => 
	{
		return user.room === room && user.username === username ; 
	})

	if ( existingUser )
		return {error : "This username has already been taken by someone in the room. Please Try again with a different username"}

	const user = {id, username, room}	

	users.push ( user ) ; 
	return user ; 
}

const removeUser = (id) =>
{
	const index = users.findIndex ( (user) => user.id === id )

	if ( index < 0 ) 
		return { error : "The user was not found" } ; 

	return users.splice ( index, 1 )[0] ; 
}

const getUser = (id) =>
{
	const index = users.findIndex ( (user) => user.id === id )

	if ( index < 0 ) 
		return { error : "OOPS! It seems that there is nobody in this room with the given id!" } ; 

	return users[index] ; 
}

const getUsersInRoom = (room) =>
{
	if ( !room ) return ; 
	
	room = room.trim().toLowerCase() ; 
	return users.filter ( (user) => user.room === room ) ; 
}

module.exports = 
{
	addUser, 
	removeUser, 
	getUser, 
	getUsersInRoom, 
}

// addUser ( 
// {
// 	id: 1340, 
// 	username: "ritesh", 
// 	room : "roomName" , 
// })

// addUser ( 
// {
// 	id: 12, 
// 	username: "ayush", 
// 	room : "roomName" , 
// })

// addUser ( 
// {
// 	id: 40, 
// 	username: "ritesh", 
// 	room : "otherRoomName" , 
// })

// console.log ( getUser ( 134 ) ) ; 
// console.log ( getUsersInRoom ( "roomname" ) ) ; 