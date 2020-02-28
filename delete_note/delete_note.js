const PROTO_PATH = __dirname + '/notes.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const bodyParser = require('body-parser')

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
    app.delete('/note/:id', (req, res) => {
        const id = req.params.id;
        client.delete({
            id
        }, (error, _) => {
            if (!error) {
                res.json({
                    status: 'OK'
                })
            } else {
                console.error(error)
            }
        })
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

main();
