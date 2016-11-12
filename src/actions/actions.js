import ajax from 'pajamas';
const apikey = 'e027d5a4941bfd6b452583c4e3c50b89';
let api = 'http://localhost:3000/login';
const notDisActions = {
    submitTodo:(dispatch, getState) => {
        let that = notDisActions.submitTodo.value;
        console.log(that);
        ajax({
            url: api,
            data:{
                mobile: that.userName,
                password: that.password
            },
            type: 'post'
        }).then((data)=>{
            console.log(data);
            if(data.errorCode == 0) {
                dispatch([{
                    type: 'LOGIN_TODO',
                    value: data.returnValue
                },{
                    type: 'LOGIN_SHOW_TODO',
                    login: {show: true, showText: "登录成功"}
                }]);
            }
            else {
                dispatch({
                    type: 'LOGIN_SHOW_TODO',
                    login: {show: true, showText: data.errorReason}
                });
            }
        }).catch((err) => {
            console.log(err);
        })
    }
};

export default notDisActions;