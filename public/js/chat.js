const socket = io( )

// elements ->
const $messageForm = document.querySelector ( "#message-form" ) ; 
const $messageFormInput = $messageForm.querySelector ( "input" ) ; 
const $messageFormButton = $messageForm.querySelector ( "button" ) ; 

const $sendLocationButton = document.querySelector ( "#send-location" ) ; 
const $messages = document.querySelector ( "#messages" ) ; 

// templates -> 

const messageTemplate = document.querySelector ( "#message-template" ).innerHTML ; 
const locationMessageTemplate = document.querySelector ( "#location-message-template" ).innerHTML ;  
const sidebarTemplate = document.querySelector ( "#sidebar-template").innerHTML ; 

// Options -> (Query string ko parse karne ke liye)
const { username, room } = Qs.parse ( location.search, {ignoreQueryPrefix : true } ) ; 

const autoscroll = () =>
{
	// new Message element ->
	const $newMessage = $messages.lastElementChild

	// Height of the new message ->
	const newMessageStyles = getComputedStyle ( $newMessage ) ; 
	const newMessageMargin = parseInt(newMessageStyles.marginBottom) ; 
	const newMessageHeight = $newMessage.offsetHeight + newMessageMargin ; 

	// Visible height
	const visibleHeight = $messages.offsetHeight ; 

	// height of messages container ->
	const containerHeight = $messages.scrollHeight ; 

	// How far have I scrolled ->
	const scrollOffset = $messages.scrollTop + visibleHeight ; 

	if ( containerHeight - newMessageHeight <= scrollOffset )	
		$messages.scrollTop = $messages.scrollHeight
}

socket.on ( "message" , (message) =>
{	
	const html = Mustache.render ( messageTemplate , 
	{
		username : message.username , 
		enteredMessage : message.text , 
		createdAt : moment(message.createdAt).format('hh:mm a') , 
	} ) ; 
	$messages.insertAdjacentHTML("beforeend" , html)
	autoscroll() ; 
})

socket.on ( "locationMessage" , (data) => 
{
	console.log ( data ) ; 

	const html = Mustache.render ( locationMessageTemplate , 
	{
		url : data.url , 
		username, 
		createdAt : moment(data.createdAt).format('hh:mm a') , 
	} ) ; 	
	$messages.insertAdjacentHTML("beforeend" , html)	
	autoscroll() ; 
})

socket.on ( "roomData" , ({room, users}) =>
{	
	const html = Mustache.render(sidebarTemplate , 
	{
		room, 
		users, 
	}) ; 

	document.querySelector ( "#sidebar" ).innerHTML = html ; 
})

$messageForm.addEventListener ( "submit" , (e) =>
{		
	e.preventDefault() ; 	

	$messageFormButton.setAttribute ( "disabled" , "disabled" ) ; 	

	const message = e.target.elements.message.value
	socket.emit ( "sendMessage" , message , (error) =>
	{
		$messageFormButton.removeAttribute ( "disabled" ) ; 
		$messageFormInput.value = "" ; 
		$messageFormInput.focus()

		if ( error ) 
			return console.log ( error ) ; 

		console.log ( "The message was delivered!", message ) ; 
	}) ; 
})

$sendLocationButton.addEventListener ( "click" , () =>
{
	if ( !navigator.geolocation ) 
		return alert ( "geolocation is not supported by your browser" ) ; 

	$sendLocationButton.setAttribute ( "disabled" , "disabled" ) ; 	

	navigator.geolocation.getCurrentPosition( (position) =>
	{
		socket.emit ( "sendLocation" , 
		{
			latitude : position.coords.latitude , 
			longitude : position.coords.longitude
		} , 

		() => {

			$sendLocationButton.removeAttribute ( "disabled" ) ; 
			console.log ( "Your location was sent to the server successfully" ) ; 
		})
	})
})

socket.emit ( "join" , { username, room } , (error) =>
{
	if (!error ) 
		return ; 

	alert ( error ) ; 
	location.href = "/" ; 
} ) ; 