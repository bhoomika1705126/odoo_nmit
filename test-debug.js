const http = require('http');

// Test health endpoint on debug server
const testEndpoint = (path, port = 3001) => {
  const options = {
    hostname: 'localhost',
    port: port,
    path: path,
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`\n=== Testing ${path} on port ${port} ===`);
    console.log(`Status: ${res.statusCode}`);
    
    res.setEncoding('utf8');
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log(`Response: ${data}`);
    });
  });

  req.on('error', (e) => {
    console.error(`Problem with request to ${path}: ${e.message}`);
  });

  req.end();
};

// Test both servers
testEndpoint('/health', 3001);
testEndpoint('/api/products', 3001);
testEndpoint('/health', 5000);