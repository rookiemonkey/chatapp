const msgs = document.querySelector('#messages')

function toScroll() {
    const newMessage = msgs.lastElementChild
    const newMessageStyles = getComputedStyle(newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin

    const visibleHeight = msgs.offsetHeight
    const containerHeight = msgs.scrollHeight
    const scollOffset = msgs.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scollOffset) {
        msgs.scrollTop = msgs.scrollHeight
    }
}