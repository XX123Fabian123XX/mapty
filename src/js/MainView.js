import {DOMElements, workoutHtmlString} from "./utils.js"
class View {

    constructor() {
        // initial zoom
        this._zoom = 13;
        // what initial state the form should have
        this.formState = "cadence"
        // creates a map to store the markers
        this.markers = new Map();
    }

    // used to set the zoom
    set zoom(zoom) {
        this._zoom = zoom; 
    }

    // loads the map
    loadMap(coords) {
        const map = L.map('map').setView([coords.latitude, coords.longitude], this._zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
      
        this.map = map;
        return this.map;
    }

    setMarker(coords, date, id)  {
        const marker = L.marker([coords.lat, coords.lng]).addTo(this.map)
        .bindPopup(date)
        .openPopup();
        this.markers.set(id, marker)
    }

    deleteMarker(id) {
        this.map.removeLayer(this.markers.get(parseInt(id)))
        this.markers.delete(id)
    }

    // remove the hidden class from the form
    showForm() {
        DOMElements.get("form").classList.remove("hidden")
    }

    // add the hidden class to remove it again
    removeForm() {
        DOMElements.get("form").style.display='none'
        DOMElements.get("form").classList.add("hidden")
        setTimeout(() => {
            DOMElements.get("form").style.display="grid"
        })
    }

    // switch the form input for cadence and elevation gain in the form
    switchElevGainAndCadence() {
        this.formState = this.formState == "elevGain" ? "cadence" : "elevGain"
        DOMElements.get("inputCadence").parentNode.classList.toggle(DOMElements.get("formRowHidden"))
        DOMElements.get("inputElevation").parentNode.classList.toggle(DOMElements.get("formRowHidden"))

    }

    clearForm() {
        // clears the field for distance and duration
        ["inputDistance", "inputDuration", "inputElevation", "inputCadence"].forEach(el => {
            DOMElements.get(el).value = ""
        })
        // if the input is set to elevGain -> set it to running
        if (this.formState === "elevGain") {
            DOMElements.get("inputType").value = "running"
            this.switchElevGainAndCadence()
            
        } 
    }
    // get the form inputs
    getFormInput() {
        const inputValues = {}
        inputValues["distance"] = parseFloat(DOMElements.get("inputDistance").value)
        
        inputValues["duration"] = parseFloat(DOMElements.get("inputDuration").value)
        
        inputValues["type"] = DOMElements.get("inputType").value
        

        if (inputValues.type == "running") {
            inputValues["cadence"] = parseFloat(DOMElements.get("inputCadence").value)
        } else {
            inputValues["elevGain"] = parseFloat(DOMElements.get("inputElevation").value)
        }
        for(const value of Object.values(inputValues)) {
            // if one of the values is empty or nan, remove nan
            if ((typeof(value) === "number") && value < 0) {   
                return null}
            if (!value && value != 0) return null
        }

        return inputValues;

    }
    // render a workout in the sidebar
    renderWorkout(workout) {   
        // insert the html
        DOMElements.get("form").insertAdjacentHTML("afterend", workoutHtmlString(workout))
    }

    // change the map focus to a new workout
    changeMapFocus(coords) {
        this.map.panTo(new L.LatLng(coords.lat, coords.lng));
    }
    // delete a workout
    deleteWorkout(dataId) {
        const selection =   document.querySelector(`[data-id="${dataId}"]`);
        selection.remove();
    }

} 

export const view = new View()