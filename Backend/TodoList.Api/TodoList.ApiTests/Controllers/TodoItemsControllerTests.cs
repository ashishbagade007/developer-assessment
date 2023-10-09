using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.Collections.Generic;
using System.Linq;
using Moq;
using TodoList.Api.Services;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace TodoList.Api.Controllers.Tests
{
    [TestClass()]
    public class TodoItemsControllerTests
    {
        private readonly TodoContext _dbContext;
        private readonly TodoItemsController _controller;
        private readonly List<TodoItem> items =
            new List<TodoItem>()
            {
                new TodoItem { Id = new Guid(), Description = "item1", IsCompleted = false },
                new TodoItem { Id = new Guid(), Description = "item2", IsCompleted = true },
                new TodoItem { Id = new Guid(), Description = "item3", IsCompleted = false }
            };

        public TodoItemsControllerTests()
        {
            // In your test setup
            var serviceProvider = new ServiceCollection().AddEntityFrameworkInMemoryDatabase().BuildServiceProvider();

            var builder = new DbContextOptionsBuilder<TodoContext>()
                .UseInMemoryDatabase(databaseName: "InMemoryDatabase")
                .UseInternalServiceProvider(serviceProvider);

            _dbContext = new TodoContext(builder.Options);

            // Seed the in-memory database with test data
            SeedTestData(_dbContext);

            var loggerMock = new Mock<ILogger<TodoItemsController>>();
            var todoItemService = new TodoItemService(_dbContext);

            _controller = new TodoItemsController(_dbContext, loggerMock.Object, todoItemService);
        }

        private void SeedTestData(TodoContext dbContext)
        {
            // Add test data to the in-memory database
            dbContext.TodoItems.AddRange(items);
            dbContext.SaveChanges();
        }

        [TestMethod()]
        public async Task GetTodoItemsTest()
        {
            // Act
            var result = await _controller.GetTodoItems();
            var okResult = (OkObjectResult)result;
            var items = (List<TodoItem>)okResult.Value; // Cast the Value property to your object type

            // Assert that isComplteted false is not selected
            Assert.AreEqual(2, items.Count);
        }

        [TestMethod()]
        public async Task GetSingleTodoItemTest()
        {
            // Act
            var result = await _controller.GetTodoItems();
            var okResult = (OkObjectResult)result;
            var items = (List<TodoItem>)okResult.Value;

            // Assert that isComplteted false is not selected
            Assert.IsNotNull(items.First().Id);

            result = await _controller.GetTodoItem(items.First().Id.ToString());
            okResult = (OkObjectResult)result;
            var item = (TodoItem)okResult.Value;

            Assert.AreEqual("item1", item.Description);
        }

        [TestMethod()]
        public async Task GetSingleTodoItemTest_failure_nonexisting()
        {
            var result = await _controller.GetTodoItem("xyz");
            Assert.IsNotNull((NotFoundResult)result);
        }

        [TestMethod()]
        public async Task PostTodoItemTest()
        {
            // Act
            var item = new TodoItem() { Id = new Guid(), Description = "item4", IsCompleted = false };
            var result = await _controller.PostTodoItem(item);
            var createdAtActionResult = (CreatedAtActionResult)result;

            var itemResult = (TodoItem)createdAtActionResult.Value;
            // Assert that isComplteted false is not selected
            Assert.IsNotNull(itemResult);
            Assert.AreEqual("item4", itemResult.Description);
        }

        [TestMethod()]
        public async Task PostTodoItemTest_failure_description_exists()
        {
            // Act
            var item = new TodoItem() { Id = new Guid(), Description = "item1", IsCompleted = false };
            var result = await _controller.PostTodoItem(item);
            var badRequestResult = (BadRequestObjectResult)result;

            // Assert that isComplteted false is not selected
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("Description already exists", badRequestResult.Value);
        }

        [TestMethod()]
        public async Task PostTodoItemTest_failure_description_empty()
        {
            // Act
            var item = new TodoItem() { Id = new Guid(), Description = "", IsCompleted = false };
            var result = await _controller.PostTodoItem(item);
            var badRequestResult = (BadRequestObjectResult)result;

            // Assert that isComplteted false is not selected
            Assert.IsNotNull(badRequestResult);
            Assert.AreEqual(400, badRequestResult.StatusCode);
            Assert.AreEqual("Description is required", badRequestResult.Value);
        }

        [TestMethod()]
        public async Task PutTodoItemTest_NotFound()
        {
            // Act
            var item = new TodoItem() { Id = items.First().Id, Description = "item88", IsCompleted = false };
            var result = await _controller.PutTodoItem(item.Id.ToString(), item);
            var notFoundResult = (NotFoundResult)result;

            Assert.IsNotNull(notFoundResult);
        }

        [TestMethod()]
        public async Task PutTodoItemTest_BadRequest()
        {
            // Act
            var item = new TodoItem() { Id = items.First().Id, Description = "item1", IsCompleted = false };
            var result = await _controller.PutTodoItem("xyz", item);
            var badRequestResult = (BadRequestResult)result;

            Assert.IsNotNull(badRequestResult);
        }

        [TestMethod()]
        public async Task PutTodoItemTest_BadRequest_NonMatching_Guid()
        {
            // Act
            var item = new TodoItem() { Id = items[1].Id, Description = "item1", IsCompleted = false };
            var result = await _controller.PutTodoItem(items[0].Id.ToString(), item);
            var badRequestResult = (BadRequestResult)result;

            Assert.IsNotNull(badRequestResult);
        }
    }
}