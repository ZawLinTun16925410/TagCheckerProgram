import React, { Component } from "react";
import './App.css';

//constructor
class TagCheckerApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = { input: '', output: '' };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  render() {
    return (
      <div>
        <h1>HTML Tag Checker</h1>
        <form onSubmit={this.handleSubmit}>
          <label for="inputHolder">
            Type String Here
          </label>
          <center>
            <textarea
              id="inputHolder"
              onChange={this.handleChange}
              value={this.state.input}
              required
            />
          </center>
          <button>
            Check
          </button>
        </form>
        <ResultString output={this.state.output} />
      </div>
    );
  }

  handleChange(e) {
    this.setState({ input: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    if (!this.state.input.length) {
      return;
    }

    this.setState(state => ({
      output: this.checkHTMLParagraph(this.state.input)
    }));
  }

  //Can check either line or paragraph
  checkHTML(text) {
    //these are valid tag names
    const uppercaseRegex = RegExp(/[A-Z]/);

    //If we find open tag, we store in the stack and find close tag for that. It also give the error messages.
    const tagStack = [];
    for (let index in text) {
      const char = text[index];
      if (char === '<') {
        const letter = text[++index];
        
        // Opening tag.
        if (letter.match(uppercaseRegex)) {
          const closingBracket = text[++index];
          if (closingBracket === '>') {
            tagStack.push(letter);
          }
        }
        
        // Closing tag.
        else if (letter === '/') {
          const closingLetter = text[++index];
          if (closingLetter.match(uppercaseRegex)) {
            const closingBracket = text[++index];
            if (closingBracket === '>') {
              const latestOpenTag = tagStack.pop();

              // No opening tag remaining.
              if (!latestOpenTag) {
                return `Expected # found </${closingLetter}>`

              // The opening tag and closing tag don't match.
              } else if (closingLetter !== latestOpenTag) {
                return `Expected </${latestOpenTag}> found </${closingLetter}>`;
              }
            }
          }
        }
      }
    }

    if (tagStack.length) {
      const latestOpenTag = tagStack.pop();
      return `Expected </${latestOpenTag}> found #`;
    }

    return "Correctly tagged paragraph";
  }

  checkHTMLParagraph(text) {
    let output = '';

    //split by question marks or full stop or new line.
    const lines = text.trim().split(/\?|\.|\r?\n/g);
    //if there is only line. dont do for loop.
    if (lines.length === 1) {
      return this.checkHTML(lines[0]);
    }

    //Empty line should not be counted.
    let lineNum = 0;
    for (let index in lines) {
      if (lines[index].trim().length) {
        lineNum++;
        output += `Line ${lineNum}: ` + this.checkHTML(lines[index]) + '\n';
      }
    }
    return output;
  }
}

class ResultString extends Component {
  render() { 
    return (
      <span>
        {this.props.output}
      </span>
    );
  }
}

export default TagCheckerApp;
