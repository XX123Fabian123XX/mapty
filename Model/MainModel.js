import {months} from "../Utils/utils.js"

// workout model
class Workout {    
    constructor(id,duration,distance, type, coords) {
        this.duration = duration;
        this.distance = distance;
        this.type = type;
        this.coords = coords;
        this.id = id;
        this.date = new Date();
        this.setDescription();
        
    }

    setDescription() {
        const month = months[this.date.getMonth()]
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${month} ${this.date.getDate()}`;
    }

}

class Cycling extends Workout {
    constructor(id,duration,distance, coords, elevationGain) {
        super(id, duration, distance, "cycling", coords);
        this.elevationGain = elevationGain;
        this.calculateSpeed();
    }

    calculateSpeed() {
        // km / h
        this.speed =  Math.round((this.distance / (this.duration / 60)) * 100) / 100
    }
}

class Running extends Workout {
    constructor(id, duration, distance, coords, cadence) {
        super(id, duration, distance, "running", coords)
        this.cadence = cadence;
        this.calculatePace()
    }

    calculatePace() {
        // min/km
        this.speed = Math.round((this.duration / this.distance) * 100) / 100 
    }
}

class Model {
    constructor() {
        this.workouts = []
    }

    // save all of the workouts in local storage
    saveInLocalStorage() {
        window.localStorage.setItem('workouts', JSON.stringify(this.workouts))
    }
    // load all the data from local storage
    loadDataFromLocalStorage() {
        const workouts = JSON.parse(window.localStorage.getItem('workouts'))

        if (workouts) {
            workouts.forEach(el => {
                el.date = new Date(el.date)
            })
            this.workouts.push(...workouts)
        }


        return this.workouts;
    }
    // the the id of the next workout
    // the next id will be the id of the last element + 1 
    getNextId() {
        if (this.workouts.length == 0) {
            return 0;
        } 
        return this.workouts.at(-1).id + 1
        
    }

    addWorkout(data) {
        let workout;
        if (data.type === "running") {
            workout = new Running(this.getNextId(), data.duration, data.distance, data.coords, data.cadence)
        }  else {
            workout = new Cycling(this.getNextId(), data.duration, data.distance, data.coords, data.elevGain)
        }
        this.workouts.push(workout);
        this.saveInLocalStorage();
        return workout;
    }

    // search for a workout with the id and return its coordinates
    getCoordinatesOfWorkout(id) {
        const workout = this.findWorkout(id)
        if (!workout) {return null;}
        return workout.coords;
    }

    findWorkout(id) {
        return this.workouts.find(el => el.id === parseInt(id))
    }

    deleteWorkout(id) {
       const index = this.workouts.findIndex(el => el.id === parseInt(id));
       console.log(index)
       if (index != -1) {
           this.workouts.splice(index, 1)
           this.saveInLocalStorage();
           return true
       }
       return false
    }

}

export const model = new Model();
