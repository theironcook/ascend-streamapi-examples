There are 2 examples in this project.  
The first shows how to use NodeJS with the AMQP protocol.
The second shows how to use a Browser with the STOMP protocol (over secure web sockets).

RabbitMQ has many libraries for almost all languages.  This project only shows 2 simple ones
that you can start with
https://www.rabbitmq.com/devtools.html

RabbitMQ can expose several protocols as well. 
The Ascend API exposes secure AMQP and the STOMP protocol over secure web sockets.
STOMP is typically for client side / browser applications but it can also be used
for backend implementations as well.


To run either example, first install all required dependencies.
Make sure you have a recent version of NodeJS installed on your machine.  
Open a command line / terminal, navigate to the root directory.
> npm i

To run the NodeJS / AMQP example:
Update the client_id and client_secret inside of of example-amqp.js and the run
> npm run start-amqp
You can add an optional parameter "qa" if you want to run the example in qa.  (this is mostly for API devs / testers)
> npm run start-amqp qa

Look at the source code in example-amqp.js to follow along with how to use the stream api



To run the Stomp example that runs in a browser run:
> npm run start-stomp
You can add an optional parameter "qa" if you want to run the example in qa.  (this is mostly for API devs / testers)
> npm run start-stomp qa

Most of the source code for the stomp example can be found in example-stomp.js and example-stomp.html.
To see the example running open a browser at http://localhost:3039 (assuming that port was open on your computer)

Make sure to open the browser console to see useful errors / messages as the example runs
