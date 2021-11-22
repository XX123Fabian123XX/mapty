class Workout {    
    constructor(id,time,distance, type, coords) {
        this.time = time;
        this.distance = distance;
        this.type = type;
        this.coords = coords;
        this.id = id;
        this.date = new Date();
    }


}

class Cycling extends Workout {
    constructor(id,time,distance, coords, elevationGain) {
        super(id, time, distance, "cycling", coords);
        this.elevationGain = elevationGain;
        this.calculateSpeed();
    }

    calculateSpeed() {
        // km / h
        this.speed =  Math.round((this.distance / (this.time / 60)) * 100) / 100
    }
}

class Running extends Workout {
    constructor(id, time, distance, coords, cadence) {
        super(id, time, distance, "running", coords)
        this.cadence = cadence;
        this.calculatePace()
    }

    calculatePace() {
        // min/km
        this.speed = Math.round((this.time / this.distance) * 100) / 100 
    }
}

class Model {
    constructor() {
        this.cyclingWorkouts = [];
        this.runningWorkouts = [];
    }

    saveInLocalStorage() {
        window.localStorage.setItem('cyclingWorkouts', JSON.stringify(this.cyclingWorkouts))
        window.localStorage.setItem('runningWorkouts',JSON.stringify(this.runningWorkouts))
    }

    loadDataFromLocalStorage() {
        const cyclingWorkouts = JSON.parse(window.localStorage.getItem('cyclingWorkouts'))
        const runningWorkouts = JSON.parse(window.localStorage.getItem('runningWorkouts'))

        if (cyclingWorkouts.length > 0) {
            this.cyclingWorkouts.push(...cyclingWorkouts)
        }
        if (runningWorkouts.length > 0) {
            this.runningWorkouts.push(...runningWorkouts)
        }

        return { "cyclingWorkouts":this.cyclingWorkouts, "runningWorkouts":this.runningWorkouts}
    }

    getNextId(workoutlist) {
        if (workoutlist.length == 0) {
            return 0;
        } 
        console.log(workoutlist.at(-1).id)
        return workoutlist.at(-1).id + 1
        
    }

    addCyclingWorkout(time, distance, coords, elevationGain) {
        const cyclingWorkout = new Cycling(this.getNextId(this.cyclingWorkouts), time, distance, coords, elevationGain)
        this.cyclingWorkouts.push(cyclingWorkout)
        this.saveInLocalStorage()
        return cyclingWorkout
    }

    addRunningWorkout(time, distance, coords, cadence) {
        const runningWorkout = new Running(this.getNextId(this.runningWorkouts), time, distance, coords, cadence)
        this.runningWorkouts.push(runningWorkout)
        this.saveInLocalStorage()
        return runningWorkout
    }

    getCoordinatesOfWorkout(type, id) {
        const workout = this.findWorkout(type, id)
        if (!workout) {return null;}
        return workout.coords;
    }

    findWorkout(type, id) {
        let workout;
        if (type == "running") {
            workout = this.runningWorkouts.find(el => el.id == id)
        } else {
            workout = this.cyclingWorkouts.find(el => el.id == id)
        }
        return workout;
    }

    deleteWorkout(type, id) {
        if (type == "running") {
            const index = this.runningWorkouts.findIndex(el => el.id == id);
            if (index != - 1) {
                this.runningWorkouts.splice(index)  
                this.saveInLocalStorage()
                return true
            }
            return false
        } else {
            const index = this.cyclingWorkouts.findIndex(el => el.id == id);
            if (index != -1) {
                this.cyclingWorkouts.splice(index)
                this.saveInLocalStorage()
                return true;
            }
            return false;
        }
    }

}

export const model = new Model();
