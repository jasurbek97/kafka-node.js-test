const { Kafka } = require('kafkajs')


const kafka = new Kafka({
    clientId: 'coin-service',
    brokers: ['172.16.15.122:29093'],
    logLevel: 1
})


const producer = kafka.producer()
const consumer = kafka.consumer({ groupId: 'coin-service-server' })


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
//
run().catch(console.error)
