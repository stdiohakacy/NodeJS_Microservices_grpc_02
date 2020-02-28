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

const notes = [{
        id: '1',
        title: 'Note 1',
        content: 'Content 1'
    },
    {
        id: '2',
        title: 'Note 2',
        content: 'Content 2'
    }
]

let note = grpc.loadPackageDefinition(packageDefinition).noteservice;

function list(call, callback) {
    callback(null, {notes});
}

function main() {
    let server = new grpc.Server();

    server.addService(note.NoteService.service, {
        list: list
    });

    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
}

main();
