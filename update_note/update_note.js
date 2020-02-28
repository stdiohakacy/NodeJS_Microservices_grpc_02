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

app.use(
    bodyParser.urlencoded({
        extended: true
    })
)
app.use(bodyParser.json())

function main() {
    let client = new note.NoteService('server:50051', grpc.credentials.createInsecure());
    app.put('/note', (req, res) => {
        const note = req.body;
        client.update(note, (error, note) => {
            if (!error) {
                res.json(note);
            } else {
                console.error(error)
            }
        })
    });
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

main();
