// Variables

const deleteBtn = document.querySelectorAll('.fa-trash')
const item = document.querySelectorAll('.item span')
const itemCompleted = document.querySelectorAll('.item span.completed')
const startBtn = document.querySelector('#start')
const sessionValue = document.querySelectorAll('.sessionValue')
const reset = document.querySelector('#reset')

let isRunning = false, count = 0, startTime = 0 , currentTime = 0, elapsedTime = 0, stopTime, 
totalMinute,clockInterval, hours, remainder = 0, minutes = 0, seconds = 0, formattedTime = 0;

// Event Listeners
reset.addEventListener('click', reSet)
startBtn.addEventListener('click', twentyFiveMinutesTimer)
// document.querySelector('p').addEventListener('onchange', fiveMinutesBreakTimer)

Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})



// Request Data from API

// A Delete request
async function deleteItem(){
    const itemText = this.parentNode.childNodes[1].innerText
    console.log(itemText)
    try{
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
        const data = await response.json()
        location.reload()

    }catch(err){
        console.log(err)
    }
}


// An Update request
async function markComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
  
    const totalPomoCount = document.querySelector('.sessionValue')
               totalPomoCount.innerText = count

    try{
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText,
               'pomoValue': totalPomoCount.innerText
               

            })
          })
          
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}


// Update request marking todo list uncomplete
async function markUnComplete(){
    const itemText = this.parentNode.childNodes[1].innerText
    const totalPomoCount = document.querySelector('.sessionValue').innerText
    
    try{
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText,
                'pomoValue': totalPomoCount
            })
          })
        const data = await response.json()
        console.log(data)
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// Leading zero
function add_leading_zero(number){
    if(number < 10) {
        return "0" + number.toString();
    } else {
        return number.toString();
    }
}

//....... Pomodoro Timers......//

// ---- Twenty five minutes

function twentyFiveMinutesTimer(){
    if (!isRunning) {
        // start the clock
        isRunning = true;

        if (elapsedTime == 0) {
            startTime = new Date().getTime();

        } else {
            startTime = new Date().getTime() - elapsedTime;
            console.log(startTime)
        }

        clockInterval = window.setInterval(function(){

            currentTime = new Date().getTime();
            elapsedTime = currentTime - startTime;
            
            // milliseconds per hour is 3600000
            hours = Math.floor(elapsedTime / 3600000);
            remainder = elapsedTime - (hours * 3600000);

            // milliseconds per minute is 60000
            minutes = Math.floor(remainder / 60000);
            remainder -= (minutes * 60000);

            // milliseconds per second is 1000
            seconds = Math.floor(remainder / 1000);
            remainder -= (seconds * 1000);

            let formattedMinutes = parseInt(minutes)
            let formattedSeconds = parseInt(seconds)
            
            if( formattedMinutes == 25 ){
                                               
                // announce the end of pomodoro
                count += 1
               
                //Insert Values into the dom
                document.querySelector('p').innerHTML = 'BREAK'
                document.querySelector('.sessionValue').innerHTML = counts
                document.querySelector('.countdownSeconds').innerHTML = add_leading_zero(formattedSeconds)
                document.querySelector('.countdownMinutes').innerHTML = add_leading_zero(formattedMinutes)

                // Clear the clock interval
                window.clearInterval(clockInterval)

                //Start Five Minutes break after every pomodoro session ends
                fiveMinutesBreakTimer()
                elapsedTime = 0
                isRunning = false
                                
            }else{
                document.querySelector('.countdownSeconds').innerHTML = add_leading_zero(formattedSeconds)
                document.querySelector('.countdownMinutes').innerHTML = add_leading_zero(formattedMinutes)
                document.querySelector('.sessionValue').innerHTML = counts
            }
            
        },1000);

    } else {

        // stop the clock
        window.clearInterval(clockInterval);
        isRunning = false;

    }
}

// Variables

let running = false, counts = 0, startBreakTime = 0 , currentTimeonBreak = 0, elapsedBreakTime = 0, stopTimeBreak, 
clockIntervalBreak, hoursBreak, remainderBreak = 0, minutesBreak = 0, secondsBreak = 0, formattedTimeBreak = 0;

// Five minutes functions

function fiveMinutesBreakTimer(){
    if (!running) {
        // start the clock
        running = true;

        if (elapsedBreakTime == 0) {
            startBreakTime = new Date().getTime();

        } else {
            startBreakTime = new Date().getTime() - elapsedBreakTime;
            console.log(startBreakTime)
        }

        clockIntervalBreak = window.setInterval(function(){

            currentTimeonBreak = new Date().getTime();
            elapsedBreakTime = currentTimeonBreak - startBreakTime;

            // per hour 3600000
            // per minute 60000
            // per second 1000
            hoursBreak = Math.floor(elapsedBreakTime / 3600000);
            remainderBreak = elapsedBreakTime - (hoursBreak * 3600000);

            minutesBreak = Math.floor(remainderBreak / 60000);
            remainderBreak -= (minutesBreak * 60000);

            secondsBreak = Math.floor(remainderBreak / 1000);
            remainderBreak -= (secondsBreak * 1000);

            
            let formattedBreakMinutes = parseInt(minutesBreak)
            let formattedBreakSeconds = parseInt(secondsBreak)
            // console.log(formattedBreakSeconds)

            if( formattedBreakMinutes == 5 ){
               
                counts += 1
               document.querySelector('.sessionValue').innerHTML = counts
               document.querySelector('.countdownSeconds').innerHTML = add_leading_zero(formattedBreakSeconds)
                document.querySelector('.countdownMinutes').innerHTML = add_leading_zero(formattedBreakMinutes)
                 // announce the end of break
                document.querySelector('p').innerHTML = 'BREAK OVER'
               
                // clear the time interval
                elapsedBreakTime = 0
                window.clearInterval(clockIntervalBreak)
                running = false
                
                
            }else{
                document.querySelector('.sessionValue').innerHTML = counts
                document.querySelector('.countdownSeconds').innerHTML = add_leading_zero(formattedBreakSeconds)
                document.querySelector('.countdownMinutes').innerHTML = add_leading_zero(formattedBreakMinutes)
            
            }
            
        },1000);

    } else {
        // stop the clock
        window.clearInterval(clockIntervalBreak);
        running = false;
    }
}

// Timer reset
function reSet() {

    startTime = new Date().getTime();
    if (!running && !isRunning) {
        elapsedTime = 0;
        document.querySelector('.countdownMinutes').innerHTML = "00";
        document.querySelector('.countdownSeconds').innerHTML = "00"
    }
}
