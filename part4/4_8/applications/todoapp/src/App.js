import './App.css';
import {useEffect, useState} from 'react';
import axios from 'axios';



function App() {
  const [imageName, setImageName] = useState('');
  const [todoNameState, setTodoNameState] = useState('');
  const [todos, setTodos] = useState([]);
  const backendurl = window.location.href + 'backend'
  const getImageName = async () => {
    const axiosResponse = await axios({
      url: `${backendurl}/imageName`,
      method: 'GET',
      responseType: 'json'
    });
    console.log(axiosResponse.data.imageName);
    setImageName(axiosResponse.data.imageName)
  }
  const getTodos = async () => {
    const axiosResponse = await axios({
      url: `${backendurl}/todos`,
      method: 'GET',
      responseType: 'json'
    })
    setTodos(axiosResponse.data.todos);
    console.log(axiosResponse.data);
  }
  const createTodo = async () => {
    const axiosResponse = await axios({
      url: `${backendurl}/todos`,
      method: 'POST',
      responseType: 'json',
      params: { 'todoName': todoNameState }
    })
    setTodos(axiosResponse.data.todos);
    console.log(axiosResponse.data.todos);
  }
  const changeDone = async (id) => {
    const axiosResponse = await axios({
      url :`${backendurl}/todos/${id}`,
      method: 'PUT',
      responseType: 'json'
    });
    console.log(axiosResponse);
    getTodos();
  }

  useEffect(() => {
    getImageName();
    getTodos();
  }, [])

  return (
    <div className="App">
      <div>
        <img src={`${backendurl}/static/images/${imageName}`} alt="some cool pic" />
      </div>
      <div>
        <input type="text" value={todoNameState} onChange={(event) => setTodoNameState(event.target.value)} name="todoName" maxLength="140" />
        <input type="button" value="Create TODO" onClick={()=>createTodo()}/>
      </div>
      <div>
        <p>TODOS:</p>
        {todos.map((item, index) => {
          return <li key={index}>{item.text}<input type="checkbox" defaultChecked={item.done} onChange={ () => changeDone(item.id)} /></li>
        })}
      </div>
    </div>
  );
}

export default App;
