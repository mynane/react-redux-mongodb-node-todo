var getId = function (state) {
  return state.todos.reduce(function (maxId, todo) {
    return Math.max(todo.id, maxId)
  }, -1) + 1;
};

var reducer = function (state, action) {
  switch (action.type) {

    case 'ADD_TODO':
      return Object.assign({}, state, {
        todos: [{
          id: getId(state),
          completed: false,
          text: action.text
        }, ...state.todos]
      });

    case 'DELETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.filter(function (todo) {
          console.log(todo);
          return todo.id !== action.id
        })
      });

    case 'COMPLETE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.map(function (todo) {
          return todo.id === action.id ? 
            Object.assign({}, todo, {completed: !todo.completed}) : 
            todo
        })
      });
    
    case 'CHANGE_TODO':
      return Object.assign({}, state, {
        todos: state.todos.map(function (todo) {
            return todo.id === action.id ? 
              Object.assign({}, todo, {text: 'i`am change'}) : 
              todo
          })
      });

      case 'SUBMIT_TODO':
       return Object.assign({}, state, {
        isLoad: true
      });

      case 'LOAD_TODO':
        return Object.assign({}, state, {
          isLoad: action.isLoad
        });
      
      case 'LOGIN_TODO':
        return Object.assign({}, state, {
          mobile: action.value.mobile
        });
      case 'LOGIN_SHOW_TODO':
        return Object.assign({}, state, {
          login: action.login
        });

      case 'LOGIN_SHOW_HIND_TODO':
        return Object.assign({}, state, {
          login: {show: false, showText: ''}
        });

      case 'LIST_TODO':
        return Object.assign({}, state, {
          list: action.list
        });

      case 'LIST_DETAIL_TODO':
        return Object.assign({},state,{
          detail: action.data.detail,
          files: action.data.files
        });
    default: 
      return state;
  }
};

module.exports = reducer;