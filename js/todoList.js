const addButton = e("#addButton")
const todoContainer = e("#container")
const todoInput = e("#inputTodo")
const todoEdit = e(".todoEdit")

//设置模板HTML，输入一个todo参数返回一个todo cell的HTML字符串
const templateTodo = todo => {
    var t = `
        <div class="todoCell">
            <button class="todoEdit">编辑</button>
            <button class="todoDone">完成</button>
            <button class="todoDelete" >删除</button>
            <!--contenteditable属性使标签可编辑-->
            <span class="todoTask">
                ${todo}
            </span>
        </div>
        `
    return t
}
//拿到保存在 lacalstorage 的todos
const loadTodos = () => {
    var s = localStorage["savedTodos"]
    var ts = JSON.parse(s)
    return ts
}
//载入todoList
const insertTodos = todos => {
    for (let i = 0; i < todos.length; i++) {
        var todo = todos[i]
        var html = templateTodo(todo)
        todoContainer.insertAdjacentHTML("beforeend", html)
    }
}
//保存todo
const saveTodo = todo => {
    var todos = localStorage["savedTodos"]
    todos = JSON.parse(todos)
    todos.push(todo)
    var s = JSON.stringify(todos)
    localStorage["savedTodos"] = s
}
//添加todoList
const addTodo = () => {
    addButton.addEventListener("click", function( ){
        var todo = todoInput.value
        saveTodo(todo)
        var html = templateTodo(todo)
        todoContainer.insertAdjacentHTML("beforeend", html)
    })
}
//完成或者删除todo
const todoDoneDelete = () =>{
    todoContainer.addEventListener("click", function (event) {
        var self = event.target
        //完成
        if (self.classList.contains("todoDone")) {
            var todoCell = self.closest(".todoCell")
            var todoTask = todoCell.querySelector(".todoTask")
            todoTask.classList.toggle("done")
        //删除
        } else if (self.classList.contains("todoDelete")) {
            var todoCell = self.closest(".todoCell")
            for (var i = 0; i < todoContainer.children.length; i++) {
                var cell = todoContainer.children[i]
                if (todoCell == cell) {
                    todoCell.remove()
                    var todos = loadTodos()
                    todos.splice(i, 1)
                    var s = JSON.stringify(todos)
                    localStorage["savedTodos"] = s
                }
            }
        }
    })
}
//编辑todo
const todoUpdate = () => {
    todoContainer.addEventListener("click", function(event) {
        var self = event.target
        if (self.classList.contains("todoEdit")) {
            var todoCell = self.closest(".todoCell")
            var todoTask = todoCell.querySelector(".todoTask")
            //这里必须是可编辑，才能聚焦
            todoTask.contentEditable = true
            todoTask.focus()
            //按下回车键，内容完成编辑，数据同步更新
            todoContainer.addEventListener("keydown", function (event) {
                //var self = event.target
                if (event.key == "Enter") {
                    //阻止浏览器默认事件
                    event.preventDefault()
                    todoTask.contentEditable = false
                    //把数据更新在localstorage
                    for (var i = 0; i < todoContainer.children.length; i++) {
                        var cell = todoContainer.children[i]
                        if (todoCell == cell) {
                            //找到所有存储在localstorage的数据
                            var todos = loadTodos()
                            //当前编辑后的内容
                            //此处获取值不能用todoTask.value,因为是已经存在的值，所以需要用todoTask.innerText
                            var task = todoTask.innerText
                            todos[i] = task
                            var s = JSON.stringify(todos)
                            localStorage["savedTodos"] = s
                        }
                    }
                }
            })
        }
    })

}
//唯一函数入口
const main = () => {
    var todos = loadTodos()
    insertTodos(todos)
    addTodo()
    todoDoneDelete()
    todoUpdate()
}
main()