import { createClient } from 'redis';

const client = createClient({
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-17292.c301.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 17292
    }
});
  
client.on('error', (err) => console.error('Redis Client Error', err));
  
(async () => {
    await client.connect();
  })();
  

export default client;