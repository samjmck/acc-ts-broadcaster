import { BroadcasterClient } from '../BroadcasterClient';

export abstract class Listener {
    constructor(protected broadcasterClient: BroadcasterClient) {}
}
