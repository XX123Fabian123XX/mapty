import {DOMElements, formatDate, getCyclcingHTMLString, getRunningHTMLString} from "../Utils/utils.js"
class View {

    constructor() {
        this._zoom = 13;
        this.formState = "cadence"
        this.markers = new Map();
    }

    set zoom(zoom) {
        this._zoom = zoom; 
    }


    loadMap(coords) {
        const map = L.map('map').setView([coords.latitude, coords.longitude], this._zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
        
      
        this.map = map;
        return this.map;
    }

    setMarker(coords, date, id)  {
        console.log(date)
        const marker = L.marker([coords.latitude, coords.longitude]).addTo(this.map)
        .bindPopup(date)
        .openPopup();
        this.markers.set(id, marker)
    }

    deleteMarker(id) {
        console.log(id)
        console.log(this.markers)
        console.log(this.markers.get(id))
        this.map.removeLayer(this.markers.get(id))
        this.markers.delete(id)
        
    }

    showForm() {
        DOMElements.get("form").classList.remove("hidden")
    }

    removeForm() {
        DOMElements.get("form").classList.add("hidden")
    }

    switchElevGainAndCadence(switchTo) {
        if (switchTo === "cadence") {
            this.formState = "cadence"
            DOMElements.get("inputCadence").parentNode.classList.remove(DOMElements.get("formRowHidden"))
            DOMElements.get("inputElevation").parentNode.classList.add(DOMElements.get("formRowHidden"));
        } else if (switchTo="elevGain") {
            this.formState = "elevGain"
            DOMElements.get("inputCadence").parentNode.classList.add(DOMElements.get("formRowHidden"))
            DOMElements.get("inputElevation").parentNode.classList.remove(DOMElements.get("formRowHidden"));
        }
    }

    clearForm() {
        ["inputDistance", "inputDuration"].forEach(el => {
            DOMElements.get(el).value = ""
        })
        if (this.formState === "elevGain") {
            DOMElements.get("inputType").value = "running"
            this.switchElevGainAndCadence("cadence")
            DOMElements.get("inputElevation").value = ""
            return;
        } 
        DOMElements.get("inputCadence").value = ""

    }

    getFormInput() {
        const inputValues = {}
        inputValues["distance"] = DOMElements.get("inputDistance").value
        
        inputValues["duration"] = DOMElements.get("inputDuration").value
        
        inputValues["type"] = DOMElements.get("inputType").value
        

        if (inputValues.type == "running") {
            inputValues["cadence"] = DOMElements.get("inputCadence").value
        } else {
            inputValues["elevation"] = DOMElements.get("inputElevation").value
        }
        for(const value of Object.values(inputValues)) {
            if (!value) return null
        }
        return inputValues;

    }


    renderWorkout(workout) {
        console.log(workout)
        const date = formatDate(workout.date)
        let htmlString;
        if (workout.type == "running") {
            console.log(workout.cadence)
            htmlString = getRunningHTMLString(workout.id, date, workout.distance, workout.time, workout.speed, workout.cadence)
        } else {
            htmlString = getCyclcingHTMLString(workout.id,date, workout.distance, workout.time, workout.speed, workout.elevationGain)
        } 
        DOMElements.get("containerWorkouts").insertAdjacentHTML("beforeend", htmlString)
    }

    changeMapFocus(coords) {
        this.map.panTo(new L.LatLng(coords.lat, coords.lng));
    }

    deleteWorkout(dataId) {
        const selection =   document.querySelector(`[data-id="${dataId}"]`);
        console.log(selection)
        selection.remove();
    }

} 

export const view = new View()