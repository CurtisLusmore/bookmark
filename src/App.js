import React from 'react';
import './App.css';

class App extends React.Component {
  constructor() {
    super();

    const items = JSON.parse(localStorage.getItem('bookmarks')) || [];
    this.state = {
      input: '',
      items,
      matches: null
    };
    this.add = this.add.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(ev) {
    const input = ev.target.value;
    this.setState(({ items }) => ({
      input,
      matches: input.length === 0
      ? null
      : items.filter(item => item.keyword.startsWith(input)) }));
  }

  onSubmit(ev) {
    ev.preventDefault();

    const { matches } = this.state;
    if (matches.length === 1) { window.location = matches[0].url; }
    return false;
  }

  add(item) {
    this.setState(({ items }) => {
      const newItems = [ ...items, item ];
      localStorage.setItem('bookmarks', JSON.stringify(newItems));
      return {
        items: newItems,
        input: ''
      };
    });
  }

  remove(item) {
    this.setState(({ items }) => {
      const newItems = items.filter(({ keyword, url }) => keyword !== item.keyword || url !== item.url);
      localStorage.setItem('bookmarks', JSON.stringify(newItems));
      return {
        items: newItems
      };
    })
  }

  render() {
    const { input, matches } = this.state;

    let results;
    if (matches === null) results = <></>;
    else if (matches.length === 0) results = <>
      <p>No matches...</p>
      <AddBookmark keyword={input} add={this.add}/>
      </>;
    else results = <>
      <table>
        <tbody>
          {matches.map(({ keyword, url, title }) => <tr key={keyword}>
            <td><a href={url}>{title}</a></td>
            <td className="right"><button onClick={() => this.remove({ keyword, url })}>x</button></td>
          </tr>)}
        </tbody>
      </table>
      <AddBookmark keyword={input} add={this.add}/>
    </>;

    return <div className="App">
      <form onSubmit={this.onSubmit}>
        <input id="input"
          value={input} onChange={this.onChange}
          placeholder="Search for a bookmark..."
          autoFocus={true} />
      </form>
      {results}
    </div>
  }
}

class AddBookmark extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(ev) {
    const keyword = this.props.keyword,
          url = ev.target.url.value,
          title = ev.target.title.value;
    ev.preventDefault();
    this.props.add({ keyword, url, title });
    return false;
  }

  render() {
    const { keyword } = this.props;

    return <form onSubmit={this.onSubmit}>
      <p>Or add a new bookmark</p>
      <input name="keyword" disabled={true} value={keyword} placeholder="keyword" />
      <input name="url" placeholder="https://example.com/" autoComplete="off" required type="url"/>
      <input name="title" placeholder="Title" autoComplete="off" required />
      <input type="submit" value="Add Bookmark" />
    </form>;
  }
}

export default App;
