module.exports = {
    logId: {
        type: "string",
        pk: true,
        length: 256
    },
    type: {
        type: 'string',
        length: 64
    },
    message: {
        type: 'textString'
    },
    timestamp: {
        type: 'string',
        length: 32
    },
    functionName: {
        type: 'string',
        length: 256
    },
    fileName: {
        type: 'string',
        length: 256
    },
    lineNumber: {
        type: 'int'
    }
};
