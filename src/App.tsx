import React, {useState} from 'react';
import './App.css';

interface Movie {
    id: number;
    img: string;
    title: string;
};

interface MenuLinkProps {
    children?: string;
    onClick: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void;
    movie_id: number;
    movie: Movie;
};

const MenuLink = (props: MenuLinkProps) => {
    if (props.movie_id === props.movie.id)
        return (<li className="selected" data-id={props.movie_id} onClick={props.onClick}>{props.children}</li>);
    return (<li data-id={props.movie_id} onClick={props.onClick}>{props.children}</li>);

};

let fallbackMovie = {
    id: 0,
    img: 'load.gif',
    title: '?',
};

const App: React.FC = () => {
    const fetch_movie = async (movie_id: number) => {
        const url = 'data/movie_' + movie_id + '.json';
        return await (await fetch(url)).json() as Movie;
    };

    let [movie_id, setMovieId] = useState(1);
    let [movie, setMovie] = useState(fallbackMovie);

    const link_callback = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
        if (!event.currentTarget) {
            throw new Error('Non target Clicked?');
        }
        const element = event.currentTarget as HTMLElement;
        if (!element.dataset.id) {
            throw new Error('Non target Clicked?');
        }
        setMovieId(+element.dataset.id);
    };

    (async () => {
        let new_movie = await fetch_movie(movie_id);
        if (new_movie.id !== movie.id)
            setMovie(new_movie);
    })();

    return (
        <div className="App">
            <h1>Bio Ajax Exemple</h1>
            <nav>
                <ul>
                    <MenuLink movie={movie} movie_id={1} onClick={link_callback}>Film 1</MenuLink>
                    <MenuLink movie={movie} movie_id={2} onClick={link_callback}>Film 2</MenuLink>
                </ul>
            </nav>
            <p>Film: <span id="movie_number">{movie.id}</span></p>
            <h2 id="movie_name">{movie.title}</h2>
            <p><img src={movie.img} alt={movie.title} id="movie_img"/></p>
        </div>
    );
};

export default App;
