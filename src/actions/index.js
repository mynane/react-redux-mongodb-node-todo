var actions = {
  
  addTodo: function (text) {
    return {
      type: 'ADD_TODO',
      text: text
    };
  },

  deleteTodo: function (id) {
    return {
      type: 'DELETE_TODO',
      id: id
    };
  },

  completeTodo: function (id) {
    return {
      type: 'COMPLETE_TODO',
      id: id
    };
  },

  changeTodo: function (id) {
    return {
      type: 'CHANGE_TODO',
      id: id
    }
  },

  submitTodo: function (value) {
    return {
      type: 'SUBMIT_TODO',
      value: value
    }
  },

  loadTodo: function (isload) {
    return {
      type: 'LOAD_TODO',
      load: isload
    }
  }

};

module.exports = actions;
