#  **Kafka** message _producer_ and _consumer_

 Send message and consume that message example in **Node.js**
```javascript
const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'coin-service',
    brokers: ['127.0.0.1:9092'],
    logLevel: 0
})

const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'coin-consumer' })

const run = async () => {
    await producer.connect()
    const topic = 'coin.actions.store'
    await producer.send({
        topic,
        messages: [{ value: JSON.stringify({ user_id: 1, merchant_id: 2, action_id: 3, amount: 1 })}],
    })
    console.log('messages sent')

    // Consuming
    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: true })

    await consumer.run({
        eachMessage: async ({  message }) => {
            console.log('message', message.value.toString() )
        },
    })
}

run().catch(console.error)
```
## Docker compose file

```dockerfile
version: "3"
services:
  zookeeper:
    image: 'bitnami/zookeeper:latest'
    ports:
      - '2181:2181'
    environment:
      - ALLOW_ANONYMOUS_LOGIN=yes
  kafka:
    image: 'bitnami/kafka:latest'
    ports:
      - '9092:9092'
    environment:
      - KAFKA_BROKER_ID=1
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092
      - KAFKA_CFG_ZOOKEEPER_CONNECT=zookeeper:2181
      - ALLOW_PLAINTEXT_LISTENER=yes
    depends_on:
      - zookeeper
```
