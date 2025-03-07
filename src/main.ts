type Movie = {
    name: string,
    year: number,
    director: string,
    genre: 'drama' | 'action' | 'fantasy'
}
const url = "http://localhost:3000/movies"
async function getMovies():Promise<Movie[]> {
    const res = await fetch(url);
    const movies = await res.json(); 
    return movies;
}

getMovies().then(movies =>{
    console.log(movies)
    const container = document.querySelector(`#movieContainer`) as HTMLDivElement;
    for(const movie of movies) {
        const h1 = document.createElement('h1');
        h1.innerText = movie.name;
        container.append(h1);
    }
})

const yearForm = document.querySelector("#searchYear") as HTMLFormElement;

yearForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const year = yearForm.querySelector('input')?.value;
    const res = await fetch(url+'/'+year);
    const movies: Movie[] = await res.json();
    const container = document.querySelector(`#movieContainer`) as HTMLDivElement;
    container.innerHTML = ''; // Clear previous results
    for (const movie of movies) {
        const h1 = document.createElement('h1');
        h1.innerText = movie.name;
        container.append(h1);
    }
});

const addMovieForm = document.querySelector('#addMovie') as HTMLFormElement;
addMovieForm.addEventListener('submit', async event =>{
    event.preventDefault();
    const formDataMovie = new FormData(addMovieForm);
    const newMovie:Movie = {
        name: formDataMovie.get("name") as string,
        year: Number(formDataMovie.get("year")),
        director: formDataMovie.get("name") as string,
        genre: formDataMovie.get("genre") as 'drama' | 'action' | 'fantasy'
    }
    const options = {
        method: "POST",
        headers:{
            "Content-type": "application/json"
        },
        body:JSON.stringify(newMovie)
    }
    const res = await fetch(url, options);
    const {message} = await res.json();
    console.log(message)
})