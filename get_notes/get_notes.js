const PROTO_PATH = __dirname + '/notes.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

const packageDefinition = protoLoader.loadSync(
    PROTO_PATH, {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

let note = grpc.loadPackageDefinition(packageDefinition).noteservice;

const express = require('express')
const app = express()
const port = 3000

function main() {
    let client = new note.NoteService('server:50051', grpc.credentials.createInsecure());
    app.get('/notes', (req, res) => {
        client.list({}, (err, data) => {
            console.log(err);
            console.log(data);
            res.send(data);
        });
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

main();
