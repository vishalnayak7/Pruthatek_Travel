const http = require('http');

http.get('http://localhost:8007/api/v1/bus/search?origin=DEL&destination=BOM&departureDate=2024-05-01', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => { 
      console.log("BUS-SERVICE HTTP RESPONSE:", data); 
      process.exit(0);
  });
}).on('error', (err) => {
  console.log("BUS-SERVICE HTTP ERROR:", err.message);
  process.exit(1);
});
