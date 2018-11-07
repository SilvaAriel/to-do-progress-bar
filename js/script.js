
/*TO-DO
- Backup tasks in localstorage.
- Change layout.
*/
'user strict'

let toDoList = {
	all: [],
	state: [],
	done: 0
}

// Bars size
const progressBarContainer = document.querySelector("#progressBarContainer")
const progressBarContainerSize = progressBarContainer.offsetWidth

//Load Saved To-dos
if (toDoList.all[0] === undefined) {
	const savedToDoList = JSON.parse(localStorage.getItem("to-dos"))
	const savedToDoListState = JSON.parse(localStorage.getItem("to-dos-state"))
	if (savedToDoList) {
		toDoList.all = savedToDoList
		for (let i = 0; i < toDoList.all.length; i++) {
			savedToDoListState[i] === true ? toDoList.done ++ : null
			addToPage(toDoList.all[i], savedToDoListState[i])
		}
	}
	createProgressBar()
}

//Save To-dos
function save() {
	localStorage.setItem('to-dos', JSON.stringify(toDoList.all))
	const checkboxes = document.querySelectorAll(".checkBox")
	toDoList.state = []
	for (let i = 0; i < checkboxes.length; i++) {
		toDoList.state.push(checkboxes[i].checked)
	}
	localStorage.setItem("to-dos-state", JSON.stringify(toDoList.state))
}

// Add to-do to array
function addToArray() {
	let text = document.querySelector("input[name='textTodo']").value
	toDoList.all.push(text)
	addToPage(text)
}

// Add to-do to list
function addToPage (text, checkState){
	if (!text) return;
	const toDo = document.querySelector("#toDoList")
	const label = document.createElement('label')
	const input = document.createElement('input')
	input.type = "checkbox"
	input.className = "checkBox"
	checkState == true ? label.className = "checked" : null
	input.checked = checkState
	const toDoText = document.createTextNode(text)
	const a = document.createElement('a')
	a.href = "#"
	a.innerHTML = "x"
	a.className = "deleteButton"
	
	label.appendChild(input)
	label.appendChild(toDoText)
	label.appendChild(a)
	toDo.appendChild(label)

	addDataAttribute()
	createProgressBar()
	document.querySelector("input[name='textTodo']").value = ""
	save()
}

function addDataAttribute() {
	const toDoListContainer = document.querySelector("#toDoList")
	const toDoListContainerLength = toDoListContainer.children.length;
	for (let i = 0; i < toDoListContainerLength; i++) {
		toDoListContainer.children[i].setAttribute("data-index", i);
	}
}

//Create Bars based on toDoList.all
function createProgressBar() {
	progressBarContainer.innerHTML = "";
	const progressDivSize = ((progressBarContainerSize/toDoList.all.length)/progressBarContainerSize)*100;
	for (let i = 0; i < toDoList.all.length; i++){
		const newDiv = document.createElement("div")
		newDiv.className = "barUndone"
		newDiv.style.width = progressDivSize + "%";
		progressBarContainer.appendChild(newDiv)
	}
	progressUpdate()
}

//Progress the bar
function progressUpdate() {
	let checkedBoxes = 0
	const progressBarContainer = document.querySelector("#progressBarContainer")
	const progressBarContainerChildren = progressBarContainer.children;
	for (let i = 0; i < toDoList.done; i++) {
		progressBarContainerChildren[i].className = "barDone"
	}
	percentageUpdate()
}

//Updates the percentage
function percentageUpdate() {
	const percentage = document.querySelector("#progressPercentage")
	const calcPercentage = Math.round((toDoList.done / toDoList.all.length)*100)
	const currentPercentage = toDoList.all.length > 0 ? calcPercentage : 0
	percentage.innerHTML = currentPercentage + "%"
}

//Increase toDoList.done when checkbox checked
function checkboxCheck (e) {
	let progressBarContainer = document.querySelector("#progressBarContainer")
	progressBarContainer.innerHTML = "";
	if (e.target.checked == true) {
		toDoList.done++
		changeColorOnCheck(e)
	} else {
		toDoList.done--
		changeColorOnCheck(e)
	} 
	createProgressBar()
	save()
}

//Delete to-do
function deleteToDo (e) {
	const parentNode = e.path[0].parentNode
	const parentNodeIndex = parentNode.dataset.index
	parentNode.remove()
	toDoList.all.splice(parentNodeIndex, 1)
	if (e.path[1].className == "checked") {
		toDoList.done > 0 ? toDoList.done-- : toDoList.done
	}

	addDataAttribute()
	createProgressBar()
	save()
}

function changeColorOnCheck(e) {
	if (e.path[1].className != "checked") {
		e.path[1].className = "checked"
	} else {
		e.path[1].className = ""
	}
}



// Add events ----------------------------------------------------------------------------
document.getElementById("toDoList").addEventListener('click', function(e){
	if (e.target && e.target.nodeName == 'INPUT') {
		checkboxCheck(e)
	} else if (e.target && e.target.nodeName == 'A') {
		deleteToDo(e)
	}
})

document.getElementById("addToDo").addEventListener('keydown', function(e){
	e.keyCode == 13 ? addToArray() : false
})