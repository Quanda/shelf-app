import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Nav from './Nav';
import BooksGrid from '../components/BooksGrid';
import { addBook } from '../redux/actions';
import stockBookImg from '../static/img/defaultBook.png';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class Explore extends React.Component {
  render() {
    const {
      classes,
      styleTheme,
      searchResults,
      addBookToShelf,
    } = this.props;

    const formattedResults = searchResults && searchResults.map(b => ({
      title: b.volumeInfo.title,
      author: b.volumeInfo.authors ? b.volumeInfo.authors[0] : 'No Author Listed',
      description: b.volumeInfo.description || b.volumeInfo.subtitle,
      image_link: b.volumeInfo.imageLinks ? b.volumeInfo.imageLinks.thumbnail : stockBookImg,
      isbn: b.isbn,
    }));

    return (
      <div className={classes.root}>
        <Nav styleTheme={styleTheme} />
        {formattedResults && (
          <BooksGrid
            books={formattedResults}
            page="explore"
            addBookToShelf={addBookToShelf}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  searchResults: state.searchResults,
});

const mapDispatchToProps = dispatch => ({
  addBookToShelf: (book, shelfType) => dispatch(addBook(book, shelfType)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Explore));
