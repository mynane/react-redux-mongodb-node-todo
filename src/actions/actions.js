import ajax from 'pajamas';
const apikey = 'e027d5a4941bfd6b452583c4e3c50b89';
let api = '/user/login';
const notDisActions = {
    submitTodo:(dispatch, getState) => {
        let that = notDisActions.submitTodo.value;
        ajax({
            url: api,
            data:{
                mobile: that.userName,
                password: that.password
            },
            type: 'post'
        }).then((data)=>{
            //  dispatch({
            //     type: 'LOAD_TODO',
            //     isLoad: false
            // });
            console.log(getState());
            if(data.errorCode == 0) {
                dispatch({
                    type: 'LOGIN_SHOW_TODO',
                    login: {show: true, showText: "登录成功", succeed: true}
                });
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