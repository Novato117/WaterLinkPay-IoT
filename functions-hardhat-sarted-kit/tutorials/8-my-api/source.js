const fromSymbol = args[0]


// make HTTP request
const url = `https://us-east-1.aws.data.mongodb-api.com/app/application-0-wqmkc/endpoint/${fromSymbol}`
console.log(`HTTP GET Request to ${url}`)

// params used for URL query parameters

const litersRequest = Functions.makeHttpRequest({
    url: url,
    method: "GET",
})

// Execute the API request (Promise)
const litersResponse = await litersRequest
if (litersResponse.error) {
    console.error(litersResponse.error)
    throw Error("Request failed")
}
console.log("litersresponse");
console.log(litersResponse["data"]);
console.log(litersResponse["data"][0]);
console.log(litersResponse["data"][0].temperatura);
console.log(litersResponse["data"][0].liters);
const data = litersResponse["data"][0]
console.log("DATOS");
console.log(data);
if (data.Response === "Error") {
    console.error(data.Message)
    throw Error(`Functional error. Read message: ${data.Message}`)
}

console.log(" response", data)



// The final result is a JSON object
const result = {
    liters: data.liters.toFixed(2),
    relay: data.relay,
}

// Convert JSON object to a string using JSON.stringify()
// Then encode it to a a bytes using the helper Functions.encodeString
return Functions.encodeString(JSON.stringify(result))
