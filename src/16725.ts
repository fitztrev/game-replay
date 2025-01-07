// console #1:
// pnpx tsx src/16725.ts

// console #2:
// curl -X POST -H "Accept: application/x-ndjson" -H "Content-Type: text/plain" "http://localhost:8080/api/stream/games-by-users" --data "bobby,mary"

import { Chess } from 'chess.js'
import createClient from 'openapi-fetch'
import type { paths } from '@lichess-org/types'

const baseUrl = 'http://localhost:8080'

const pgnDraw = `[Event "Rated bullet game"]
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

const pgnWin = `
[Event "Hourly SuperBlitz Arena"]
[Site "https://lichess.org/H8dHWTl1"]
[Date "2025.01.07"]
[White "success0885"]
[Black "EricRosen"]
[Result "0-1"]
[UTCDate "2025.01.07"]
[UTCTime "01:35:13"]
[WhiteElo "1940"]
[BlackElo "2567"]
[WhiteRatingDiff "+0"]
[BlackRatingDiff "+0"]
[BlackTitle "IM"]
[Variant "Standard"]
[TimeControl "180+0"]
[ECO "A40"]
[Opening "Polish Defense"]
[Termination "Normal"]
[Annotator "lichess.org"]

1. d4 b5?! { (0.17 → 0.73) Inaccuracy. Nf6 was best. } { A40 Polish Defense } (1... Nf6 2. c4 e6 3. Nf3 d5 4. Nc3 Be7 5. Bf4 O-O 6. e3) 2. e3 a6 3. f4?! { (0.46 → -0.09) Inaccuracy. Nf3 was best. } (3. Nf3 Bb7 4. Bd3 e6 5. a4 b4 6. e4 c5 7. O-O cxd4) 3... Bb7 4. Nf3 d6 5. Bd3 g6 6. O-O Bg7 7. a4 b4 8. Nbd2 Nd7 9. Qe1 c5 10. c3 Ngf6 11. e4 cxd4 12. cxd4 Qb6?! { (0.83 → 1.93) Inaccuracy. O-O was best. } (12... O-O 13. Nb3 e5 14. fxe5 dxe5 15. Bg5 h6 16. Bxf6 Bxf6 17. d5 a5) 13. Kh1 O-O 14. Nc4 Qa7 15. e5 dxe5 16. dxe5?? { (1.99 → 0.20) Blunder. fxe5 was best. } (16. fxe5 Nh5 17. Be3 Bd5 18. a5 e6 19. Rc1 f6 20. Qxb4 Rab8 21. Qd2 Rb3) 16... Nd5 17. e6?! { (0.05 → -0.77) Inaccuracy. f5 was best. } (17. f5 Nc5) 17... N7f6?? { (-0.77 → 3.23) Blunder. Nc5 was best. } (17... Nc5 18. exf7+ Rxf7 19. Be2 Nb3 20. Nce5 Rff8 21. Rb1 e6 22. Bc4 Nxc1 23. Rxc1) 18. exf7+ Rxf7 19. Nfe5? { (3.33 → 1.64) Mistake. f5 was best. } (19. f5 gxf5 20. Bxf5 Bc8 21. Bd3 Rf8 22. Bg5 h6 23. Bd2 b3 24. Qh4 Ng4) 19... Rff8 20. a5?! { (1.46 → 0.37) Inaccuracy. f5 was best. } (20. f5 Qd4) 20... Qd4 21. Rb1? { (0.50 → -0.99) Mistake. Be2 was best. } (21. Be2) 21... Rad8?! { (-0.99 → -0.40) Inaccuracy. Nd7 was best. } (21... Nd7) 22. b3? { (-0.40 → -1.61) Mistake. Bd2 was best. } (22. Bd2 Nh5) 22... Nc3? { (-1.61 → 0.00) Mistake. Ng4 was best. } (22... Ng4) 23. Be3 Qd5 24. Rc1?? { (0.00 → Mate in 1) Checkmate is now unavoidable. Rb2 was best. } (24. Rb2 Nfe4 25. Bb6 Rc8 26. Bg1 Rcd8) 24... Qxg2# { Black wins by checkmate. } 0-1
`

const game = new Chess()
game.loadPgn(pgnDraw)
const moves = game.history({ verbose: true })

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const clientW = createClient<paths>({
    baseUrl,
    headers: { Authorization: `Bearer lip_bobby` },
})
const clientB = createClient<paths>({
    baseUrl,
    headers: { Authorization: `Bearer lip_mary` },
})

await clientW.POST('/api/challenge/{username}', { params: { path: { username: 'mary' } }, body: { color: 'white' } })

const { data } = await clientB.GET('/api/challenge', { params: {  } })

const gameId = data?.in?.[0]?.id

if (!gameId) {
    throw new Error('No challenge found')
}

await clientB.POST('/api/challenge/{challengeId}/accept', { params: { path: { challengeId: gameId } } })

console.log(`Game started at ${baseUrl}/${gameId}`)
await sleep(2000)

for (const move of moves) {
    if (move.color === 'w') {
        await clientW.POST('/api/board/game/{gameId}/move/{move}', {
            params: { path: { gameId, move: move.lan } },
        })
    } else {
        await clientB.POST('/api/board/game/{gameId}/move/{move}', {
            params: { path: { gameId, move: move.lan } },
        })
    }

    await sleep(20);
}
