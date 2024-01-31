        const socket = new WebSocket('ws://' + window.location.host + ':5001/reverse');

        socket.onmessage = function (event) {
            const messagesDiv = document.getElementById('messages');
            messagesDiv.innerHTML += '<p>Server: ' + event.data + '</p>';
        };

        function sendMessage() {
            const messageInput = document.getElementById('message');
            const message = messageInput.value;

            if (message.trim() !== '') {
                socket.send(message);
                const messagesDiv = document.getElementById('messages');
                messagesDiv.innerHTML += '<p>You: ' + message + '</p>';
                messageInput.value = '';
            }
        }

