import './App.css'
import { Image, Alert, Container, Row, Col } from 'react-bootstrap'
import React, { useState, useEffect } from 'react'
import ItemServices from './Services/ItemServices';
import { ItemModel } from './Models/ItemModel';
import { v4 as uuidv4 } from 'uuid';
import AddTodoItemContent from './Components/AddToDoItemContent'
import TodoItemsContent from './Components/TodoItemsContent';

const itemService = new ItemServices();

const App = () => {
  const [description, setDescription] = useState('')
  const [items, setItems] = useState([])
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const convertBase64ToHtmlAndPreloadStaffAndClients = async () => {
      // get all the items
      const itemsSourceResponse = await itemService.getAllItems()
      const data = itemsSourceResponse.data
      // initialize the item list
      setItems(data);
    }
    convertBase64ToHtmlAndPreloadStaffAndClients();
  }, [])

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  }

  async function getItems() {
    try {
      const itemsSourceResponse = await itemService.getAllItems()
      const data = itemsSourceResponse.data
      // initialize the item list
      setItems(data);
      setErrorMessage('');
    } catch (error) {
      console.error(error)
    }
  }

  async function handleAdd() {
    try {
      // Generate a new GUID
      const newGuid = uuidv4()
      const newItem = new ItemModel(newGuid, description, false)
      //here we are creating the new item record and 
      //refreshing the screen as soon as its done to get the new record in the list display
      await itemService.createItem(newItem).then(response => {
        if (response.isSuccess) {
          getItems().then(response => {
            handleClear()
          });
        } else {
          setErrorMessage(response.errors[0].values[0])
        }
      });
    } catch (error) {
      console.error(error)
    }
  }

  function handleClear() {
    setDescription('')
    setErrorMessage('')
  }

  async function handleMarkAsComplete(item) {
    try {
      item.isCompleted = true;
      await itemService.updateItem(item.id, item).then(response => {
        getItems().then(response => {
          handleClear()
        });
      });
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="App">
      <Container>
        <Row>
          <Col>
            <Image src="clearPointLogo.png" fluid rounded />
          </Col>
        </Row>
        <Row>
          <Col>
            <Alert variant="success">
              <Alert.Heading>Todo List App</Alert.Heading>
              Welcome to the ClearPoint frontend technical test. We like to keep things simple, yet clean so your
              task(s) are as follows:
              <br />
              <br />
              <ol className="list-left">
                <li>Add the ability to add (POST) a Todo Item by calling the backend API</li>
                <li>
                  Display (GET) all the current Todo Items in the below grid and display them in any order you wish
                </li>
                <li>
                  Bonus points for completing the 'Mark as completed' button code for allowing users to update and mark
                  a specific Todo Item as completed and for displaying any relevant validation errors/ messages from the
                  API in the UI
                </li>
                <li>Feel free to add unit tests and refactor the component(s) as best you see fit</li>
              </ol>
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            {/* Render the AddTodoItemContent component */}
            <AddTodoItemContent
              description={description}
              handleDescriptionChange={handleDescriptionChange}
              handleAdd={handleAdd}
              handleClear={handleClear}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            {/* Render the TodoItemsContent component */}
            <TodoItemsContent
              errorMessage={errorMessage}
              items={items}
              getItems={getItems}
              handleMarkAsComplete={handleMarkAsComplete}
            />
          </Col>
        </Row>
      </Container>
      <footer className="page-footer font-small teal pt-4">
        <div className="footer-copyright text-center py-3">
          © 2021 Copyright:
          <a href="https://clearpoint.digital" target="_blank" rel="noreferrer">
            clearpoint.digital
          </a>
        </div>
      </footer>
    </div>
  )
}

export default App
