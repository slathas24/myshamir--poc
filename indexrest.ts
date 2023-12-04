import http from 'http';
import { parse } from 'url';
import { SecretRecord } from './dto/dto';
import { seng } from './secretengine/secretengine'

const port = 7090;
//const todos: { id: number; text: string }[] = [];

let y= new SecretRecord("ABC123",'MYAPP1','DBPASSWD','')

const server = http.createServer((req, res) => {
  const { pathname, query } = parse(req.url!, true);
  console.log('here',req.url)
  if (req.method === 'POST' && pathname === '/process/secrets') {
    console.log('here')
    let data = '';
    req.on('data', chunk => {
      data += chunk;
    });

    req.on('end', async () => {
    var sc:SecretRecord
      sc = JSON.parse(data);
      await seng.RetrieveSecret(sc)
      console.log(sc)
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(sc));
    });
}
});

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});