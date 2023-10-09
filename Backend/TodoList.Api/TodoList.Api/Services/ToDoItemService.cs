using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodoList.Api.Services
{

    public class TodoItemService : ITodoItemService
    {
        private readonly TodoContext _context;

        public TodoItemService(TodoContext context)
        {
            _context = context;
        }

        public async Task<List<TodoItem>> GetTodoItemsAsync()
        {
            return await _context.TodoItems.Where(x => !x.IsCompleted).ToListAsync();
        }

        public async Task<TodoItem> GetTodoItemByIdAsync(string id)
        {
            try
            {
                var guidForId = new Guid(id);
                return await _context.TodoItems.FindAsync(guidForId);
            } catch
            {
                return null;
            }
        }

        public async Task CreateTodoItemAsync(TodoItem todoItem)
        {
            _context.TodoItems.Add(todoItem);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateTodoItemAsync(Guid guidForId, TodoItem todoItem)
        {
            _context.Entry(todoItem).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw;
            }
            await _context.SaveChangesAsync();
        }

        public async Task DeleteTodoItemAsync(string id)
        {
            var guidForId = new Guid(id);

            var todoItem = await _context.TodoItems.FindAsync(guidForId);
            if (todoItem != null)
            {
                _context.TodoItems.Remove(todoItem);
                await _context.SaveChangesAsync();
            }
        }

        private bool TodoItemIdExists(Guid id)
        {
            return _context.TodoItems.Any(x => x.Id == id);
        }

        public bool TodoItemDescriptionExists(string description)
        {
            return _context.TodoItems
                   .Any(x => x.Description.ToLowerInvariant() == description.Trim().ToLowerInvariant() && !x.IsCompleted);
        }
    }
}
