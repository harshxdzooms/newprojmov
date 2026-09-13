import 'dotenv/config'
import express from 'express'
import { getMovieCandidates, getMovieDetails, searchMovies, tvdbStatus, TvdbError } from './tvdb.js'

const app = express()
const port = Number(process.env.PORT || 8787)
app.use(express.json())

app.get('/api/health', (_request, response) => response.json({ ok: true, tvdb: tvdbStatus() }))
app.get('/api/movies/search', async (request, response) => {
  try {
    const result = await searchMovies(String(request.query.q || ''))
    response.json(result)
  } catch (error) {
    console.error('[tvdb-search]', error)
    response.status(error instanceof TvdbError ? error.status : 502).json({ error: error.message, source: 'tvdb' })
  }
})
app.get('/api/movies/:id', async (request, response) => {
  try { response.json(await getMovieDetails(request.params.id)) }
  catch (error) { console.error('[tvdb-details]', error); response.status(error instanceof TvdbError ? error.status : 502).json({ error: error.message, source: 'tvdb' }) }
})
app.post('/api/movies/:id/recommendations', async (request, response) => {
  try {
    const source = request.body?.source || await getMovieDetails(request.params.id)
    response.json({ source, candidates: await getMovieCandidates(source), strategy: 'Live TVDB search by source genres and themes; no invented similar-movies endpoint.' })
  } catch (error) { console.error('[tvdb-recommendations]', error); response.status(error instanceof TvdbError ? error.status : 502).json({ error: error.message, source: 'tvdb' }) }
})

app.listen(port, () => console.log(`Movie API listening on http://localhost:${port}`))
