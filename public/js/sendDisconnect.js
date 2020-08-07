// send disconnect user message
window.addEventListener("unload", disconnectMessage);

function disconnectMessage() {
    socket.emit('disconnect')
}
