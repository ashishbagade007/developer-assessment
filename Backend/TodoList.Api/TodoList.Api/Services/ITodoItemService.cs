using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoList.Api.Models;

namespace TodoList.Api.Services
{
    public interface ITodoItemService
    {
        Task CreateTodoItemAsync(TodoItem todoItem);
        Task DeleteTodoItemAsync(string id);
        Task<TodoItem> GetTodoItemByIdAsync(string id);
        Task<List<TodoItem>> GetTodoItemsAsync();
        bool TodoItemDescriptionExists(string description);
        Task UpdateTodoItemAsync(Guid guidForId, TodoItem todoItem);
    }
}