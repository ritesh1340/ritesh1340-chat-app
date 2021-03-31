const generateMessage = (username, text) =>
{
	return object = 
	{ 
		username, 
		text : text, 
		createdAt : new Date().getTime() , 
	}
}

const generateLocationMessage = (username, url) =>
{
	return object = 
	{
		username , 
		url : url, 
		createdAt : new Date().getTime() , 
	}
}

module.exports.generateMessage = generateMessage ; 
module.exports.generateLocationMessage = generateLocationMessage ; 