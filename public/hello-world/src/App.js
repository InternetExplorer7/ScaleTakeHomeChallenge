import React, { Component } from 'react';
import './App.css';
import cookie from 'react-cookie';

class App extends Component {

  constructor(){
    super();

    this.handleSubmit = this.handleSubmit.bind(this);
  }
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <LoadList/>
          </div>
          <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
            <div id="bbox_annotator"></div>
            <input ref="annotation" id="annotation_data" name="annotation_data" type="hidden" />
            <input type="submit" onClick={this.handleSubmit}/>
          </div>
        </div>
      </div>
    );
  }

  handleSubmit(){
    // window.handleSubmit();
    var response = this.refs.annotation.value;

    console.log('cb url: ' + cookie.load('callback_url'));

    fetch('https://60ed3e1c.ngrok.io/complete/task', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bounding_box: response,
        obj: cookie.load('object')
      })
    })
  }
}

class LoadList extends Component {
  constructor(props){
    super(props);
    this.state = {
      tasks: []
    }
  }

  componentDidMount(){
    var x = 500;
    setInterval( () => {
      fetch('https://60ed3e1c.ngrok.io/fetch/tasks', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((tasks) => {
        this.setState({
          tasks: tasks
        })
        // if (tasks.length > 0) {
        //   var n = tasks.length - 1;
        //   var new_task = tasks[n];
        //   this.setState({
        //     tasks: this.state.tasks.concat(new_task)
        //   })
        // }
      })
    }, x);
  }

  render() {
    return(
      <ol>
        {this.state.tasks.map((result) => {
          return <Link obj={result}/>
        })}
      </ol>
    )
  }
}

class Link extends Component {
  constructor(props){
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  render(){
    return (
      <div>
        <li onClick={this.handleClick} key={this.props.obj._id}>New task: id: {this.props.obj._id} 
        <br/> From user with api-key: {this.props.obj.api_key}
        <br/> instructions: {this.props.obj.instructions}
        <br/> attachment: {this.props.obj.attachment}
        <br/> attachment type: {this.props.obj.attachment_type}
        <br/> objects to annotate: {this.props.obj.objects_to_annotate.join(',')}
        <br/> labels: {this.props.obj.with_labels}
        <br/> completed: false</li>
      </div>
    )
  }

  handleClick(){
    cookie.save('object', JSON.stringify(this.props.obj), { path: '/'});
  }
}

export default App;
