import * as dotenv from 'dotenv';
import { resolve } from 'path';
import { BroadcasterClient } from './network/BroadcasterClient';
dotenv.config({ path: resolve(`${__dirname}/../.env`) });

(async() => {
    const client = await BroadcasterClient.create(
        Number(process.env.client_port),
        process.env.address, Number(process.env.port),
        process.env.password,
        process.env.command_password,
        process.env.display_name,
        Number(process.env.update_interval),
    );
})();
