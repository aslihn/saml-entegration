const axios = require('axios');


  
// axios.get('http://localhost:3001/sendToken')
// .then(response => console.log(response.data))
// .catch(error => console.log(error));

axios.post('http://localhost:3001/login/callback')
.then(response => console.log(response.data.token))
.catch(error => console.log(error));