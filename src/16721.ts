// Usage:
// pnpx tsx src/16721.ts

import createClient from 'openapi-fetch'
import type { paths } from '@lichess-org/types'
import { sleep } from './config'
import open from 'open'

const client = createClient<paths>({
    baseUrl: 'http://localhost:8080',
    headers: {
        Authorization: `Bearer lip_admin`,
    },
})

const tour = await client.POST('/broadcast/new', {
    body: {
        name: 'Test Broadcast',
        players: [
            'aaa / 1 / GM / 2800 / Player A',
            'bbb / 2 / IM / 2600 / Player B',
        ].join('\n'),
    },
})

const round = await client.POST('/broadcast/{broadcastTournamentId}/new', {
    params: { path: { broadcastTournamentId: tour.data?.tour.id! } },
    body: {
        name: 'Round 1',
    },
})

const url = `${tour.data?.tour.url}#boards`;
console.log(`Broadcast created at ${url}`)
open(url);

await sleep(2000)

const pgn = `
[Event "Test"]
[White "aaa"]
[Black "bbb"]
[Result "*"]

1. e4
`

const push = await client.POST('/api/broadcast/round/{broadcastRoundId}/push', {
    params: { path: { broadcastRoundId: round.data?.round.id! } },
    headers: {
        'Content-Type': 'text/plain',
    },
    body: pgn,
    bodySerializer: (body) => body,
});

console.log(push.data);
