import { InboundMessageType } from '../InboundMessageType';
import { OutboundMessageType } from '../OutboundMessageType';

export type MessageType = InboundMessageType | OutboundMessageType;

export interface IPacketData {
    messageType: MessageType;
}

export abstract class Packet {
    abstract fromBuffer(): object;
    abstract toBuffer(): Buffer;
}
