import React from 'react';
import { Table, Button } from 'react-bootstrap';

const TodoItemsContent = ({ errorMessage, items, getItems, handleMarkAsComplete }) => {
  return (
    <>
      <h4>{errorMessage}</h4>
      <h1>
        Showing {items.length} Item(s){' '}
        <Button variant="primary" className="pull-right" onClick={getItems}>
          Refresh
        </Button>
      </h1>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Id</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.description}</td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleMarkAsComplete(item)}>
                  Mark as completed
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default TodoItemsContent;
