const posterIds = [
  'photo-1489599849927-2ee91cede3ba',
  'photo-1536440136628-849c177e76a1',
  'photo-1517604931442-7e0c8ed2963c',
  'photo-1485846234645-a62644f84728',
  'photo-1440404653325-ab127d49abc1',
  'photo-1489599849927-2ee91cede3ba',
  'photo-1500534623283-312aade485b7',
  'photo-1500530855697-b586d89ba3ee',
]

const poster = (index, width = 700) => `https://images.unsplash.com/${posterIds[index % posterIds.length]}?auto=format&fit=crop&w=${width}&q=82`

export const mockMovies = [
  {
    id: 'mock-1', title: 'The Grand Budapest Hotel', year: 2014, runtime: 100,
    genres: ['Comedy', 'Drama', 'Adventure'], themes: ['friendship', 'eccentric', 'heist'], keywords: ['hotel', 'portrait', 'europe'],
    overview: 'A legendary concierge and his lobby boy become wrapped up in a priceless painting, a family fortune, and a changing Europe.',
    cast: ['Ralph Fiennes', 'Tony Revolori', 'Saoirse Ronan'], crew: ['Wes Anderson'], director: 'Wes Anderson',
    language: 'English', poster: poster(0), backdrop: poster(0, 1600), score: 96, accent: '#d69054',
  },
  {
    id: 'mock-2', title: 'Knives Out', year: 2019, runtime: 130,
    genres: ['Mystery', 'Comedy', 'Crime'], themes: ['family', 'murder', 'investigation'], keywords: ['detective', 'estate', 'inheritance'],
    overview: 'A sharp, stylish mystery where everyone in a dysfunctional family has a motive and one detective has the patience to untangle it.',
    cast: ['Daniel Craig', 'Ana de Armas', 'Chris Evans'], crew: ['Rian Johnson'], director: 'Rian Johnson',
    language: 'English', poster: poster(1), backdrop: poster(1, 1600), score: 94, accent: '#d9ad51',
  },
  {
    id: 'mock-3', title: 'The Nice Guys', year: 2016, runtime: 116,
    genres: ['Comedy', 'Crime', 'Mystery'], themes: ['buddy', 'conspiracy', 'los angeles'], keywords: ['private eye', '1970s', 'missing person'],
    overview: 'A down-on-his-luck private eye and a hired enforcer stumble through 1970s Los Angeles looking for a missing girl.',
    cast: ['Ryan Gosling', 'Russell Crowe', 'Angourie Rice'], crew: ['Shane Black'], director: 'Shane Black',
    language: 'English', poster: poster(2), backdrop: poster(2, 1600), score: 91, accent: '#a56b42',
  },
  {
    id: 'mock-4', title: 'Arrival', year: 2016, runtime: 116,
    genres: ['Science Fiction', 'Drama', 'Mystery'], themes: ['language', 'time', 'grief'], keywords: ['aliens', 'linguistics', 'first contact'],
    overview: 'A linguist is recruited to communicate with mysterious visitors and begins to see time, language, and loss differently.',
    cast: ['Amy Adams', 'Jeremy Renner', 'Forest Whitaker'], crew: ['Denis Villeneuve'], director: 'Denis Villeneuve',
    language: 'English', poster: poster(3), backdrop: poster(3, 1600), score: 93, accent: '#7892a1',
  },
  {
    id: 'mock-5', title: 'Moonrise Kingdom', year: 2012, runtime: 94,
    genres: ['Comedy', 'Drama', 'Romance'], themes: ['coming of age', 'summer', 'escape'], keywords: ['island', 'scouts', 'young love'],
    overview: 'Two young outsiders run away together, sending an island community into a tender, stormy search.',
    cast: ['Jared Gilman', 'Kara Hayward', 'Bruce Willis'], crew: ['Wes Anderson'], director: 'Wes Anderson',
    language: 'English', poster: poster(4), backdrop: poster(4, 1600), score: 89, accent: '#d2a74e',
  },
  {
    id: 'mock-6', title: 'The Lighthouse', year: 2019, runtime: 109,
    genres: ['Drama', 'Mystery', 'Horror'], themes: ['isolation', 'madness', 'myth'], keywords: ['sea', 'keepers', 'black and white'],
    overview: 'Two lighthouse keepers attempt to survive a remote island, each other, and the strange forces gathering around them.',
    cast: ['Robert Pattinson', 'Willem Dafoe'], crew: ['Robert Eggers'], director: 'Robert Eggers',
    language: 'English', poster: poster(5), backdrop: poster(5, 1600), score: 87, accent: '#7c8587',
  },
  {
    id: 'mock-7', title: 'Amélie', year: 2001, runtime: 122,
    genres: ['Comedy', 'Romance'], themes: ['whimsy', 'solitude', 'kindness'], keywords: ['paris', 'cafe', 'imagination'],
    overview: 'A shy Parisian waitress quietly orchestrates small acts of joy for the people around her while searching for connection.',
    cast: ['Audrey Tautou', 'Mathieu Kassovitz'], crew: ['Jean-Pierre Jeunet'], director: 'Jean-Pierre Jeunet',
    language: 'French', poster: poster(6), backdrop: poster(6, 1600), score: 86, accent: '#b95b38',
  },
  {
    id: 'mock-8', title: 'Ex Machina', year: 2014, runtime: 108,
    genres: ['Science Fiction', 'Drama', 'Thriller'], themes: ['artificial intelligence', 'power', 'confinement'], keywords: ['robot', 'experiment', 'tech'],
    overview: 'A young programmer is invited to administer a Turing test to an intelligent humanoid in a secluded estate.',
    cast: ['Alicia Vikander', 'Domhnall Gleeson', 'Oscar Isaac'], crew: ['Alex Garland'], director: 'Alex Garland',
    language: 'English', poster: poster(7), backdrop: poster(7, 1600), score: 88, accent: '#9ab3aa',
  },
  {
    id: 'mock-interstellar', title: 'Interstellar', year: 2014, runtime: 169,
    genres: ['Science Fiction', 'Drama', 'Adventure'], themes: ['space', 'time', 'family'], keywords: ['astronaut', 'wormhole', 'earth'], aliases: ['Inter Stellar'],
    overview: 'A team of explorers travels through a wormhole in space in an attempt to ensure humanity\'s survival.',
    cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain'], crew: ['Christopher Nolan'], director: 'Christopher Nolan',
    language: 'English', poster: poster(0), backdrop: poster(0, 1600), score: 97, accent: '#788b9c',
  },
  {
    id: 'mock-inception', title: 'Inception', year: 2010, runtime: 148,
    genres: ['Science Fiction', 'Action', 'Thriller'], themes: ['dreams', 'memory', 'heist'], keywords: ['subconscious', 'team', 'reality'],
    overview: 'A thief who steals secrets through shared dreams is offered a chance to erase his past by planting an idea in a target\'s mind.',
    cast: ['Leonardo DiCaprio', 'Joseph Gordon-Levitt', 'Elliot Page'], crew: ['Christopher Nolan'], director: 'Christopher Nolan',
    language: 'English', poster: poster(1), backdrop: poster(1, 1600), score: 96, accent: '#526b76',
  },
  {
    id: 'mock-matrix', title: 'The Matrix', year: 1999, runtime: 136,
    genres: ['Science Fiction', 'Action', 'Thriller'], themes: ['reality', 'identity', 'rebellion'], keywords: ['simulation', 'hacker', 'chosen one'],
    overview: 'A hacker discovers that the world he knows is a simulated reality and joins a rebellion against its architects.',
    cast: ['Keanu Reeves', 'Laurence Fishburne', 'Carrie-Anne Moss'], crew: ['The Wachowskis'], director: 'The Wachowskis',
    language: 'English', poster: poster(2), backdrop: poster(2, 1600), score: 95, accent: '#5b8a73',
  },
  {
    id: 'mock-avatar', title: 'Avatar', year: 2009, runtime: 162,
    genres: ['Science Fiction', 'Action', 'Adventure'], themes: ['nature', 'colonialism', 'belonging'], keywords: ['pandora', 'aliens', 'military'],
    overview: 'A marine on an alien world finds himself torn between following orders and protecting the world he has learned to call home.',
    cast: ['Sam Worthington', 'Zoe Saldana', 'Sigourney Weaver'], crew: ['James Cameron'], director: 'James Cameron',
    language: 'English', poster: poster(3), backdrop: poster(3, 1600), score: 94, accent: '#5f8792',
  },
  {
    id: 'mock-oppenheimer', title: 'Oppenheimer', year: 2023, runtime: 180,
    genres: ['Drama', 'History'], themes: ['ambition', 'science', 'consequence'], keywords: ['manhattan project', 'physicist', 'atomic bomb'],
    overview: 'The story of J. Robert Oppenheimer and the creation of the atomic bomb.',
    cast: ['Cillian Murphy', 'Emily Blunt', 'Robert Downey Jr.'], crew: ['Christopher Nolan'], director: 'Christopher Nolan',
    language: 'English', poster: poster(4), backdrop: poster(4, 1600), score: 95, accent: '#a27351',
  },
  {
    id: 'mock-spiderman', title: 'Spider-Man', year: 2002, runtime: 121,
    genres: ['Action', 'Adventure', 'Science Fiction'], themes: ['responsibility', 'identity', 'heroism'], keywords: ['superhero', 'new york', 'spider'], aliases: ['Spiderman', 'Spider Man'],
    overview: 'After a bite from a genetically altered spider, a shy student develops extraordinary abilities and learns what responsibility means.',
    cast: ['Tobey Maguire', 'Kirsten Dunst', 'Willem Dafoe'], crew: ['Sam Raimi'], director: 'Sam Raimi',
    language: 'English', poster: poster(5), backdrop: poster(5, 1600), score: 90, accent: '#9e3e34',
  },
  {
    id: 'mock-batman', title: 'Batman', year: 1989, runtime: 126,
    genres: ['Action', 'Crime', 'Drama'], themes: ['justice', 'identity', 'gothic'], keywords: ['gotham', 'vigilante', 'joker'],
    overview: 'A masked vigilante protects Gotham City while facing a criminal mastermind who turns the city into a spectacle.',
    cast: ['Michael Keaton', 'Jack Nicholson', 'Kim Basinger'], crew: ['Tim Burton'], director: 'Tim Burton',
    language: 'English', poster: poster(6), backdrop: poster(6, 1600), score: 89, accent: '#62577b',
  },
]

export const backgroundPosters = mockMovies.map((movie, index) => ({ ...movie, poster: poster(index, 500) }))
