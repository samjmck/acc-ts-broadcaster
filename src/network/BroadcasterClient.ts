import { Socket, createSocket } from 'dgram';
import { OutboundMessageType } from './OutboundMessageType';
import { getStringBuffer, BufferReader } from '../util/broadcasterClient';
import { InboundMessageType, getInboundMessageType } from './InboundMessageType';

export class BroadcasterClient {
    static protocolVersion = 2;

    public connectionId: number = null;

    private socket: Socket;

    constructor(
        public readonly clientPort: number,
        public readonly address: string,
        public readonly port: number,
        private password: string,
        private commandPassword: string,
        public readonly displayName: string,
        public readonly updateInterval: number,
    ) {
        this.initialiseSocket();
        this.setupListener();
        this.connect();
    }

    private sendBuffer(buffer: Buffer): Promise<void> {
        let sent: () => void = null;
        let error: () => void = null;
        const promise = new Promise<void>((resolve, reject) => {
            sent = resolve;
            error = reject;
        });

        this.socket.send(buffer, this.port, this.address, err => {
            if(err) {
                return error();
            }
            sent();
        });

        return promise;
    }

    private initialiseSocket(): void {
        this.socket = createSocket('udp4');
        this.socket.bind(this.clientPort);
    }

    private async connect(): Promise<void> {
        // alloc 2 bytes for UInt8 for message type and protocol version (first byte is always message type)
        const initialBuffer = Buffer.alloc(2);
        // UInt8 --> unsigned 8-bit integer --> 0-255
        // offset 0, start from start
        initialBuffer.writeUInt8(OutboundMessageType.RegisterCommandApplication, 0);
        initialBuffer.writeUInt8(BroadcasterClient.protocolVersion, 1);

        const displayNameBuffer = getStringBuffer(this.displayName);
        const passwordBuffer = getStringBuffer(this.password);

        // alloc 4 bytes for 32-bit (4 x 8-bits) buffer
        const updateIntervalBuffer = Buffer.alloc(4);
        updateIntervalBuffer.writeUInt32LE(this.updateInterval, 0);

        const commandPasswordBuffer = getStringBuffer(this.commandPassword);

        const resultBuffer = Buffer.concat([
            initialBuffer,
            displayNameBuffer,
            passwordBuffer,
            updateIntervalBuffer,
            commandPasswordBuffer,
        ]);

        this.sendBuffer(resultBuffer);
    }

    private setupListener(): void {
        this.socket.on('message', buffer => {
            console.log(buffer.byteLength);
            const bufferReader = new BufferReader(buffer);
            const type = <InboundMessageType> bufferReader.readUInt8();
            console.log(getInboundMessageType(type));
            switch(type) {
                case InboundMessageType.RegistrationResult:
                    this.connectionId = bufferReader.readUInt32LE();
                    const success = bufferReader.readUInt8() > 0;
                    const isReadonly = bufferReader.readUInt8() === 0;
                    const errorMessage = bufferReader.readString();
                    break;
                case InboundMessageType.EntryList:
                    break;
            }
        });
    }
}
