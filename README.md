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
version: "2"
services:
  zookeeper:
    image: 'confluentinc/cp-zookeeper:latest'
    container_name: zookeeper
    networks:
      - kafka_network
    ports:
      - '22181:2181'
    environment:
      ZOOKEEPER_CLIENT_PORT: 22181
      ZOOKEEPER_TICK_TIME: 2000
  kafka:
    image: 'confluentinc/cp-kafka:latest'
    networks:
      - kafka_network
    ports:
      - '29092:29092'
      - '29093:29093'
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:22181
      KAFKA_LISTENERS: EXTERNAL_SAME_HOST://:29092,EXTERNAL_DIFFERENT_HOST://:29093,INTERNAL://:9092
      KAFKA_ADVERTISED_LISTENERS: INTERNAL://kafka:9092,EXTERNAL_SAME_HOST://localhost:29092,EXTERNAL_DIFFERENT_HOST://172.16.15.122:29093
      KAFKA_LISTENER_SECURITY_PROTOCOL_MAP: INTERNAL:PLAINTEXT,EXTERNAL_SAME_HOST:PLAINTEXT,EXTERNAL_DIFFERENT_HOST:PLAINTEXT
      KAFKA_INTER_BROKER_LISTENER_NAME: INTERNAL
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
    depends_on:
      - zookeeper

networks:
  kafka_network:
    name: kafka_docker_example_network
```
