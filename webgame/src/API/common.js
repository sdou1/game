var Console = console
module.exports = {
    LogMessage(msgType, msgContent) {
        if (msgType === 'warn')
            Console.warn(msgContent)
        else if (msgType == 'error')
            Console.error(msgContent)
        else
            Console.log(msgContent)
    }
}