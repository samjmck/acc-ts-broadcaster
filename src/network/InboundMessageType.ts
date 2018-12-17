export enum InboundMessageType {
    RegistrationResult = 1,
    RealtimeUpdate = 2,
    RealtimeCarUpdate = 3,
    EntryList = 4,
    EntryListCar = 6,
    TrackData = 5,
}

export function getInboundMessageType(type: InboundMessageType): string {
    switch(type) {
        case InboundMessageType.RegistrationResult:
            return 'RegistrationResult';
        case InboundMessageType.RealtimeUpdate:
            return 'RealtimeUpdate';
        case InboundMessageType.RealtimeCarUpdate:
            return 'RealtimeCarUpdate';
        case InboundMessageType.EntryList:
            return 'EntryList';
        case InboundMessageType.EntryListCar:
            return 'EntryListCar';
        case InboundMessageType.TrackData:
            return 'TrackData';
    }
}
