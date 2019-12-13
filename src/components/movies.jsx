import React, { Component } from "react";
//import { getMovies, deleteMovie } from "../services/fakeMovieService";
//import { getGenres } from "../services/fakeGenreService";
import { getGenres } from "../services/genreService";
import { getMovies, deleteMovie } from "../services/movieService";
import Pagination from "./common/pagination";
import { paginate } from "../utils/paginate";
import ListGroup from "./common/listGroup";
import { toast } from "react-toastify";
import MoviesTable from "./moviesTable";
import { Link } from "react-router-dom";
import SearchBar from "./common/searchBar";
import _ from "lodash";

class Movies extends Component {
  state = {
    movies: [],
    genres: [],
    selectedGenre: null,
    selectedSearch: "",
    sortColumn: { path: "title", order: "asc" },
    pageSize: 4,
    currentPage: 1
  };

  async componentDidMount() {
    const { data } = await getGenres();
    const genres = [{ name: "All Genres", _id: "" }, ...data];

    const { data: movies } = await getMovies();
    this.setState({ movies: movies, genres: genres });
  }

  handleDelete = async movie => {
    const originalMovies = this.state.movies;
    const movies = originalMovies.filter(m => m._id !== movie._id);
    this.setState({ movies: movies });

    try {
      await deleteMovie(movie._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This movie has already been deleted");
      this.setState({ movies: originalMovies });
    }
    //deleteMovie(movie._id);
  };

  handleLike = movie => {
    const movies = [...this.state.movies];
    const index = movies.indexOf(movie);
    movies[index] = { ...movies[index] };
    movies[index].liked = !movies[index].liked;
    this.setState({ movies: movies });
  };

  handlePageChange = page => {
    this.setState({ currentPage: page });
  };

  handleGenreSelect = genre => {
    this.setState({ selectedGenre: genre, selectedSearch: "", currentPage: 1 });
  };

  handleSearch = search => {
    this.setState({
      selectedSearch: search,
      selectedGenre: null,
      currentPage: 1
    });
  };

  handleSort = sortColumn => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      movies: allMovies,
      pageSize,
      currentPage,
      selectedGenre,
      selectedSearch,
      sortColumn
    } = this.state;

    let filtered = allMovies;
    if (selectedSearch)
      filtered = allMovies.filter(m =>
        m.title.toLowerCase().startsWith(selectedSearch.toLowerCase())
      );
    else if (selectedGenre && selectedGenre._id)
      filtered = allMovies.filter(m => m.genre._id === selectedGenre._id);

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const movies = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: movies };
  };

  render() {
    const count = this.state.movies.length;
    const { pageSize, currentPage, sortColumn } = this.state;
    const { user } = this.props;
    console.log(user);

    if (count === 0) return <p>There are no movies in the database.</p>;

    const { totalCount, data: movies } = this.getPageData();

    //table.table>thead>tr>th*4 shortcut
    return (
      <div className="row">
        <div className="col-3">
          <ListGroup
            items={this.state.genres}
            selectedItem={this.state.selectedGenre}
            onItemSelect={this.handleGenreSelect}
          />
        </div>
        <div className="col">
          {user && (
            <Link to="/movies/new" className="btn btn-primary">
              New Movie
            </Link>
          )}

          <p />
          <p>Showing {totalCount} movies in the database.</p>

          <SearchBar
            value={this.state.selectedSearch}
            onChange={this.handleSearch}
          />

          <MoviesTable
            movies={movies}
            sortColumn={sortColumn}
            onLike={this.handleLike}
            onDelete={this.handleDelete}
            onSort={this.handleSort}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={this.handlePageChange}
          />
        </div>
      </div>
    );
  }
}

export default Movies;
