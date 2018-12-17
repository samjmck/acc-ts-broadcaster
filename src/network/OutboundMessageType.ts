export enum OutboundMessageType {
    RegisterCommandApplication = 1,
    UnregisterCommandApplication = 9,
    RequestEntryList = 10,
    RequestTrackData = 11,
    ChangeHUDPage = 49,
    ChangeFocus = 50,
    InstantReplayRequest = 51,
    // PlayManualReplayHighlight = 52,
    // SaveManualReplayHighlight = 60,
}

export function getOutboundMessageType(type: OutboundMessageType): string {
    switch(type) {
        case OutboundMessageType.RegisterCommandApplication:
            return 'RegisterCommandApplication';
        case OutboundMessageType.UnregisterCommandApplication:
            return 'UnregisterCommandApplication';
        case OutboundMessageType.RequestEntryList:
            return 'RequestEntryList';
        case OutboundMessageType.RequestTrackData:
            return 'RequestTrackData';
        case OutboundMessageType.ChangeHUDPage:
            return 'ChangeHUDPage';
        case OutboundMessageType.ChangeFocus:
            return 'ChangeFocus';
        case OutboundMessageType.InstantReplayRequest:
            return 'InstantReplayRequest';
    }
}
