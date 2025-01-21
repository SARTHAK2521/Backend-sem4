const http = require('http');  
const fs = require('fs');  
const url = require('url');  

const PORT = 3000;  

// Function to handle incoming requests  
const requestHandler = (req, res) => {  
    if (req.method === 'POST' && req.url === '/register') {  
        let body = '';  

        // Collect the data from the request  
        req.on('data', chunk => {  
            body += chunk.toString(); // convert Buffer to string  
        });  

        req.on('end', () => {  
            const userData = JSON.parse(body);  
            console.log('Received User Data:', userData);  

            // Save the data to a JSON file  
            fs.readFile('users.json', 'utf8', (err, data) => {  
                if (err) {  
                    console.error('Error reading file:', err);  
                    res.writeHead(500);  
                    return res.end(JSON.stringify({ error: 'Error reading file' }));  
                }  

                const users = JSON.parse(data || '[]');  
                users.push(userData);  

                fs.writeFile('users.json', JSON.stringify(users), (err) => {  
                    if (err) {  
                        console.error('Error writing file:', err);  
                        res.writeHead(500);  
                        return res.end(JSON.stringify({ error: 'Error saving data' }));  
                    }  

                    res.writeHead(201, { 'Content-Type': 'application/json' });  
                    res.end(JSON.stringify({ message: 'User registered successfully!' }));  
                });  
            });  
        });  
    } else {  
        res.writeHead(404, { 'Content-Type': 'text/plain' });  
        res.end('404 Not Found');  
    }  
};  
   
const server = http.createServer(requestHandler);  
   
server.listen(PORT, () => {  
    console.log(`Server is running on http://localhost:${PORT}`);  
});