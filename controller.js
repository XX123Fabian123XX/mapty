'use strict';
// prettier-ignore
import { DOMElements, formatDate } from "./Utils/utils.js";
import {view} from "./View/MainView.js"
import { model } from "./Model/MainModel.js";


let lastClickedCoordinates = {}

const getLocation = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((success) => {
            const {latitude, longitude} = success.coords;
            resolve({latitude, longitude})
        }, error => {
            reject(error)
        })
    })
}

const initMapListeners = (map) => {
    map.on('click', function(event) {
        lastClickedCoordinates = event.latlng;
        // open up the form in the sidebar
        view.showForm();

    })
}

const initFormListener = function() {
    DOMElements.get("inputType").addEventListener("click", event => {
        if (event.target.value === "running") {
            view.switchElevGainAndCadence("cadence")
        } else if (event.target.value === "cycling") {
            view.switchElevGainAndCadence("elevGain")
        }
    })

    DOMElements.get("form").addEventListener("submit", e => {
        e.preventDefault();
        const input = view.getFormInput()
        if (!input) return
        view.removeForm()
        view.clearForm();
        let workout;
        if (input.type === "running") {
            workout = model.addRunningWorkout(input.duration, input.distance, lastClickedCoordinates, input.cadence)   
        } else {
            workout = model.addCyclingWorkout(input.duration, input.distance, lastClickedCoordinates, input.elevation)
        }
        view.renderWorkout(workout)
         // set the marker
        console.log(workout)
        view.setMarker({latitude:lastClickedCoordinates.lat, longitude:lastClickedCoordinates.lng}, `${workout.type} on ${formatDate(workout.date)}`, `${workout.type}-${workout.id}`)
    })
}

const initWorkoutListener = () => {
    DOMElements.get("containerWorkouts").addEventListener("click", e => {
        let dataId;
        // element should be deleted
        const classList = Array.from(e.target.classList);
        if (classList.includes(DOMElements.get("cross")) || classList.includes(DOMElements.get("cross-bar"))) {
            const parentElement = e.target.parentNode
            let dataId;
            if (parentElement.getAttribute("data-id")) {
                dataId = parentElement.getAttribute("data-id")
            } else {
                dataId = parentElement.parentNode.getAttribute("data-id")
            }

            const [type, id] = dataId.split("-")
            model.deleteWorkout(type, id)
            view.deleteMarker(dataId)
            view.deleteWorkout(dataId);
            return;
        }
        else if (e.target.getAttribute('data-id')) {
            dataId = e.target.getAttribute('data-id')
        } else if (e.target.parentNode.getAttribute('data-id')) {
            dataId = e.target.parentNode.getAttribute('data-id')
        } else if (e.target.parentNode.parentNode.getAttribute('data-id')) {
            dataId = e.target.parentNode.parentNode.getAttribute('data-id')
        } else {
            return
        }

        const [type, id ] = dataId.split("-")
        const coords = model.getCoordinatesOfWorkout(type,id)

        if (!coords) {
            console.log("coordinates not found")
            return;
        }

        view.changeMapFocus(coords)
    })
}

const loadStaticData = function() {
    const data = model.loadDataFromLocalStorage();
    if (!data.cyclingWorkouts && !data.runningWorkouts) return;
        const displayWorkout = (view) =>{
            view.renderWorkout(workout)
            view.setMarker({latitude:lastClickedCoordinates.lat, longitude:lastClickedCoordinates.lng}, `${workout.type} on ${formatDate(workout.date)}`, `${workout.type}-${workout.id}`)
        }
    // every workout has to be rendered to the sidebar and to the map
    data.cyclingWorkouts.forEach(displayWorkout)
    data.runningWorkouts.forEach(displayWorkout) 
}


// function zum initialisieren
const init = async () => {

    // gets the geolocation coordinates from the user
    const coords = await getLocation();
    // loads the map
    const map = view.loadMap(coords)

    loadStaticData();

    // used to listen to clicks on the map
    initMapListeners(map)

    // used to listen to changes on the form
    initFormListener()

    // used for navigating to the destinations
    initWorkoutListener();
}

init();
