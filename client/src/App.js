import React, { useState, useEffect } from 'react';
import './App.css';
import { useQuery, useMutation } from '@apollo/react-hooks'
import gql from 'graphql-tag'

const READ_TODOS = gql`
  query todos {
    todos {
      id
      text
      completed
    }
  }
`;

const CREATE_TODO = gql`
  mutation CreateTodo($text: String!) {
    createTodo(text: $text)
  }
`;

const REMOVE_TODO = gql`
  mutation RemoveTodo($id: String!) {
    removeTodo(id: $id)
  }
`;

const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!) {
    updateTodo(id: $id)
  }
`;


function App() {

  let [todoText, setTodoText] = useState("")
  let [createTodo] = useMutation(CREATE_TODO)
  let [removeTodo] = useMutation(REMOVE_TODO)
  let [updateTodo] = useMutation(UPDATE_TODO)
  let { data, loading, error } = useQuery(READ_TODOS)

  const handleSubmit = (evt) => {
    evt.preventDefault();
    createTodo({ variables: { text: todoText} });
    window.location.reload()
  }

  const handleDelete = (evt) => {
    evt.preventDefault();
    removeTodo({ variables: { id: evt.target.className }})
    window.location.reload()
  }

  const handleComplete = (evt) => {
    evt.preventDefault();
    updateTodo({ variables: { id: evt.target.className }})
    window.location.reload()
  }

  // useEffect( () => {
  //   console.log("data changed")
  // }, [ data ])

  if (loading) return <h3>Loading...</h3>
  if (error) return <h3>ERROR</h3>


  return (
    <div className="App">
      <h3>Create New Todo</h3>
      <form onSubmit={handleSubmit}>
        <input className="form-control" type="text" placeholder="Enter todo" onChange={e => setTodoText(e.target.value)}></input>
        <button className="btn btn-primary px-5 my-2" type="submit">Submit</button>
      </form>

      <h2>Todos</h2>
      <ul>
        {data.todos.map(todo => {
          return (
          <li key={todo.id}>
            <span className={todo.completed ? "complete" : "pending"}>{todo.text}</span>
            <button className={todo.id} onClick={handleDelete}>Remove todo</button>
            <button className={todo.id} onClick={handleComplete}>Completed</button>
          </li>
          )   
        })}
      </ul>
    </div>
  );
}

export default App;
