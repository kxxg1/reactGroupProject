import React, { useState } from 'react';
import NewTask from './NewTask.js';
import TaskList from './TaskList.js';
import CompletedTasks from './CompletedTasks.js';
import { format, addDays, parseISO } from 'date-fns';
import './App.css';

//let savedData = {}
async function load_html(path){
  return await fetch(path)
    .then(response => {return response.json()})
    .then(data => {return data})//console.log("data = ");//console.log(data);return data})
    .catch(err => {console.log("ERROR: Failed to fetch savedData JSON, Error message = "+ err)})
}
//console.log("length of json keys = "+Object.keys(savedData).length)

let temperatureJson = await load_html("https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m")
//temperatureArray = temperatureJson.hourly.temperature_2m
//timeArray = temperatureJson.hourly.time
//these are two arrays of equal size







///////////////////
//local Storage


  //look for allTasks and completedTasks in local storage
  //loading:
  let myLoadedTasks = JSON.parse(localStorage.getItem("myTasks"))
  if(myLoadedTasks == null){
      console.log("failed to load allTasks")
      myLoadedTasks = []
  }else{
      console.log("suceeded at loading allTasks")
      console.log(myLoadedTasks)
      //setAllTasks(myLoadedTasks)
  }

  let myCompletedTasks = JSON.parse(localStorage.getItem("completedTasks"))
  if(myCompletedTasks == null){
      console.log("failed to load completedTasks")
      myCompletedTasks = []
  }else{
      if(Object.keys(myCompletedTasks).length == 0){
        console.log("failed to load completedTasks 2")
        console.log(myCompletedTasks)
        myCompletedTasks = []
      }
      console.log("suceeded at loading completedTasks")
      console.log(myCompletedTasks)
      //setCompletedTasks(myCompletedTasks)
  }
  //Refresh
  //myCompletedTasks = []

  let myTaskCount = localStorage.getItem("taskCounter")
  if(myTaskCount == null){
      console.log("failed to load taskCount")
      myTaskCount = 1
  }else{
      console.log("suceeded at loading taskCount")
      console.log(myTaskCount)
      myTaskCount = (parseInt(myTaskCount,10))
  }





