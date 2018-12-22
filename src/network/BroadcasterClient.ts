import { Socket, createSocket } from 'dgram';
import { OutboundMessageType } from './OutboundMessageType';
import { InboundMessageType } from './InboundMessageType';
import { Packet } from './packet/Packet';
import { IRegistrationResultData, RegistrationResultPacket } from './packet/inbound/RegistrationResultPacket';
import { RegisterCommandApplicationPacket } from './packet/outbound/RegisterCommandApplicationPacket';
import { EntryListPacket } from './packet/inbound/EntryListPacket';
import { EntryListCarPacket } from './packet/inbound/EntryListCarPacket';
import { RealtimeUpdatePacket } from './packet/inbound/RealtimeUpdatePacket';
import { RealtimeCarUpdatePacket } from './packet/inbound/RealtimeCarUpdatePacket';
import { TrackDataPacket } from './packet/inbound/TrackDataPacket';

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
        const packet = new RegisterCommandApplicationPacket({
            messageType: OutboundMessageType.RegisterCommandApplication,
            protocolVersion: BroadcasterClient.protocolVersion,
            displayName: this.displayName,
            password: this.password,
            updateInterval: this.updateInterval,
            commandPassword: this.commandPassword,
        });

        const awaitingRegistrationResult = new Promise<IRegistrationResultData>((resolve, error) => {
            this._awaitingRegistrationResult = [resolve, error];
        });

        this.send(packet);

        await awaitingRegistrationResult;
    }

    private setupListener(): void {
        this.socket.on('message', buffer => {
            let data = null;
            let packet: Packet = null;
            const type = <InboundMessageType> buffer.readUInt8(0);
            switch(type) {
                case InboundMessageType.RegistrationResult:
                    data = new RegistrationResultPacket(buffer).fromBuffer();

                    this.connectionId = data.connectionId;

                    if(data.success) {
                        this._awaitingRegistrationResult[0](data);
                    } else {
                        this._awaitingRegistrationResult[1](data.errorMessage);
                    }
                    break;
                case InboundMessageType.EntryList:
                    packet = new EntryListPacket(buffer);
                    break;
                case InboundMessageType.EntryListCar:
                    packet = new EntryListCarPacket(buffer);
                    break;
                case InboundMessageType.RealtimeUpdate:
                    packet = new RealtimeUpdatePacket(buffer);
                    break;
                case InboundMessageType.RealtimeCarUpdate:
                    packet = new RealtimeCarUpdatePacket(buffer);
                    break;
                case InboundMessageType.TrackData:
                    packet = new TrackDataPacket(buffer);
                    break;
            }
        });
    }
}
