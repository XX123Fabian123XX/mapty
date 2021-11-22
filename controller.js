'use strict';
// prettier-ignore
import { DOMElements, formatDate, getLocation } from "./Utils/utils.js";
import {view} from "./View/MainView.js"
import { model } from "./Model/MainModel.js";


let lastClickedCoordinates = {}



// initializes the map listener that is triggered when the map is clicked
const initMapListeners = (map) => {
    map.on('click', function(event) {
        // saves the coordinates of the click
        lastClickedCoordinates = event.latlng;
        // shows the form
        view.showForm();
    })
}


const initSubmitFormListener = function() {
    DOMElements.get("form").addEventListener("submit", e => {
        e.preventDefault();
        
        // gets the form input
        const input = view.getFormInput()
        // if it is undefined
        if (!input) return

        // remove and clear the form
        view.removeForm()
        view.clearForm();

        // set the coordinates
        input.coords = lastClickedCoordinates;

        // create a new workout
        const workout = model.addWorkout(input)
        
        // render the workout
        view.renderWorkout(workout)

         // set the marker for the workout
        view.setMarker({lat:lastClickedCoordinates.lat, lng:lastClickedCoordinates.lng}, workout.description, workout.id)
    })
}

// creates an event listener for a click event on the workouts
const initWorkoutListener = () => {
    DOMElements.get("containerWorkouts").addEventListener("click", e => {
        // check if the cross was clicked to delete the item
        const clickedElement = e.target;

        // if  the cross was clicked, search for the cross element
        // if it was not clicked it will be null
        const crossElement = (clickedElement.closest(DOMElements.get("crossClass")))
        if (crossElement) {
            deleteWorkout(crossElement.getAttribute("data-id"))
            return
        }
        // otherwise navigate to the workout on the map
        // lookup the id
        const id = clickedElement.closest(DOMElements.get("workoutClass")).getAttribute("data-id")
        
        // get the coordinates
        const coords = model.getCoordinatesOfWorkout(id)

        if (!coords) {
            console.log("coordinates not found")
            return;
        }
        // change  the map focus
        view.changeMapFocus(coords)
    })
}
// delete the workout
const deleteWorkout = (id) => {
    // delete the workout from the model
    model.deleteWorkout(id)
    // delete marker
    view.deleteMarker(id)
    // delete workout from sidebar
    view.deleteWorkout(id);
}

// load the static data
const loadAndRenderLocalStorageData = function() {
    // gets the workouts from the model
    const workouts = model.loadDataFromLocalStorage();
    // renders every workout
    workouts.forEach(workout => {
        view.renderWorkout(workout)
        view.setMarker(workout.coords, `${workout.type} on ${formatDate(workout.date)}`, workout.id)
    })
}


// function zum initialisieren
const init = async () => {

    // gets the geolocation coordinates from the user
    const coords = await getLocation();
    // loads the map
    const map = view.loadMap(coords)

    loadAndRenderLocalStorageData();

    // used to listen to clicks on the map
    initMapListeners(map)

    // used to listen to changes on the form
    initSubmitFormListener();

    // used to listen to changes on the type input field
    DOMElements.get("inputType").addEventListener("change", view.switchElevGainAndCadence)

    // used for navigating to the destinations
    initWorkoutListener();    
}

init();