export default function App() {

  const [allTasks, setAllTasks] = useState(myLoadedTasks);
  const [completedTasks, setCompletedTasks] = useState(myCompletedTasks);
  if (myLoadedTasks.length == 0 && myCompletedTasks.length == 0){
    myTaskCount = 0
  }
  const [taskIdCounter, setTaskIdCounter] = useState(myTaskCount);






  const formatDateTime = (date, time) => {
    const formattedDate = date ? format(parseISO(date), 'MMM do yy') : '';
    const formattedTime = time ? format(parseISO(`1970-01-01T${time}`), 'h:mm a') : '';
    return { formattedDate, formattedTime };
  };

  const addNewTask = (task) => {
    let newTasks = [];
    if (task.isReoccurring) {
      const taskFreqMapMonth = {
        'Daily' : 30,
        'Weekly' : 4,
        'Fortnightly' : 2,
        'Monthly' : 1,
      }
      const taskFreqMapDays = {
        'Daily' : 1,
        'Weekly' : 7,
        'Fortnightly' : 14,
        'Monthly' : 30,
      }

      //const totalOccurrences = parseInt(task.reoccurringDuration, 10) * (task.frequency === 'Fortnightly' ? 2 : 4);
      const totalOccurrences = parseInt(task.reoccurringDuration, 10) * taskFreqMapMonth[task.frequency];
      // console.log("totalOccurances = ", totalOccurrences)
      // console.log("task.reoccurringDuration = ", task.reoccurringDuration)
      // console.log("task.frequency = ", task.frequency)
      for (let i = 0; i < totalOccurrences; i++) {
        //const frequencyOffset = (task.frequency === 'weekly' ? i : i * 2);
        const newDate = addDays(parseISO(task.taskDate), taskFreqMapDays[task.frequency]*i);//used to be addWeeks
        newTasks.push({
          ...task,
          id: taskIdCounter + newTasks.length,
          taskDate: newDate.toISOString().split('T')[0]
        });
      }
      //////WHAT I DID /////////////////////
    //}//This bracket was added since the one below was commented out (COMMENT TO RESTORE TO PREVIOUS VERSION WHEN UNCOMMENTING BELOW)
    ///BELOW HAS BEEN COMMENTED OUT
    //seems this was meant to be part of if( isReOccuring){} but wasnt in the right spot
    // removed so we do with an object instead
    // } else if (task.frequency === 'daily') {
    //   for (let i = 0; i < task.reoccurringDuration; i++) {
    //     const newDate = addWeeks(parseISO(task.taskDate), i * 30);
    //     newTasks.push({
    //       ...task,
    //       id: taskIdCounter + newTasks.length,
    //       taskDate: newDate.toISOString().split('T')[0]
    //     });
    //   }
    } else {
      newTasks.push({ ...task, id: taskIdCounter });
    }
    //////////////////////////////////////////

    const myNewTasks = [...allTasks, ...newTasks]
    setAllTasks(myNewTasks);
    localStorage.setItem("myTasks", JSON.stringify(myNewTasks));
    const newCount = taskIdCounter + newTasks.length
    setTaskIdCounter(newCount);
    localStorage.setItem("taskCounter", String(newCount));
  };

  const handleDelete = (taskIdToRemove) => {
    const newTasks = allTasks.filter(task => task.id !== taskIdToRemove)
    setAllTasks(newTasks);
    localStorage.setItem("myTasks", JSON.stringify(newTasks));
  };

  const markComplete = (taskId) => {
    const completedTask = allTasks.find(task => task.id === taskId);
    if (completedTask) {
      console.log(`Task completed: ${completedTask.title}`);
      const newCompleteTasks = [...completedTasks, { ...completedTask, status: 'closed' }]
      setCompletedTasks(newCompleteTasks);
      localStorage.setItem("completedTasks", JSON.stringify(newCompleteTasks));
      
      const newTasks = allTasks.filter(task => task.id !== taskId)
      setAllTasks(newTasks);
      localStorage.setItem("myTasks", JSON.stringify(newTasks));
    }
  };

  const handleEdit = (selectedTask) => {
    // console.log("handleEdit function in app.jsx")
    // console.log("(selectedTask = ")
    // console.log(selectedTask)
    const newTasks = allTasks.map((task) => {
      if (String(task.id) === String(selectedTask.id)) {
        //console.log("found selected task")
        return selectedTask;
      }
      return task;
    });
    // console.log("newTasks = ")
    // console.log(newTasks)
    setAllTasks(newTasks)
    localStorage.setItem("myTasks", JSON.stringify(newTasks));
  }



  //Weather stuff
  function getTempJSX(){
    let jsxArray = []
    const tempArray = temperatureJson.hourly.temperature_2m
    const timeArray = temperatureJson.hourly.time
    
    for(let index =0 ; index<timeArray.length ; index++){
      const Tdex = timeArray[index].indexOf("T")
      const colonDex = timeArray[index].indexOf(":",Tdex)
      const timeStr = timeArray[index].substring(Tdex+1,colonDex)
      const timeMilli = Date.now() + 1000*60*60*parseInt(timeStr,10)
      const timeThen = new Date(timeMilli)
      //console.log(timeThen)
      const newColonDex = String(timeThen).lastIndexOf(":")//backwards
      const actualTimeStr = String(timeThen).substring(0,newColonDex)
      let jsxElement = (
      <div className="temp-element" key={"tmp"+index}>
        <p>{actualTimeStr}</p>
        <p>{tempArray[index] + "°C"}</p>
      </div>
      )
      jsxArray.push(jsxElement)
    }
    return jsxArray
  }
  let tempJSX = getTempJSX()



  //daily-temp-div is where I put the weather stuff
  return (
    <div className="app-container">
      <div id="daily-temp-div">
        {tempJSX}
      </div>
      <div className="main-content">
        <h1 className="tasks-title">New Tasks</h1>
        <NewTask addNewTask={addNewTask} />
        <TaskList tasks={allTasks.map(task => ({ ...task, ...formatDateTime(task.taskDate, task.taskTime) }))} handleDelete={handleDelete} markComplete={markComplete} handleEdit={handleEdit} />
      </div>
      <div className="completed-tasks-section">
        <h1 className="completed-tasks-title">Completed Tasks</h1>
        <CompletedTasks completedTasks={completedTasks.map(task => ({ ...task, ...formatDateTime(task.taskDate, task.taskTime) }))} />
      </div>
    </div>
  );
}


//on each task we need an edit button


// open meteo has a free non commercial API for weather
// e.g. https://api.open-meteo.com/v1/forecast?latitude=-33.87&longitude=151.21&hourly=temperature_2m
// gives us a JSON
//so we just need to put in sydney latitude and longitude

//first step is forecast just today