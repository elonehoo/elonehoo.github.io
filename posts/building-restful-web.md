---
title: Spring Boot - 构建 RESTful Web 服务
date: 2022-02-26
author: Elone Hoo
twitter: '@huchengye'
---

浏览了大部分的教程，发现并没有任何一篇教程提到 `ResponseEntity` 作为返回值，都是使用了自己创建一个 `Result` 类，这样也可以算是成为了 Restful 的返回值了吗？



我发出了一个疑惑？那这样的还算是一个正常的返回值了吗？

---

## 绝大部分

我随意的复制了一个点赞最高的[博客](https://blog.csdn.net/aiyaya_/article/details/78209992)

创建了一个 `Result` 和 `ResultCode` 类

代码如下

```java
import lombok.Data;
import java.io.Serializable;

@Data
public class Result implements Serializable {

	private static final long serialVersionUID = -3948389268046368059L;

	private Integer code;

	private String msg;

	private Object data;

	public Result() {}

	public Result(Integer code, String msg) {
		this.code = code;
		this.msg = msg;
	}

	public static Result success() {
		Result result = new Result();
		result.setResultCode(ResultCode.SUCCESS);
		return result;
	}

	public static Result success(Object data) {
		Result result = new Result();
		result.setResultCode(ResultCode.SUCCESS);
		result.setData(data);
		return result;
	}

	public static Result failure(ResultCode resultCode) {
		Result result = new Result();
		result.setResultCode(resultCode);
		return result;
	}

	public static Result failure(ResultCode resultCode, Object data) {
		Result result = new Result();
		result.setResultCode(resultCode);
		result.setData(data);
		return result;
	}

	public void setResultCode(ResultCode code) {
		this.code = code.code();
		this.msg = code.message();
	}
}
```

```java
public enum ResultCode {

	/* 成功状态码 */
	SUCCESS(1, "成功"),

	/* 参数错误：10001-19999 */
	PARAM_IS_INVALID(10001, "参数无效"),
	PARAM_IS_BLANK(10002, "参数为空"),
	PARAM_TYPE_BIND_ERROR(10003, "参数类型错误"),
	PARAM_NOT_COMPLETE(10004, "参数缺失"),

	/* 用户错误：20001-29999*/
	USER_NOT_LOGGED_IN(20001, "用户未登录"),
	USER_LOGIN_ERROR(20002, "账号不存在或密码错误"),
	USER_ACCOUNT_FORBIDDEN(20003, "账号已被禁用"),
	USER_NOT_EXIST(20004, "用户不存在"),
	USER_HAS_EXISTED(20005, "用户已存在"),

	/* 业务错误：30001-39999 */
	SPECIFIED_QUESTIONED_USER_NOT_EXIST(30001, "某业务出现问题"),

	/* 系统错误：40001-49999 */
	SYSTEM_INNER_ERROR(40001, "系统繁忙，请稍后重试"),

	/* 数据错误：50001-599999 */
	RESULE_DATA_NONE(50001, "数据未找到"),
	DATA_IS_WRONG(50002, "数据有误"),
	DATA_ALREADY_EXISTED(50003, "数据已存在"),

	/* 接口错误：60001-69999 */
	INTERFACE_INNER_INVOKE_ERROR(60001, "内部系统接口调用异常"),
	INTERFACE_OUTTER_INVOKE_ERROR(60002, "外部系统接口调用异常"),
	INTERFACE_FORBID_VISIT(60003, "该接口禁止访问"),
	INTERFACE_ADDRESS_INVALID(60004, "接口地址无效"),
	INTERFACE_REQUEST_TIMEOUT(60005, "接口请求超时"),
	INTERFACE_EXCEED_LOAD(60006, "接口负载过高"),

	/* 权限错误：70001-79999 */
	PERMISSION_NO_ACCESS(70001, "无访问权限");

	private Integer code;

	private String message;

	ResultCode(Integer code, String message) {
		this.code = code;
		this.message = message;
	}

	public Integer code() {
		return this.code;
	}

	public String message() {
		return this.message;
	}

	public static String getMessage(String name) {
		for (ResultCode item : ResultCode.values()) {
			if (item.name().equals(name)) {
				return item.message;
			}
		}
		return name;
	}
	public static Integer getCode(String name) {
		for (ResultCode item : ResultCode.values()) {
			if (item.name().equals(name)) {
				return item.code;
			}
		}
		return null;
	}

	@Override
	public String toString() {
		return this.name();
	}
}

```

并且编写了一个简单的demo

```java
@GetMapping("/demo2")
public Result demo2(){
  List<String> list = new ArrayList<>();
	for (int i = 0; i < 10; i++){
		list.add(String.valueOf(i));
	}
	Result result = new Result();
	result.setResultCode(ResultCode.DATA_IS_WRONG);
	result.setData(list);
  return result;
}
```

我们来看一下浏览器的结果

![01.png](/public/building-restful-web/01.png)

## 使用 `ResponseEntity` 

```java
@GetMapping("/demo")
public ResponseEntity<Object> demo(){
	List<String> list = new ArrayList<>();
	for (int i = 0; i < 10; i++){
		list.add(String.valueOf(i));
	}
	return new ResponseEntity<>(list, HttpStatus.INTERNAL_SERVER_ERROR);
}
```

结果如下

![02.png](/public/building-restful-web/02.png)

## 结论

高下立判。