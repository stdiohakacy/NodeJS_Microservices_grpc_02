const PROTO_PATH = __dirname + '/notes.proto';
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');
const uuidv1 = require('uuid/v1')

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
        id: 1,
        title: 'Note 1',
        content: 'Content 1'
    },
    {
        id: 2,
        title: 'Note 2',
        content: 'Content 2'
    }
]

let note = grpc.loadPackageDefinition(packageDefinition).noteservice;

function main() {
    let server = new grpc.Server();

    server.addService(note.NoteService.service, {
        list: (_, callback) => {
            callback(null, {
                notes
            })
        },
        get: (call, callback) => {
            let note = notes.find((n) => n.id == call.request.id)
            if (note) {
                callback(null, note)
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                })
            }
        },
        insert: (call, callback) => {
            let note = call.request
            note.id = uuidv1()
            notes.push(note)
            callback(null, note)
        },
        update: (call, callback) => {
            let existingNote = notes.find((n) => n.id == call.request.id)
            if (existingNote) {
                existingNote.title = call.request.title
                existingNote.content = call.request.content
                callback(null, existingNote)         
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                })
            }
        },
        delete: (call, callback) => {
            let existingNoteIndex = notes.findIndex((n) => n.id == call.request.id)
            if (existingNoteIndex != -1) {
                notes.splice(existingNoteIndex, 1)
                callback(null, {})
            } else {
                callback({
                    code: grpc.status.NOT_FOUND,
                    details: "Not found"
                })
            }
        }
    });

    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
}

main();
