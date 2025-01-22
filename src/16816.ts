// pnpx tsx src/16816.ts

import createClient from 'openapi-fetch'
import type { paths } from '@lichess-org/types'
import { faker } from '@faker-js/faker'

const users = [
    'ana',
    'lola',
    'yulia',
    'angel',
    'elena',
    'mei',
    'yaroslava',
    'ekaterina',
    'milena',
    'margarita',
    'ivan',
    'boris',
    'luis',
    'dmitry',
    'yevgeny',
    'yunel',
    'diego',
    'mateo',
    'aleksandr',
    'veer',
    'li',
    'dae',
    'bobby',
    'elizabeth',
    'marcel',
    'akeem',
    'abdul',
    'rudra',
    'sai',
    'yarah',
    'gabriela',
    'ikem',
    'hans',
    'pedro',
    'qing',
    'yun',
    'xioyan',
    'monica',
    'nushi',
    'mohammed',
    'jose',
    'mary',
    'hui',
    'fatima',
    'jiang',
    'vera',
    'anthony',
    'ramesh',
    'suresh',
    'aaron',
    'jacob',
    'salma',
    'benjamin',
    'abubakar',
    'kenneth',
    'adriana',
    'patricia',
    'broadcaster',
    'zerogames',
    'kid',
    'wwwwwwwwwwwwwwwwwwww',
]

const baseUrl = 'http://localhost:8080'

for (const user of users) {
    const client = createClient<paths>({
        baseUrl,
        headers: { Authorization: `Bearer lip_${user}` },
    })
    client
        .POST('/api/challenge/{username}', {
            params: { path: { username: 'bobby' } },
            body: {
                'clock.limit': 60 * faker.number.int({ min: 1, max: 15 }),
                'clock.increment': faker.number.int({ min: 0, max: 5 }),
            },
        })
        .then(({ data }) => {
            console.log(data)
        })
}
