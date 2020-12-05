export default {
    decodeb64(value) {
        return Buffer.from(value, 'base64').toString();
    }
}