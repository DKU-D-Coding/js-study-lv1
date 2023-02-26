import Component from "./Component.js";
import Title from "./components/Title.js";
import AddForm from "./components/AddForm.js";
import TodoList from "./components/TodoList.js";
import { CONTAINER } from "./constants/_index.js";

class App extends Component {
  initState() {
    return {
      todos: [],
      editing: null,
    };
  }
  html() {
    return `
      <header id="${CONTAINER.TITLE}">${Title()}</header>
      <div id="${CONTAINER.ADD_FORM}"></div>
      <ul id="${CONTAINER.TODO_LIST}"></ul>
    `;
  }
  mounted() {
    const { todos, editing } = this.state;

    console.log(todos);

    new AddForm($app.querySelector(`#${CONTAINER.ADD_FORM}`), {
      addTodo: this.addTodo.bind(this),
    });
    new TodoList($app.querySelector(`#${CONTAINER.TODO_LIST}`), {
      todos,
      editing,
      deleteTodo: this.deleteTodo.bind(this),
      toggleTodo: this.toggleTodo.bind(this),
      editTodo: this.editTodo.bind(this),
      startEditing: this.startEditing.bind(this),
    });
  }
  findTodo(todoId) {
    const { todos } = this.state;
    const todoIndex = todos.findIndex((value) => value.id === todoId);
    const todo = todos.find((value) => value.id === todoId);
    return { todo, index: todos[todoIndex] };
  }
  addTodo(content) {
    const newTodo = {
      content,
      id: Date.now(),
      done: false,
    };
    this.setState({ todos: [...this.state.todos, newTodo] });
  }
  deleteTodo(todoId) {
    this.setState({
      todos: this.state.todos.filter((value) => value.id !== todoId),
    });
  }
  toggleTodo(todoId) {
    const found = this.findTodo(todoId);
    const oldTodo = found.todo;
    const newTodo = {
      ...oldTodo,
      done: !oldTodo.done,
    };

    const todos = [...this.state.todos];
    todos.splice(found.index, 1, newTodo);
    this.setState({ todos: todos });
  }
  editTodo(content) {
    const { todos, editing } = this.state;
    const newTodo = {
      ...editing,
      content,
    };

    const newTodos = [...todos];
    newTodos.splice(this.findTodo(editing.id).index, 1, newTodo);

    this.setState({ editing: null, todos: newTodos });
  }
  startEditing(todoId) {
    const editingTodo = this.findTodo(todoId).todo;
    this.setState({ editing: editingTodo });
  }
}

const $app = document.querySelector("#App");
new App($app);
