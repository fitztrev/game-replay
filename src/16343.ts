import { Chess } from 'chess.js'
import createClient from 'openapi-fetch'
import type { paths } from '@lichess-org/types'
import open from 'open'
import { baseUrl, sleep } from './config'

const pgn = `[Event "Rated bullet game"]
[Site "https://lichess.org/NaF1M8nH"]
[Date "2024.11.05"]
[White "kneuner"]
[Black "pres7on"]
[Result "1/2-1/2"]
[UTCDate "2024.11.05"]
[UTCTime "16:59:24"]
[WhiteElo "851"]
[BlackElo "770"]
[WhiteRatingDiff "-1"]
[BlackRatingDiff "+14"]
[Variant "Standard"]
[TimeControl "120+1"]
[ECO "B01"]
[Opening "Scandinavian Defense"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. e4 d5 { B01 Scandinavian Defense } 2. d3 d4 3. Nf3 Nc6 4. c3 dxc3 5. Nxc3 e5 6. Bg5 f6 7. Bh4 Bb4 8. Qb3 Bxc3+ 9. Qxc3 Bg4 10. Be2 Bxf3 11. Bxf3 Qd7 12. O-O O-O-O 13. Rac1 Qd4 14. Bg4+ Kb8 15. Rfd1 Qxc3 16. Rxc3 Nd4 17. f3 Ne2+ 18. Kf2 Nxc3 19. Rc1 Nxa2 20. Rc4 Rxd3 21. Be6 Rd2+ 22. Ke3 Rxb2 23. f4 Rb3+ 24. Kd2 b5 25. Rc6 Rc3 26. Rxc3 Nxc3 27. Kxc3 Ne7 28. fxe5 Nc6 29. exf6 Ne5 30. fxg7 Re8 31. Bf5 Rg8 32. Bxh7 Rxg7 33. Bf6 Rxg2 34. Bxe5 Rxh2 35. Bf5 Rh3+ 36. Bxh3 Kb7 37. Bd4 c6 38. e5 Kc7 39. Bxa7 Kd8 40. Bb8 Ke7 41. e6 Kf6 42. Bg2 Kxe6 43. Bg3 Kd7 44. Bh4 Kc7 45. Bh3 Kb6 46. Bg3 c5 47. Bg4 Ka5 48. Kb3 b4 49. Be1 Kb5 50. Be2+ c4+ 51. Bxc4+ Ka5 52. Bd5 Kb5 53. Bxb4 Kb6 54. Bc3 Kc5 55. Bc4 Kb6 56. Bb4 Kc6 57. Ka4 Kd7 58. Bb5+ Kc7 59. Ka5 Kd8 60. Bc5 Kc8 61. Ba6+ Kd7 62. Kb5 Ke6 63. Bb6 Kf5 64. Bc5 Ke4 65. Bb7+ Kd3 66. Bd5 Kc3 67. Bb4+ Kd3 68. Bc4+ Ke4 69. Bb3 Ke5 70. Kc5 Kf5 71. Bc4 Kf6 72. Kd4 Kf5 73. Bd5 Kf6 74. Bc5 Kf5 75. Be4+ Ke6 76. Bd5+ Kf6 77. Be4 Kg5 78. Bd6 Kg4 79. Ke5 Kg3 80. Kf6+ Kf2 81. Bf5 Ke3 82. Bf4+ Kd4 83. Be5+ Ke3 84. Bg6 Kf3 85. Kf5 Ke3 86. Bf7 Kd3 87. Kf6 Ke4 88. Bd6 Kd4 89. Be6 Ke4 90. Ke7 Kd4 91. Kd7 Ke4 92. Be7 Ke5 93. Bd6+ Kf6 94. Bd5 Kf5 95. Kc6 Kf6 96. Bc5 Ke5 97. Bc4 Ke4 98. Kb5 Ke5 99. Bb6 Ke4 100. Bb3 Kd3 101. Bc4+ Kc3 102. Kc5 Kc2 103. Kb4 { The game is a draw. } 1/2-1/2`

const game = new Chess()
game.loadPgn(pgn)
const moves = game.history({ verbose: true })

const clients = {
    w: createClient<paths>({
        baseUrl,
        headers: { Authorization: `Bearer lip_bobby` },
    }),
    b: createClient<paths>({
        baseUrl,
        headers: { Authorization: `Bearer lip_mary` },
    }),
}

await clients.w.POST('/api/challenge/{username}', {
    params: { path: { username: 'mary' } },
    body: { color: 'white', 'clock.limit': 300, 'clock.increment': 0 },
})

const { data } = await clients.b.GET('/api/challenge')

const gameId = data?.in?.[0]?.id

if (!gameId) {
    throw new Error('No challenge found')
}

await clients.b.POST('/api/challenge/{challengeId}/accept', {
    params: { path: { challengeId: gameId } },
})

const gameUrl = `${baseUrl}/${gameId}`
console.log(`Game started at ${gameUrl}`)
await open(gameUrl)
await sleep(2000)

for (const move of moves) {
    await clients[move.color].POST('/api/board/game/{gameId}/move/{move}', {
        params: { path: { gameId, move: move.lan } },
    })

    await sleep(20)
}
