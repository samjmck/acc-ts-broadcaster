import { Socket, createSocket } from 'dgram';
import { OutboundMessageType } from './OutboundMessageType';
import { getStringBuffer, BufferReader } from '../util/buffer';
import { InboundMessageType, getInboundMessageType } from './InboundMessageType';
import { IRegistrationResultData } from './message/inbound/IRegistrationResultData';
import { Packet } from './packet/Packet';
import { OutboundPacket } from './packet/outbound/OutboundPacket';

export class BroadcasterClient {
    static protocolVersion = 2;

    public connectionId: number = null;

    private socket: Socket;
    private _awaitingRegistrationResult: [(value: IRegistrationResultData) => void, (error: string) => void] = null;

    constructor(
        public readonly clientPort: number,
        public readonly address: string,
        public readonly port: number,
        private password: string,
        private commandPassword: string,
        public readonly displayName: string,
        public readonly updateInterval: number,
        finishedSetup: () => void,
    ) {
        this.initialiseSocket();
        this.setupListener();
        this.connect().then(finishedSetup);
    }

    static async create(
        clientPort: number,
        address: string,
        port: number,
        password: string,
        commandPassword: string,
        displayName: string,
        updateInterval: number,
    ): Promise<BroadcasterClient> {
        let resolved: () => void = null;
        const finishedSetup = new Promise((resolve, error) => {
            resolved = resolve;
        });

        const client = new BroadcasterClient(
            clientPort,
            address,
            port,
            password,
            commandPassword,
            displayName,
            updateInterval,
            resolved,
        );

        await finishedSetup;
        return client;
    }

    private async send(packet: Packet): Promise<void> {
        await this.sendBuffer(packet.toBuffer());
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

        const awaitingRegistrationResult = new Promise<IRegistrationResultData>((resolve, error) => {
            this._awaitingRegistrationResult = [resolve, error];
        });

        this.sendBuffer(resultBuffer);

        await awaitingRegistrationResult;
    }

    private setupListener(): void {
        this.socket.on('message', buffer => {
            const bufferReader = new BufferReader(buffer);

            const type = <InboundMessageType> bufferReader.readUInt8();
            switch(type) {
                case InboundMessageType.RegistrationResult:
                    const messageData: IRegistrationResultData = {
                        connectionId: bufferReader.readUInt32LE(),
                        success: bufferReader.readUInt8() > 0,
                        isReadonly: bufferReader.readUInt8() === 0,
                        errorMessage: bufferReader.readString(),
                    };

                    this.connectionId = messageData.connectionId;

                    if(messageData.success) {
                        this._awaitingRegistrationResult[0](messageData);
                    } else {
                        this._awaitingRegistrationResult[1](messageData.errorMessage);
                    }

                    break;
                case InboundMessageType.EntryList:
                    bufferReader.readUInt32LE(); // connection id

                    const carEntryCount = bufferReader.readUInt16LE();

                    break;
            }
        });
    }
}
