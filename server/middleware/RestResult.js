var RestResult = function(){
    this.meta={};
    this.meta.code = RestResult.NO_ERROR;
    this.meta.message = "";
    this.data = {}; 
};  

RestResult.NO_ERROR = 200;//无错误  
RestResult.ILLEGAL_ARGUMENT_ERROR_CODE = 1;//无效参数错误  
RestResult.BUSINESS_ERROR_CODE = 2;//业务错误  
RestResult.AUTH_ERROR_CODE = 3;//认证错误
RestResult.SERVER_EXCEPTION_ERROR_CODE = 5;//服务器未知错误  
RestResult.TARGET_NOT_EXIT_ERROR_CODE = 6;//目标不存在错误  
RestResult.CAPTCHA_CODE_ERROR_CODE = 7; //验证码错误

module.exports = RestResult;  